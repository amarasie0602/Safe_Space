import { describe, expect, test } from 'vitest';
import { timeAgo } from './timeAgo';

describe('timeAgo', () => {
  test('returns "just now" for a timestamp seconds ago', () => {
    expect(timeAgo(new Date().toISOString())).toBe('just now');
  });

  test('returns singular unit for exactly one hour ago', () => {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    expect(timeAgo(oneHourAgo)).toBe('1 hour ago');
  });

  test('returns plural unit for multiple days ago', () => {
    const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString();
    expect(timeAgo(threeDaysAgo)).toBe('3 days ago');
  });
});
