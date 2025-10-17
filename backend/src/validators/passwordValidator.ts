import crypto from "crypto";

export class PasswordValidator {
  static validate(password: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // NIST Guidelines
    if (password.length < 8) {
      errors.push("Password must be at least 8 characters");
    }

    if (password.length > 128) {
      errors.push("Password must not exceed 128 characters");
    }

    const commonPasswords = ["password", "123456", "admin", "pharmacy123"];
    if (commonPasswords.includes(password.toLowerCase())) {
      errors.push("Password is too common");
    }

    if (/(.)\1{3,}/.test(password)) {
      errors.push("Password cannot have more than 3 repeated characters");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  static async checkBreach(password: string): Promise<boolean> {
    const hash = crypto
      .createHash("sha1")
      .update(password)
      .digest("hex")
      .toUpperCase();
    const prefix = hash.substring(0, 5);
    const suffix = hash.substring(5);

    try {
      const response = await fetch(
        `https://api.pwnedpasswords.com/range/${prefix}`
      );
      const data = await response.text();
      return data.includes(suffix);
    } catch {
      return false; // Fail open for availability
    }
  }
}
