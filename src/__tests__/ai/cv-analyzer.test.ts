import { CVAnalyzer } from '@/lib/ai/cv-analyzer';
import { Language } from '@/lib/ai/language-utils';

describe('CVAnalyzer', () => {
  describe('Multi-language Support', () => {
    test('analyzes English summary correctly', () => {
      const summary = 'Experienced software engineer with expertise in React and Node.js. Achieved significant improvements in application performance.';
      const analysis = CVAnalyzer.analyzeSummary(summary, { language: Language.EN });

      expect(analysis.score).toBeGreaterThanOrEqual(50);
      expect(analysis.strengths).toContain('Uses strong action words');
    });

    test('analyzes Spanish summary correctly', () => {
      const summary = 'Ingeniero de software experimentado con experiencia en React y Node.js. Logrado mejoras significativas en el rendimiento de aplicaciones.';
      const analysis = CVAnalyzer.analyzeSummary(summary, { language: Language.ES });

      expect(analysis.score).toBeGreaterThanOrEqual(50);
      expect(analysis.strengths).toContain('Uses strong action words');
    });

    test('analyzes French summary correctly', () => {
      const summary = 'Ingénieur logiciel expérimenté avec expertise en React et Node.js. Réalisé des améliorations significatives dans les performances des applications.';
      const analysis = CVAnalyzer.analyzeSummary(summary, { language: Language.FR });

      expect(analysis.score).toBeGreaterThanOrEqual(50);
      expect(analysis.strengths).toContain('Uses strong action words');
    });

    test('analyzes German summary correctly', () => {
      const summary = 'Erfahrener Software-Ingenieur mit Expertise in React und Node.js. Erreicht signifikante Verbesserungen in der Anwendungsleistung.';
      const analysis = CVAnalyzer.analyzeSummary(summary, { language: Language.DE });

      expect(analysis.score).toBeGreaterThanOrEqual(50);
      expect(analysis.strengths).toContain('Uses strong action words');
    });

    test('detects weak words in different languages', () => {
      const experiences = [{
        position: 'Developer',
        company: 'Tech Corp',
        description: 'Trabajé en proyectos de desarrollo web'
      }];

      const analysis = CVAnalyzer.analyzeExperience(experiences, { language: Language.ES });
      expect(analysis.weaknesses).toContain('Uses passive language in job descriptions');
    });

    test('suggests industry-relevant skills in different languages', () => {
      const skills = [{ name: 'JavaScript', level: 'expert' }];
      const analysis = CVAnalyzer.analyzeSkills(skills, { industry: 'tech', language: Language.ES });

      expect(analysis.improvedContent).toContain('react');
      expect(analysis.improvedContent).toContain('node.js');
    });

    test('full CV analysis includes language context', () => {
      const cvData = {
        content: {
          summary: 'Desarrollador full-stack con experiencia en tecnologías modernas',
          experience: [{
            position: 'Senior Developer',
            company: 'Tech Company',
            description: 'Lideré el desarrollo de aplicaciones web escalables'
          }],
          skills: [{ name: 'JavaScript', level: 'expert' }]
        }
      };

      const analysis = CVAnalyzer.analyzeFullCV(cvData, { language: Language.ES });
      expect(analysis.overallScore).toBeGreaterThan(0);
      expect(analysis.sectionAnalyses.summary.score).toBeGreaterThan(0);
    });
  });
});