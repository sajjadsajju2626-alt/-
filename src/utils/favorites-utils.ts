import { DhikrItem } from '../types/adhkar.ts';

/**
 * Toggles an item ID in the favorites array (adds if absent, removes if present).
 * Returns a new array.
 */
export function toggleFavoriteId(favoriteIds: string[], itemId: string): string[] {
  if (favoriteIds.includes(itemId)) {
    return favoriteIds.filter((id) => id !== itemId);
  }
  return [...favoriteIds, itemId];
}

/**
 * Checks if a dhikr item ID is starred.
 */
export function isItemFavorite(favoriteIds: string[], itemId: string): boolean {
  return favoriteIds.includes(itemId);
}

/**
 * Filters a pool of all dhikrs to return only those whose IDs are in favoriteIds,
 * preserving either order of favorites or original order.
 */
export function getFavoriteDhikrItems(
  allDhikrItems: DhikrItem[],
  favoriteIds: string[]
): DhikrItem[] {
  const favSet = new Set(favoriteIds);
  return allDhikrItems.filter((item) => favSet.has(item.id));
}
