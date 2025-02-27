import { jest } from '@jest/globals'

export const createRelease =
  jest.fn<typeof import('../src/api.js').createRelease>()
