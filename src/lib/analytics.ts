// Simple client-side analytics tracking
type EventName = 'page_view' | 'save_cv' | 'export_pdf' | 'ai_analysis' | 'template_change';

export function trackEvent(eventName: EventName, eventData: Record<string, any> = {}) {
  if (typeof window === 'undefined') return;

  // In a production app, you would send this to an analytics service
  // For example: 
  // window.analytics.track(eventName, eventData);
  
  // For now, we'll just log to the console
  console.log(`[Analytics] ${eventName}`, eventData);
}

// Track page views
export function trackPageView(page: string) {
  trackEvent('page_view', { page });
}

// Track CV saves
export function trackCVSave(cvId: string, section: string) {
  trackEvent('save_cv', { cvId, section });
}

// Track PDF exports
export function trackPDFExport(cvId: string) {
  trackEvent('export_pdf', { cvId });
}

// Track AI analysis
export function trackAIAnalysis(cvId: string, analysisType: string) {
  trackEvent('ai_analysis', { cvId, analysisType });
}
