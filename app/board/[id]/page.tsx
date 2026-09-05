import postsData from '@/data/posts.json'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { Calendar, Tag, ChevronLeft } from 'lucide-react'

/**
 * 글 상세 페이지.
 *
 * 예전에는 `/board?id=N` 쿼리 파라미터 한 장으로 모든 글을 서빙했다.
 * 크롤러 입장에서는 URL 이 `/board` 하나뿐이라 글 11개가 색인 대상에서 통째로 빠졌고,
 * 사이트가 "계산기 + 빈 게시판" 으로 인식됐다.
 * 글마다 정적 URL(`/board/1` …)을 만들고 사이트맵에 등록해야 개별 문서로 잡힌다.
 */

interface Post {
  id: number
  title: string
  date: string
  category: string
  summary: string
  content: string
  tags: string[]
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://estioo.kr'

const allPosts: Post[] = (postsData as Post[]).slice().sort((a, b) => b.date.localeCompare(a.date))

export function generateStaticParams() {
  return (postsData as Post[]).map((p) => ({ id: String(p.id) }))
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const post = allPosts.find((p) => p.id === Number(id))
  if (!post) return {}

  return {
    title: `${post.title} | Estioo`,
    description: post.summary,
    keywords: post.tags,
    alternates: { canonical: `/board/${post.id}` },
    openGraph: {
      title: `${post.title} | Estioo`,
      description: post.summary,
      url: `/board/${post.id}`,
      type: 'article',
      publishedTime: post.date,
      tags: post.tags,
      images: [{ url: '/thumb.webp', width: 1200, height: 630, alt: post.title }],
    },
  }
}

const categoryColor: Record<string, string> = {
  '중개수수료': '#2563eb',
  '취득세': '#16a34a',
  '양도소득세': '#dc2626',
  '전세·월세': '#9333ea',
  '계약 가이드': '#ea580c',
  '보유세': '#0891b2',
}

function CategoryBadge({ category }: { category: string }) {
  const color = categoryColor[category] ?? '#2563eb'
  return (
    <span style={{
      display: 'inline-block',
      padding: '2px 10px',
      borderRadius: '4px',
      fontSize: '0.75rem',
      fontWeight: 700,
      color: '#fff',
      backgroundColor: color,
    }}>
      {category}
    </span>
  )
}

export default async function BoardPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const post = allPosts.find((p) => p.id === Number(id))
  if (!post) notFound()

  // 관련 글은 "현재 글 다음 4개"를 순환해서 고른다.
  // 고정 4개를 쓰면 뒤쪽 글들이 목록 페이지에서만 링크를 받아 색인이 잘 붙지 않는다.
  const self = allPosts.findIndex((p) => p.id === post.id)
  const related = Array.from({ length: Math.min(4, allPosts.length - 1) }, (_, k) =>
    allPosts[(self + 1 + k) % allPosts.length]
  )

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.summary,
    datePublished: post.date,
    dateModified: post.date,
    inLanguage: 'ko-KR',
    keywords: post.tags.join(', '),
    articleSection: post.category,
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE_URL}/board/${post.id}` },
    image: [`${SITE_URL}/thumb.webp`],
    author: { '@type': 'Organization', name: 'Estioo', url: SITE_URL },
    publisher: {
      '@type': 'Organization',
      name: 'Estioo',
      url: SITE_URL,
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/logo.svg` },
    },
  }

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: '홈', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: '부동산 가이드', item: `${SITE_URL}/board` },
      { '@type': 'ListItem', position: 3, name: post.title, item: `${SITE_URL}/board/${post.id}` },
    ],
  }

  return (
    <main style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px', fontFamily: 'sans-serif', color: '#333', lineHeight: '1.8' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <nav aria-label="브레드크럼" style={{ fontSize: '0.8rem', color: '#9ca3af', marginBottom: '16px' }}>
        <Link href="/" style={{ color: '#9ca3af', textDecoration: 'none' }}>홈</Link>
        <span style={{ margin: '0 6px' }}>›</span>
        <Link href="/board" style={{ color: '#9ca3af', textDecoration: 'none' }}>부동산 가이드</Link>
        <span style={{ margin: '0 6px' }}>›</span>
        <span style={{ color: '#6b7280' }}>{post.category}</span>
      </nav>

      <Link href="/board" style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        color: '#2563eb',
        fontSize: '0.9rem',
        fontWeight: 600,
        marginBottom: '24px',
        textDecoration: 'none',
      }}>
        <ChevronLeft size={16} /> 목록으로 돌아가기
      </Link>

      <article style={{
        background: '#fff',
        border: '1px solid #e5e7eb',
        borderRadius: '12px',
        padding: '32px',
        boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
      }}>
        <div style={{ marginBottom: '12px' }}>
          <CategoryBadge category={post.category} />
        </div>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 'bold', marginBottom: '16px', lineHeight: '1.5' }}>
          {post.title}
        </h1>
        <div style={{
          display: 'flex',
          gap: '20px',
          color: '#888',
          fontSize: '0.85rem',
          paddingBottom: '20px',
          borderBottom: '1px solid #eee',
          marginBottom: '24px',
          flexWrap: 'wrap',
        }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Calendar size={14} /> {post.date}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Tag size={14} /> {post.tags.join(', ')}
          </span>
        </div>

        <div style={{ fontSize: '0.97rem', lineHeight: '1.9' }}>
          {post.content.split('\n').map((line, i) =>
            line.trim() === ''
              ? <br key={i} />
              : <p key={i} style={{ marginBottom: '6px', whiteSpace: 'pre-wrap' }}>{line}</p>
          )}
        </div>
      </article>

      <section style={{ marginTop: '48px' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '16px' }}>다른 부동산 가이드</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {related.map(p => (
            <Link key={p.id} href={`/board/${p.id}`} style={{
              display: 'block',
              background: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '10px',
              padding: '16px 20px',
              textDecoration: 'none',
            }}>
              <div style={{ marginBottom: '6px' }}>
                <CategoryBadge category={p.category} />
              </div>
              <p style={{ color: '#222', fontWeight: 600, fontSize: '0.97rem', margin: 0 }}>{p.title}</p>
            </Link>
          ))}
        </div>
      </section>

      <div style={{ marginTop: '48px', borderTop: '1px solid #eee', paddingTop: '20px', textAlign: 'center' }}>
        <Link href="/" style={{ color: '#2563eb', marginRight: '16px' }}>중개수수료 계산기</Link>
        <Link href="/registration-tax" style={{ color: '#2563eb', marginRight: '16px' }}>취득세 계산기</Link>
        <Link href="/capital-gains-tax" style={{ color: '#2563eb', marginRight: '16px' }}>양도소득세 계산기</Link>
        <Link href="/jeonwolse" style={{ color: '#2563eb' }}>전월세전환 계산기</Link>
      </div>
    </main>
  )
}
