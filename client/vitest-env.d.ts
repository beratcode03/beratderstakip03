/**
 * BERAT CANKIR - YKS ANALİZ TAKİP SİSTEMİ
 * @author Berat Cankır
 * @copyright © 2025 Berat Cankır. Tüm hakları saklıdır.
 */

/// <reference types="vitest" />
/// <reference types="@testing-library/jest-dom" />

import type {
  TestingLibraryMatchers,
} from '@testing-library/jest-dom/matchers'

declare global {
  namespace Vi {
    interface Assertion extends TestingLibraryMatchers<HTMLElement, void> {}
    interface AsymmetricMatchersContaining extends TestingLibraryMatchers<any, void> {}
  }
}

// CANKIR