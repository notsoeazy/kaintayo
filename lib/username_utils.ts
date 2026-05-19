// Generates a random username in the format: adjective + food noun + number
// e.g. "hungrytaho42", "spicysilog7"

const ADJECTIVES = [
  'hungry', 'spicy', 'crispy', 'saucy', 'juicy',
  'smoky', 'cheesy', 'tangy', 'salty', 'sweet',
  'grilled', 'fried', 'soupy', 'sassy', 'tasty',
  'bold', 'epic', 'zesty', 'savory', 'sizzling',
];

const FOOD_NOUNS = [
  'taho', 'silog', 'adobo', 'sinigang', 'sisig',
  'lumpia', 'lechon', 'pares', 'liempo', 'bbq',
  'kare', 'dinuguan', 'halo', 'pinakbet', 'bulalo',
  'arroz', 'tokwa', 'balut', 'goto', 'kwek',
];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Returns a random username like "spicysilog42".
 * Collision probability is low enough for a default placeholder — the user
 * is expected to update it from the profile screen.
 */
export function generateRandomUsername(): string {
  const adj  = pick(ADJECTIVES);
  const noun = pick(FOOD_NOUNS);
  const num  = Math.floor(Math.random() * 999) + 1; // 1–999
  return `${adj}${noun}${num}`;
}
