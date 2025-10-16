import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { CoverLetterContent } from '@/types/cover-letter';

interface RouteParams {
  params: {
    id: string;
  };
}

// GET /api/cover-letter/drafts/[id] - Get a specific draft
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = params;

    const draft = await prisma.coverLetter.findFirst({
      where: {
        id,
        userId: session.user.id,
        isDraft: true,
      },
      select: {
        id: true,
        title: true,
        slug: true,
        templateId: true,
        content: true,
        isDraft: true,
        isPublic: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!draft) {
      return NextResponse.json(
        { error: 'Draft not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ draft });

  } catch (error) {
    console.error('Error fetching cover letter draft:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/cover-letter/drafts/[id] - Update a specific draft
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = params;
    const body = await request.json();
    const { title, templateId, content }: {
      title?: string;
      templateId?: string;
      content?: CoverLetterContent;
    } = body;

    // Build update data object with only provided fields
    const updateData: any = {
      updatedAt: new Date(),
    };

    if (title !== undefined) {
      if (!title.trim()) {
        return NextResponse.json(
          { error: 'Title cannot be empty' },
          { status: 400 }
        );
      }
      updateData.title = title;

      // Update slug if title changed
      updateData.slug = title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
    }

    if (templateId) {
      updateData.templateId = templateId;
    }

    if (content) {
      updateData.content = content;
    }

    const updatedDraft = await prisma.coverLetter.update({
      where: {
        id,
        userId: session.user.id,
        isDraft: true,
      },
      data: updateData,
      select: {
        id: true,
        title: true,
        slug: true,
        templateId: true,
        isDraft: true,
        isPublic: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      draft: updatedDraft,
    });

  } catch (error) {
    console.error('Error updating cover letter draft:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/cover-letter/drafts/[id] - Delete a specific draft
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = params;

    await prisma.coverLetter.delete({
      where: {
        id,
        userId: session.user.id,
        isDraft: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Draft deleted successfully',
    });

  } catch (error) {
    console.error('Error deleting cover letter draft:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}