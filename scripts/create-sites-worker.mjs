import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

const workerPath = resolve('dist/server/index.js');

const workerSource = `const STATIC_ASSET_CACHE = 'public, max-age=31536000, immutable';

function responseWithHeaders(response, pathname) {
  const headers = new Headers(response.headers);
  headers.set('X-Content-Type-Options', 'nosniff');

  if (pathname.startsWith('/assets/')) {
    headers.set('Cache-Control', STATIC_ASSET_CACHE);
  } else {
    headers.set('Cache-Control', 'no-store');
  }

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers
  });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname.startsWith('/api/')) {
      return Response.json(
        {
          error:
            'The OpenAI coach endpoint is not configured on this Sites deployment. The client will use the local coaching fallback.'
        },
        { status: 503 }
      );
    }

    if (request.method !== 'GET' && request.method !== 'HEAD') {
      return new Response('Method not allowed', {
        status: 405,
        headers: { Allow: 'GET, HEAD' }
      });
    }

    const assetResponse = await env.ASSETS.fetch(request);

    if (assetResponse.status !== 404) {
      return responseWithHeaders(assetResponse, url.pathname);
    }

    const fallbackUrl = new URL(request.url);
    fallbackUrl.pathname = '/index.html';
    fallbackUrl.search = '';

    const fallbackResponse = await env.ASSETS.fetch(
      new Request(fallbackUrl, request)
    );

    return responseWithHeaders(fallbackResponse, '/index.html');
  }
};
`;

await mkdir(dirname(workerPath), { recursive: true });
await writeFile(workerPath, workerSource);
