import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '양도소득세 계산기 | 부동산 팔 때 세금 자동계산',
  description: '부동산 매도 시 양도소득세를 바로 계산하세요. 보유기간·거주기간·주택수·조정지역 여부에 따른 세율 자동 적용. 장기보유특별공제, 지방소득세 포함 예상 세액 확인.',
  keywords: ['양도소득세 계산기', '부동산 양도세', '양도소득세율', '장기보유특별공제', '1세대1주택 비과세', '다주택 양도세', '부동산 팔때 세금'],
  alternates: { canonical: '/capital-gains-tax' },
  openGraph: {
    title: '양도소득세 계산기 | 부동산 팔 때 세금 자동계산',
    description: '부동산 매도 시 양도소득세를 바로 계산하세요. 보유·거주기간별 장기보유특별공제 자동 반영.',
    url: '/capital-gains-tax',
    siteName: 'Estioo',
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: '양도소득세 계산기 | 부동산 팔 때 세금 자동계산',
    description: '양도차익, 보유기간별 세금을 바로 계산하세요. 지방소득세 포함.',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebApplication',
      name: '양도소득세 계산기',
      url: 'https://estioo.kr/capital-gains-tax',
      applicationCategory: 'FinanceApplication',
      operatingSystem: 'Web',
      description: '부동산 매도 시 양도소득세를 자동 계산하는 무료 온라인 계산기',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'KRW' },
      inLanguage: 'ko',
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: '홈', item: 'https://estioo.kr' },
        { '@type': 'ListItem', position: 2, name: '양도소득세 계산기', item: 'https://estioo.kr/capital-gains-tax' },
      ],
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: '1세대 1주택 비과세 조건은 무엇인가요?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: '2년 이상 보유(조정대상지역은 2년 이상 거주 요건 추가)하고 양도가액이 12억 원 이하면 양도소득세가 비과세됩니다.',
          },
        },
        {
          '@type': 'Question',
          name: '장기보유특별공제란 무엇인가요?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: '3년 이상 보유한 부동산에 적용되는 세금 감면 혜택입니다. 일반은 연 2%(최대 30%), 1세대1주택은 보유 연 4%+거주 연 4%(최대 80%)가 공제됩니다.',
          },
        },
        {
          '@type': 'Question',
          name: '양도소득세 세율은 몇 %인가요?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: '과세표준에 따라 6%~45% 누진세율이 적용됩니다. 다주택자 조정지역 추가과세(2주택 +20%, 3주택 이상 +30%)가 적용될 수 있습니다.',
          },
        },
      ],
    },
  ],
}

export default function CapitalGainsTaxLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  )
}
