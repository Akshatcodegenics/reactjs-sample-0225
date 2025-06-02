
import '@testing-library/jest-dom';
import { vi } from 'vitest';

declare global {
  var describe: (name: string, fn: () => void) => void;
  var test: (name: string, fn: () => void | Promise<void>) => void;
  var it: (name: string, fn: () => void | Promise<void>) => void;
  var expect: any;
  var beforeEach: (fn: () => void | Promise<void>) => void;
  var afterEach: (fn: () => void | Promise<void>) => void;
  var beforeAll: (fn: () => void | Promise<void>) => void;
  var afterAll: (fn: () => void | Promise<void>) => void;
  var vi: typeof vi;
}

export {};
