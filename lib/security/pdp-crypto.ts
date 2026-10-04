import crypto from "node:crypto";

const ALGORITHM = "aes-256-cbc";
const DEFAULT_KEY = process.env.PDP_ENCRYPTION_KEY || "nusabook_pdp_default_secret_key_32b!";

export function maskNik(nik: string): string {
  if (!nik || nik.length < 8) return "********";
  const prefix = nik.slice(0, 4);
  const suffix = nik.slice(-4);
  const middleMask = "*".repeat(Math.max(0, nik.length - 8));
  return `${prefix}${middleMask}${suffix}`;
}

export function encryptNik(nik: string, secretKey: string = DEFAULT_KEY): string {
  const iv = crypto.randomBytes(16);
  const key = crypto.createHash("sha256").update(secretKey).digest();
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  let encrypted = cipher.update(nik, "utf8", "hex");
  encrypted += cipher.final("hex");
  return `${iv.toString("hex")}:${encrypted}`;
}

export function decryptNik(cipherText: string, secretKey: string = DEFAULT_KEY): string {
  const [ivHex, encrypted] = cipherText.split(":");
  if (!ivHex || !encrypted) throw new Error("Format ciphertext tidak valid");
  const iv = Buffer.from(ivHex, "hex");
  const key = crypto.createHash("sha256").update(secretKey).digest();
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  let decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}
