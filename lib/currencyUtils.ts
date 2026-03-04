
// Use a library like Dinero.js or similar in a real-world app for robust money handling.
// For this project, we'll use simple integer conversion to cents to avoid floating point issues.

/**
 * Converts a float/number amount to an integer representing cents.
 * @param amount - The monetary value (e.g., 123.45)
 * @returns The value in cents (e.g., 12345)
 */
export const toCents = (amount: number): number => {
  return Math.round(amount * 100);
};

/**
 * Converts an integer amount in cents back to a float/number.
 * @param amountInCents - The monetary value in cents (e.g., 12345)
 * @returns The value as a float (e.g., 123.45)
 */
export const fromCents = (amountInCents: number): number => {
  return amountInCents / 100;
};
