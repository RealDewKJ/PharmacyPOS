import { redisService } from "./redis";

export class TokenService {
  static async generateTokenPair(jwtInstance: any, userId: string, email: string, role: string) {
    const accessToken = await jwtInstance.sign({
      sub: userId,
      email,
      role,
      type: "access",
      jti: crypto.randomUUID(), // JWT ID for tracking
      exp: Math.floor(Date.now() / 1000) + (15 * 60), // 15 minutes
      iss: "pharmacy-pos-api",
      aud: "pharmacy-pos-client",
    });

    const refreshToken = await jwtInstance.sign({
      sub: userId,
      type: "refresh",
      jti: crypto.randomUUID(),
      exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60), // 7 days
      iss: "pharmacy-pos-api",
      aud: "pharmacy-pos-client",
    });

    // Store refresh token in Redis
    await redisService.set(
      `refresh_token:${refreshToken}`,
      JSON.stringify({ userId, createdAt: new Date() }),
      7 * 24 * 60 * 60 // 7 days
    );

    return { accessToken, refreshToken };
  }

  static async revokeToken(tokenId: string): Promise<void> {
    await redisService.set(
      `revoked_token:${tokenId}`,
      "true",
      7 * 24 * 60 * 60
    );
  }

  static async isTokenRevoked(tokenId: string): Promise<boolean> {
    return !!(await redisService.get(`revoked_token:${tokenId}`));
  }

  static async refreshAccessToken(
    jwtInstance: any,
    refreshToken: string
  ): Promise<string | null> {
    try {
      const decoded = await jwtInstance.verify(refreshToken);
      const stored = await redisService.get(`refresh_token:${refreshToken}`);

      if (!stored) {
        return null; // Refresh token not found or expired
      }

      // Generate new access token
      return await jwtInstance.sign({
        sub: decoded.sub,
        email: decoded.email,
        role: decoded.role,
        type: "access",
        jti: crypto.randomUUID(),
        exp: Math.floor(Date.now() / 1000) + (15 * 60), // 15 minutes
        iss: "pharmacy-pos-api",
        aud: "pharmacy-pos-client",
      });
    } catch {
      return null;
    }
  }

  static async validateToken(jwtInstance: any, token: string): Promise<{ valid: boolean; payload?: any; error?: string }> {
    try {
      // Verify token signature and expiration
      const decoded = await jwtInstance.verify(token);
      
      // Check if token is revoked
      if (decoded.jti) {
        const isRevoked = await this.isTokenRevoked(decoded.jti);
        if (isRevoked) {
          return { valid: false, error: "Token has been revoked" };
        }
      }

      // Validate token type
      if (decoded.type !== "access") {
        return { valid: false, error: "Invalid token type" };
      }

      // Validate issuer and audience
      if (decoded.iss !== "pharmacy-pos-api" || decoded.aud !== "pharmacy-pos-client") {
        return { valid: false, error: "Invalid token issuer or audience" };
      }

      return { valid: true, payload: decoded };
    } catch (error: any) {
      if (error.message?.includes('expired')) {
        return { valid: false, error: "Token has expired" };
      } else if (error.message?.includes('invalid')) {
        return { valid: false, error: "Invalid token" };
      } else {
        return { valid: false, error: "Token validation failed" };
      }
    }
  }

  static async revokeAllUserTokens(userId: string): Promise<void> {
    // This would require storing active tokens per user
    // For now, we'll implement a simple approach
    console.log(`Revoking all tokens for user: ${userId}`);
  }

  static async getTokenInfo(jwtInstance: any, token: string): Promise<{ jti?: string; sub?: string; exp?: number; iat?: number; type?: string }> {
    try {
      const decoded = await jwtInstance.verify(token);
      return {
        jti: decoded.jti,
        sub: decoded.sub,
        exp: decoded.exp,
        iat: decoded.iat,
        type: decoded.type
      };
    } catch {
      return {};
    }
  }
}
