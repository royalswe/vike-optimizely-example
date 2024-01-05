import { API_URL } from './constants.js';
import { getCookieValue } from './utils.js';

const SESSION_COOKIE = '.AspNet.Federation';

/**
 * Fetch user from API server if user is logged in
 * @param cookie {string}
 * @returns {Promise<any>}
 */
export async function fetchUser(cookie: string): Promise<any> {
  const sessionCookie = getCookieValue(cookie, SESSION_COOKIE);
  if (!sessionCookie) {
    return null; // user is not logged in
  }

  const headers = new Headers({
    'Camel-Case-Response': 'true',
    Accept: 'application/json',
    Cookie: `${SESSION_COOKIE}=${sessionCookie}`,
  });

  const response = await fetch(`${API_URL}/_api/account`, {
    headers,
    credentials: 'include',
    method: 'GET',
  });

  if (!response.ok) {
    const responseBody = await response.text();
    console.error(
      `Could not fetch user: HTTP request failed with code: ${response.status}, response: ${responseBody}`
    );
    return null; // proceed rendering without user
  }

  return response.json();
}
