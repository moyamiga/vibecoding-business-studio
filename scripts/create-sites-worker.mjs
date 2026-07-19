import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';

const distPath = resolve('dist');
const workerPath = resolve('dist/server/index.js');

const contentTypes = new Map([
  ['.html', 'text/html; charset=utf-8'],
  ['.css', 'text/css; charset=utf-8'],
  ['.js', 'text/javascript; charset=utf-8'],
  ['.map', 'application/json; charset=utf-8'],
  ['.json', 'application/json; charset=utf-8'],
  ['.svg', 'image/svg+xml'],
  ['.png', 'image/png'],
  ['.jpg', 'image/jpeg'],
  ['.jpeg', 'image/jpeg'],
  ['.webp', 'image/webp'],
  ['.ico', 'image/x-icon']
]);

function contentTypeFor(filePath) {
  const extension = filePath.slice(filePath.lastIndexOf('.'));
  return contentTypes.get(extension) ?? 'application/octet-stream';
}

async function collectFiles(directory, prefix = '') {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    if (entry.name === 'server' || entry.name === '.openai') continue;

    const relativePath = prefix ? `${prefix}/${entry.name}` : entry.name;
    const absolutePath = join(directory, entry.name);

    if (entry.isDirectory()) {
      files.push(...(await collectFiles(absolutePath, relativePath)));
    } else if (entry.isFile()) {
      files.push(relativePath);
    }
  }

  return files;
}

const assetEntries = Object.fromEntries(
  await Promise.all(
    (await collectFiles(distPath)).map(async (relativePath) => {
      const content = await readFile(join(distPath, relativePath), 'utf8');
      return [
        `/${relativePath.replaceAll('\\\\', '/')}`,
        {
          content,
          contentType: contentTypeFor(relativePath)
        }
      ];
    })
  )
);

if (!assetEntries['/index.html']) {
  throw new Error('Missing dist/index.html');
}

assetEntries['/'] = assetEntries['/index.html'];

const workerSource = `const STATIC_ASSET_CACHE = 'public, max-age=31536000, immutable';
const ASSETS = ${JSON.stringify(assetEntries, null, 2)};

function assetResponse(pathname, method) {
  const asset = ASSETS[pathname] ?? ASSETS['/index.html'];
  const headers = new Headers();
  headers.set('X-Content-Type-Options', 'nosniff');
  headers.set('Content-Type', asset.contentType);

  if (pathname.startsWith('/assets/')) {
    headers.set('Cache-Control', STATIC_ASSET_CACHE);
  } else {
    headers.set('Cache-Control', 'no-store');
  }

  return new Response(method === 'HEAD' ? null : asset.content, { headers });
}

export default {
  async fetch(request) {
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

    return assetResponse(url.pathname, request.method);
  }
};
`;

await mkdir(dirname(workerPath), { recursive: true });
await writeFile(workerPath, workerSource);
