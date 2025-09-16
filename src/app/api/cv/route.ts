import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { title, content } = await request.json();

    // For demo purposes, create CV without database persistence
    // Generate a unique ID for the CV
    const cvId = `cv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // In a real app, you would save this to the database
    // For now, we'll just return the generated ID
    const cvData = {
      id: cvId,
      title: title || 'Untitled CV',
      content: content || {},
      slug: generateSlug(title || 'untitled-cv'),
      createdAt: new Date().toISOString(),
    };

    // Store in session storage or local storage on the client side
    // For now, just return the ID so the user can proceed to the editor
    return NextResponse.json({ id: cvId });
  } catch (error) {
    console.error('Error creating CV:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Failed to create CV' }), 
      { status: 500 }
    );
  }
}

// Helper function to generate URL-friendly slugs
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .trim()
    .concat(`-${Date.now().toString(36)}`); // Add timestamp for uniqueness
}
