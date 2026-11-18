import { useEffect, useRef, useState } from 'react'
import {
  AlertTriangle,
  ArrowRight,
  Check,
  Copy,
  Eye,
  EyeOff,
  HelpCircle,
  KeyRound,
  Lock,
  QrCode,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Upload,
} from 'lucide-react'
import QRCode from 'qrcode'
import {
  type AdminSecurityVault,
  LOCKOUT_DURATION_MS,
  MAX_FAILED_ATTEMPTS,
  STEP_PROCESS_MS,
  buildOtpAuthUri,
  decryptText,
  encryptText,
  generateTotpSecretBase32,
  hashSecret,
  loadLockoutState,
  loadVault,
  normalizeAnswer,
  normalizeIdentifier,
  recordFailedAuthAttempt,
  resetLockoutState,
  runWithMinimumStepDelay,
  saveVault,
  sealVault,
  validateStrongPassword,
  verifySecret,
  verifyTotpCode,
  verifyVaultIntegrity,
} from '../../utils/adminCrypto'

export interface AuthenticatedSession {
  vault: AdminSecurityVault
  sessionKeyMaterial: string
  authenticatedAt: number
}

interface AdminAuthGateProps {
  onAuthenticated: (session: AuthenticatedSession) => void
}

type AuthStep = 1 | 2 | 3 | 4

export function AdminAuthGate({ onAuthenticated }: AdminAuthGateProps) {
  const [vault, setVault] = useState<AdminSecurityVault | null>(() => loadVault())
  const mode: 'setup' | 'login' = vault ? 'login' : 'setup'

  const [step, setStep] = useState<AuthStep>(1)
  const [processing, setProcessing] = useState(false)
  const [progressPct, setProgressPct] = useState(0)
  const [remainingSec, setRemainingSec] = useState(0)
  const [statusLabel, setStatusLabel] = useState('')
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [decoyBanner, setDecoyBanner] = useState<string | null>(null)

  // Lockout state
  const [lockoutUntil, setLockoutUntil] = useState<number>(() => loadLockoutState().lockedUntil)
  const [nowTs, setNowTs] = useState<number>(() => Date.now())

  // Step 1 inputs
  const [primaryEmail, setPrimaryEmail] = useState('')
  const [primaryPassword, setPrimaryPassword] = useState('')
  const [primaryPasswordConfirm, setPrimaryPasswordConfirm] = useState('')
  const [showPrimaryPw, setShowPrimaryPw] = useState(false)

  // Step 2 inputs (2FA TOTP)
  const [setupTotpSecret, setSetupTotpSecret] = useState('')
  const [setupQrDataUrl, setSetupQrDataUrl] = useState('')
  const [totpCode, setTotpCode] = useState('')
  const [copiedSecret, setCopiedSecret] = useState(false)

  // Step 3 inputs (Security Question)
  const [setupQuestion, setSetupQuestion] = useState('')
  const [securityAnswer, setSecurityAnswer] = useState('')

  // Step 4 inputs (Different Secondary Login)
  const [secondaryLogin, setSecondaryLogin] = useState('')
  const [secondaryPassword, setSecondaryPassword] = useState('')
  const [secondaryPasswordConfirm, setSecondaryPasswordConfirm] = useState('')
  const [showSecondaryPw, setShowSecondaryPw] = useState(false)

  // Ephemeral in-memory verification state (never persisted to storage)
  const pendingSetupRef = useRef<{
    primaryEmailNorm: string
    primaryPasswordRaw: string
    primaryEmailHash?: Awaited<ReturnType<typeof hashSecret>>
    primaryPasswordHash?: Awaited<ReturnType<typeof hashSecret>>
    encryptedTotpSecret?: Awaited<ReturnType<typeof encryptText>>
    securityQuestion?: string
    securityAnswerHash?: Awaited<ReturnType<typeof hashSecret>>
  }>({
    primaryEmailNorm: '',
    primaryPasswordRaw: '',
  })

  const loginMemoryRef = useRef<{
    primaryPasswordRaw: string
    decryptedTotpSecret: string
    step1Passed: boolean
    step2Passed: boolean
    step3Passed: boolean
  }>({
    primaryPasswordRaw: '',
    decryptedTotpSecret: '',
    step1Passed: false,
    step2Passed: false,
    step3Passed: false,
  })

  const importInputRef = useRef<HTMLInputElement>(null)

  // Tick lockout countdown when locked
  useEffect(() => {
    if (lockoutUntil <= Date.now()) return
    const id = window.setInterval(() => {
      const t = Date.now()
      setNowTs(t)
      if (t >= lockoutUntil) {
        resetLockoutState()
        setLockoutUntil(0)
      }
    }, 1000)
    return () => window.clearInterval(id)
  }, [lockoutUntil])

  const isLockedOut = lockoutUntil > nowTs
  const lockoutMinutes = Math.ceil(Math.max(0, lockoutUntil - nowTs) / 60000)

  const beginProcessing = (label: string) => {
    setErrorMsg(null)
    setProcessing(true)
    setProgressPct(0)
    setRemainingSec(STEP_PROCESS_MS / 1000)
    setStatusLabel(label)
  }

  const endProcessing = () => {
    setProcessing(false)
    setProgressPct(0)
    setRemainingSec(0)
    setStatusLabel('')
  }

  const resetLoginFlow = (message: string) => {
    loginMemoryRef.current = {
      primaryPasswordRaw: '',
      decryptedTotpSecret: '',
      step1Passed: false,
      step2Passed: false,
      step3Passed: false,
    }
    setPrimaryPassword('')
    setTotpCode('')
    setSecurityAnswer('')
    setSecondaryLogin('')
    setSecondaryPassword('')
    setDecoyBanner(null)
    setStep(1)
    setErrorMsg(message)
  }

  // Import an existing encrypted vault JSON on a new device
  const handleImportVault = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const text = await file.text()
      const parsed = JSON.parse(text) as AdminSecurityVault
      const intact = await verifyVaultIntegrity(parsed)
      if (!intact) {
        setErrorMsg('Vault signature verification failed. File is invalid or tampered.')
        return
      }
      saveVault(parsed)
      setVault(parsed)
      setStep(1)
      setErrorMsg(null)
    } catch {
      setErrorMsg('Could not parse vault backup file.')
    } finally {
      if (importInputRef.current) importInputRef.current.value = ''
    }
  }

  // ==========================================
  // STEP 1: Primary Email & Password
  // ==========================================
  const handleStep1Submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (processing || isLockedOut) return

    const emailNorm = normalizeIdentifier(primaryEmail)
    if (!emailNorm || !emailNorm.includes('@')) {
      setErrorMsg('Enter a valid email address.')
      return
    }

    if (mode === 'setup') {
      const pwError = validateStrongPassword(primaryPassword)
      if (pwError) {
        setErrorMsg(pwError)
        return
      }
      if (primaryPassword !== primaryPasswordConfirm) {
        setErrorMsg('Passwords do not match.')
        return
      }

      beginProcessing('Deriving PBKDF2-SHA-256 (600,000 rounds) & generating 2FA seed...')
      try {
        const result = await runWithMinimumStepDelay(
          async () => {
            const [emailHash, pwHash] = await Promise.all([
              hashSecret(emailNorm),
              hashSecret(primaryPassword),
            ])
            const secret = generateTotpSecretBase32(20)
            const otpUri = buildOtpAuthUri(secret, emailNorm)
            const qrDataUrl = await QRCode.toDataURL(otpUri, {
              width: 220,
              margin: 2,
              color: { dark: '#0a0a0a', light: '#ffffff' },
            })
            return { emailHash, pwHash, secret, qrDataUrl }
          },
          STEP_PROCESS_MS,
          (pct, rem) => {
            setProgressPct(pct)
            setRemainingSec(rem)
          }
        )

        pendingSetupRef.current = {
          primaryEmailNorm: emailNorm,
          primaryPasswordRaw: primaryPassword,
          primaryEmailHash: result.emailHash,
          primaryPasswordHash: result.pwHash,
        }
        setSetupTotpSecret(result.secret)
        setSetupQrDataUrl(result.qrDataUrl)
        setPrimaryPassword('')
        setPrimaryPasswordConfirm('')
        setStep(2)
      } finally {
        endProcessing()
      }
      return
    }

    // Login Mode Step 1
    if (!vault) return
    if (!primaryPassword) {
      setErrorMsg('Enter your password.')
      return
    }

    beginProcessing('Verifying primary credentials (PBKDF2-SHA-256 600,000 rounds)...')
    try {
      const outcome = await runWithMinimumStepDelay(
        async () => {
          const intact = await verifyVaultIntegrity(vault)
          if (!intact) return { ok: false, tampered: true, totpSecret: null }
          const [emailOk, pwOk] = await Promise.all([
            verifySecret(emailNorm, vault.primaryEmailHash),
            verifySecret(primaryPassword, vault.primaryPasswordHash),
          ])
          if (!emailOk || !pwOk) {
            return { ok: false, tampered: false, totpSecret: null }
          }
          const decryptedSecret = await decryptText(vault.encryptedTotpSecret, primaryPassword)
          if (!decryptedSecret) {
            return { ok: false, tampered: false, totpSecret: null }
          }
          return { ok: true, tampered: false, totpSecret: decryptedSecret }
        },
        STEP_PROCESS_MS,
        (pct, rem) => {
          setProgressPct(pct)
          setRemainingSec(rem)
        }
      )

      if (outcome.tampered) {
        setErrorMsg('Vault integrity check failed. Stored vault has been tampered with.')
        return
      }

      if (!outcome.ok || !outcome.totpSecret) {
        const lock = recordFailedAuthAttempt()
        setLockoutUntil(lock.lockedUntil)
        setNowTs(Date.now())
        const left = Math.max(0, MAX_FAILED_ATTEMPTS - lock.attempts)
        resetLoginFlow(
          left > 0
            ? `Authentication rejected. ${left} attempt${left === 1 ? '' : 's'} remaining before lockout.`
            : `Too many failed attempts. Locked for ${Math.round(LOCKOUT_DURATION_MS / 60000)} minutes.`
        )
        return
      }

      loginMemoryRef.current = {
        primaryPasswordRaw: primaryPassword,
        decryptedTotpSecret: outcome.totpSecret,
        step1Passed: true,
        step2Passed: false,
        step3Passed: false,
      }
      setPrimaryPassword('')
      setStep(2)
    } finally {
      endProcessing()
    }
  }

  // ==========================================
  // STEP 2: 2FA TOTP Verification (QR Setup / Code Check)
  // ==========================================
  const handleStep2Submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (processing || isLockedOut) return

    const cleanedCode = totpCode.replace(/\s+/g, '')
    if (!/^\d{6}$/.test(cleanedCode)) {
      setErrorMsg('Enter the 6-digit code from your authenticator app.')
      return
    }

    if (mode === 'setup') {
      beginProcessing('Validating RFC 6238 TOTP token & sealing 2FA seed with AES-256-GCM...')
      try {
        const result = await runWithMinimumStepDelay(
          async () => {
            const valid = await verifyTotpCode(setupTotpSecret, cleanedCode, 1)
            if (!valid) return { valid: false, encrypted: null }
            const encrypted = await encryptText(
              setupTotpSecret,
              pendingSetupRef.current.primaryPasswordRaw
            )
            return { valid: true, encrypted }
          },
          STEP_PROCESS_MS,
          (pct, rem) => {
            setProgressPct(pct)
            setRemainingSec(rem)
          }
        )

        if (!result.valid || !result.encrypted) {
          setErrorMsg('Invalid 6-digit authenticator code. Verify your device clock and try again.')
          setTotpCode('')
          return
        }

        pendingSetupRef.current.encryptedTotpSecret = result.encrypted
        setSetupTotpSecret('')
        setSetupQrDataUrl('')
        setTotpCode('')
        setStep(3)
      } finally {
        endProcessing()
      }
      return
    }

    // Login Mode Step 2
    if (!loginMemoryRef.current.step1Passed || !loginMemoryRef.current.decryptedTotpSecret) {
      resetLoginFlow('Session state expired. Start again.')
      return
    }

    beginProcessing('Validating RFC 6238 HMAC-SHA-1 TOTP token...')
    try {
      const valid = await runWithMinimumStepDelay(
        async () => verifyTotpCode(loginMemoryRef.current.decryptedTotpSecret, cleanedCode, 1),
        STEP_PROCESS_MS,
        (pct, rem) => {
          setProgressPct(pct)
          setRemainingSec(rem)
        }
      )

      // Wipe plaintext TOTP secret from RAM immediately after check
      loginMemoryRef.current.decryptedTotpSecret = ''
      setTotpCode('')

      if (!valid) {
        const lock = recordFailedAuthAttempt()
        setLockoutUntil(lock.lockedUntil)
        setNowTs(Date.now())
        const left = Math.max(0, MAX_FAILED_ATTEMPTS - lock.attempts)
        resetLoginFlow(
          left > 0
            ? `2FA verification failed. ${left} attempt${left === 1 ? '' : 's'} remaining.`
            : `Too many failed attempts. Locked for ${Math.round(LOCKOUT_DURATION_MS / 60000)} minutes.`
        )
        return
      }

      loginMemoryRef.current.step2Passed = true
      setStep(3)
    } finally {
      endProcessing()
    }
  }

  // ==========================================
  // STEP 3: Security Question + Intentional Decoy Rejection
  // ==========================================
  const handleStep3Submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (processing || isLockedOut) return

    const normAns = normalizeAnswer(securityAnswer)
    if (normAns.length < 3) {
      setErrorMsg('Enter an answer of at least 3 characters.')
      return
    }

    if (mode === 'setup') {
      const trimmedQuestion = setupQuestion.trim()
      if (trimmedQuestion.length < 6) {
        setErrorMsg('Enter a security question of at least 6 characters.')
        return
      }

      beginProcessing('Evaluating challenge response & deriving salted PBKDF2 hash...')
      try {
        const ansHash = await runWithMinimumStepDelay(
          async () => hashSecret(normAns),
          STEP_PROCESS_MS,
          (pct, rem) => {
            setProgressPct(pct)
            setRemainingSec(rem)
          }
        )

        pendingSetupRef.current.securityQuestion = trimmedQuestion
        pendingSetupRef.current.securityAnswerHash = ansHash
        setSecurityAnswer('')

        // Intentional decoy rejection per security protocol before secondary login setup
        setDecoyBanner(
          'Incorrect answer. Identity challenge rejected. Configure your secondary login credentials below to complete access.'
        )
        setStep(4)
      } finally {
        endProcessing()
      }
      return
    }

    // Login Mode Step 3
    if (!vault || !loginMemoryRef.current.step2Passed) {
      resetLoginFlow('Session state expired. Start again.')
      return
    }

    beginProcessing('Evaluating challenge response...')
    try {
      // Silently verify the real answer hash with zero oracle leakage
      const answerMatches = await runWithMinimumStepDelay(
        async () => verifySecret(normAns, vault.securityAnswerHash),
        STEP_PROCESS_MS,
        (pct, rem) => {
          setProgressPct(pct)
          setRemainingSec(rem)
        }
      )

      loginMemoryRef.current.step3Passed = answerMatches
      setSecurityAnswer('')

      // Always display intentional decoy rejection and proceed to Step 4
      setDecoyBanner(
        'Incorrect answer. Challenge failed. Secondary vault authentication is required.'
      )
      setStep(4)
    } finally {
      endProcessing()
    }
  }

  // ==========================================
  // STEP 4: Different (Secondary) Login Gate
  // ==========================================
  const handleStep4Submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (processing || isLockedOut) return

    const secIdNorm = normalizeIdentifier(secondaryLogin)
    if (secIdNorm.length < 3) {
      setErrorMsg('Enter a secondary login identifier (at least 3 characters).')
      return
    }

    if (mode === 'setup') {
      if (secIdNorm === pendingSetupRef.current.primaryEmailNorm) {
        setErrorMsg('Secondary login must be different from your primary email.')
        return
      }
      const pwErr = validateStrongPassword(secondaryPassword)
      if (pwErr) {
        setErrorMsg(pwErr)
        return
      }
      if (secondaryPassword === pendingSetupRef.current.primaryPasswordRaw) {
        setErrorMsg('Secondary passphrase must be different from your primary password.')
        return
      }
      if (secondaryPassword !== secondaryPasswordConfirm) {
        setErrorMsg('Secondary passphrases do not match.')
        return
      }

      beginProcessing('Sealing cryptographic vault & computing SHA-256 integrity signature...')
      try {
        const sealed = await runWithMinimumStepDelay(
          async () => {
            const [secIdHash, secPwHash] = await Promise.all([
              hashSecret(secIdNorm),
              hashSecret(secondaryPassword),
            ])
            const unsigned: Omit<AdminSecurityVault, 'integrityDigest'> = {
              version: 1,
              createdAt: new Date().toISOString(),
              primaryEmailHash: pendingSetupRef.current.primaryEmailHash!,
              primaryPasswordHash: pendingSetupRef.current.primaryPasswordHash!,
              encryptedTotpSecret: pendingSetupRef.current.encryptedTotpSecret!,
              securityQuestion: pendingSetupRef.current.securityQuestion!,
              securityAnswerHash: pendingSetupRef.current.securityAnswerHash!,
              secondaryLoginHash: secIdHash,
              secondaryPasswordHash: secPwHash,
            }
            return sealVault(unsigned)
          },
          STEP_PROCESS_MS,
          (pct, rem) => {
            setProgressPct(pct)
            setRemainingSec(rem)
          }
        )

        saveVault(sealed)
        resetLockoutState()
        const sessionKeyMaterial = pendingSetupRef.current.primaryPasswordRaw
        pendingSetupRef.current = { primaryEmailNorm: '', primaryPasswordRaw: '' }
        setSecondaryPassword('')
        setSecondaryPasswordConfirm('')
        setVault(sealed)

        onAuthenticated({
          vault: sealed,
          sessionKeyMaterial,
          authenticatedAt: Date.now(),
        })
      } finally {
        endProcessing()
      }
      return
    }

    // Login Mode Step 4
    if (!vault || !loginMemoryRef.current.step2Passed) {
      resetLoginFlow('Session state expired. Start again.')
      return
    }

    if (!secondaryPassword) {
      setErrorMsg('Enter your secondary passphrase.')
      return
    }

    beginProcessing('Verifying secondary credentials & finalizing multi-factor attestation...')
    try {
      const granted = await runWithMinimumStepDelay(
        async () => {
          const [idOk, pwOk] = await Promise.all([
            verifySecret(secIdNorm, vault.secondaryLoginHash),
            verifySecret(secondaryPassword, vault.secondaryPasswordHash),
          ])
          return Boolean(
            loginMemoryRef.current.step1Passed &&
              loginMemoryRef.current.step2Passed &&
              loginMemoryRef.current.step3Passed &&
              idOk &&
              pwOk
          )
        },
        STEP_PROCESS_MS,
        (pct, rem) => {
          setProgressPct(pct)
          setRemainingSec(rem)
        }
      )

      if (!granted) {
        const lock = recordFailedAuthAttempt()
        setLockoutUntil(lock.lockedUntil)
        setNowTs(Date.now())
        const left = Math.max(0, MAX_FAILED_ATTEMPTS - lock.attempts)
        resetLoginFlow(
          left > 0
            ? `Multi-factor verification failed. ${left} attempt${left === 1 ? '' : 's'} remaining.`
            : `Too many failed attempts. Locked for ${Math.round(LOCKOUT_DURATION_MS / 60000)} minutes.`
        )
        return
      }

      resetLockoutState()
      const sessionKeyMaterial = loginMemoryRef.current.primaryPasswordRaw
      loginMemoryRef.current = {
        primaryPasswordRaw: '',
        decryptedTotpSecret: '',
        step1Passed: false,
        step2Passed: false,
        step3Passed: false,
      }
      setSecondaryPassword('')

      onAuthenticated({
        vault,
        sessionKeyMaterial,
        authenticatedAt: Date.now(),
      })
    } finally {
      endProcessing()
    }
  }

  const handleCopyTotpSecret = () => {
    navigator.clipboard?.writeText(setupTotpSecret).catch(() => {})
    setCopiedSecret(true)
    window.setTimeout(() => setCopiedSecret(false), 2000)
  }

  return (
    <div className="min-h-screen w-full bg-blueprint-grid bg-neutral-50 text-neutral-950 flex items-center justify-center px-4 py-10 dark:bg-neutral-950 dark:text-neutral-50">
      <div className="w-full max-w-lg rounded-2xl border border-neutral-200 bg-white p-6 shadow-2xl sm:p-8 dark:border-neutral-800 dark:bg-neutral-950">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-neutral-200 pb-5 dark:border-neutral-800">
          <div>
            <div className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
              <Shield className="h-4 w-4" strokeWidth={1.8} />
              <span>{mode === 'setup' ? 'First-Time Vault Enrollment' : 'Restricted Security Gate'}</span>
            </div>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-neutral-950 dark:text-neutral-50">
              {step === 1 && (mode === 'setup' ? 'Step 01 // Primary Credentials' : 'Step 01 // Primary Login')}
              {step === 2 && (mode === 'setup' ? 'Step 02 // Configure 2FA QR' : 'Step 02 // 2FA Verification')}
              {step === 3 && (mode === 'setup' ? 'Step 03 // Security Challenge' : 'Step 03 // Security Challenge')}
              {step === 4 && (mode === 'setup' ? 'Step 04 // Secondary Login' : 'Step 04 // Secondary Login')}
            </h1>
          </div>

          <span className="rounded border border-neutral-200 bg-neutral-100 px-2.5 py-1 font-mono text-xs text-neutral-700 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300">
            {step} / 4
          </span>
        </div>

        {/* Step Indicator Bar */}
        <div className="mt-5 grid grid-cols-4 gap-2">
          {[1, 2, 3, 4].map((num) => (
            <div
              key={num}
              className={`h-1.5 rounded-full transition-colors ${
                num < step
                  ? 'bg-neutral-950 dark:bg-neutral-50'
                  : num === step
                    ? 'bg-neutral-700 dark:bg-neutral-300'
                    : 'bg-neutral-200 dark:bg-neutral-800'
              }`}
            />
          ))}
        </div>

        {/* Lockout Warning */}
        {isLockedOut && (
          <div className="mt-5 flex items-start gap-3 rounded-lg border border-neutral-950 bg-neutral-100 p-4 font-mono text-xs text-neutral-950 dark:border-neutral-300 dark:bg-neutral-900 dark:text-neutral-100">
            <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.8} />
            <div>
              <div className="font-semibold uppercase">Terminal Locked</div>
              <p className="mt-1 text-neutral-600 dark:text-neutral-400">
                Maximum failed attempts reached. Retry unlocked in approximately {lockoutMinutes} min.
              </p>
            </div>
          </div>
        )}

        {/* Intentional Decoy Banner (shown transitioning from Step 3 -> Step 4) */}
        {decoyBanner && step === 4 && (
          <div className="mt-5 flex items-start gap-3 rounded-lg border border-neutral-900 bg-neutral-950 p-4 font-mono text-xs text-neutral-100 dark:border-neutral-700 dark:bg-neutral-900">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-neutral-100" strokeWidth={1.8} />
            <div>
              <div className="font-semibold uppercase tracking-wider">Challenge Failed</div>
              <p className="mt-1 leading-relaxed text-neutral-300">{decoyBanner}</p>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {errorMsg && (
          <div className="mt-5 flex items-start gap-2.5 rounded-lg border border-neutral-300 bg-neutral-100 p-3.5 font-mono text-xs text-neutral-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.8} />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* 5-Second Cryptographic Processing Indicator */}
        {processing && (
          <div className="mt-6 rounded-xl border border-neutral-200 bg-neutral-50 p-5 dark:border-neutral-800 dark:bg-neutral-900/70">
            <div className="flex items-center justify-between font-mono text-xs text-neutral-700 dark:text-neutral-300">
              <span className="inline-flex items-center gap-2">
                <Lock className="h-3.5 w-3.5 animate-pulse" strokeWidth={1.8} />
                <span>Processing Security Gate</span>
              </span>
              <span>{remainingSec.toFixed(1)}s</span>
            </div>

            <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-800">
              <div
                className="h-full bg-neutral-950 transition-all duration-75 dark:bg-neutral-50"
                style={{ width: `${progressPct}%` }}
              />
            </div>

            <p className="mt-3 font-mono text-[11px] text-neutral-500 dark:text-neutral-400">
              {statusLabel}
            </p>
          </div>
        )}

        {/* STEP 1 FORM */}
        {!processing && !isLockedOut && step === 1 && (
          <form onSubmit={handleStep1Submit} className="mt-6 space-y-4">
            <p className="text-xs leading-relaxed text-neutral-600 dark:text-neutral-400">
              {mode === 'setup'
                ? 'No vault detected in this browser. Set your primary email and a strong password (12+ chars, upper, lower, digit, symbol). All credentials are salted and hashed with PBKDF2-SHA-256 (600,000 iterations).'
                : 'Enter your primary email and password. Every step enforces a 5-second constant-time cryptographic verification window.'}
            </p>

            <div>
              <label className="block font-mono text-xs uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
                Primary Email
              </label>
              <input
                type="email"
                required
                autoComplete="username"
                value={primaryEmail}
                onChange={(e) => setPrimaryEmail(e.target.value)}
                placeholder="admin@domain.com"
                className="mt-1.5 w-full rounded-lg border border-neutral-200 bg-white px-3.5 py-2.5 font-mono text-xs text-neutral-950 focus:border-neutral-950 focus:outline-none dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-50 dark:focus:border-neutral-300"
              />
            </div>

            <div>
              <label className="block font-mono text-xs uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
                Primary Password
              </label>
              <div className="relative mt-1.5">
                <input
                  type={showPrimaryPw ? 'text' : 'password'}
                  required
                  autoComplete={mode === 'setup' ? 'new-password' : 'current-password'}
                  value={primaryPassword}
                  onChange={(e) => setPrimaryPassword(e.target.value)}
                  placeholder="Min 12 chars, mixed case, digit & symbol"
                  className="w-full rounded-lg border border-neutral-200 bg-white py-2.5 pr-10 pl-3.5 font-mono text-xs text-neutral-950 focus:border-neutral-950 focus:outline-none dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-50 dark:focus:border-neutral-300"
                />
                <button
                  type="button"
                  onClick={() => setShowPrimaryPw((v) => !v)}
                  aria-label="Toggle password visibility"
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-neutral-500 hover:text-neutral-950 dark:hover:text-neutral-50"
                >
                  {showPrimaryPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {mode === 'setup' && (
              <div>
                <label className="block font-mono text-xs uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
                  Confirm Primary Password
                </label>
                <input
                  type={showPrimaryPw ? 'text' : 'password'}
                  required
                  autoComplete="new-password"
                  value={primaryPasswordConfirm}
                  onChange={(e) => setPrimaryPasswordConfirm(e.target.value)}
                  placeholder="Re-enter primary password"
                  className="mt-1.5 w-full rounded-lg border border-neutral-200 bg-white px-3.5 py-2.5 font-mono text-xs text-neutral-950 focus:border-neutral-950 focus:outline-none dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-50 dark:focus:border-neutral-300"
                />
              </div>
            )}

            <button
              type="submit"
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-neutral-950 px-4 py-2.5 font-mono text-xs font-medium text-neutral-50 transition-colors hover:bg-neutral-800 dark:bg-neutral-50 dark:text-neutral-950 dark:hover:bg-neutral-200"
            >
              <span>{mode === 'setup' ? 'Hash & Continue to 2FA' : 'Verify Primary Credentials'}</span>
              <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.8} />
            </button>

            {mode === 'setup' && (
              <div className="border-t border-neutral-200 pt-4 dark:border-neutral-800">
                <input
                  ref={importInputRef}
                  type="file"
                  accept="application/json,.json"
                  onChange={handleImportVault}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => importInputRef.current?.click()}
                  className="flex w-full items-center justify-center gap-2 rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 font-mono text-xs text-neutral-700 transition-colors hover:border-neutral-400 hover:text-neutral-950 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:border-neutral-600 dark:hover:text-neutral-50"
                >
                  <Upload className="h-3.5 w-3.5" strokeWidth={1.8} />
                  <span>Import Existing Encrypted Vault Backup</span>
                </button>
              </div>
            )}
          </form>
        )}

        {/* STEP 2 FORM (2FA TOTP QR) */}
        {!processing && !isLockedOut && step === 2 && (
          <form onSubmit={handleStep2Submit} className="mt-6 space-y-4">
            {mode === 'setup' ? (
              <>
                <p className="text-xs leading-relaxed text-neutral-600 dark:text-neutral-400">
                  Scan this QR code with Google Authenticator, Authy, Bitwarden, or 1Password, then enter the live 6-digit code to lock your encrypted 2FA seed.
                </p>

                <div className="flex flex-col items-center rounded-xl border border-neutral-200 bg-neutral-50 p-5 dark:border-neutral-800 dark:bg-neutral-900/60">
                  {setupQrDataUrl ? (
                    <img
                      src={setupQrDataUrl}
                      alt="2FA TOTP Authenticator QR Code"
                      className="h-48 w-48 rounded-lg border border-neutral-200 bg-white p-2"
                    />
                  ) : (
                    <div className="flex h-48 w-48 items-center justify-center rounded-lg border border-neutral-200 bg-white">
                      <QrCode className="h-10 w-10 text-neutral-400" />
                    </div>
                  )}

                  <div className="mt-4 w-full">
                    <div className="font-mono text-[10px] uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                      Manual Setup Key (Base32)
                    </div>
                    <div className="mt-1 flex items-center justify-between gap-2 rounded-lg border border-neutral-200 bg-white px-3 py-2 font-mono text-xs text-neutral-900 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-100">
                      <span className="truncate select-all">{setupTotpSecret}</span>
                      <button
                        type="button"
                        onClick={handleCopyTotpSecret}
                        className="inline-flex shrink-0 items-center gap-1 rounded px-2 py-0.5 text-[11px] text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800"
                      >
                        {copiedSecret ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                        <span>{copiedSecret ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <p className="text-xs leading-relaxed text-neutral-600 dark:text-neutral-400">
                Open your authenticator app and enter the current 6-digit TOTP verification code.
              </p>
            )}

            <div>
              <label className="block font-mono text-xs uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
                6-Digit Authenticator Code
              </label>
              <input
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                required
                value={totpCode}
                onChange={(e) => setTotpCode(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
                placeholder="000000"
                className="mt-1.5 w-full rounded-lg border border-neutral-200 bg-white px-3.5 py-3 text-center font-mono text-lg tracking-[0.4em] text-neutral-950 focus:border-neutral-950 focus:outline-none dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-50 dark:focus:border-neutral-300"
              />
            </div>

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-neutral-950 px-4 py-2.5 font-mono text-xs font-medium text-neutral-50 transition-colors hover:bg-neutral-800 dark:bg-neutral-50 dark:text-neutral-950 dark:hover:bg-neutral-200"
            >
              <ShieldCheck className="h-4 w-4" strokeWidth={1.8} />
              <span>Verify 2FA Token</span>
            </button>
          </form>
        )}

        {/* STEP 3 FORM (Security Question) */}
        {!processing && !isLockedOut && step === 3 && (
          <form onSubmit={handleStep3Submit} className="mt-6 space-y-4">
            <div className="flex items-start gap-2.5 rounded-lg border border-neutral-200 bg-neutral-50 p-3.5 dark:border-neutral-800 dark:bg-neutral-900/60">
              <HelpCircle className="mt-0.5 h-4 w-4 shrink-0 text-neutral-600 dark:text-neutral-400" strokeWidth={1.8} />
              <p className="text-xs leading-relaxed text-neutral-600 dark:text-neutral-400">
                {mode === 'setup'
                  ? 'Define a private verification question and its secret answer. The answer is stored exclusively as a salted PBKDF2-SHA-256 hash.'
                  : 'Answer your enrolled verification question to continue.'}
              </p>
            </div>

            {mode === 'setup' ? (
              <div>
                <label className="block font-mono text-xs uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
                  Security Question
                </label>
                <input
                  type="text"
                  required
                  value={setupQuestion}
                  onChange={(e) => setSetupQuestion(e.target.value)}
                  placeholder="Enter your custom security question"
                  className="mt-1.5 w-full rounded-lg border border-neutral-200 bg-white px-3.5 py-2.5 font-mono text-xs text-neutral-950 focus:border-neutral-950 focus:outline-none dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-50 dark:focus:border-neutral-300"
                />
              </div>
            ) : (
              <div className="rounded-lg border border-neutral-200 bg-neutral-100/70 px-4 py-3 font-mono text-xs font-medium text-neutral-950 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-50">
                {vault?.securityQuestion}
              </div>
            )}

            <div>
              <label className="block font-mono text-xs uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
                Secret Answer
              </label>
              <input
                type="password"
                required
                autoComplete="off"
                value={securityAnswer}
                onChange={(e) => setSecurityAnswer(e.target.value)}
                placeholder="Enter secret answer"
                className="mt-1.5 w-full rounded-lg border border-neutral-200 bg-white px-3.5 py-2.5 font-mono text-xs text-neutral-950 focus:border-neutral-950 focus:outline-none dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-50 dark:focus:border-neutral-300"
              />
            </div>

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-neutral-950 px-4 py-2.5 font-mono text-xs font-medium text-neutral-50 transition-colors hover:bg-neutral-800 dark:bg-neutral-50 dark:text-neutral-950 dark:hover:bg-neutral-200"
            >
              <span>Submit Challenge Answer</span>
              <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.8} />
            </button>
          </form>
        )}

        {/* STEP 4 FORM (Different Secondary Login) */}
        {!processing && !isLockedOut && step === 4 && (
          <form onSubmit={handleStep4Submit} className="mt-6 space-y-4">
            <p className="text-xs leading-relaxed text-neutral-600 dark:text-neutral-400">
              {mode === 'setup'
                ? 'Enroll a second, completely different login identifier and passphrase (must differ from Step 01). This completes your multi-layer vault.'
                : 'Enter your secondary vault login identifier and passphrase to complete authentication.'}
            </p>

            <div>
              <label className="block font-mono text-xs uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
                Secondary Login Identifier
              </label>
              <input
                type="text"
                required
                autoComplete="off"
                value={secondaryLogin}
                onChange={(e) => setSecondaryLogin(e.target.value)}
                placeholder="Different username or secondary email"
                className="mt-1.5 w-full rounded-lg border border-neutral-200 bg-white px-3.5 py-2.5 font-mono text-xs text-neutral-950 focus:border-neutral-950 focus:outline-none dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-50 dark:focus:border-neutral-300"
              />
            </div>

            <div>
              <label className="block font-mono text-xs uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
                Secondary Passphrase
              </label>
              <div className="relative mt-1.5">
                <input
                  type={showSecondaryPw ? 'text' : 'password'}
                  required
                  autoComplete="off"
                  value={secondaryPassword}
                  onChange={(e) => setSecondaryPassword(e.target.value)}
                  placeholder="Different strong passphrase (12+ chars)"
                  className="w-full rounded-lg border border-neutral-200 bg-white py-2.5 pr-10 pl-3.5 font-mono text-xs text-neutral-950 focus:border-neutral-950 focus:outline-none dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-50 dark:focus:border-neutral-300"
                />
                <button
                  type="button"
                  onClick={() => setShowSecondaryPw((v) => !v)}
                  aria-label="Toggle passphrase visibility"
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-neutral-500 hover:text-neutral-950 dark:hover:text-neutral-50"
                >
                  {showSecondaryPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {mode === 'setup' && (
              <div>
                <label className="block font-mono text-xs uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
                  Confirm Secondary Passphrase
                </label>
                <input
                  type={showSecondaryPw ? 'text' : 'password'}
                  required
                  autoComplete="off"
                  value={secondaryPasswordConfirm}
                  onChange={(e) => setSecondaryPasswordConfirm(e.target.value)}
                  placeholder="Re-enter secondary passphrase"
                  className="mt-1.5 w-full rounded-lg border border-neutral-200 bg-white px-3.5 py-2.5 font-mono text-xs text-neutral-950 focus:border-neutral-950 focus:outline-none dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-50 dark:focus:border-neutral-300"
                />
              </div>
            )}

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-neutral-950 px-4 py-2.5 font-mono text-xs font-medium text-neutral-50 transition-colors hover:bg-neutral-800 dark:bg-neutral-50 dark:text-neutral-950 dark:hover:bg-neutral-200"
            >
              <KeyRound className="h-4 w-4" strokeWidth={1.8} />
              <span>{mode === 'setup' ? 'Seal Vault & Enter Portal' : 'Verify & Unlock Portal'}</span>
            </button>
          </form>
        )}

        {/* Security Footer Metadata */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-2 border-t border-neutral-200 pt-4 font-mono text-[11px] text-neutral-500 dark:border-neutral-800 dark:text-neutral-500">
          <span>PBKDF2-SHA-256 (600K) · AES-256-GCM · TOTP</span>
          <span>5.0s / step</span>
        </div>
      </div>
    </div>
  )
}
