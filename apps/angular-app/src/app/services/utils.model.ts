export const customDecodeToken = <T>(token: string): T | null => {
  try {
    // split the token into 3 parts
    const parts = token.split('.');

    if (parts.length !== 3) {
      throw new Error('Invalid token structure');
    }

    // get the payload (2nd part)
    const payload = parts[1];

    // decode Base64Url to string
    // replace special URL chars just in case (standard JWT practice)
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    // parse JSON
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error('Error decoding token', e);
    return null;
  }
};
