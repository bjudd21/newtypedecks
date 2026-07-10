// GET /api/uploads/cards/[...path] - Serve locally stored card images (dev).
// Production images live on Vercel Blob and are served directly by its CDN.
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';

interface RouteParams {
  params: Promise<{ path: string[] }>;
}

const CONTENT_TYPES: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
};

export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const { path: imagePath } = await params;

    if (!imagePath || imagePath.length === 0) {
      return NextResponse.json(
        { error: 'File path is required' },
        { status: 400 }
      );
    }

    const uploadsDir = path.resolve(process.cwd(), 'uploads', 'cards');
    const resolvedPath = path.resolve(uploadsDir, ...imagePath);

    // Security check - ensure path stays within the uploads directory
    if (!resolvedPath.startsWith(uploadsDir + path.sep)) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    const ext = path.extname(resolvedPath).toLowerCase();
    const contentType = CONTENT_TYPES[ext];
    if (!contentType) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    let data: Buffer;
    try {
      data = await fs.readFile(resolvedPath);
    } catch {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    return new NextResponse(new Uint8Array(data), {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
