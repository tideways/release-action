/**
 * Unit tests for the action's main functionality, src/main.ts
 *
 * To mock dependencies in ESM, you can create fixtures that export mock
 * functions and objects. For example, the core module is mocked in this test,
 * so that the actual '@actions/core' module is not imported.
 */
import { jest } from '@jest/globals'
import * as core from '../__fixtures__/core.js'
import { createRelease } from '../__fixtures__/api.js'

// Mocks should be declared before the module being tested is imported.
jest.unstable_mockModule('@actions/core', () => core)
jest.unstable_mockModule('../src/api.js', () => ({ createRelease }))

// The module being tested should be imported dynamically. This ensures that the
// mocks are used in place of any actual dependencies.
const { run } = await import('../src/main.js')

describe('main.ts', () => {
  beforeEach(() => {
    createRelease.mockImplementation(() =>
      Promise.resolve({
        ok: true,
        id: 123,
        name: 'acme/myproject42',
        environment: 'production',
        service: 'app',
        releases: [
          {
            id: 123,
            name: 'acme/myproject42',
            environment: 'production',
            service: 'app'
          }
        ]
      })
    )
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('Sets proper outputs for a release event', async () => {
    core.getInput.mockImplementation((name) => {
      switch (name) {
        case 'apiKey':
          return 'tw_Axxxxxxxxxxxxxxxxxxxxxx000000'
        case 'name':
          return 'Test Release'
        case 'type':
          return 'release'
      }

      return ''
    })

    await run()

    expect(core.setOutput.mock.calls).toContainEqual(['id', 123])
    expect(core.setOutput.mock.calls).toContainEqual([
      'url',
      'https://app.tideways.io/o/acme/myproject42/issues/release?error=123&env=production&s=app'
    ])
  })

  it('Sets proper outputs for a marker event', async () => {
    core.getInput.mockImplementation((name) => {
      switch (name) {
        case 'apiKey':
          return 'tw_Axxxxxxxxxxxxxxxxxxxxxx000000'
        case 'name':
          return 'Test Marker'
        case 'type':
          return 'marker'
      }

      return ''
    })

    await run()

    expect(core.setOutput.mock.calls).toContainEqual(['id', 123])
    expect(core.setOutput.mock.calls).toContainEqual(['url', ''])
  })
})
