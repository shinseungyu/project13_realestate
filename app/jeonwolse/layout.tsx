import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '전월세 전환율 계산기 | 전세→월세 월세→전세 자동계산',
  description: '전세를 월세로, 월세를 전세로 바로 계산하세요. 법정 전월세 전환율(기준금리+2%) 자동 적용. 보증금·월세·전세금 환산을 10초 만에 무료로 확인.',
  keywords: ['전월세 전환율 계산기', '전세 월세 전환', '월세 전세 환산', '전월세 계산기', '전환율 계산', '보증금 월세 계산'],
  alternates: { canonical: '/jeonwolse' },
  openGraph: {
    title: '전월세 전환율 계산기 | 전세→월세 월세→전세 자동계산',
    description: '전세↔월세 금액을 바로 계산하세요. 법정 전환율(기준금리+2%) 자동 적용.',
    url: '/jeonwolse',
    siteName: 'Estioo',
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: '전월세 전환율 계산기 | 전세→월세 월세→전세',
    description: '전세를 월세로, 월세를 전세로 10초 만에 계산하세요.',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebApplication',
      name: '전월세 전환율 계산기',
      url: 'https://estioo.kr/jeonwolse',
      applicationCategory: 'FinanceApplication',
      operatingSystem: 'Web',
      description: '전세와 월세를 상호 전환하는 무료 온라인 계산기. 법정 전환율 자동 적용.',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'KRW' },
      inLanguage: 'ko',
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: '홈', item: 'https://estioo.kr' },
        { '@type': 'ListItem', position: 2, name: '전월세 전환율 계산기', item: 'https://estioo.kr/jeonwolse' },
      ],
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: '전월세 전환율이란 무엇인가요?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: '전세보증금을 월세로 전환할 때 적용하는 비율입니다. 법정 상한은 기준금리 + 2%로, 2026년 기준 약 5.5%입니다.',
          },
        },
        {
          '@type': 'Question',
          name: '전세를 월세로 바꾸는 계산 방법은?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: '월세 = (전세금 - 보증금) × 전환율 ÷ 12로 계산합니다. 예를 들어 전세 3억, 보증금 5000만 원, 전환율 5.5%이면 월세 = 2.5억 × 0.055 ÷ 12 = 약 114,583원입니다.',
          },
        },
        {
          '@type': 'Question',
          name: '집주인이 법정 전환율보다 높게 요구해도 되나요?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: '주택임대차보호법에 따라 법정 전환율 상한을 초과하는 전환은 세입자가 거부할 수 있습니다. 단, 신규 계약 시에는 자유롭게 협의할 수 있습니다.',
          },
        },
      ],
    },
  ],
}

export default function JeonwolseLayout({ children }: { children: React.ReactNode }) {
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
