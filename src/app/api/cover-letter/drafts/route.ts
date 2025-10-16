import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { CoverLetterContent } from '@/types/cover-letter';

// GET /api/cover-letter/drafts - List all drafts for the current user
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const drafts = await prisma.coverLetter.findMany({
      where: {
        userId: session.user.id,
        isDraft: true,
      },
      orderBy: {
        updatedAt: 'desc',
      },
      select: {
        id: true,
        title: true,
        templateId: true,
        isDraft: true,
        isPublic: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ drafts });

  } catch (error) {
    console.error('Error fetching cover letter drafts:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/cover-letter/drafts - Create or update a draft
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { id, title, templateId, content }: {
      id?: string;
      title: string;
      templateId: string;
      content: CoverLetterContent;
    } = body;

    if (!title?.trim()) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }

    if (!templateId) {
      return NextResponse.json(
        { error: 'Template ID is required' },
        { status: 400 }
      );
    }

    if (!content) {
      return NextResponse.json(
        { error: 'Cover letter content is required' },
        { status: 400 }
      );
    }

    // Generate a slug from the title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();

    let coverLetter;

    if (id) {
      // Update existing draft
      coverLetter = await prisma.coverLetter.update({
        where: {
          id,
          userId: session.user.id,
          isDraft: true,
        },
        data: {
          title,
          slug,
          templateId,
          content,
          updatedAt: new Date(),
        },
      });
    } else {
      // Create new draft
      coverLetter = await prisma.coverLetter.create({
        data: {
          userId: session.user.id,
          title,
          slug,
          templateId,
          content,
          isDraft: true,
          isPublic: false,
        },
      });
    }

    return NextResponse.json({
      success: true,
      coverLetter: {
        id: coverLetter.id,
        title: coverLetter.title,
        templateId: coverLetter.templateId,
        isDraft: coverLetter.isDraft,
        createdAt: coverLetter.createdAt,
        updatedAt: coverLetter.updatedAt,
      },
    });

  } catch (error) {
    console.error('Error saving cover letter draft:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}