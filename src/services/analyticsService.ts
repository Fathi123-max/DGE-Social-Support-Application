type EventName =
  | 'app_opened'
  | 'step_viewed'
  | 'step_completed'
  | 'field_focused'
  | 'field_error'
  | 'ai_assist_opened'
  | 'ai_assist_generated'
  | 'ai_assist_accepted'
  | 'ai_assist_edited'
  | 'ai_assist_discarded'
  | 'ai_assist_error'
  | 'form_submitted'
  | 'form_submission_error'
  | 'draft_saved'
  | 'draft_restored'
  | 'language_changed'
  | 'validation_error';

interface EventProperties {
  [key: string]: string | number | boolean | undefined;
}

interface AnalyticsEvent {
  name: EventName;
  properties: EventProperties;
  timestamp: string;
  sessionId: string;
}

let sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(7)}`;

function formatEvent(name: EventName, properties: EventProperties): AnalyticsEvent {
  return {
    name,
    properties,
    timestamp: new Date().toISOString(),
    sessionId,
  };
}

export const analyticsService = {
  resetSession(): void {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    console.log('[Analytics] New session started:', sessionId);
  },

  trackEvent(name: EventName, properties: EventProperties = {}): void {
    const event = formatEvent(name, properties);
    console.log('[Analytics] Event:', JSON.stringify(event, null, 2));
  },

  trackStepViewed(stepId: number, stepKey: string): void {
    this.trackEvent('step_viewed', { stepId, stepKey });
  },

  trackStepCompleted(stepId: number, stepKey: string, durationMs: number): void {
    this.trackEvent('step_completed', { stepId, stepKey, durationMs });
  },

  trackAIAssist(
    action: 'opened' | 'generated' | 'accepted' | 'edited' | 'discarded' | 'error',
    fieldKey: string,
    tone?: string,
    errorMessage?: string
  ): void {
    const eventName = `ai_assist_${action}` as EventName;
    this.trackEvent(eventName, { fieldKey, tone, errorMessage });
  },

  trackFormSubmitted(referenceId: string): void {
    this.trackEvent('form_submitted', { referenceId });
  },

  trackError(type: string, message: string, context?: Record<string, string>): void {
    this.trackEvent('validation_error', { type, message, ...context });
  },

  trackLanguageChange(from: string, to: string): void {
    this.trackEvent('language_changed', { from, to });
  },

  trackDraftSaved(fieldsCount: number): void {
    this.trackEvent('draft_saved', { fieldsCount });
  },

  trackDraftRestored(fieldsCount: number): void {
    this.trackEvent('draft_restored', { fieldsCount });
  },
};
