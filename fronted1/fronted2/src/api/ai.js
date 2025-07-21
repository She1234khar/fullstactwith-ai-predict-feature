export async function askProductQuestion(productId, question) {
  const res = await fetch('/api/ai/qa', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ productId, question })
  });
  return res.json();
}

export async function getProductSummary(productId) {
  const res = await fetch(`/api/ai/summary/${productId}`);
  return res.json();
}

export async function smartSearch(query) {
  const res = await fetch('/api/ai/search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query })
  });
  return res.json();
}

export function parseGeminiFilters(filters) {
  try {
    let clean = filters.replace(/```json|```/g, '').trim();
    return JSON.parse(clean);
  } catch {
    return null;
  }
}

export async function getRecommendations({ interest, category, brand, priceRange }) {
  const res = await fetch('/api/ai/recommend', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ interest, category, brand, priceRange })
  });
  return res.json();
}

export async function askChatbot(message) {
  const res = await fetch('/api/ai/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message })
  });
  return res.json();
}

export async function getDiscountCategories() {
  const res = await fetch('/api/ai/discounts');
  return res.json();
}

export async function getReviewSummary(productId) {
  const res = await fetch(`/api/ai/review-summary/${productId}`);
  return res.json();
} 