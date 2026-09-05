import postsData from '@/data/posts.json'
import Link from 'next/link'
import type { Metadata } from 'next'
import { BookOpen } from 'lucide-react'

/**
 * 글 목록 페이지.
 *
 * 이전 버전은 이 파일 하나가 목록과 본문을 겸했다(`/board?id=N`).
 * 본문은 `app/board/[id]/page.tsx` 로 분리했고, 여기는 목록만 담당한다.
 * 페이지네이션(`?page=N`)도 걷어냈다. 글이 11개뿐이라 한 장에 다 담는 편이
 * 크롤러가 모든 글에 한 번에 도달할 수 있어 유리하다.
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

export const metadata: Metadata = {
  title: '부동산 가이드 | 중개수수료·취득세·양도세 완전정리',
  description:
    '부동산 중개수수료 요율, 취득세 절약법, 양도소득세 비과세 조건, 전세 vs 월세 비교, 종합부동산세 계산까지 부동산 거래에 필요한 모든 정보를 확인하세요.',
  alternates: { canonical: '/board' },
  openGraph: {
    title: '부동산 가이드 | 중개수수료·취득세·양도세 완전정리',
    description: '부동산 거래에 필요한 세금, 수수료, 계약 정보를 총정리합니다.',
    url: '/board',
  },
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

export default function BoardPage() {
  const allPosts: Post[] = (postsData as Post[]).slice().sort((a, b) => b.date.localeCompare(a.date))

  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: '부동산 가이드',
    itemListElement: allPosts.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `${SITE_URL}/board/${p.id}`,
      name: p.title,
    })),
  }

  return (
    <main style={{ minHeight: '100vh', background: '#f9fafb', paddingBottom: '60px', fontFamily: 'sans-serif' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />

      {/* 헤더 */}
      <section style={{
        background: '#fff',
        borderBottom: '1px solid #e5e7eb',
        padding: '48px 20px',
        textAlign: 'center',
      }}>
        <div style={{
          width: '52px',
          height: '52px',
          background: '#eff6ff',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 16px',
        }}>
          <BookOpen size={26} color="#2563eb" />
        </div>
        <h1 style={{ fontSize: '1.9rem', fontWeight: 'bold', color: '#111', marginBottom: '12px' }}>
          부동산 가이드
        </h1>
        <p style={{ color: '#666', maxWidth: '520px', margin: '0 auto', lineHeight: '1.7', fontSize: '0.97rem' }}>
          중개수수료 요율부터 취득세·양도소득세·종합부동산세·전월세 전환까지,
          부동산 거래에 필요한 모든 정보를 쉽게 정리했습니다.
        </p>
      </section>

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px' }}>
        <p style={{ color: '#888', fontSize: '0.85rem', marginBottom: '24px' }}>
          전체 <strong style={{ color: '#333' }}>{allPosts.length}개</strong> 글
        </p>

        {/* 포스트 목록 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {allPosts.map((post) => (
            <Link
              key={post.id}
              href={`/board/${post.id}`}
              style={{
                display: 'block',
                background: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '12px',
                padding: '24px',
                textDecoration: 'none',
                boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                <CategoryBadge category={post.category} />
                <span style={{ color: '#aaa', fontSize: '0.8rem' }}>{post.date}</span>
              </div>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#111', marginBottom: '8px', lineHeight: '1.5' }}>
                {post.title}
              </h2>
              <p style={{ color: '#666', fontSize: '0.9rem', lineHeight: '1.6', margin: '0 0 14px' }}>
                {post.summary}
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {post.tags.map(tag => (
                  <span key={tag} style={{
                    background: '#f3f4f6',
                    color: '#555',
                    fontSize: '0.75rem',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontWeight: 500,
                  }}>
                    #{tag}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>

        <div style={{ marginTop: '48px', borderTop: '1px solid #eee', paddingTop: '20px', textAlign: 'center' }}>
          <Link href="/" style={{ color: '#2563eb', marginRight: '16px' }}>중개수수료 계산기</Link>
          <Link href="/registration-tax" style={{ color: '#2563eb', marginRight: '16px' }}>취득세 계산기</Link>
          <Link href="/capital-gains-tax" style={{ color: '#2563eb', marginRight: '16px' }}>양도소득세 계산기</Link>
          <Link href="/jeonwolse" style={{ color: '#2563eb' }}>전월세전환 계산기</Link>
        </div>
      </div>
    </main>
  )
}
