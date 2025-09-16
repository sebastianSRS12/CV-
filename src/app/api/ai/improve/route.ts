import { NextResponse } from 'next/server';
import { CVAnalyzer } from '@/lib/ai/cv-analyzer';

// Industry detection based on CV content
function detectIndustry(cvData: any): string {
  const content = JSON.stringify(cvData.content).toLowerCase();
  
  const industryScores = {
    tech: 0,
    marketing: 0,
    finance: 0,
    healthcare: 0,
    sales: 0
  };

  // Tech keywords
  const techKeywords = ['javascript', 'python', 'react', 'node', 'aws', 'docker', 'api', 'database', 'software', 'developer', 'engineer'];
  techKeywords.forEach(keyword => {
    if (content.includes(keyword)) industryScores.tech += 1;
  });

  // Marketing keywords
  const marketingKeywords = ['marketing', 'seo', 'campaign', 'brand', 'social media', 'analytics', 'content'];
  marketingKeywords.forEach(keyword => {
    if (content.includes(keyword)) industryScores.marketing += 1;
  });

  // Finance keywords
  const financeKeywords = ['finance', 'accounting', 'budget', 'financial', 'audit', 'investment', 'banking'];
  financeKeywords.forEach(keyword => {
    if (content.includes(keyword)) industryScores.finance += 1;
  });

  // Healthcare keywords
  const healthcareKeywords = ['healthcare', 'medical', 'patient', 'clinical', 'nurse', 'doctor', 'hospital'];
  healthcareKeywords.forEach(keyword => {
    if (content.includes(keyword)) industryScores.healthcare += 1;
  });

  // Sales keywords
  const salesKeywords = ['sales', 'revenue', 'client', 'customer', 'crm', 'lead', 'quota', 'negotiation'];
  salesKeywords.forEach(keyword => {
    if (content.includes(keyword)) industryScores.sales += 1;
  });

  // Return industry with highest score
  return Object.entries(industryScores).reduce((a, b) => 
    industryScores[a[0] as keyof typeof industryScores] > industryScores[b[0] as keyof typeof industryScores] ? a : b
  )[0];
}

// Detect experience level based on CV content
function detectExperienceLevel(cvData: any): 'entry' | 'mid' | 'senior' | 'executive' {
  const experiences = cvData.content?.experience || [];
  const totalYears = experiences.length * 2; // Rough estimate
  
  const content = JSON.stringify(cvData.content).toLowerCase();
  const seniorKeywords = ['led', 'managed', 'director', 'senior', 'lead', 'head of', 'vp', 'chief'];
  const seniorMatches = seniorKeywords.filter(keyword => content.includes(keyword)).length;

  if (seniorMatches >= 3 || totalYears >= 10) return 'executive';
  if (seniorMatches >= 2 || totalYears >= 5) return 'senior';
  if (totalYears >= 2) return 'mid';
  return 'entry';
}

export async function POST(request: Request) {
  try {
    const { cvData, section, targetRole } = await request.json();

    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Detect context automatically
    const industry = detectIndustry(cvData);
    const level = detectExperienceLevel(cvData);
    
    const context = {
      industry,
      level,
      targetRole: targetRole || 'Software Developer'
    };

    let analysis;
    let improvedContent;

    switch (section) {
      case 'summary':
        analysis = CVAnalyzer.analyzeSummary(cvData.content?.summary || '', context);
        improvedContent = analysis.improvedContent;
        break;

      case 'experience':
        analysis = CVAnalyzer.analyzeExperience(cvData.content?.experience || [], context);
        improvedContent = analysis.improvedContent;
        break;

      case 'skills':
        analysis = CVAnalyzer.analyzeSkills(cvData.content?.skills || [], context);
        improvedContent = analysis.improvedContent;
        break;

      case 'full':
        const fullAnalysis = CVAnalyzer.analyzeFullCV(cvData, context);
        return NextResponse.json({
          success: true,
          analysis: fullAnalysis,
          context,
          message: `CV Analysis Complete! Overall Score: ${fullAnalysis.overallScore}/100`
        });

      default:
        return NextResponse.json({ 
          error: 'Invalid section specified' 
        }, { status: 400 });
    }

    // Generate specific improvement message based on analysis
    let message = '';
    if (analysis.score >= 80) {
      message = `🎉 Excellent ${section}! Score: ${analysis.score}/100. Minor enhancements applied.`;
    } else if (analysis.score >= 60) {
      message = `✨ Good ${section} with room for improvement! Score: ${analysis.score}/100. Enhanced with stronger language and metrics.`;
    } else {
      message = `🚀 Significant improvements made to your ${section}! Score: ${analysis.score}/100. Added impact-focused content.`;
    }

    return NextResponse.json({
      success: true,
      improvement: improvedContent,
      section,
      analysis: {
        score: analysis.score,
        strengths: analysis.strengths,
        weaknesses: analysis.weaknesses,
        suggestions: analysis.suggestions
      },
      context,
      message
    });

  } catch (error) {
    console.error('AI improvement error:', error);
    return NextResponse.json(
      { error: 'Failed to improve CV content. Please try again.' },
      { status: 500 }
    );
  }
}

// New endpoint for comprehensive CV analysis
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const cvId = searchParams.get('cvId');
  
  if (!cvId) {
    return NextResponse.json({ error: 'CV ID required' }, { status: 400 });
  }

  try {
    // In a real app, fetch CV from database
    // For demo, return analysis capabilities
    return NextResponse.json({
      capabilities: {
        industries: ['tech', 'marketing', 'finance', 'healthcare', 'sales'],
        levels: ['entry', 'mid', 'senior', 'executive'],
        analysisTypes: ['summary', 'experience', 'skills', 'full'],
        features: [
          'Industry-specific keyword optimization',
          'Power word enhancement',
          'Quantifiable achievement detection',
          'Weak language identification',
          'Professional tone improvement',
          'ATS optimization',
          'Skill gap analysis',
          'Overall CV scoring'
        ]
      }
    });
  } catch (error) {
    return NextResponse.json({ error: 'Analysis failed' }, { status: 500 });
  }
}
