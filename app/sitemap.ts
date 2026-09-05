import { MetadataRoute } from 'next'
import postsData from '@/data/posts.json'

/**
 * 글 URL 은 하드코딩하지 않고 posts.json 에서 파생시킨다.
 * 예전 사이트맵에는 `/board` 목록 한 줄만 있어서, 글 11개가 사이트맵에 전혀 없었다.
 * (본문도 `/board?id=N` 쿼리로만 접근 가능해 크롤러 눈에는 URL 이 1개였다.)
 */
const POST_IDS = (postsData as { id: number }[]).map((p) => p.id).sort((a, b) => a - b)

// 콘텐츠가 실제로 바뀔 때만 손으로 올린다.
// new Date() 를 쓰면 CSS 한 줄만 고쳐도 전체 URL 이 "방금 수정됨"으로 나가고,
// 그런 lastmod 는 구글이 통째로 무시한다.
const SITE_UPDATED = new Date('2026-09-05')

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://estioo.kr'

  const postEntries: MetadataRoute.Sitemap = POST_IDS.map((id) => ({
    url: `${base}/board/${id}`,
    lastModified: SITE_UPDATED,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  return [
    {
      url: base,
      lastModified: SITE_UPDATED,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${base}/registration-tax`,
      lastModified: SITE_UPDATED,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${base}/capital-gains-tax`,
      lastModified: SITE_UPDATED,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${base}/jeonwolse`,
      lastModified: SITE_UPDATED,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${base}/board`,
      lastModified: SITE_UPDATED,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    ...postEntries,
    {
      url: `${base}/about`,
      lastModified: SITE_UPDATED,
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${base}/contact`,
      lastModified: SITE_UPDATED,
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${base}/privacy-policy`,
      lastModified: SITE_UPDATED,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${base}/terms-of-service`,
      lastModified: SITE_UPDATED,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${base}/cookie-policy`,
      lastModified: SITE_UPDATED,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ]
}
