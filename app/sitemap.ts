import type { MetadataRoute } from 'next';
import site from '@/content/site.json';
import posts from '@/content/posts.json';
import { projects } from '@/content/projects';
import investigation from '@/content/nvidia-investigation.json';
export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  // Preserve the existing site-wide review gate for every route.
  if (site.review) return [];
  const paths = ['/', '/about/', '/perspectives/', '/work/', '/journal/', '/privacy/', ...projects.map(p => `/work/${p.slug}/`), ...posts.map(p => `/journal/${p.slug}/`)];
  if (investigation.article.status === 'published') paths.push(`/journal/${investigation.article.slug}/`);
  return paths.map(path => ({ url: site.url + path }));
}
