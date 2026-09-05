import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '연락처 | Estioo 부동산 계산기',
  description:
    'Estioo(estioo.kr) 운영자에게 문의하는 방법입니다. 계산 결과 오류 제보, 세율·요율 갱신 요청, 제휴 및 광고 문의를 이메일로 받고 있습니다.',
  alternates: { canonical: '/contact' },
  openGraph: {
    title: '연락처 | Estioo 부동산 계산기',
    description: 'Estioo 운영자 문의 안내.',
    url: '/contact',
  },
}

const h2 = { fontSize: '1.05rem', fontWeight: 700, marginTop: '32px', marginBottom: '10px', color: '#111' } as const

export default function ContactPage() {
  return (
    <main style={{ maxWidth: '760px', margin: '0 auto', padding: '48px 20px 80px', fontFamily: 'sans-serif', color: '#374151', lineHeight: 1.85 }}>
      <Link href="/" style={{ fontSize: '0.85rem', color: '#2563eb', textDecoration: 'none', fontWeight: 600 }}>← 홈으로</Link>

      <h1 style={{ fontSize: '1.7rem', fontWeight: 800, margin: '20px 0 6px', color: '#111' }}>연락처</h1>
      <p style={{ fontSize: '0.85rem', color: '#6b7280', marginBottom: '28px' }}>Estioo 부동산 계산기 · estioo.kr</p>

      <p>
        사이트 이용 중 궁금한 점이나 잘못된 정보를 발견하셨다면 아래 이메일로 알려주세요.
        확인 후 계산 로직과 본문을 수정하고 있습니다.
      </p>

      <div style={{
        marginTop: '20px',
        padding: '20px 24px',
        background: '#f9fafb',
        border: '1px solid #e5e7eb',
        borderRadius: '12px',
      }}>
        <p style={{ margin: 0, fontSize: '0.85rem', color: '#6b7280' }}>이메일</p>
        <p style={{ margin: '4px 0 0', fontSize: '1.05rem', fontWeight: 700 }}>
          <a href="mailto:tlsfkaus0711@gmail.com" style={{ color: '#2563eb', textDecoration: 'none' }}>
            tlsfkaus0711@gmail.com
          </a>
        </p>
      </div>

      <h2 style={h2}>이런 문의를 받습니다</h2>
      <ul style={{ marginLeft: '18px', listStyleType: 'disc' }}>
        <li><strong>계산 오류 제보</strong> — 계산기 결과가 실제 고지 세액과 다른 경우, 입력값과 함께 알려주시면 확인합니다.</li>
        <li><strong>세율·요율 갱신 요청</strong> — 법령이나 요율표가 개정되었는데 반영이 안 된 경우</li>
        <li><strong>콘텐츠 정정 요청</strong> — 글의 내용이 현행 제도와 다른 경우</li>
        <li><strong>제휴·광고 문의</strong></li>
      </ul>

      <h2 style={h2}>답변에 걸리는 시간</h2>
      <p>
        개인이 운영하는 사이트라 즉시 답변이 어려울 수 있습니다. 보통 영업일 기준 2~3일 안에 회신드리고 있으며,
        계산 로직 수정이 필요한 제보는 확인 후 반영까지 며칠이 더 걸릴 수 있습니다.
      </p>

      <h2 style={h2}>답변드리기 어려운 문의</h2>
      <p>
        본 사이트는 정보 제공을 목적으로 하며, <strong>개별 사안에 대한 세무·법률 상담은 제공하지 않습니다.</strong>
        실제 신고와 납부는 세무사·공인중개사 등 자격을 갖춘 전문가나 관할 세무서·지자체를 통해 확인해 주세요.
        계산 결과는 참고용 추정치이며, 이를 근거로 한 의사결정의 결과에 대해서는 책임지지 않습니다.
      </p>

      <p style={{ marginTop: '28px' }}>
        사이트에 대한 전반적인 설명은 <Link href="/about" style={{ color: '#2563eb' }}>사이트 소개</Link>를,
        개인정보 처리에 관한 내용은 <Link href="/privacy-policy" style={{ color: '#2563eb' }}>개인정보 처리방침</Link>을 참고해 주세요.
      </p>
    </main>
  )
}
