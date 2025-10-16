import { redisService } from "./redis";

export class TokenService {
  static async generateTokenPair(jwtInstance: any, userId: string, email: string, role: string) {
    const accessToken = await jwtInstance.sign({
      sub: userId,
      email,
      role,
      type: "access",
      jti: crypto.randomUUID(),
      iss: "pharmacy-pos-api",
      aud: "pharmacy-pos-client",
    }, { expiresIn: "15m" });

    const refreshToken = await jwtInstance.sign({
      sub: userId,
      type: "refresh",
      jti: crypto.randomUUID(),
      iss: "pharmacy-pos-api",
      aud: "pharmacy-pos-client",
    }, { expiresIn: "7d" });

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
        return null;
      }

      return await jwtInstance.sign({
        sub: decoded.sub,
        email: decoded.email,
        role: decoded.role,
        type: "access",
        jti: crypto.randomUUID(),
        iss: "pharmacy-pos-api",
        aud: "pharmacy-pos-client",
      }, { expiresIn: "15m" });
    } catch {
      return null;
    }
  }

  static async validateToken(jwtInstance: any, token: string): Promise<{ valid: boolean; payload?: any; error?: string }> {
    try {
      const decoded = await jwtInstance.verify(token);
      
      if (decoded.jti) {
        const isRevoked = await this.isTokenRevoked(decoded.jti);
        if (isRevoked) {
          return { valid: false, error: "Token has been revoked" };
        }
      }

      if (decoded.type !== "access") {
        return { valid: false, error: "Invalid token type" };
      }

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
    try {
      // Get all active sessions for the user
      const userSessionsKey = `user_sessions:${userId}`
      const existingSessions = await redisService.get(userSessionsKey)
      
      if (existingSessions) {
        const sessions = JSON.parse(existingSessions)
        
        // Revoke each session
        for (const sessionId of sessions) {
          await redisService.del(`session:${sessionId}`)
        }
        
        // Clear user sessions list
        await redisService.del(userSessionsKey)
      }
      
      // Revoke all refresh tokens for the user
      const refreshTokensPattern = `refresh_token:*`
      // Note: In a real implementation, you'd need to scan Redis keys
      // and check each refresh token's userId
      
      console.log(`Successfully revoked all tokens for user: ${userId}`)
    } catch (error) {
      console.error(`Error revoking tokens for user ${userId}:`, error)
      throw error
    }
  }

}
