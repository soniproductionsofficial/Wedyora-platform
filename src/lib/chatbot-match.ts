import { FAQS, type FaqItem } from "@/lib/faqs";

// This is a plain keyword-overlap matcher, not a real AI/NLP model — no
// paid API, no external calls, runs entirely in the browser for free. It
// only ever answers with the exact text already on the /faq page, so it
// can't invent a policy or price that doesn't exist. Anything it can't
// confidently match falls back to pointing the visitor at Contact Us
// (see chat-widget.tsx), and the unmatched question gets logged so you
// can see what people are actually asking and expand the FAQ over time.

const STOPWORDS = new Set([
  "a", "an", "the", "is", "are", "am", "was", "were", "be", "been", "being",
  "i", "you", "he", "she", "it", "we", "they", "my", "your", "his", "her",
  "its", "our", "their", "this", "that", "these", "those",
  "do", "does", "did", "doing", "have", "has", "had", "having",
  "how", "what", "when", "where", "who", "whom", "which", "why",
  "can", "could", "will", "would", "shall", "should", "may", "might", "must",
  "to", "of", "for", "in", "on", "at", "by", "with", "about", "against",
  "between", "into", "through", "during", "before", "after", "above",
  "below", "from", "up", "down", "and", "or", "but", "if", "so", "than",
  "too", "very", "just", "not", "no", "yes", "there", "here", "any",
  "some", "me", "us", "them", "get", "got", "need", "want", "please",
]);

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 1 && !STOPWORDS.has(w));
}

const FAQ_TOKEN_SETS: { faq: FaqItem; tokens: Set<string> }[] = FAQS.map((faq) => ({
  faq,
  tokens: new Set(tokenize(`${faq.question} ${faq.answer}`)),
}));

export function matchFaq(userMessage: string): FaqItem | null {
  const userTokens = tokenize(userMessage);
  if (userTokens.length === 0) return null;

  let best: FaqItem | null = null;
  let bestScore = 0;

  for (const { faq, tokens } of FAQ_TOKEN_SETS) {
    let score = 0;
    for (const word of userTokens) {
      if (tokens.has(word)) score += 1;
    }
    if (score > bestScore) {
      bestScore = score;
      best = faq;
    }
  }

  // Require at least 2 meaningful overlapping words (or all of them, for a
  // very short message) so a single generic word doesn't trigger a
  // confident-looking but wrong answer.
  const threshold = Math.min(2, userTokens.length);
  return bestScore >= threshold ? best : null;
}
