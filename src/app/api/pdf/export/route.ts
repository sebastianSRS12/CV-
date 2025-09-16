import { NextRequest, NextResponse } from 'next/server'
import { PDFGenerator, CVData } from '@/lib/pdf/pdf-generator'

export const runtime = 'nodejs' // Use Node.js runtime for PDF generation

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { cvData, template = 'modern' }: { cvData: CVData; template?: 'modern' | 'classic' | 'minimal' } = body

    if (!cvData) {
      return NextResponse.json({ error: 'CV data is required' }, { status: 400 })
    }

    const generator = new PDFGenerator()
    const pdfBuffer = await generator.generateFromData(cvData, template)

    // Return PDF as response
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${cvData.personalInfo.name.replace(/\s+/g, '_')}_CV.pdf"`,
        'Content-Length': pdfBuffer.length.toString(),
      },
    })
  } catch (error) {
    console.error('PDF generation failed:', error)
    return NextResponse.json(
      { error: 'Failed to generate PDF' },
      { status: 500 }
    )
  }
}
