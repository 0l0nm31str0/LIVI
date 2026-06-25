import { compressData } from './compression'

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: { code?: string; message: string }
  meta?: {
    compressed?: boolean
    compressionRatio?: number
  }
}

// Shorthand helpers used across API routes
export function ok<T>(data: T, meta?: ApiResponse['meta']): ApiResponse<T> {
  return { success: true, data, ...(meta ? { meta } : {}) }
}

export function err(message: string, code?: string): ApiResponse<never> {
  return { success: false, error: { message, ...(code ? { code } : {}) } }
}

export async function compressedResponse<T>(
  data: T,
  useCompression = false
): Promise<ApiResponse<T | string>> {
  const response: ApiResponse<T> = { success: true, data }

  if (useCompression && JSON.stringify(data).length > 1000) {
    const compressed = await compressData(data)
    return {
      success: true,
      data: compressed.compressed as string,
      meta: { compressed: true, compressionRatio: compressed.metadata.ratio },
    }
  }

  return response
}

export async function errorResponse(message: string, code?: string): Promise<ApiResponse> {
  return { success: false, error: { message, ...(code ? { code } : {}) } }
}
