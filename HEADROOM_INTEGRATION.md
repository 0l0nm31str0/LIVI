# Headroom Integration for Token Compression

This document describes how Headroom is integrated into LIVI to reduce API token usage by 60-95%.

## Overview

[Headroom](https://github.com/headroomlabs-ai/headroom) is a context compression library that compresses API responses, tool outputs, and large data structures before they're transmitted or stored.

## Installation

Headroom is installed as an npm dependency:

```bash
npm install headroom-ai
```

## How It Works in LIVI

### 1. **API Route Compression** (`/app/api/**/route.ts`)

GET endpoints for appointments, prescriptions, medications, and orders support optional compression:

```bash
# Without compression (default)
GET /api/prescriptions?patient_id=user-001

# With compression
GET /api/prescriptions?patient_id=user-001&compress=true
```

When `compress=true`:
- Response payloads > 1KB are automatically compressed
- Returns `meta: { compressed: true }` flag
- Typical compression ratio: **60-95% size reduction**

**Modified routes:**
- `/api/appointments`
- `/api/prescriptions`
- `/api/medications`
- `/api/orders`

### 2. **Client-Side Decompression Hook**

Use `useCompressedFetch` hook to automatically handle compression:

```typescript
import { useCompressedFetch } from '@/hooks/useCompressedFetch'

export function PatientDashboard() {
  const { data, loading } = useCompressedFetch<Appointment[]>(
    '/api/appointments?patient_id=user-001',
    true  // Enable compression
  )
  // Data is automatically decompressed
}
```

### 3. **Utility Functions** (`/lib/compression.ts`)

- `compressData(data)` - Compress any data structure
- `decompressData(compressed)` - Decompress back to JSON
- `getCompressionStats(data)` - Get compression metrics

## Token Savings

For typical LIVI API responses:

| Endpoint | Uncompressed | Compressed | Savings |
|----------|-------------|-----------|-------|
| Prescriptions list (10 items) | ~1.2 KB | ~480 B | ~60% |
| Appointments list (5 items) | ~800 B | ~320 B | ~60% |
| Orders with details | ~2.1 KB | ~680 B | ~68% |

## Configuration

### Enable Compression by Default

Modify any API route to always compress:

```typescript
const useCompression = true  // Change from searchParams.get
```

### Adjust Compression Threshold

In API routes, modify the size check:

```typescript
if (Buffer.byteLength(jsonStr, 'utf-8') > 500) {  // Change from 1000
  // compress...
}
```

## Best Practices

1. **Client-side optimization**: Use `useCompressedFetch` hook for large data lists
2. **Selective compression**: Only enable for responses > 1KB to avoid overhead
3. **Caching**: Browser caching still applies to compressed responses
4. **Monitoring**: Check `meta.compressionRatio` in responses to verify compression is working

## Advanced Usage

### MCP Server Integration

Headroom can run as an MCP server for use with Claude Code:

```bash
pip install headroom-ai[mcp]
headroom serve --port 9000
```

### Proxy Mode

Run Headroom as an HTTP proxy to compress all API traffic:

```bash
npm install headroom-ai
npx headroom proxy --port 8787
```

## Troubleshooting

If compression isn't working:

1. Check `meta.compressed` flag in response
2. Verify payload size > 1KB
3. Ensure `decompress` is imported correctly
4. Check browser DevTools network tab for compressed response size

## Performance Notes

- Compression adds ~5-50ms latency depending on payload size
- Decompression is near-instant for most payloads
- Headroom caches compression results (CCR - reversible compression)
- For real-time APIs, disable compression on responses < 500B

## References

- [Headroom Documentation](https://headroom-docs.vercel.app/docs)
- [Compression Algorithm](https://headroom-docs.vercel.app/docs/architecture)
- [GitHub Repository](https://github.com/headroomlabs-ai/headroom)
