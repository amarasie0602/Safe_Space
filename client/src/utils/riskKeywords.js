// Mirrors backend/controllers/postController.js RISK_KEYWORDS. Keep these two
// lists in sync — this one only powers an inline supportive nudge while
// writing; the backend list is what actually gates moderation.
const RISK_KEYWORDS = [
  'suicide',
  'self-harm',
  'self harm',
  'kill myself',
  'end my life',
  'want to die',
];

export const containsRiskKeyword = (text) => {
  const lower = (text || '').toLowerCase();
  return RISK_KEYWORDS.some((keyword) => lower.includes(keyword));
};
