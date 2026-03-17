import postsData from '@/data/posts.json'
import Link from 'next/link'
import type { Metadata } from 'next'
import { BookOpen, Calendar, Tag, ChevronLeft, ChevronRight } from 'lucide-react'

interface Post {
  id: number
  title: string
  date: string
  category: string
  summary: string
  content: string
  tags: string[]
}

interface Props {
  searchParams: Promise<{ id?: string; page?: string }>
}

const POSTS_PER_PAGE = 5

const defaultMetadata: Metadata = {
  title: '부동산 가이드 | 중개수수료·취득세·양도세 완전정리',
  description: '부동산 중개수수료 요율, 취득세 절약법, 양도소득세 비과세 조건, 전세 vs 월세 비교까지 부동산 거래에 필요한 모든 정보를 확인하세요.',
  alternates: { canonical: '/board' },
  openGraph: {
    title: '부동산 가이드 | 중개수수료·취득세·양도세 완전정리',
    description: '부동산 거래에 필요한 세금, 수수료, 계약 정보를 총정리합니다.',
  },
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { id } = await searchParams
  if (!id) return defaultMetadata

  const allPosts: Post[] = postsData as Post[]
  const post = allPosts.find((p) => p.id === Number(id))
  if (!post) return defaultMetadata

  return {
    title: `${post.title} | Estioo`,
    description: post.summary,
    alternates: { canonical: `/board?id=${post.id}` },
    openGraph: {
      title: `${post.title} | Estioo`,
      description: post.summary,
      type: 'article',
      publishedTime: post.date,
      tags: post.tags,
    },
  }
}

const categoryColor: Record<string, string> = {
  '중개수수료': '#2563eb',
  '취득세': '#16a34a',
  '양도소득세': '#dc2626',
  '전세·월세': '#9333ea',
  '계약 가이드': '#ea580c',
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

export default async function BoardPage({ searchParams }: Props) {
  const { id, page } = await searchParams
  const allPosts: Post[] = (postsData as Post[]).sort((a, b) => b.date.localeCompare(a.date))

  // 개별 포스트 뷰
  if (id) {
    const post = allPosts.find((p) => p.id === Number(id))

    if (!post) {
      return (
        <main style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px', textAlign: 'center' }}>
          <p style={{ color: '#888' }}>게시글을 찾을 수 없습니다.</p>
          <Link href="/board" style={{ color: '#2563eb', marginTop: '16px', display: 'inline-block' }}>목록으로</Link>
        </main>
      )
    }

    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: post.title,
      description: post.summary,
      datePublished: post.date,
      keywords: post.tags.join(', '),
      publisher: {
        '@type': 'Organization',
        name: 'Estioo',
        url: 'https://estioo.kr',
      },
    }

    return (
      <main style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px', fontFamily: 'sans-serif', color: '#333', lineHeight: '1.8' }}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

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
            {allPosts.filter(p => p.id !== post.id).slice(0, 5).map(p => (
              <Link key={p.id} href={`/board?id=${p.id}`} style={{
                display: 'block',
                background: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '10px',
                padding: '16px 20px',
                textDecoration: 'none',
                transition: 'border-color 0.2s',
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

  // 목록 뷰 — 페이지네이션
  const currentPage = Math.max(1, Number(page) || 1)
  const totalPages = Math.ceil(allPosts.length / POSTS_PER_PAGE)
  const startIdx = (currentPage - 1) * POSTS_PER_PAGE
  const pagePosts = allPosts.slice(startIdx, startIdx + POSTS_PER_PAGE)

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1)

  return (
    <main style={{ minHeight: '100vh', background: '#f9fafb', paddingBottom: '60px', fontFamily: 'sans-serif' }}>
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
        <p style={{ color: '#666', maxWidth: '500px', margin: '0 auto', lineHeight: '1.7', fontSize: '0.97rem' }}>
          중개수수료 요율부터 취득세·양도소득세·전월세 전환까지,
          부동산 거래에 필요한 모든 정보를 쉽게 정리했습니다.
        </p>
      </section>

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px' }}>
        <p style={{ color: '#888', fontSize: '0.85rem', marginBottom: '24px' }}>
          전체 <strong style={{ color: '#333' }}>{allPosts.length}개</strong> 글 · {currentPage}/{totalPages} 페이지
        </p>

        {/* 포스트 목록 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {pagePosts.map((post) => (
            <Link
              key={post.id}
              href={`/board?id=${post.id}`}
              style={{
                display: 'block',
                background: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '12px',
                padding: '24px',
                textDecoration: 'none',
                boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                transition: 'border-color 0.2s, box-shadow 0.2s',
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

        {/* 페이지네이션 */}
        {totalPages > 1 && (
          <nav style={{
            marginTop: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
          }} aria-label="페이지 네비게이션">
            {currentPage > 1 ? (
              <Link
                href={`/board?page=${currentPage - 1}`}
                style={navBtnStyle(false)}
              >
                <ChevronLeft size={16} /> 이전
              </Link>
            ) : (
              <span style={navBtnStyle(false, true)}><ChevronLeft size={16} /> 이전</span>
            )}

            {pageNumbers.map(p => (
              <Link
                key={p}
                href={`/board?page=${p}`}
                style={pageNumStyle(p === currentPage)}
              >
                {p}
              </Link>
            ))}

            {currentPage < totalPages ? (
              <Link
                href={`/board?page=${currentPage + 1}`}
                style={navBtnStyle(false)}
              >
                다음 <ChevronRight size={16} />
              </Link>
            ) : (
              <span style={navBtnStyle(false, true)}>다음 <ChevronRight size={16} /></span>
            )}
          </nav>
        )}
      </div>
    </main>
  )
}

function navBtnStyle(active: boolean, disabled = false): React.CSSProperties {
  return {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    padding: '8px 14px',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    fontSize: '0.85rem',
    fontWeight: 600,
    color: disabled ? '#ccc' : '#333',
    background: '#fff',
    textDecoration: 'none',
    cursor: disabled ? 'not-allowed' : 'pointer',
  }
}

function pageNumStyle(active: boolean): React.CSSProperties {
  return {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '38px',
    height: '38px',
    border: active ? '1px solid #2563eb' : '1px solid #e5e7eb',
    borderRadius: '8px',
    fontSize: '0.85rem',
    fontWeight: 700,
    color: active ? '#fff' : '#333',
    background: active ? '#2563eb' : '#fff',
    textDecoration: 'none',
  }
}
