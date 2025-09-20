import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return new NextResponse(
        JSON.stringify({ error: 'Not authenticated' }), 
        { status: 401 }
      );
    }

    const cv = await prisma.cV.findUnique({
      where: { id: params.id },
    });

    if (!cv) {
      return new NextResponse(
        JSON.stringify({ error: 'CV not found' }), 
        { status: 404 }
      );
    }

    // Verify the user owns this CV
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (cv.userId !== user?.id) {
      return new NextResponse(
        JSON.stringify({ error: 'Unauthorized' }), 
        { status: 403 }
      );
    }

    return NextResponse.json(cv);
  } catch (error) {
    console.error('Error fetching CV:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Failed to fetch CV' }), 
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return new NextResponse(
        JSON.stringify({ error: 'Not authenticated' }), 
        { status: 401 }
      );
    }

    const { title, content } = await request.json();

    // Find the user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return new NextResponse(
        JSON.stringify({ error: 'User not found' }), 
        { status: 404 }
      );
    }

    // Check if CV exists and belongs to the user
    const existingCV = await prisma.cV.findUnique({
      where: { id: params.id },
    });

    if (!existingCV) {
      return new NextResponse(
        JSON.stringify({ error: 'CV not found' }), 
        { status: 404 }
      );
    }

    if (existingCV.userId !== user.id) {
      return new NextResponse(
        JSON.stringify({ error: 'Unauthorized' }), 
        { status: 403 }
      );
    }

    // Update the CV
    const updatedCV = await prisma.cV.update({
      where: { id: params.id },
      data: {
        title,
        content,
      },
    });

    return NextResponse.json(updatedCV);
  } catch (error) {
    console.error('Error updating CV:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Failed to update CV' }), 
      { status: 500 }
    );
  }
}
