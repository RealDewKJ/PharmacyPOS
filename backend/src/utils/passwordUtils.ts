import bcrypt from "bcryptjs";
import argon2 from "argon2";

export class PasswordUtils {
  static async hashPassword(password: string): Promise<string> {
    return await argon2.hash(password, {
      type: argon2.argon2id,
      timeCost: 3,
      parallelism: 1,
    });
  }

  static async verifyPassword(
    password: string,
    hash: string
  ): Promise<boolean> {
    try {
      return await argon2.verify(hash, password);
    } catch {
      return bcrypt.compare(password, hash);
    }
  }

  static async upgradePasswordHash(
    password: string,
    currentHash: string
  ): Promise<string> {
    const isValid = await bcrypt.compare(password, currentHash);
    if (isValid) {
      return await this.hashPassword(password);
    }
    throw new Error("Invalid password");
  }
}
