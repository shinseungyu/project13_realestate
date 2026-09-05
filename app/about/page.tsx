import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '사이트 소개 | Estioo 부동산 계산기',
  description:
    'Estioo(estioo.kr)는 부동산 중개수수료·취득세·양도소득세·전월세 전환율을 법정 기준에 따라 계산하고, 거래에 필요한 세금 정보를 정리해 제공하는 개인 운영 정보 사이트입니다.',
  alternates: { canonical: '/about' },
  openGraph: {
    title: '사이트 소개 | Estioo 부동산 계산기',
    description: '부동산 중개수수료·세금 계산기와 가이드를 제공하는 Estioo를 소개합니다.',
    url: '/about',
  },
}

const h2 = { fontSize: '1.05rem', fontWeight: 700, marginTop: '32px', marginBottom: '10px', color: '#111' } as const

export default function AboutPage() {
  return (
    <main style={{ maxWidth: '760px', margin: '0 auto', padding: '48px 20px 80px', fontFamily: 'sans-serif', color: '#374151', lineHeight: 1.85 }}>
      <Link href="/" style={{ fontSize: '0.85rem', color: '#2563eb', textDecoration: 'none', fontWeight: 600 }}>← 홈으로</Link>

      <h1 style={{ fontSize: '1.7rem', fontWeight: 800, margin: '20px 0 6px', color: '#111' }}>사이트 소개</h1>
      <p style={{ fontSize: '0.85rem', color: '#6b7280', marginBottom: '28px' }}>Estioo 부동산 계산기 · estioo.kr</p>

      <p>
        Estioo는 부동산을 사고팔거나 임대차 계약을 할 때 반드시 마주치는 <strong>중개수수료와 세금</strong>을,
        계산기와 글 양쪽으로 확인할 수 있게 만든 정보 사이트입니다. 요율표를 찾아 헤매지 않고 내 거래금액을 넣으면
        바로 금액이 나오도록 만드는 것이 목표입니다.
      </p>

      <h2 style={h2}>제공하는 계산기</h2>
      <ul style={{ marginLeft: '18px', listStyleType: 'disc' }}>
        <li><Link href="/" style={{ color: '#2563eb' }}>중개수수료 계산기</Link> — 매매·전세·월세별 법정 상한 요율과 한도액 적용</li>
        <li><Link href="/registration-tax" style={{ color: '#2563eb' }}>취등록세 계산기</Link> — 주택 가격·보유 주택 수·지역별 취득세와 부가 세목</li>
        <li><Link href="/capital-gains-tax" style={{ color: '#2563eb' }}>양도소득세 계산기</Link> — 보유·거주 기간과 장기보유특별공제 반영</li>
        <li><Link href="/jeonwolse" style={{ color: '#2563eb' }}>전월세 전환 계산기</Link> — 법정 전환율 상한 기준 월세 한도 계산</li>
      </ul>

      <h2 style={h2}>이런 정보를 다룹니다</h2>
      <ul style={{ marginLeft: '18px', listStyleType: 'disc' }}>
        <li>매매·전세·월세 <strong>중개수수료 요율</strong>과 구간별 한도액, VAT 처리</li>
        <li>취득세 감면 요건, <strong>생애최초·신혼부부 감면</strong>과 신고 기한</li>
        <li>1세대 1주택 <strong>양도소득세 비과세</strong> 조건과 장기보유특별공제</li>
        <li>전월세 전환율 법정 상한, <strong>주택임대차보호법</strong>상 세입자 대응 방법</li>
        <li>종합부동산세 과세 기준과 계산 순서, 매매 계약 실무 체크리스트</li>
      </ul>
      <p>
        전체 글은 <Link href="/board" style={{ color: '#2563eb' }}>부동산 가이드</Link>에서 볼 수 있습니다.
      </p>

      <h2 style={h2}>정보의 신뢰성과 한계</h2>
      <p>
        모든 내용은 국토교통부·국세청·행정안전부 등이 공개한 법령과 기준을 바탕으로 이해하기 쉽게 재구성한 것입니다.
        다만 부동산 세제는 <strong>정책에 따라 자주 바뀌고</strong>, 조정대상지역 지정·해제나 세율·공제 요건은 수시로 변경됩니다.
        계산 결과와 글의 내용은 참고용 추정치이며, 실제 세액은 개별 사정과 과세관청의 판단에 따라 달라질 수 있습니다.
        큰 금액이 오가는 계약이라면 계약 전에 세무사·공인중개사 등 전문가에게 최종 확인을 받으시기 바랍니다.
      </p>

      <h2 style={h2}>운영 주체</h2>
      <p>
        본 사이트는 <strong>개인이 운영</strong>하는 정보 제공 목적의 웹사이트입니다. 회원가입 없이 무료로 이용할 수 있으며,
        서버 운영과 자료 갱신 비용을 충당하기 위해 Google AdSense 광고가 게재됩니다.
      </p>
      <ul style={{ marginLeft: '18px', listStyleType: 'disc' }}>
        <li><strong>운영:</strong> Estioo 운영자 (개인)</li>
        <li><strong>문의:</strong> <a href="mailto:tlsfkaus0711@gmail.com" style={{ color: '#2563eb' }}>tlsfkaus0711@gmail.com</a></li>
      </ul>

      <p style={{ marginTop: '28px' }}>
        문의는 <Link href="/contact" style={{ color: '#2563eb' }}>연락처 페이지</Link>를,
        개인정보 처리에 관한 내용은 <Link href="/privacy-policy" style={{ color: '#2563eb' }}>개인정보 처리방침</Link>을 참고해 주세요.
      </p>
    </main>
  )
}
