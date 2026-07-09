import { describe, expect, test } from 'vitest';
import { AFFIRMATIONS, getTodaysAffirmation } from './affirmations';

describe('getTodaysAffirmation', () => {
  test('returns one of the known affirmations', () => {
    expect(AFFIRMATIONS).toContain(getTodaysAffirmation());
  });

  test('is stable across multiple calls on the same day', () => {
    expect(getTodaysAffirmation()).toBe(getTodaysAffirmation());
  });
});
