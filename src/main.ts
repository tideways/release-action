import * as core from '@actions/core'
import { createRelease, CreateReleaseRequest, EventType } from './api.js'

/**
 * The main function for the action.
 *
 * @returns Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    const apiKey = core.getInput('apiKey', { required: true })
    core.setSecret(apiKey)

    const name = core.getInput('name', { required: true })
    const type = core.getInput('type', { required: true }) as EventType
    const description = core.getInput('description') || undefined
    const environment = core.getInput('environment') || undefined
    const service = core.getInput('service') || undefined
    const compareAfterMinutes = parseInt(
      core.getInput('compareAfterMinutes') || '90',
      10
    )

    const payload: CreateReleaseRequest = {
      apiKey,
      name,
      type,
      description,
      environment,
      service,
      compareAfterMinutes
    }

    const result = await createRelease(payload)
    core.setOutput('id', result.id)
    if (type === 'release') {
      const query = new URLSearchParams({
        error: result.id.toString(),
        env: result.environment,
        s: result.service
      })
      const url = `https://app.tideways.io/o/${result.name}/issues/release?${query}`
      core.setOutput('url', url)

      core.info(
        `Successfully created release for project ${result.name}: ${url}`
      )
    } else {
      core.setOutput('url', '')

      core.info(`Successfully created ${type} event for project ${result.name}`)
    }
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  }
}
