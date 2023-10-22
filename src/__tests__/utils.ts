import { vi } from 'vitest';
import { cleanup } from '@testing-library/react';

export function clearScreenAndMocks() {
  cleanup();
  vi.clearAllMocks();
}
