'use client'

import { useState } from 'react'
import { DocumentArrowDownIcon } from '@heroicons/react/24/outline'
import { CVData } from '@/lib/pdf/pdf-generator'

interface ExportButtonProps {
  cvData?: CVData
  elementId?: string
  template?: 'modern' | 'classic' | 'minimal'
  className?: string
}

export function ExportButton({ cvData, elementId = 'cv-preview', template = 'modern', className = '' }: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false)

  const handleExport = async () => {
    if (isExporting) return

    setIsExporting(true)
    try {
      if (cvData) {
        // Use API route for PDF generation
        const response = await fetch('/api/pdf/export', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ cvData, template }),
        })

        if (!response.ok) {
          throw new Error('PDF generation failed')
        }

        // Download the PDF
        const blob = await response.blob()
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `${cvData.personalInfo.name.replace(/\s+/g, '_')}_CV.pdf`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
      } else {
        // For HTML export, use html2canvas directly
        const html2canvas = (await import('html2canvas')).default
        const jsPDF = (await import('jspdf')).jsPDF
        
        const element = document.getElementById(elementId)
        if (!element) {
          throw new Error(`Element with ID '${elementId}' not found`)
        }

        const canvas = await html2canvas(element, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#ffffff',
        })

        const imgData = canvas.toDataURL('image/png')
        const pdf = new jsPDF('p', 'mm', 'a4')
        const imgWidth = 210
        const pageHeight = 295
        const imgHeight = (canvas.height * imgWidth) / canvas.width
        let heightLeft = imgHeight

        let position = 0
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
        heightLeft -= pageHeight

        while (heightLeft >= 0) {
          position = heightLeft - imgHeight
          pdf.addPage()
          pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
          heightLeft -= pageHeight
        }

        pdf.save('cv.pdf')
      }
    } catch (error) {
      console.error('Export failed:', error)
      alert('Export failed. Please try again.')
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <button
      onClick={handleExport}
      disabled={isExporting}
      className={`inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors duration-200 ${className}`}
    >
      <DocumentArrowDownIcon className="w-5 h-5" />
      {isExporting ? 'Exporting...' : 'Export PDF'}
    </button>
  )
}
