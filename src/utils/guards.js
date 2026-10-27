// Object.hasOwn is ES2022 and is not part of Vite's default build target
// baseline (chrome87 / safari14), so use the call form instead.
const hasOwn = (target, key) =>
  target != null && Object.prototype.hasOwnProperty.call(target, key)

/**
 * Read `key` from a plain-object lookup table, ignoring inherited properties.
 *
 * Without the hasOwnProperty guard, keys like "constructor", "toString" or
 * "__proto__" resolve up the prototype chain and return Object/Function
 * values. A function returned here can be handed to React as a component,
 * which throws and trips the error boundary.
 */
export function safeLookup(table, key, fallback) {
  if (key == null) return fallback
  return hasOwn(table, key) ? table[key] : fallback
}
