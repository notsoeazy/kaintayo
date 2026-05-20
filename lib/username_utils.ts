const ADJECTIVES = [
  'Hungry', 'Spicy', 'Crispy', 'Saucy', 'Juicy',
  'Smoky', 'Cheesy', 'Tangy', 'Salty', 'Sweet',
  'Grilled', 'Fried', 'Soupy', 'Sassy', 'Tasty',
  'Bold', 'Zesty', 'Savory', 'Sizzling',
];

const FOOD_NOUNS = [
  'Taho', 'Silog', 'Adobo', 'Sinigang', 'Sisig',
  'Lumpia', 'Lechon', 'Pares', 'Liempo', 'Bbq',
  'Kare', 'Dinuguan', 'Halo', 'Pinakbet', 'Bulalo',
  'Tokwa', 'Balut', 'Goto', 'Kwek',
];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Returns a random username like "spicysilog42"
export function generateRandomUsername(): string {
  const adj  = pick(ADJECTIVES);
  const noun = pick(FOOD_NOUNS);
  const num  = Math.floor(Math.random() * 999) + 1; // 1–999
  return `${adj}${noun}${num}`;
}
