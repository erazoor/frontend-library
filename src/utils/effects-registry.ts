import type { EffectMeta } from '@/types/effect'
import type { RouteRecordRaw } from 'vue-router'

/**
 * Lazy-loaded effect page components, discovered via Vite's `import.meta.glob`.
 * Each entry maps a file path (example: `../effects/parallax-hero/index.vue`)
 * to a dynamic import function for code-splitting.
 */
const effectComponents = import.meta.glob<{ default: any }>(
  '../effects/*/index.vue',
)

/**
 * Eagerly loaded effect metadata modules.
 * Loaded eagerly (the opposite of lazy-loading) because metadata is needed at startup
 * to build the landing page and populate the router.
 */
const effectMetaModules = import.meta.glob<{ default: EffectMeta }>(
  '../effects/*/meta.ts',
  { eager: true },
)

/**
 * Extracts the effect slug from a glob-resolved file path.
 * @param path | The file path returned by `import.meta.glob` (example: `../effects/parallax-hero/meta.ts`)
 * @returns | The slug (example: `parallax-hero`) or `null` if the path doesn't match.
 */
function extractSlug(path: string): string | null {
  const match = path.match(/\.\.\/effects\/(.+?)\//)
  return match ? match[1] : null
}

/**
 * Determines whether an effect folder should be registered as a route.
 * Folders prefixed with `_` (example `_template`) are excluded from auto-discovery.
 * @param slug | The effect folder name.
 */
function isRegistered(slug: string): boolean {
  return !slug.startsWith('_')
}

/**
 * Returns all registered effects with their metadata, sorted by creation date (newest first).
 * Used by the landing page to render the effect catalog.
 */
export function getEffects(): { slug: string; meta: EffectMeta }[] {
  return Object.entries(effectMetaModules)
    .map(([path, module]) => {
      const slug = extractSlug(path)
      if (!slug || !isRegistered(slug)) return null
      return { slug, meta: module.default }
    })
    .filter((entry): entry is NonNullable<typeof entry> => entry !== null)
    .sort((a, b) => b.meta.createdAt.localeCompare(a.meta.createdAt))
}

/**
 * Generates lazy-loaded Vue Router routes for all registered effects.
 * Each effect is accessible at `/effect/<slug>` (example: `/effect/parallax-hero`).
 */
export function getEffectRoutes(): RouteRecordRaw[] {
  return Object.entries(effectComponents)
    .map(([path, component]) => {
      const slug = extractSlug(path)
      if (!slug || !isRegistered(slug)) return null
      return {
        path: `/effect/${slug}`,
        name: `effect-${slug}`,
        component,
      } satisfies RouteRecordRaw
    })
    .filter((route): route is NonNullable<typeof route> => route !== null)
}
