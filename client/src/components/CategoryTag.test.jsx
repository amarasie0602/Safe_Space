import { describe, expect, test } from 'vitest';
import { render, screen } from '@testing-library/react';
import CategoryTag from './CategoryTag';

describe('CategoryTag', () => {
  test('renders the label for a known category', () => {
    render(<CategoryTag category="gratitude" />);
    expect(screen.getByText('Gratitude & Wins')).toBeInTheDocument();
  });

  test('falls back gracefully for an unknown category', () => {
    render(<CategoryTag category="not_a_real_category" />);
    expect(screen.getByText('not_a_real_category')).toBeInTheDocument();
  });
});
