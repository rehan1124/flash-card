import { test } from '@playwright/test'

/**
 * Decorator for page-object methods so Playwright reports
 * high-level business actions instead of low-level locator operations.
 */
export function step(label?: string) {
  return function <T extends (...methodArgs: unknown[]) => Promise<void>>(
    _target: object,
    propertyKey: string | symbol,
    descriptor: TypedPropertyDescriptor<T>
  ): void | TypedPropertyDescriptor<T> {
    if (!descriptor?.value) {
      return
    }

    const originalMethod = descriptor.value
    descriptor.value = (async function (
      this: unknown,
      ...methodArgs: Parameters<T>
    ): Promise<void> {
      const stepName = label ?? String(propertyKey)
      return test.step(stepName, async () => originalMethod.apply(this, methodArgs))
    }) as T

    return descriptor
  }
}
