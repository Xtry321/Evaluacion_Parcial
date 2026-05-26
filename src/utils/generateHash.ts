/**
 * Genera un hash para un string dado
 */

export const generateHash = (input: string): string => {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convierte a entero de 32 bits
  }
  return hash.toString(16);
};
