import { NextRequest, NextResponse } from 'next/server';
import { authenticatedFetch } from '@/lib/auth';

const BACKEND_URL = process.env.BACKEND_URL || 'https://smartlensocrv2-bk-sp62tbdjjq-uw.a.run.app';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const response = await authenticatedFetch(`${BACKEND_URL}/api/users/${id}/credits`, {
      method: 'POST',
      data: body,
    });

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('[API] credits error:', error);
    const status = error.response?.status || 500;
    const detail = error.response?.data?.detail || error.message || 'Internal server error';
    return NextResponse.json(
      { detail },
      { status }
    );
  }
}
