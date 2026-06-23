import { useEffect, useState } from 'react'

export interface CompressedResponse<T> {
  success: boolean
  data?: T | string
  meta?: {
    compressed?: boolean
    compressionRatio?: number
  }
  error?: { code?: string; message: string }
}

export function useCompressedFetch<T = unknown>(
  url: string,
  useCompression: boolean = false
) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      try {
        const fullUrl = new URL(url, typeof window !== 'undefined' ? window.location.origin : '')
        if (useCompression) {
          fullUrl.searchParams.set('compress', 'true')
        }

        const response = await fetch(fullUrl.toString())
        const json = (await response.json()) as CompressedResponse<T>

        if (!response.ok || !json.success) {
          setError(json.error?.message || 'Failed to fetch')
          setData(null)
        } else if (json.meta?.compressed && typeof json.data === 'string') {
          const binaryStr = atob(json.data)
          const bytes = Uint8Array.from(binaryStr, (c) => c.charCodeAt(0))
          const ds = new DecompressionStream('gzip')
          const writer = ds.writable.getWriter()
          writer.write(bytes)
          writer.close()
          const reader = ds.readable.getReader()
          const chunks: Uint8Array[] = []
          let done = false
          while (!done) {
            const { value, done: d } = await reader.read()
            if (value) chunks.push(value)
            done = d
          }
          const decoded = new TextDecoder().decode(
            chunks.reduce((a, b) => {
              const merged = new Uint8Array(a.length + b.length)
              merged.set(a)
              merged.set(b, a.length)
              return merged
            }, new Uint8Array(0))
          )
          setData(JSON.parse(decoded) as T)
        } else {
          setData(json.data as T)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
        setData(null)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [url, useCompression])

  return { data, loading, error }
}
