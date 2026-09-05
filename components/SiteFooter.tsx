import Link from 'next/link'

/**
 * 사이트 공통 푸터.
 *
 * 예전에는 계산기 페이지 4곳에 똑같은 푸터가 인라인으로 복사돼 있었고,
 * 게시판·정책 페이지에는 푸터 자체가 없었다. 그래서 소개·연락처 같은
 * 운영 주체 정보로 가는 링크가 사이트 어디에도 걸리지 않는 상태였다.
 * 레이아웃에서 한 번만 렌더해 모든 페이지가 같은 링크를 갖게 한다.
 */
export default function SiteFooter() {
  const linkStyle: React.CSSProperties = {
    fontSize: '12px',
    color: '#6b7280',
    textDecoration: 'none',
  }

  return (
    <footer style={{
      marginTop: '48px',
      padding: '28px 20px 36px',
      borderTop: '1px solid #e5e7eb',
      background: '#fff',
      textAlign: 'center',
    }}>
      <nav
        aria-label="사이트 정보"
        style={{ display: 'flex', justifyContent: 'center', gap: '18px', flexWrap: 'wrap' }}
      >
        <Link href="/about" style={linkStyle}>사이트 소개</Link>
        <Link href="/contact" style={linkStyle}>연락처</Link>
        <Link href="/board" style={linkStyle}>부동산 가이드</Link>
        <Link href="/privacy-policy" style={linkStyle}>개인정보 처리방침</Link>
        <Link href="/terms-of-service" style={linkStyle}>이용약관</Link>
        <Link href="/cookie-policy" style={linkStyle}>쿠키 정책</Link>
      </nav>

      <p style={{ marginTop: '14px', fontSize: '11px', color: '#9ca3af', lineHeight: 1.7, maxWidth: '640px', marginLeft: 'auto', marginRight: 'auto' }}>
        본 사이트의 계산 결과와 정보는 공개된 법령·고시를 바탕으로 한 참고용 추정치입니다.
        부동산 세제는 정책에 따라 변경될 수 있으며, 실제 세액은 개별 사정과 과세관청의 판단에 따라 달라질 수 있습니다.
      </p>

      <p style={{ marginTop: '10px', fontSize: '11px', color: '#9ca3af' }}>
        © 2026 Estioo · 개인 운영 · 문의: tlsfkaus0711@gmail.com
      </p>
    </footer>
  )
}
