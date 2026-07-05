import { NextRequest, NextResponse } from 'next/server';

// SHA-256 hash of the valid license key — actual key lives only in .env (gitignored)
const VALID_KEY_HASH = 'f80b7d10f58353a6742d4fb2bc33d415e7c8e1f870a63e9418a98bbf491b3a46';

// Routes always accessible (license gate page itself + static assets)
const BYPASS_PREFIXES = ['/unlicensed', '/_next', '/api', '/favicon', '/icon'];

async function sha256(text: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  // Web Crypto API — available in Edge runtime
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip protected check for public/static paths
  if (BYPASS_PREFIXES.some(p => pathname.startsWith(p)) || pathname.includes('.')) {
    return NextResponse.next();
  }

  const licenseKey = process.env.LUMIO_LICENSE_KEY ?? '';

  if (!licenseKey) {
    return NextResponse.redirect(new URL('/unlicensed', request.url));
  }

  const keyHash = await sha256(licenseKey);

  if (keyHash !== VALID_KEY_HASH) {
    return NextResponse.redirect(new URL('/unlicensed', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
