import * as http from '@actions/http-client'
export type EventType = 'marker' | 'release' | 'maintenance' | 'down'

export interface CreateReleaseRequest {
  apiKey: string
  name: string
  type: EventType
  description?: string
  environment?: string
  service?: string
  compareAfterMinutes?: number
}

interface Release {
  id: number
  name: string
  environment: string
  service: string
}

export interface CreateReleaseResponse {
  id: number
  name: string
  environment: string
  service: string
  releases: Release[]
}

interface SuccessResponse extends CreateReleaseResponse {
  ok: true
}

interface FailureResponse {
  msg: string
}

function isFailureResponse(response: unknown): response is FailureResponse {
  return typeof response == 'object' && response != null && 'msg' in response
}

function isSuccessResponse(response: unknown): response is SuccessResponse {
  return (
    typeof response == 'object' &&
    response != null &&
    'ok' in response &&
    response.ok === true
  )
}

export async function createRelease(
  payload: CreateReleaseRequest
): Promise<CreateReleaseResponse> {
  const client = new http.HttpClient('TidewaysReleaseAction')

  const response = await client.post(
    'https://app.tideways.io/api/events',
    JSON.stringify(payload)
  )

  const result = await response.readBody()
  let parsedResult = undefined
  try {
    parsedResult = JSON.parse(result)
  } catch {
    // Ignore
  }

  if (response.message.statusCode === 201 && isSuccessResponse(parsedResult)) {
    return parsedResult
  } else {
    if (isFailureResponse(parsedResult)) {
      throw new Error(
        `API request failed with status code ${response.message.statusCode}: ${parsedResult.msg}`
      )
    } else {
      throw new Error(
        `API request failed with status code ${response.message.statusCode}: ${result}`
      )
    }
  }
}
