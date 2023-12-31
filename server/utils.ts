import { API_URL } from './constants.js';
import { Request } from 'express';
/**
 * Get full API url
 * @param req {Request}
 * @returns {string}
 */
export function getFullApiUrl(req: Request): string {
  return API_URL + req.originalUrl;
}

/**
 * Get cookie value by name
 * @param cookieHeader {string}
 * @param cookieName {string}
 * @returns {string | null}
 */
export function getCookieValue(
  cookieHeader: any,
  cookieName: string
): string | null {
  if (cookieHeader) {
    const regex = new RegExp(`(?:^| )${cookieName}=([^;]*)`);
    const match = cookieHeader.match(regex);
    if (match) {
      return match[1];
    }
  }
  return null;
}
