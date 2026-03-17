import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '취득세 계산기 | 부동산 취등록세 자동계산',
  description: '주택 매수 시 취득세(취등록세)를 바로 계산하세요. 1주택·2주택·3주택 이상, 조정대상지역 여부에 따른 세율 자동 적용. 지방교육세·농어촌특별세 포함 총 납부액 확인.',
  keywords: ['취득세 계산기', '취등록세 계산기', '부동산 취득세', '취득세율', '다주택 취득세', '조정대상지역 취득세', '취등록세 계산'],
  alternates: { canonical: '/registration-tax' },
  openGraph: {
    title: '취득세 계산기 | 부동산 취등록세 자동계산',
    description: '주택 매수 시 취득세를 바로 계산하세요. 1~3주택 이상, 조정지역 여부별 세율 자동 적용.',
    url: '/registration-tax',
    siteName: 'Estioo',
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: '취득세 계산기 | 부동산 취등록세 자동계산',
    description: '1주택·다주택 취득세를 바로 계산하세요. 지방교육세·농특세 포함.',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebApplication',
      name: '취득세 계산기',
      url: 'https://estioo.kr/registration-tax',
      applicationCategory: 'FinanceApplication',
      operatingSystem: 'Web',
      description: '부동산 주택 취득세(취등록세)를 자동 계산하는 무료 온라인 계산기',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'KRW' },
      inLanguage: 'ko',
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: '홈', item: 'https://estioo.kr' },
        { '@type': 'ListItem', position: 2, name: '취득세 계산기', item: 'https://estioo.kr/registration-tax' },
      ],
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: '취득세율은 몇 %인가요?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: '1주택자는 6억 이하 1%, 6~9억 1~3% 누진, 9억 초과 3%입니다. 2주택 조정지역 8%, 3주택 이상 조정지역 12%, 비조정 3주택 이상 8%입니다.',
          },
        },
        {
          '@type': 'Question',
          name: '취득세 외에 추가 세금이 있나요?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: '취득세 외에 지방교육세(취득세의 10%)와 농어촌특별세(대규모 주택의 경우)가 추가됩니다. 계산기에서 총합을 바로 확인할 수 있습니다.',
          },
        },
        {
          '@type': 'Question',
          name: '조정대상지역이란 무엇인가요?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: '국토교통부가 주택 가격 상승률이 높은 지역을 지정한 구역으로, 2주택 이상 취득 시 더 높은 세율이 적용됩니다.',
          },
        },
      ],
    },
  ],
}

export default function RegistrationTaxLayout({ children }: { children: React.ReactNode }) {
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
