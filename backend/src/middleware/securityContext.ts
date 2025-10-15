import { Context } from 'elysia';

export interface SecurityContext {
  ip: string;
  userAgent?: string;
  forwardedFor?: string;
  realIp?: string;
}

export function extractSecurityContext(context: any): SecurityContext {
  const headers = context.headers;
  
  // Extract IP address with fallback chain
  let ip = 'unknown';
  
  // Check for forwarded headers (common in reverse proxy setups)
  const forwardedFor = headers['x-forwarded-for'];
  const realIp = headers['x-real-ip'];
  const cfConnectingIp = headers['cf-connecting-ip']; // Cloudflare
  
  if (cfConnectingIp) {
    ip = Array.isArray(cfConnectingIp) ? cfConnectingIp[0] : cfConnectingIp;
  } else if (realIp) {
    ip = Array.isArray(realIp) ? realIp[0] : realIp;
  } else if (forwardedFor) {
    // X-Forwarded-For can contain multiple IPs, take the first one
    const ips = Array.isArray(forwardedFor) ? forwardedFor[0] : forwardedFor;
    ip = ips.split(',')[0].trim();
  } else if (context.request?.ip) {
    ip = context.request.ip;
  }
  
  // Extract User-Agent
  const userAgent = headers['user-agent'];
  
  return {
    ip,
    userAgent: Array.isArray(userAgent) ? userAgent[0] : userAgent,
    forwardedFor: Array.isArray(forwardedFor) ? forwardedFor[0] : forwardedFor,
    realIp: Array.isArray(realIp) ? realIp[0] : realIp,
  };
}

export function getClientIp(context: any): string {
  const securityContext = extractSecurityContext(context);
  return securityContext.ip;
}

export function getUserAgent(context: any): string | undefined {
  const securityContext = extractSecurityContext(context);
  return securityContext.userAgent;
}
