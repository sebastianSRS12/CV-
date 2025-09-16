// AI-powered CV analysis and improvement engine
export interface CVAnalysis {
  score: number;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  improvedContent?: string;
}

export interface CVSection {
  type: 'summary' | 'experience' | 'education' | 'skills';
  content: any;
  context?: {
    industry?: string;
    level?: 'entry' | 'mid' | 'senior' | 'executive';
    targetRole?: string;
  };
}

export class CVAnalyzer {
  // Keywords and patterns for different industries and roles
  private static readonly INDUSTRY_KEYWORDS = {
    tech: ['javascript', 'python', 'react', 'node.js', 'aws', 'docker', 'kubernetes', 'api', 'database', 'agile', 'scrum'],
    marketing: ['seo', 'sem', 'analytics', 'campaign', 'conversion', 'roi', 'brand', 'social media', 'content', 'lead generation'],
    finance: ['financial analysis', 'budgeting', 'forecasting', 'excel', 'sql', 'risk management', 'compliance', 'audit'],
    healthcare: ['patient care', 'medical', 'clinical', 'hipaa', 'emr', 'healthcare', 'diagnosis', 'treatment'],
    sales: ['crm', 'lead generation', 'pipeline', 'quota', 'revenue', 'client relationship', 'negotiation', 'closing']
  };

  private static readonly POWER_WORDS = [
    'achieved', 'improved', 'increased', 'decreased', 'developed', 'implemented', 'led', 'managed',
    'created', 'designed', 'optimized', 'streamlined', 'delivered', 'exceeded', 'spearheaded',
    'transformed', 'innovated', 'collaborated', 'mentored', 'established'
  ];

  private static readonly WEAK_WORDS = [
    'responsible for', 'worked on', 'helped with', 'assisted', 'participated', 'involved in',
    'duties included', 'tasks included', 'did', 'handled'
  ];

  // Analyze summary section
  static analyzeSummary(summary: string, context?: { industry?: string; level?: string }): CVAnalysis {
    const analysis: CVAnalysis = {
      score: 0,
      strengths: [],
      weaknesses: [],
      suggestions: []
    };

    if (!summary || summary.length < 50) {
      analysis.score = 20;
      analysis.weaknesses.push('Summary is too short or missing');
      analysis.suggestions.push('Add a compelling professional summary (100-150 words)');
      return analysis;
    }

    let score = 50; // Base score

    // Check for power words
    const powerWordCount = this.POWER_WORDS.filter(word => 
      summary.toLowerCase().includes(word)
    ).length;
    
    if (powerWordCount >= 3) {
      score += 20;
      analysis.strengths.push('Uses strong action words');
    } else {
      analysis.weaknesses.push('Lacks impactful action words');
      analysis.suggestions.push('Include more power words like "achieved", "led", "improved"');
    }

    // Check for quantifiable achievements
    const hasNumbers = /\d+/.test(summary);
    if (hasNumbers) {
      score += 15;
      analysis.strengths.push('Includes quantifiable achievements');
    } else {
      analysis.suggestions.push('Add specific numbers and metrics to demonstrate impact');
    }

    // Check for industry relevance
    if (context?.industry) {
      const industryKeywords = this.INDUSTRY_KEYWORDS[context.industry as keyof typeof this.INDUSTRY_KEYWORDS] || [];
      const relevantKeywords = industryKeywords.filter(keyword =>
        summary.toLowerCase().includes(keyword.toLowerCase())
      );
      
      if (relevantKeywords.length >= 2) {
        score += 15;
        analysis.strengths.push('Contains industry-relevant keywords');
      } else {
        analysis.suggestions.push(`Include more ${context.industry} industry keywords`);
      }
    }

    // Generate improved summary
    analysis.improvedContent = this.improveSummary(summary, context);
    analysis.score = Math.min(score, 100);

    return analysis;
  }

  // Analyze experience section
  static analyzeExperience(experiences: any[], context?: { industry?: string; level?: string }): CVAnalysis {
    const analysis: CVAnalysis = {
      score: 0,
      strengths: [],
      weaknesses: [],
      suggestions: []
    };

    if (!experiences || experiences.length === 0) {
      analysis.score = 0;
      analysis.weaknesses.push('No work experience listed');
      analysis.suggestions.push('Add your work experience with specific achievements');
      return analysis;
    }

    let totalScore = 0;
    const improvedExperiences = [];

    for (const exp of experiences) {
      let expScore = 40; // Base score per experience

      // Check description quality
      if (!exp.description || exp.description.length < 50) {
        analysis.weaknesses.push(`${exp.position} description is too brief`);
        analysis.suggestions.push('Expand job descriptions with specific achievements and metrics');
      } else {
        expScore += 20;
      }

      // Check for weak language
      const hasWeakWords = this.WEAK_WORDS.some(word =>
        exp.description?.toLowerCase().includes(word)
      );
      
      if (hasWeakWords) {
        analysis.weaknesses.push('Uses passive language in job descriptions');
        analysis.suggestions.push('Replace passive phrases with strong action verbs');
      } else {
        expScore += 20;
      }

      // Check for quantifiable results
      const hasMetrics = /\d+[%$]?|\d+\+|increased|decreased|improved|reduced/i.test(exp.description || '');
      if (hasMetrics) {
        expScore += 20;
        analysis.strengths.push('Includes quantifiable achievements');
      } else {
        analysis.suggestions.push('Add specific metrics and results to demonstrate impact');
      }

      // Generate improved experience
      const improvedExp = this.improveExperience(exp, context);
      improvedExperiences.push(improvedExp);

      totalScore += expScore;
    }

    analysis.score = Math.min(totalScore / experiences.length, 100);
    analysis.improvedContent = improvedExperiences;

    return analysis;
  }

  // Analyze skills section
  static analyzeSkills(skills: any[], context?: { industry?: string; level?: string }): CVAnalysis {
    const analysis: CVAnalysis = {
      score: 0,
      strengths: [],
      weaknesses: [],
      suggestions: []
    };

    if (!skills || skills.length === 0) {
      analysis.score = 0;
      analysis.weaknesses.push('No skills listed');
      analysis.suggestions.push('Add relevant technical and soft skills');
      return analysis;
    }

    let score = 60; // Base score

    // Check skill diversity
    if (skills.length >= 8) {
      score += 20;
      analysis.strengths.push('Good variety of skills listed');
    } else {
      analysis.suggestions.push('Add more skills to demonstrate breadth of expertise');
    }

    // Check for industry relevance
    if (context?.industry) {
      const industryKeywords = this.INDUSTRY_KEYWORDS[context.industry as keyof typeof this.INDUSTRY_KEYWORDS] || [];
      const relevantSkills = skills.filter(skill =>
        industryKeywords.some(keyword =>
          skill.name?.toLowerCase().includes(keyword.toLowerCase())
        )
      );

      if (relevantSkills.length >= 3) {
        score += 20;
        analysis.strengths.push('Skills are relevant to target industry');
      } else {
        analysis.suggestions.push(`Add more ${context.industry}-specific skills`);
      }
    }

    analysis.score = Math.min(score, 100);
    analysis.improvedContent = this.suggestAdditionalSkills(skills, context);

    return analysis;
  }

  // Generate improved summary
  private static improveSummary(summary: string, context?: { industry?: string; level?: string }): string {
    // This would use AI in production, for now we'll enhance with patterns
    let improved = summary;

    // Replace weak phrases with stronger ones
    const replacements = {
      'responsible for': 'managed and delivered',
      'worked on': 'developed and implemented',
      'helped with': 'contributed to',
      'good at': 'expert in',
      'experienced in': 'proven expertise in'
    };

    Object.entries(replacements).forEach(([weak, strong]) => {
      improved = improved.replace(new RegExp(weak, 'gi'), strong);
    });

    // Add industry-specific enhancements
    if (context?.industry === 'tech') {
      improved = improved.replace(/software/gi, 'scalable software solutions');
      improved = improved.replace(/applications/gi, 'high-performance applications');
    }

    return improved;
  }

  // Generate improved experience entry
  private static improveExperience(exp: any, context?: { industry?: string; level?: string }): any {
    const improved = { ...exp };

    if (exp.description) {
      let desc = exp.description;

      // Add metrics if missing
      if (!/\d+/.test(desc)) {
        desc += '\n• Achieved measurable results and exceeded performance targets';
      }

      // Strengthen language
      desc = desc.replace(/responsible for/gi, 'Led and managed');
      desc = desc.replace(/worked on/gi, 'Developed and delivered');
      desc = desc.replace(/helped/gi, 'Collaborated to');

      improved.description = desc;
    }

    return improved;
  }

  // Suggest additional skills
  private static suggestAdditionalSkills(currentSkills: any[], context?: { industry?: string; level?: string }): string[] {
    const suggestions = [];
    const currentSkillNames = currentSkills.map(s => s.name?.toLowerCase() || '');

    if (context?.industry) {
      const industryKeywords = this.INDUSTRY_KEYWORDS[context.industry as keyof typeof this.INDUSTRY_KEYWORDS] || [];
      
      industryKeywords.forEach(keyword => {
        if (!currentSkillNames.some(skill => skill.includes(keyword.toLowerCase()))) {
          suggestions.push(keyword);
        }
      });
    }

    // Add universal professional skills
    const universalSkills = ['Leadership', 'Communication', 'Problem Solving', 'Project Management', 'Team Collaboration'];
    universalSkills.forEach(skill => {
      if (!currentSkillNames.some(s => s.includes(skill.toLowerCase()))) {
        suggestions.push(skill);
      }
    });

    return suggestions.slice(0, 5); // Return top 5 suggestions
  }

  // Overall CV analysis
  static analyzeFullCV(cvData: any, context?: { industry?: string; level?: string; targetRole?: string }): {
    overallScore: number;
    sectionAnalyses: Record<string, CVAnalysis>;
    recommendations: string[];
  } {
    const sectionAnalyses: Record<string, CVAnalysis> = {};

    // Analyze each section
    sectionAnalyses.summary = this.analyzeSummary(cvData.content?.summary || '', context);
    sectionAnalyses.experience = this.analyzeExperience(cvData.content?.experience || [], context);
    sectionAnalyses.skills = this.analyzeSkills(cvData.content?.skills || [], context);

    // Calculate overall score
    const scores = Object.values(sectionAnalyses).map(analysis => analysis.score);
    const overallScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;

    // Generate top-level recommendations
    const recommendations = [];
    if (overallScore < 60) {
      recommendations.push('Focus on adding quantifiable achievements and metrics');
      recommendations.push('Use stronger action verbs throughout your CV');
    }
    if (overallScore < 80) {
      recommendations.push('Tailor content more specifically to your target role');
      recommendations.push('Add more industry-relevant keywords');
    }

    return {
      overallScore: Math.round(overallScore),
      sectionAnalyses,
      recommendations
    };
  }
}
