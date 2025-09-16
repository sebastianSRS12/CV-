import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

// Setup DOMPurify for Node.js environment
const window = new JSDOM('').window;
const purify = DOMPurify(window as any);

describe('XSS Protection Tests', () => {
  describe('Input Sanitization', () => {
    it('should sanitize malicious script tags', () => {
      const maliciousInputs = [
        '<script>alert("XSS")</script>',
        '<img src="x" onerror="alert(\'XSS\')">',
        '<svg onload="alert(\'XSS\')">',
        '<iframe src="javascript:alert(\'XSS\')"></iframe>',
        '<object data="javascript:alert(\'XSS\')"></object>',
        '<embed src="javascript:alert(\'XSS\')">',
        '<link rel="stylesheet" href="javascript:alert(\'XSS\')">',
        '<style>@import "javascript:alert(\'XSS\')"</style>',
      ];

      maliciousInputs.forEach(input => {
        const sanitized = purify.sanitize(input);
        expect(sanitized).not.toContain('script');
        expect(sanitized).not.toContain('javascript:');
        expect(sanitized).not.toContain('onerror');
        expect(sanitized).not.toContain('onload');
      });
    });

    it('should preserve safe HTML content', () => {
      const safeInputs = [
        '<p>This is a safe paragraph</p>',
        '<strong>Bold text</strong>',
        '<em>Italic text</em>',
        '<ul><li>List item</li></ul>',
        '<a href="https://example.com">Safe link</a>',
      ];

      safeInputs.forEach(input => {
        const sanitized = purify.sanitize(input);
        expect(sanitized).toBeTruthy();
        expect(sanitized.length).toBeGreaterThan(0);
      });
    });

    it('should handle CV content sanitization', () => {
      const cvContent = {
        personalInfo: {
          name: '<script>alert("XSS")</script>John Doe',
          email: 'john@example.com',
          summary: '<p>Experienced developer with <strong>5 years</strong> of experience.</p>'
        },
        experience: [
          {
            company: '<img src="x" onerror="alert(\'XSS\')">TechCorp',
            position: 'Senior Developer',
            description: '<ul><li>Led team of 5 developers</li><li>Improved performance by 30%</li></ul>'
          }
        ]
      };

      // Sanitize all string fields
      const sanitizeObject = (obj: any): any => {
        if (typeof obj === 'string') {
          return purify.sanitize(obj);
        }
        if (Array.isArray(obj)) {
          return obj.map(sanitizeObject);
        }
        if (typeof obj === 'object' && obj !== null) {
          const sanitized: any = {};
          for (const [key, value] of Object.entries(obj)) {
            sanitized[key] = sanitizeObject(value);
          }
          return sanitized;
        }
        return obj;
      };

      const sanitizedContent = sanitizeObject(cvContent);
      
      expect(sanitizedContent.personalInfo.name).not.toContain('<script>');
      expect(sanitizedContent.personalInfo.name).toContain('John Doe');
      expect(sanitizedContent.experience[0].company).not.toContain('onerror');
      expect(sanitizedContent.experience[0].company).toContain('TechCorp');
    });
  });

  describe('Content Security Policy', () => {
    it('should define strict CSP headers', () => {
      const cspDirectives = {
        'default-src': ["'self'"],
        'script-src': ["'self'", "'unsafe-inline'"], // Note: unsafe-inline should be avoided in production
        'style-src': ["'self'", "'unsafe-inline'"],
        'img-src': ["'self'", 'data:', 'https:'],
        'font-src': ["'self'"],
        'connect-src': ["'self'"],
        'frame-ancestors': ["'none'"],
        'base-uri': ["'self'"],
        'form-action': ["'self'"],
      };

      // Validate CSP configuration
      expect(cspDirectives['default-src']).toContain("'self'");
      expect(cspDirectives['frame-ancestors']).toContain("'none'");
      expect(cspDirectives['base-uri']).toContain("'self'");
    });
  });

  describe('URL Validation', () => {
    it('should validate and sanitize URLs', () => {
      const validateUrl = (url: string): boolean => {
        try {
          const parsed = new URL(url);
          const allowedProtocols = ['http:', 'https:', 'mailto:'];
          return allowedProtocols.includes(parsed.protocol);
        } catch {
          return false;
        }
      };

      const validUrls = [
        'https://example.com',
        'http://localhost:3000',
        'mailto:test@example.com',
      ];

      const invalidUrls = [
        'javascript:alert("XSS")',
        'data:text/html,<script>alert("XSS")</script>',
        'vbscript:msgbox("XSS")',
        'file:///etc/passwd',
      ];

      validUrls.forEach(url => {
        expect(validateUrl(url)).toBe(true);
      });

      invalidUrls.forEach(url => {
        expect(validateUrl(url)).toBe(false);
      });
    });
  });

  describe('Template Injection Prevention', () => {
    it('should prevent template injection in CV templates', () => {
      const userInput = '{{constructor.constructor("alert(1)")()}}';
      const templateData = {
        name: userInput,
        email: 'test@example.com'
      };

      // Simple template rendering function (should escape user input)
      const renderTemplate = (template: string, data: any): string => {
        return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
          const value = data[key] || '';
          // Escape HTML entities
          return String(value)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#x27;');
        });
      };

      const template = '<h1>{{name}}</h1><p>{{email}}</p>';
      const rendered = renderTemplate(template, templateData);
      
      expect(rendered).not.toContain('constructor');
      expect(rendered).not.toContain('alert');
      expect(rendered).toContain('&lt;'); // Should be escaped
    });
  });

  describe('DOM-based XSS Prevention', () => {
    it('should safely handle dynamic content insertion', () => {
      // Simulate safe DOM manipulation
      const safeSetTextContent = (element: any, content: string) => {
        // Use textContent instead of innerHTML to prevent XSS
        element.textContent = content;
      };

      const safeSetInnerHTML = (element: any, content: string) => {
        // Sanitize before setting innerHTML
        element.innerHTML = purify.sanitize(content);
      };

      const mockElement = {
        textContent: '',
        innerHTML: ''
      };

      const maliciousContent = '<script>alert("XSS")</script>Hello';
      
      safeSetTextContent(mockElement, maliciousContent);
      expect(mockElement.textContent).toBe(maliciousContent); // Raw text, no execution
      
      safeSetInnerHTML(mockElement, maliciousContent);
      expect(mockElement.innerHTML).not.toContain('<script>');
      expect(mockElement.innerHTML).toContain('Hello');
    });
  });

  describe('File Upload XSS Prevention', () => {
    it('should validate uploaded file content', () => {
      const validateFileContent = (filename: string, content: string): boolean => {
        // Check file extension
        const allowedExtensions = ['.jpg', '.jpeg', '.png', '.pdf', '.doc', '.docx'];
        const extension = filename.toLowerCase().substring(filename.lastIndexOf('.'));
        
        if (!allowedExtensions.includes(extension)) {
          return false;
        }

        // Check for embedded scripts in filename
        const dangerousPatterns = [
          /<script/i,
          /javascript:/i,
          /vbscript:/i,
          /on\w+=/i, // Event handlers
        ];

        return !dangerousPatterns.some(pattern => 
          pattern.test(filename) || pattern.test(content)
        );
      };

      const safeFiles = [
        { name: 'resume.pdf', content: 'PDF content here' },
        { name: 'photo.jpg', content: 'JPEG binary data' },
      ];

      const maliciousFiles = [
        { name: 'resume<script>alert("XSS")</script>.pdf', content: 'PDF content' },
        { name: 'file.html', content: '<script>alert("XSS")</script>' },
        { name: 'image.jpg', content: '<script>alert("XSS")</script>' },
      ];

      safeFiles.forEach(file => {
        expect(validateFileContent(file.name, file.content)).toBe(true);
      });

      maliciousFiles.forEach(file => {
        expect(validateFileContent(file.name, file.content)).toBe(false);
      });
    });
  });
});
