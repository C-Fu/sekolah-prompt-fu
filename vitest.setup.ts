import "@testing-library/jest-dom";
import { vi, beforeAll, afterAll } from "vitest";

// Suppress console.error and console.log during tests to reduce noise
// These are expected outputs from error handling tests
const originalConsoleError = console.error;
const originalConsoleLog = console.log;

beforeAll(() => {
  console.error = vi.fn();
  console.log = vi.fn();
});

afterAll(() => {
  console.error = originalConsoleError;
  console.log = originalConsoleLog;
});

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    refresh: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    prefetch: vi.fn(),
  }),
  useSearchParams: () => {
    return new URLSearchParams();
  },
  usePathname: () => "/",
  useParams: () => ({}),
  redirect: vi.fn(),
  notFound: vi.fn(),
}));

// Mock next/headers
vi.mock("next/headers", () => {
  const getCookieMock = vi.fn().mockReturnValue(null);
  const setCookieMock = vi.fn();
  const deleteCookieMock = vi.fn();

  return {
    cookies: () => ({
      get: getCookieMock,
      set: setCookieMock,
      delete: deleteCookieMock,
    }),
    headers: () => new Headers(),
  };
});

// Mock next-intl
vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
  useLocale: () => "en",
  getTranslations: () => Promise.resolve((key: string) => key),
}));
