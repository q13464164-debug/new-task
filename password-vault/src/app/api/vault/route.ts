import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import VaultItem from '@/models/VaultItem';
import dbConnect from '@/lib/mongodb';

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    await dbConnect();

    const items = await VaultItem.find({ userId: payload.userId }).sort({ createdAt: -1 });

    return NextResponse.json({ items });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { encryptedData } = await request.json();

    if (!encryptedData) {
      return NextResponse.json({ error: 'Encrypted data is required' }, { status: 400 });
    }

    await dbConnect();

    const item = new VaultItem({
      userId: payload.userId,
      encryptedData,
    });

    await item.save();

    return NextResponse.json({ item }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}