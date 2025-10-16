import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

export interface CVData {
  personalInfo: {
    name: string
    email: string
    phone?: string
    location?: string
    website?: string
    linkedin?: string
    github?: string
  }
  summary?: string
  experience: Array<{
    title: string
    company: string
    location?: string
    startDate: string
    endDate?: string
    description: string
    achievements?: string[]
  }>
  education: Array<{
    degree: string
    institution: string
    location?: string
    graduationDate: string
    gpa?: string
    honors?: string[]
  }>
  skills: Array<{
    category: string
    items: string[]
  }>
  projects?: Array<{
    name: string
    description: string
    technologies: string[]
    url?: string
    github?: string
  }>
  certifications?: Array<{
    name: string
    issuer: string
    date: string
    url?: string
  }>
}

export class PDFGenerator {
  private pdf: jsPDF
  private pageWidth: number
  private pageHeight: number
  private margin: number
  private currentY: number
  private lineHeight: number

  constructor() {
    this.pdf = new jsPDF('p', 'mm', 'a4')
    this.pageWidth = this.pdf.internal.pageSize.getWidth()
    this.pageHeight = this.pdf.internal.pageSize.getHeight()
    this.margin = 20
    this.currentY = this.margin
    this.lineHeight = 6
  }

  // Generate PDF from CV data
  async generateFromData(cvData: CVData, template: 'modern' | 'classic' | 'minimal' = 'modern'): Promise<Uint8Array> {
    switch (template) {
      case 'modern':
        this.generateModernTemplate(cvData)
        break
      case 'classic':
        this.generateClassicTemplate(cvData)
        break
      case 'minimal':
        this.generateMinimalTemplate(cvData)
        break
    }

    const arrayBuffer = this.pdf.output('arraybuffer')
    return new Uint8Array(arrayBuffer)
  }

  // Generate PDF from HTML element
  async generateFromHTML(elementId: string, filename: string = 'cv.pdf'): Promise<void> {
    const element = document.getElementById(elementId)
    if (!element) {
      throw new Error(`Element with ID '${elementId}' not found`)
    }

    // Configure html2canvas for better quality
    const canvas = await html2canvas(element, {
      scale: 2, // Higher resolution
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      removeContainer: true,
      imageTimeout: 0,
      logging: false,
    })

    const imgData = canvas.toDataURL('image/png')
    const imgWidth = this.pageWidth - (this.margin * 2)
    const imgHeight = (canvas.height * imgWidth) / canvas.width

    // Handle multiple pages if content is long
    let heightLeft = imgHeight
    let position = 0

    this.pdf.addImage(imgData, 'PNG', this.margin, this.margin, imgWidth, imgHeight)
    heightLeft -= this.pageHeight - (this.margin * 2)

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight
      this.pdf.addPage()
      this.pdf.addImage(imgData, 'PNG', this.margin, position + this.margin, imgWidth, imgHeight)
      heightLeft -= this.pageHeight - (this.margin * 2)
    }

    this.pdf.save(filename)
  }

  // Generate PDF from cover letter HTML string
  async generateFromCoverLetterHTML(htmlContent: string, filename: string = 'cover-letter.pdf'): Promise<void> {
    // Create a temporary div to hold the HTML content
    const tempDiv = document.createElement('div')
    tempDiv.innerHTML = htmlContent
    tempDiv.style.position = 'absolute'
    tempDiv.style.left = '-9999px'
    tempDiv.style.top = '0'
    tempDiv.style.width = '210mm' // A4 width
    tempDiv.style.backgroundColor = 'white'
    tempDiv.style.fontFamily = 'serif' // Default serif for cover letters

    // Ensure proper styling for PDF generation
    const style = document.createElement('style')
    style.textContent = `
      body {
        margin: 20mm;
        line-height: 1.4;
        font-size: 14px;
        color: #1f2937;
      }
      .header { text-align: right; margin-bottom: 1.5rem; }
      .date { text-align: right; margin-bottom: 1.5rem; }
      .salutation { margin-bottom: 1rem; }
      .paragraph { margin-bottom: 1rem; text-align: justify; }
      .signature { margin-top: 2rem; }
      .signature-name { font-weight: 600; }
    `
    tempDiv.appendChild(style)

    document.body.appendChild(tempDiv)

    try {
      // Configure html2canvas for cover letter
      const canvas = await html2canvas(tempDiv, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        width: 794, // A4 width in pixels at 96 DPI
        height: 1123, // A4 height in pixels at 96 DPI
      })

      const imgData = canvas.toDataURL('image/png')
      const imgWidth = this.pageWidth - (this.margin * 2)
      const imgHeight = (canvas.height * imgWidth) / canvas.width

      // Handle multiple pages if content is long
      let heightLeft = imgHeight
      let position = 0

      this.pdf.addImage(imgData, 'PNG', this.margin, this.margin, imgWidth, imgHeight)
      heightLeft -= this.pageHeight - (this.margin * 2)

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight
        this.pdf.addPage()
        this.pdf.addImage(imgData, 'PNG', this.margin, position + this.margin, imgWidth, imgHeight)
        heightLeft -= this.pageHeight - (this.margin * 2)
      }

      this.pdf.save(filename)
    } finally {
      // Clean up the temporary element
      document.body.removeChild(tempDiv)
    }
  }

  // Modern template with accent colors
  private generateModernTemplate(cvData: CVData): void {
    this.setColors('modern')
    
    // Header with accent background
    this.pdf.setFillColor(59, 130, 246) // Blue-500
    this.pdf.rect(0, 0, this.pageWidth, 60, 'F')
    
    // Name
    this.pdf.setTextColor(255, 255, 255)
    this.pdf.setFontSize(28)
    this.pdf.setFont('helvetica', 'bold')
    this.pdf.text(cvData.personalInfo.name, this.margin, 25)
    
    // Contact info
    this.pdf.setFontSize(11)
    this.pdf.setFont('helvetica', 'normal')
    let contactY = 35
    const contactInfo = [
      cvData.personalInfo.email,
      cvData.personalInfo.phone,
      cvData.personalInfo.location,
      cvData.personalInfo.website
    ].filter(Boolean)
    
    this.pdf.text(contactInfo.join(' • '), this.margin, contactY)
    
    this.currentY = 70
    this.pdf.setTextColor(0, 0, 0)
    
    // Summary
    if (cvData.summary) {
      this.addSection('Professional Summary', cvData.summary)
    }
    
    // Experience
    if (cvData.experience.length > 0) {
      this.addExperienceSection(cvData.experience)
    }
    
    // Education
    if (cvData.education.length > 0) {
      this.addEducationSection(cvData.education)
    }
    
    // Skills
    if (cvData.skills.length > 0) {
      this.addSkillsSection(cvData.skills)
    }
    
    // Projects
    if (cvData.projects && cvData.projects.length > 0) {
      this.addProjectsSection(cvData.projects)
    }
  }

  // Classic template with traditional styling
  private generateClassicTemplate(cvData: CVData): void {
    this.setColors('classic')
    
    // Header
    this.pdf.setFontSize(24)
    this.pdf.setFont('times', 'bold')
    this.pdf.text(cvData.personalInfo.name, this.pageWidth / 2, this.currentY, { align: 'center' })
    
    this.currentY += 10
    
    // Contact info centered
    this.pdf.setFontSize(10)
    this.pdf.setFont('times', 'normal')
    const contactInfo = [
      cvData.personalInfo.email,
      cvData.personalInfo.phone,
      cvData.personalInfo.location
    ].filter(Boolean).join(' | ')
    
    this.pdf.text(contactInfo, this.pageWidth / 2, this.currentY, { align: 'center' })
    
    // Horizontal line
    this.currentY += 8
    this.pdf.setLineWidth(0.5)
    this.pdf.line(this.margin, this.currentY, this.pageWidth - this.margin, this.currentY)
    this.currentY += 10
    
    // Continue with sections...
    if (cvData.summary) {
      this.addSection('OBJECTIVE', cvData.summary)
    }
    
    if (cvData.experience.length > 0) {
      this.addExperienceSection(cvData.experience)
    }
    
    if (cvData.education.length > 0) {
      this.addEducationSection(cvData.education)
    }
  }

  // Minimal template with clean design
  private generateMinimalTemplate(cvData: CVData): void {
    this.setColors('minimal')
    
    // Simple header
    this.pdf.setFontSize(22)
    this.pdf.setFont('helvetica', 'normal')
    this.pdf.text(cvData.personalInfo.name, this.margin, this.currentY)
    
    this.currentY += 8
    
    // Contact info
    this.pdf.setFontSize(9)
    this.pdf.setTextColor(100, 100, 100)
    const contactInfo = [
      cvData.personalInfo.email,
      cvData.personalInfo.phone,
      cvData.personalInfo.website
    ].filter(Boolean).join(' • ')
    
    this.pdf.text(contactInfo, this.margin, this.currentY)
    this.currentY += 15
    
    this.pdf.setTextColor(0, 0, 0)
    
    // Continue with minimal styling...
    if (cvData.summary) {
      this.addSection('About', cvData.summary)
    }
    
    if (cvData.experience.length > 0) {
      this.addExperienceSection(cvData.experience)
    }
  }

  private setColors(template: string): void {
    switch (template) {
      case 'modern':
        // Blue accent theme
        break
      case 'classic':
        // Traditional black theme
        break
      case 'minimal':
        // Gray accent theme
        break
    }
  }

  private addSection(title: string, content: string): void {
    this.checkPageBreak(20)
    
    // Section title
    this.pdf.setFontSize(14)
    this.pdf.setFont('helvetica', 'bold')
    this.pdf.setTextColor(59, 130, 246)
    this.pdf.text(title.toUpperCase(), this.margin, this.currentY)
    
    this.currentY += 2
    
    // Underline
    this.pdf.setLineWidth(0.5)
    this.pdf.setDrawColor(59, 130, 246)
    this.pdf.line(this.margin, this.currentY, this.margin + 40, this.currentY)
    
    this.currentY += 8
    
    // Content
    this.pdf.setFontSize(10)
    this.pdf.setFont('helvetica', 'normal')
    this.pdf.setTextColor(0, 0, 0)
    
    const lines = this.pdf.splitTextToSize(content, this.pageWidth - (this.margin * 2))
    this.pdf.text(lines, this.margin, this.currentY)
    this.currentY += lines.length * this.lineHeight + 10
  }

  private addExperienceSection(experience: CVData['experience']): void {
    this.addSectionHeader('EXPERIENCE')
    
    experience.forEach((exp, index) => {
      this.checkPageBreak(25)
      
      // Job title and company
      this.pdf.setFontSize(12)
      this.pdf.setFont('helvetica', 'bold')
      this.pdf.text(exp.title, this.margin, this.currentY)
      
      this.pdf.setFont('helvetica', 'normal')
      this.pdf.text(exp.company, this.margin + 80, this.currentY)
      
      // Dates
      const dateRange = `${exp.startDate} - ${exp.endDate || 'Present'}`
      this.pdf.text(dateRange, this.pageWidth - this.margin - 40, this.currentY, { align: 'right' })
      
      this.currentY += 8
      
      // Description
      this.pdf.setFontSize(10)
      const descLines = this.pdf.splitTextToSize(exp.description, this.pageWidth - (this.margin * 2))
      this.pdf.text(descLines, this.margin, this.currentY)
      this.currentY += descLines.length * this.lineHeight
      
      // Achievements
      if (exp.achievements && exp.achievements.length > 0) {
        this.currentY += 3
        exp.achievements.forEach(achievement => {
          this.pdf.text(`• ${achievement}`, this.margin + 5, this.currentY)
          this.currentY += this.lineHeight
        })
      }
      
      this.currentY += 8
    })
  }

  private addEducationSection(education: CVData['education']): void {
    this.addSectionHeader('EDUCATION')
    
    education.forEach(edu => {
      this.checkPageBreak(15)
      
      this.pdf.setFontSize(12)
      this.pdf.setFont('helvetica', 'bold')
      this.pdf.text(edu.degree, this.margin, this.currentY)
      
      this.pdf.setFont('helvetica', 'normal')
      this.pdf.text(edu.institution, this.margin + 80, this.currentY)
      this.pdf.text(edu.graduationDate, this.pageWidth - this.margin - 30, this.currentY, { align: 'right' })
      
      this.currentY += 10
    })
  }

  private addSkillsSection(skills: CVData['skills']): void {
    this.addSectionHeader('SKILLS')
    
    skills.forEach(skillGroup => {
      this.checkPageBreak(10)
      
      this.pdf.setFontSize(11)
      this.pdf.setFont('helvetica', 'bold')
      this.pdf.text(`${skillGroup.category}:`, this.margin, this.currentY)
      
      this.pdf.setFont('helvetica', 'normal')
      this.pdf.text(skillGroup.items.join(', '), this.margin + 40, this.currentY)
      
      this.currentY += 8
    })
  }

  private addProjectsSection(projects: CVData['projects']): void {
    this.addSectionHeader('PROJECTS')
    
    projects?.forEach(project => {
      this.checkPageBreak(15)
      
      this.pdf.setFontSize(12)
      this.pdf.setFont('helvetica', 'bold')
      this.pdf.text(project.name, this.margin, this.currentY)
      
      this.currentY += 6
      
      this.pdf.setFontSize(10)
      this.pdf.setFont('helvetica', 'normal')
      const descLines = this.pdf.splitTextToSize(project.description, this.pageWidth - (this.margin * 2))
      this.pdf.text(descLines, this.margin, this.currentY)
      this.currentY += descLines.length * this.lineHeight
      
      this.pdf.setFont('helvetica', 'italic')
      this.pdf.text(`Technologies: ${project.technologies.join(', ')}`, this.margin, this.currentY)
      
      this.currentY += 10
    })
  }

  private addSectionHeader(title: string): void {
    this.checkPageBreak(15)
    
    this.pdf.setFontSize(14)
    this.pdf.setFont('helvetica', 'bold')
    this.pdf.setTextColor(59, 130, 246)
    this.pdf.text(title, this.margin, this.currentY)
    
    this.currentY += 2
    this.pdf.setLineWidth(0.5)
    this.pdf.setDrawColor(59, 130, 246)
    this.pdf.line(this.margin, this.currentY, this.margin + 40, this.currentY)
    
    this.currentY += 10
    this.pdf.setTextColor(0, 0, 0)
  }

  private checkPageBreak(requiredSpace: number): void {
    if (this.currentY + requiredSpace > this.pageHeight - this.margin) {
      this.pdf.addPage()
      this.currentY = this.margin
    }
  }
}

// Export utility functions
export const exportToPDF = async (cvData: CVData, template: 'modern' | 'classic' | 'minimal' = 'modern'): Promise<void> => {
  const generator = new PDFGenerator()
  const pdfBuffer = await generator.generateFromData(cvData, template)
  
  // Create download link
  const blob = new Blob([pdfBuffer], { type: 'application/pdf' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${cvData.personalInfo.name.replace(/\s+/g, '_')}_CV.pdf`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export const exportHTMLToPDF = async (elementId: string, filename?: string): Promise<void> => {
  const generator = new PDFGenerator()
  await generator.generateFromHTML(elementId, filename)
}

// Export utility functions for cover letters
export const exportCoverLetterToPDF = async (htmlContent: string, filename: string = 'cover-letter.pdf'): Promise<void> => {
  const generator = new PDFGenerator()
  await generator.generateFromCoverLetterHTML(htmlContent, filename)
}
