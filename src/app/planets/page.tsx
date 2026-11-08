import type { Metadata } from 'next';
import { buildPageMetadata } from '@/lib/seo';
import { PlanetaryExplorer } from '@/components/kids/planets';

export const metadata: Metadata = buildPageMetadata({
  title: 'Solar System Explorer | Sekolah Prompt-Fu',
  description: 'Explore planetary worlds and discover subject adventures across our solar system.',
  path: '/planets',
  absoluteTitle: true,
});

/**
 * Dedicated Fullscreen Standalone Route for 3D Planetary Explorer (D-01, D-04).
 *
 * Renders full-screen layout containing the PlanetaryExplorer component.
 * Encapsulated client hydration guard guarantees zero SSR reference errors during next build static export.
 */
export default function PlanetsPage() {
  return (
    <main className="relative w-full h-full overflow-hidden bg-slate-950">
      <PlanetaryExplorer />
    </main>
  );
}
