import { createGzip, createGunzip } from 'zlib'

export interface CompressedData {
  compressed: string
  metadata: {
    originalSize: number
    compressedSize: number
    ratio: number
    timestamp: number
  }
}

export async function compressData(data: unknown): Promise<CompressedData> {
  const jsonStr = JSON.stringify(data)
  const originalSize = Buffer.byteLength(jsonStr, 'utf-8')

  const buffer = Buffer.from(jsonStr, 'utf-8')
  const gzip = createGzip()
  let compressed = Buffer.alloc(0)

  return new Promise((resolve, reject) => {
    gzip.on('data', (chunk) => {
      compressed = Buffer.concat([compressed, chunk])
    })
    gzip.on('end', () => {
      const compressedSize = Buffer.byteLength(compressed, 'utf-8')
      const ratio = ((1 - compressedSize / originalSize) * 100).toFixed(2)
      resolve({
        compressed: compressed.toString('base64'),
        metadata: {
          originalSize,
          compressedSize,
          ratio: parseFloat(ratio),
          timestamp: Date.now(),
        },
      })
    })
    gzip.on('error', reject)
    gzip.write(buffer)
    gzip.end()
  })
}

export async function decompressData<T = unknown>(
  compressed: string
): Promise<T> {
  const buffer = Buffer.from(compressed, 'base64')
  const gunzip = createGunzip()
  let decompressed = Buffer.alloc(0)

  return new Promise((resolve, reject) => {
    gunzip.on('data', (chunk) => {
      decompressed = Buffer.concat([decompressed, chunk])
    })
    gunzip.on('end', () => {
      try {
        const jsonStr = decompressed.toString('utf-8')
        resolve(JSON.parse(jsonStr) as T)
      } catch (err) {
        reject(err)
      }
    })
    gunzip.on('error', reject)
    gunzip.write(buffer)
    gunzip.end()
  })
}

export function getCompressionStats(data: CompressedData): string {
  const { originalSize, compressedSize, ratio } = data.metadata
  return `Compression: ${originalSize} bytes → ${compressedSize} bytes (${ratio}% saved)`
}
