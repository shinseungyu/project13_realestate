import type { Metadata } from 'next'
import Script from 'next/script'
import { Geist } from 'next/font/google'
import './globals.css'

const geist = Geist({ subsets: ['latin'], variable: '--font-geist' })

export const metadata: Metadata = {
  title: '부동산 중개수수료 계산기 | 2026 복비 자동 계산',
  description: '2026년 최신 기준 부동산 중개수수료(복비)를 1초 만에 계산하세요. 매매·전세·월세별 법정 상한 요율 적용, 아파트·빌라·오피스텔 모두 계산 가능한 무료 계산기입니다.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://estioo.kr'),
  alternates: {
    canonical: '/',
  },
  keywords: ['부동산 중개수수료 계산기', '복비 계산기', '부동산 복비', '중개수수료 계산', '매매 중개수수료', '전세 복비', '월세 중개수수료', '아파트 복비 계산', '공인중개사 수수료'],
  openGraph: {
    title: '부동산 중개수수료 계산기 | 2026 복비 자동 계산',
    description: '2026년 최신 기준 부동산 중개수수료(복비)를 1초 만에 계산하세요. 매매·전세·월세별 법정 상한 요율 적용 무료 계산기.',
    url: '/',
    siteName: 'Estioo',
    locale: 'ko_KR',
    type: 'website',
    images: [
      {
        url: '/thumb.webp',
        width: 1200,
        height: 630,
        alt: '부동산 중개수수료 계산기 썸네일',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '부동산 중개수수료 계산기 | 2026 복비 자동 계산',
    description: '2026년 최신 기준 부동산 중개수수료(복비)를 1초 만에 계산하세요. 매매·전세·월세별 법정 상한 요율 적용 무료 계산기.',
    images: ['/thumb.webp'],
  },
  authors: [{ name: 'Estioo' }],
  publisher: 'Estioo',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
  },
  formatDetection: {
    telephone: false,
    date: false,
    address: false,
    email: false,
  },
  verification: {
    other: {
      'naver-site-verification': '01da215d01b04d9a8c6e6c0387a766482c988163',
    },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Estioo 부동산 계산기',
    description: '매매·전세·월세 부동산 중개수수료(복비)를 법정 상한 요율에 따라 자동 계산해주는 무료 계산기입니다.',
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'All',
    url: 'https://estioo.kr',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'KRW',
    },
    featureList: '매매 중개수수료 계산, 전세 중개수수료 계산, 월세 중개수수료 계산, 법정 상한 요율 자동 적용',
  }

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: '부동산 중개수수료(복비)는 어떻게 계산하나요?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: '중개수수료는 거래금액 × 요율로 계산합니다. 요율은 거래 유형(매매·전세·월세)과 거래금액 구간에 따라 법정 상한이 정해져 있으며, 공인중개사와 협의하여 상한 이하로 결정할 수 있습니다.',
        },
      },
      {
        '@type': 'Question',
        name: '2026년 매매 중개수수료 요율은 얼마인가요?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: '2026년 기준 주택 매매 중개수수료 상한 요율은 2억원 미만 0.5%, 2억~9억원 미만 0.4%, 9억~12억원 미만 0.5%, 12억~15억원 미만 0.6%, 15억원 이상 0.7%입니다.',
        },
      },
      {
        '@type': 'Question',
        name: '월세 중개수수료는 어떻게 계산하나요?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: '월세의 경우 보증금 + (월세 × 100)으로 환산보증금을 계산한 뒤, 해당 금액 구간의 요율을 적용합니다. 단, 환산금액이 5천만원 미만인 경우 보증금 + (월세 × 70)과 비교하여 더 높은 금액을 기준으로 합니다.',
        },
      },
      {
        '@type': 'Question',
        name: '중개수수료는 VAT(부가세)가 따로 붙나요?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: '공인중개사가 일반과세자로 등록된 경우 중개수수료에 부가세 10%가 추가됩니다. 간이과세자인 경우 부가세가 포함되거나 면제될 수 있으니, 거래 전 공인중개사에게 확인하세요.',
        },
      },
      {
        '@type': 'Question',
        name: '오피스텔 중개수수료 요율은 주택과 다른가요?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: '주거용 오피스텔은 전용면적 85㎡ 이하인 경우 매매 0.5%, 임대차 0.4% 상한이 적용됩니다. 비주거용(업무용) 오피스텔은 거래금액의 0.9% 이내에서 협의합니다.',
        },
      },
    ],
  }

  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <meta name="google-adsense-account" content="ca-pub-5378247298190063" />
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-H0BDK8VQLR"
        />
        <Script id="google-analytics">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-H0BDK8VQLR');
          `}
        </Script>
        <Script
          id="json-ld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          strategy="beforeInteractive"
        />
        <Script
          id="faq-json-ld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
          strategy="beforeInteractive"
        />
        <style dangerouslySetInnerHTML={{
          __html: `
            .nav-container {
              background-color: white;
              border-bottom: 1px solid #e5e7eb;
              position: sticky;
              top: 0;
              z-index: 50;
              padding: 0 1rem;
            }
            .nav-content {
              max-width: 1200px;
              margin: 0 auto;
              display: flex;
              height: 4rem;
              align-items: center;
              justify-content: space-between;
            }
            .nav-logo {
              font-weight: bold;
              color: black;
              font-size: 1.125rem;
              text-decoration: none;
              display: flex;
              align-items: center;
            }
            .nav-links {
              display: flex;
              gap: 2rem;
            }
            .nav-link {
              text-decoration: none;
              color: #6b7280;
              font-size: 0.875rem;
              font-weight: 500;
              transition: color 0.2s;
            }
            .nav-link:hover {
              color: black;
            }
            @media (max-width: 640px) {
              .nav-links {
                gap: 0.75rem;
              }
              .nav-link {
                font-size: 0.8rem;
              }
            }
          `
        }} />
      </head>
      <body className={geist.variable}>
        <nav className="nav-container">
          <div className="nav-content">
            <a href="/" className="nav-logo">
              <img src="/logo.svg" alt="Estioo" style={{ height: '28px', width: 'auto' }} />
            </a>
            <div className="nav-links">
              <a href="/" className="nav-link">중개수수료</a>
              <a href="/registration-tax" className="nav-link">취등록세</a>
              <a href="/capital-gains-tax" className="nav-link">양도소득세</a>
              <a href="/jeonwolse" className="nav-link">전월세전환</a>
              <a href="/board" className="nav-link">부동산 가이드</a>
            </div>
          </div>
        </nav>
        {children}
      </body>
    </html>
  )
}
