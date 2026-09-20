const NOTIFICATION_KEYWORDS = [
  'notification',
  'notif',
  'push alert',
  'alert fatigue',
  'do not disturb',
  'focus mode',
  'ambient computing',
  'proactive ai',
  'ai agent',
  'agentic',
  'background task',
  'assistant',
  'wear os',
  'smartwatch',
  'smart glasses',
  'interruption',
  'digital wellbeing',
  'glanceable',
  'context-aware',
  'on-device ai',
  'mcp server',
  'model context protocol',
];

export function isNotificationRelevant(text: string): boolean {
  const lower = text.toLowerCase();
  return NOTIFICATION_KEYWORDS.some((kw) => lower.includes(kw));
}
