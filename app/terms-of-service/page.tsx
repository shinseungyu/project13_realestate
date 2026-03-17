import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '이용약관 | Estioo',
  description: 'Estioo 서비스의 이용약관입니다.',
  alternates: { canonical: '/terms-of-service' },
}

export default function TermsPage() {
  return (
    <main style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px', fontFamily: 'sans-serif', color: '#333', lineHeight: '1.8' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '8px' }}>이용약관</h1>
      <p style={{ color: '#888', marginBottom: '32px' }}>최종 업데이트: 2026년 3월 17일</p>

      <section style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 'bold', marginBottom: '12px', borderBottom: '2px solid #eee', paddingBottom: '8px' }}>제1조 (목적)</h2>
        <p>
          본 약관은 Estioo 서비스(이하 &quot;사이트&quot;)가 제공하는
          중개수수료·취등록세·양도소득세·전월세전환율 계산기 서비스(이하 &quot;서비스&quot;)의
          이용 조건 및 절차, 이용자와 사이트 간의 권리·의무 및 책임사항을 규정함을 목적으로 합니다.
        </p>
      </section>

      <section style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 'bold', marginBottom: '12px', borderBottom: '2px solid #eee', paddingBottom: '8px' }}>제2조 (서비스의 내용)</h2>
        <p>본 사이트는 다음 서비스를 제공합니다:</p>
        <ul style={{ paddingLeft: '20px', marginTop: '8px' }}>
          <li>부동산 중개수수료(복비) 자동 계산 서비스</li>
          <li>주택 취득세·취등록세 계산 서비스</li>
          <li>양도소득세 예상 세액 계산 서비스</li>
          <li>전월세 전환율 계산 서비스</li>
          <li>관련 광고 서비스 (Google AdSense)</li>
        </ul>
      </section>

      <section style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 'bold', marginBottom: '12px', borderBottom: '2px solid #eee', paddingBottom: '8px' }}>제3조 (서비스 이용)</h2>
        <p>
          본 서비스는 회원가입 없이 무료로 이용할 수 있습니다.
          이용자는 서비스를 이용함으로써 본 약관에 동의한 것으로 간주합니다.
        </p>
      </section>

      <section style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 'bold', marginBottom: '12px', borderBottom: '2px solid #eee', paddingBottom: '8px' }}>제4조 (이용자의 의무)</h2>
        <p>이용자는 다음 행위를 해서는 안 됩니다:</p>
        <ul style={{ paddingLeft: '20px', marginTop: '8px' }}>
          <li>서비스를 불법적인 목적으로 이용하는 행위</li>
          <li>서비스의 운영을 방해하거나 악용하는 행위</li>
          <li>본 사이트의 콘텐츠를 무단으로 복제·배포하는 행위</li>
          <li>자동화된 수단(봇, 크롤러 등)을 이용한 과도한 서버 요청</li>
        </ul>
      </section>

      <section style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 'bold', marginBottom: '12px', borderBottom: '2px solid #eee', paddingBottom: '8px' }}>제5조 (광고)</h2>
        <p>
          본 사이트는 Google AdSense를 통한 광고를 게재합니다.
          광고는 제3자(Google)에 의해 제공되며, 본 사이트는 해당 광고 내용에 대한 책임을 지지 않습니다.
        </p>
      </section>

      <section style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 'bold', marginBottom: '12px', borderBottom: '2px solid #eee', paddingBottom: '8px' }}>제6조 (면책 조항)</h2>
        <p>
          본 사이트에서 제공하는 중개수수료·취득세·양도소득세·전월세전환율 계산 결과는
          <strong> 참고용</strong>이며, 법적 효력이 없습니다.
        </p>
        <ul style={{ paddingLeft: '20px', marginTop: '8px' }}>
          <li>실제 중개수수료는 공인중개사와 협의한 금액이 우선합니다.</li>
          <li>취득세·양도소득세는 세법 개정·개인 상황에 따라 실제 세액이 달라질 수 있습니다.</li>
          <li>정확한 세액은 관할 세무서 또는 세무사에게 확인하시기 바랍니다.</li>
          <li>계산 결과에 따른 실제 세금 납부 결과에 대해 사이트는 책임을 지지 않습니다.</li>
        </ul>
      </section>

      <section style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 'bold', marginBottom: '12px', borderBottom: '2px solid #eee', paddingBottom: '8px' }}>제7조 (지적 재산권)</h2>
        <p>
          본 사이트의 모든 콘텐츠(텍스트, 이미지, 로고 등)에 대한 저작권은 사이트에 귀속됩니다.
          이용자는 사이트의 사전 동의 없이 콘텐츠를 무단으로 사용할 수 없습니다.
        </p>
      </section>

      <section style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 'bold', marginBottom: '12px', borderBottom: '2px solid #eee', paddingBottom: '8px' }}>제8조 (약관의 변경)</h2>
        <p>
          본 약관은 관련 법령 변경 또는 서비스 정책 변화에 따라 수정될 수 있습니다.
          변경된 약관은 본 페이지에 게시되며, 게시 즉시 효력이 발생합니다.
        </p>
      </section>

      <section style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 'bold', marginBottom: '12px', borderBottom: '2px solid #eee', paddingBottom: '8px' }}>제9조 (문의)</h2>
        <p>이용약관에 대한 문의사항은 아래로 연락주세요:</p>
        <p style={{ marginTop: '8px' }}>
          이메일: <a href="mailto:tlsfkaus0711@gmail.com" style={{ color: '#2563eb' }}>tlsfkaus0711@gmail.com</a>
        </p>
      </section>

      <div style={{ marginTop: '48px', borderTop: '1px solid #eee', paddingTop: '20px', textAlign: 'center' }}>
        <a href="/" style={{ color: '#2563eb', marginRight: '16px' }}>홈으로</a>
        <a href="/privacy-policy" style={{ color: '#2563eb', marginRight: '16px' }}>개인정보 처리방침</a>
        <a href="/cookie-policy" style={{ color: '#2563eb' }}>쿠키 정책</a>
      </div>
    </main>
  )
}
