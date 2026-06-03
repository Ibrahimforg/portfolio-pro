declare module 'jest-axe' {
  import type { CustomMatcherResult } from 'expect'

  export interface AxeResults {
    violations: any[]
    passes: any[]
    incomplete: any[]
    inapplicable: any[]
  }

  export function axe(element: HTMLElement | Document | string): Promise<AxeResults>
  export function toHaveNoViolations(results: AxeResults): CustomMatcherResult
}

declare global {
  namespace jest {
    interface Matchers<R> {
      toHaveNoViolations(): R
    }
  }
}
