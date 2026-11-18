const PBKDF2_ITERATIONS = 600_000
const SALT_BYTES = 16
const IV_BYTES = 12
const BASE32_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'
const VAULT_STORAGE_KEY = 'lt_sec_vault_v1'
const LOCKOUT_STORAGE_KEY = 'lt_sec_lock_v1'

export const STEP_PROCESS_MS = 5_000
export const MAX_FAILED_ATTEMPTS = 3
export const LOCKOUT_DURATION_MS = 15 * 60 * 1000

export interface SaltedHash {
  salt: string
  hash: string
  iterations: number
}

export interface EncryptedBlob {
  salt: string
  iv: string
  ciphertext: string
  iterations: number
}

export interface AdminSecurityVault {
  version: 1
  createdAt: string
  primaryEmailHash: SaltedHash
  primaryPasswordHash: SaltedHash
  encryptedTotpSecret: EncryptedBlob
  securityQuestion: string
  securityAnswerHash: SaltedHash
  secondaryLoginHash: SaltedHash
  secondaryPasswordHash: SaltedHash
  encryptedGithubToken?: EncryptedBlob
  integrityDigest: string
}

export interface LockoutState {
  attempts: number
  lockedUntil: number
}

function bytesToBase64(bytes: Uint8Array): string {
  let binary = ''
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return btoa(binary)
}

function base64ToBytes(b64: string): Uint8Array {
  const binary = atob(b64)
  const out = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) {
    out[i] = binary.charCodeAt(i)
  }
  return out
}

function toArrayBuffer(bytes: Uint8Array): ArrayBuffer {
  const copy = new Uint8Array(bytes.byteLength)
  copy.set(bytes)
  return copy.buffer
}

function randomBytes(length: number): Uint8Array {
  const arr = new Uint8Array(length)
  crypto.getRandomValues(arr)
  return arr
}

/**
 * Constant-time byte array comparison to mitigate timing side-channel leaks.
 */
export function timingSafeEqual(a: Uint8Array, b: Uint8Array): boolean {
  const len = Math.max(a.length, b.length)
  let diff = a.length ^ b.length
  for (let i = 0; i < len; i++) {
    const ba = i < a.length ? a[i] : 0
    const bb = i < b.length ? b[i] : 0
    diff |= ba ^ bb
  }
  return diff === 0
}

export function timingSafeStringEqual(a: string, b: string): boolean {
  const enc = new TextEncoder()
  return timingSafeEqual(enc.encode(a), enc.encode(b))
}

export function normalizeIdentifier(value: string): string {
  return value.trim().toLowerCase()
}

export function normalizeAnswer(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, ' ')
}

export function validateStrongPassword(password: string): string | null {
  if (password.length < 12) {
    return 'Password must be at least 12 characters long.'
  }
  if (!/[a-z]/.test(password)) {
    return 'Password must include at least one lowercase letter.'
  }
  if (!/[A-Z]/.test(password)) {
    return 'Password must include at least one uppercase letter.'
  }
  if (!/[0-9]/.test(password)) {
    return 'Password must include at least one digit.'
  }
  if (!/[^A-Za-z0-9]/.test(password)) {
    return 'Password must include at least one special character.'
  }
  return null
}

async function derivePbkdf2Bits(
  secret: string,
  salt: Uint8Array,
  iterations: number,
  lengthBits = 256
): Promise<Uint8Array> {
  const enc = new TextEncoder()
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'PBKDF2' },
    false,
    ['deriveBits']
  )
  const bits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: toArrayBuffer(salt),
      iterations,
      hash: 'SHA-256',
    },
    keyMaterial,
    lengthBits
  )
  return new Uint8Array(bits)
}

export async function hashSecret(
  secret: string,
  iterations = PBKDF2_ITERATIONS
): Promise<SaltedHash> {
  const salt = randomBytes(SALT_BYTES)
  const derived = await derivePbkdf2Bits(secret, salt, iterations, 256)
  return {
    salt: bytesToBase64(salt),
    hash: bytesToBase64(derived),
    iterations,
  }
}

export async function verifySecret(secret: string, record: SaltedHash): Promise<boolean> {
  try {
    const salt = base64ToBytes(record.salt)
    const expected = base64ToBytes(record.hash)
    const derived = await derivePbkdf2Bits(secret, salt, record.iterations, expected.length * 8)
    return timingSafeEqual(derived, expected)
  } catch {
    return false
  }
}

async function deriveAesGcmKey(
  passphrase: string,
  salt: Uint8Array,
  iterations: number
): Promise<CryptoKey> {
  const enc = new TextEncoder()
  const baseKey = await crypto.subtle.importKey(
    'raw',
    enc.encode(passphrase),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  )
  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: toArrayBuffer(salt),
      iterations,
      hash: 'SHA-256',
    },
    baseKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  )
}

export async function encryptText(
  plaintext: string,
  passphrase: string,
  iterations = PBKDF2_ITERATIONS
): Promise<EncryptedBlob> {
  const salt = randomBytes(SALT_BYTES)
  const iv = randomBytes(IV_BYTES)
  const key = await deriveAesGcmKey(passphrase, salt, iterations)
  const enc = new TextEncoder()
  const cipherBuf = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv: toArrayBuffer(iv) },
    key,
    enc.encode(plaintext)
  )
  return {
    salt: bytesToBase64(salt),
    iv: bytesToBase64(iv),
    ciphertext: bytesToBase64(new Uint8Array(cipherBuf)),
    iterations,
  }
}

export async function decryptText(blob: EncryptedBlob, passphrase: string): Promise<string | null> {
  try {
    const salt = base64ToBytes(blob.salt)
    const iv = base64ToBytes(blob.iv)
    const ciphertext = base64ToBytes(blob.ciphertext)
    const key = await deriveAesGcmKey(passphrase, salt, blob.iterations)
    const plainBuf = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: toArrayBuffer(iv) },
      key,
      toArrayBuffer(ciphertext)
    )
    return new TextDecoder().decode(plainBuf)
  } catch {
    return null
  }
}

// ==========================================
// RFC 6238 TOTP (2FA Authenticator Support)
// ==========================================

export function generateTotpSecretBase32(byteLength = 20): string {
  const bytes = randomBytes(byteLength)
  let bits = 0
  let value = 0
  let output = ''

  for (let i = 0; i < bytes.length; i++) {
    value = (value << 8) | bytes[i]
    bits += 8
    while (bits >= 5) {
      output += BASE32_ALPHABET[(value >>> (bits - 5)) & 31]
      bits -= 5
    }
  }
  if (bits > 0) {
    output += BASE32_ALPHABET[(value << (5 - bits)) & 31]
  }
  return output
}

function base32ToBytes(base32: string): Uint8Array {
  const cleaned = base32.toUpperCase().replace(/[^A-Z2-7]/g, '')
  let bits = 0
  let value = 0
  const out: number[] = []

  for (let i = 0; i < cleaned.length; i++) {
    const idx = BASE32_ALPHABET.indexOf(cleaned[i])
    if (idx === -1) continue
    value = (value << 5) | idx
    bits += 5
    if (bits >= 8) {
      out.push((value >>> (bits - 8)) & 0xff)
      bits -= 8
    }
  }
  return new Uint8Array(out)
}

export function buildOtpAuthUri(secretBase32: string, accountLabel: string): string {
  const issuer = 'NIDNASSER-Portfolio-Admin'
  const label = encodeURIComponent(`${issuer}:${accountLabel}`)
  const params = new URLSearchParams({
    secret: secretBase32,
    issuer,
    algorithm: 'SHA1',
    digits: '6',
    period: '30',
  })
  return `otpauth://totp/${label}?${params.toString()}`
}

async function generateTotpCodeForCounter(secretBytes: Uint8Array, counter: number): Promise<string> {
  const counterBuf = new ArrayBuffer(8)
  const view = new DataView(counterBuf)
  const high = Math.floor(counter / 0x100000000)
  const low = counter >>> 0
  view.setUint32(0, high, false)
  view.setUint32(4, low, false)

  const hmacKey = await crypto.subtle.importKey(
    'raw',
    toArrayBuffer(secretBytes),
    { name: 'HMAC', hash: 'SHA-1' },
    false,
    ['sign']
  )
  const signature = new Uint8Array(await crypto.subtle.sign('HMAC', hmacKey, counterBuf))
  const offset = signature[signature.length - 1] & 0x0f
  const binary =
    ((signature[offset] & 0x7f) << 24) |
    ((signature[offset + 1] & 0xff) << 16) |
    ((signature[offset + 2] & 0xff) << 8) |
    (signature[offset + 3] & 0xff)

  return String(binary % 1_000_000).padStart(6, '0')
}

export async function verifyTotpCode(
  secretBase32: string,
  userCode: string,
  windowSteps = 1
): Promise<boolean> {
  const cleaned = userCode.replace(/\s+/g, '')
  if (!/^\d{6}$/.test(cleaned)) return false

  const secretBytes = base32ToBytes(secretBase32)
  if (secretBytes.length < 10) return false

  const currentCounter = Math.floor(Date.now() / 1000 / 30)
  let matched = false
  for (let delta = -windowSteps; delta <= windowSteps; delta++) {
    const expected = await generateTotpCodeForCounter(secretBytes, currentCounter + delta)
    if (timingSafeStringEqual(cleaned, expected)) {
      matched = true
    }
  }
  return matched
}

// ==========================================
// Vault Integrity, Storage & Lockout Guards
// ==========================================

async function computeVaultIntegrityDigest(
  vault: Omit<AdminSecurityVault, 'integrityDigest'>
): Promise<string> {
  const canonical = JSON.stringify({
    version: vault.version,
    createdAt: vault.createdAt,
    primaryEmailHash: vault.primaryEmailHash,
    primaryPasswordHash: vault.primaryPasswordHash,
    encryptedTotpSecret: vault.encryptedTotpSecret,
    securityQuestion: vault.securityQuestion,
    securityAnswerHash: vault.securityAnswerHash,
    secondaryLoginHash: vault.secondaryLoginHash,
    secondaryPasswordHash: vault.secondaryPasswordHash,
    encryptedGithubToken: vault.encryptedGithubToken ?? null,
  })
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(canonical))
  return bytesToBase64(new Uint8Array(digest))
}

export async function sealVault(
  unsigned: Omit<AdminSecurityVault, 'integrityDigest'>
): Promise<AdminSecurityVault> {
  const integrityDigest = await computeVaultIntegrityDigest(unsigned)
  return { ...unsigned, integrityDigest }
}

export async function verifyVaultIntegrity(vault: AdminSecurityVault): Promise<boolean> {
  if (!vault || vault.version !== 1 || typeof vault.integrityDigest !== 'string') return false
  const { integrityDigest, ...rest } = vault
  const expected = await computeVaultIntegrityDigest(rest)
  return timingSafeStringEqual(integrityDigest, expected)
}

export function loadVault(): AdminSecurityVault | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(VAULT_STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as AdminSecurityVault
    if (
      !parsed ||
      parsed.version !== 1 ||
      !parsed.primaryEmailHash?.hash ||
      !parsed.primaryPasswordHash?.hash ||
      !parsed.encryptedTotpSecret?.ciphertext ||
      !parsed.securityAnswerHash?.hash ||
      !parsed.secondaryLoginHash?.hash ||
      !parsed.secondaryPasswordHash?.hash
    ) {
      return null
    }
    return parsed
  } catch {
    return null
  }
}

export function saveVault(vault: AdminSecurityVault): void {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(VAULT_STORAGE_KEY, JSON.stringify(vault))
}

export function clearVault(): void {
  if (typeof window === 'undefined') return
  window.localStorage.removeItem(VAULT_STORAGE_KEY)
  window.localStorage.removeItem(LOCKOUT_STORAGE_KEY)
}

export function loadLockoutState(): LockoutState {
  if (typeof window === 'undefined') return { attempts: 0, lockedUntil: 0 }
  try {
    const raw = window.localStorage.getItem(LOCKOUT_STORAGE_KEY)
    if (!raw) return { attempts: 0, lockedUntil: 0 }
    const parsed = JSON.parse(raw) as Partial<LockoutState>
    return {
      attempts: typeof parsed.attempts === 'number' && parsed.attempts >= 0 ? parsed.attempts : 0,
      lockedUntil:
        typeof parsed.lockedUntil === 'number' && parsed.lockedUntil >= 0 ? parsed.lockedUntil : 0,
    }
  } catch {
    return { attempts: 0, lockedUntil: 0 }
  }
}

export function recordFailedAuthAttempt(): LockoutState {
  const current = loadLockoutState()
  const nextAttempts = current.attempts + 1
  const lockedUntil =
    nextAttempts >= MAX_FAILED_ATTEMPTS ? Date.now() + LOCKOUT_DURATION_MS : current.lockedUntil
  const next: LockoutState = { attempts: nextAttempts, lockedUntil }
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(LOCKOUT_STORAGE_KEY, JSON.stringify(next))
  }
  return next
}

export function resetLockoutState(): void {
  if (typeof window === 'undefined') return
  window.localStorage.removeItem(LOCKOUT_STORAGE_KEY)
}

/**
 * Enforces a strict minimum processing duration (default 5,000ms) for every auth step
 * to throttle brute-force attacks and prevent timing side-channel leaks.
 */
export async function runWithMinimumStepDelay<T>(
  work: () => Promise<T>,
  minMs = STEP_PROCESS_MS,
  onProgress?: (pct: number, remainingSeconds: number) => void
): Promise<T> {
  const startedAt = performance.now()
  let timer: number | undefined

  if (onProgress) {
    onProgress(0, minMs / 1000)
    timer = window.setInterval(() => {
      const elapsed = performance.now() - startedAt
      const pct = Math.min(99, Math.round((elapsed / minMs) * 100))
      const rem = Math.max(0, (minMs - elapsed) / 1000)
      onProgress(pct, rem)
    }, 60)
  }

  try {
    const result = await work()
    const elapsed = performance.now() - startedAt
    if (elapsed < minMs) {
      await new Promise((resolve) => window.setTimeout(resolve, minMs - elapsed))
    }
    if (onProgress) onProgress(100, 0)
    return result
  } finally {
    if (timer !== undefined) {
      window.clearInterval(timer)
    }
  }
}
