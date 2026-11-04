import { notFound } from "next/navigation";
import { getLevelBySlug, getAllLevels } from "@/lib/kids/levels";
import { buildPageMetadata, NOINDEX_ROBOTS } from "@/lib/seo";
import { LevelContentWrapper } from "@/components/kids/layout/level-content-wrapper";
import type { Metadata } from "next";

interface LevelPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllLevels().map((level) => ({
    slug: level.slug,
  }));
}

export async function generateMetadata({ params }: LevelPageProps): Promise<Metadata> {
  const { slug } = await params;
  const level = getLevelBySlug(slug);

  if (!level) {
    return { title: "Level Not Found", robots: NOINDEX_ROBOTS };
  }

  return buildPageMetadata({
    title: `${level.title} | Learn Prompting for Kids`,
    description: level.description,
    path: `/kids/level/${slug}`,
  });
}

export default async function LevelPage({ params }: LevelPageProps) {
  const { slug } = await params;
  const level = getLevelBySlug(slug);

  if (!level) {
    notFound();
  }

  // Compiled MDX selection happens on the client against a validated slug (01-15),
  // so this server component stays independent of the request-time browser locale.
  return (
    <LevelContentWrapper levelSlug={slug} levelNumber={`${level.world}-${level.levelNumber}`} />
  );
}
