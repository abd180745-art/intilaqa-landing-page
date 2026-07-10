import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  // Deprecated. Evolution API now points to /api/webhooks/evolution
  return NextResponse.json({ success: true, message: "Use /api/webhooks/evolution" });
}
