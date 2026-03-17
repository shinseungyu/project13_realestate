import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '개인정보 처리방침 | Estioo',
  description: 'Estioo 서비스의 개인정보 처리방침입니다.',
  alternates: { canonical: '/privacy-policy' },
}

export default function PrivacyPolicyPage() {
  return (
    <main style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px', fontFamily: 'sans-serif', color: '#333', lineHeight: '1.8' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '8px' }}>개인정보 처리방침</h1>
      <p style={{ color: '#888', marginBottom: '32px' }}>최종 업데이트: 2026년 3월 17일</p>

      <section style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 'bold', marginBottom: '12px', borderBottom: '2px solid #eee', paddingBottom: '8px' }}>1. 개요</h2>
        <p>
          본 개인정보 처리방침은 Estioo 서비스(이하 &quot;사이트&quot;)가 운영하는
          중개수수료·취등록세·양도소득세·전월세전환율 계산기 서비스와 관련하여,
          이용자의 개인정보를 어떻게 수집·이용·보호하는지를 설명합니다.
          본 사이트를 이용함으로써 이 방침에 동의하는 것으로 간주합니다.
        </p>
      </section>

      <section style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 'bold', marginBottom: '12px', borderBottom: '2px solid #eee', paddingBottom: '8px' }}>2. 수집하는 정보</h2>
        <p>본 사이트는 다음과 같은 정보를 자동으로 수집할 수 있습니다:</p>
        <ul style={{ paddingLeft: '20px', marginTop: '8px' }}>
          <li>방문 페이지, 체류 시간 등 사이트 이용 기록</li>
          <li>IP 주소, 브라우저 유형, 운영체제 정보</li>
          <li>쿠키 및 유사 추적 기술을 통한 데이터</li>
        </ul>
        <p style={{ marginTop: '12px' }}>
          본 사이트는 회원가입, 로그인 등 절차가 없으므로 이름, 이메일, 주민등록번호 등
          직접적인 개인정보를 수집하지 않습니다. 계산기에 입력하는 금액 정보는
          서버에 저장되지 않으며 브라우저 내에서만 처리됩니다.
        </p>
      </section>

      <section style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 'bold', marginBottom: '12px', borderBottom: '2px solid #eee', paddingBottom: '8px' }}>3. 정보의 이용 목적</h2>
        <p>수집한 정보는 다음 목적으로 사용됩니다:</p>
        <ul style={{ paddingLeft: '20px', marginTop: '8px' }}>
          <li>서비스 운영 및 개선</li>
          <li>방문자 통계 분석 (Google Analytics)</li>
          <li>맞춤형 광고 제공 (Google AdSense)</li>
        </ul>
      </section>

      <section style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 'bold', marginBottom: '12px', borderBottom: '2px solid #eee', paddingBottom: '8px' }}>4. Google AdSense 및 제3자 광고</h2>
        <p>
          본 사이트는 <strong>Google AdSense</strong>를 통해 광고를 게재합니다.
          Google은 쿠키를 사용하여 이용자의 이전 방문 기록을 기반으로 관련 광고를 표시합니다.
        </p>
        <ul style={{ paddingLeft: '20px', marginTop: '8px' }}>
          <li>Google의 광고 쿠키 사용은 <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" style={{ color: '#2563eb' }}>Google 개인정보 처리방침</a>을 따릅니다.</li>
          <li>이용자는 <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" style={{ color: '#2563eb' }}>Google 광고 설정</a>에서 개인화 광고를 비활성화할 수 있습니다.</li>
          <li>또는 <a href="https://www.aboutads.info" target="_blank" rel="noopener noreferrer" style={{ color: '#2563eb' }}>aboutads.info</a>에서 제3자 광고 쿠키를 거부할 수 있습니다.</li>
        </ul>
      </section>

      <section style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 'bold', marginBottom: '12px', borderBottom: '2px solid #eee', paddingBottom: '8px' }}>5. 쿠키(Cookie) 사용</h2>
        <p>
          본 사이트는 서비스 향상 및 광고 제공을 위해 쿠키를 사용합니다.
          이용자는 브라우저 설정을 통해 쿠키를 거부할 수 있으나,
          이 경우 일부 서비스 이용에 제한이 있을 수 있습니다.
          자세한 내용은 <a href="/cookie-policy" style={{ color: '#2563eb' }}>쿠키 정책</a>을 참고하세요.
        </p>
      </section>

      <section style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 'bold', marginBottom: '12px', borderBottom: '2px solid #eee', paddingBottom: '8px' }}>6. 개인정보의 보관 및 파기</h2>
        <p>
          본 사이트는 직접적으로 개인정보를 저장하거나 보관하지 않습니다.
          Google Analytics 및 Google AdSense를 통해 수집된 데이터는 각 서비스의 방침에 따라 관리됩니다.
        </p>
      </section>

      <section style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 'bold', marginBottom: '12px', borderBottom: '2px solid #eee', paddingBottom: '8px' }}>7. 아동의 개인정보 보호</h2>
        <p>
          본 서비스는 만 14세 미만 아동을 대상으로 하지 않습니다.
          만 14세 미만 아동의 개인정보는 의도적으로 수집하지 않습니다.
        </p>
      </section>

      <section style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 'bold', marginBottom: '12px', borderBottom: '2px solid #eee', paddingBottom: '8px' }}>8. 방침의 변경</h2>
        <p>
          본 개인정보 처리방침은 관련 법령 및 서비스 변경에 따라 수정될 수 있습니다.
          변경 사항은 본 페이지에 게시됩니다.
        </p>
      </section>

      <section style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 'bold', marginBottom: '12px', borderBottom: '2px solid #eee', paddingBottom: '8px' }}>9. 문의</h2>
        <p>개인정보 처리방침과 관련한 문의사항은 아래로 연락주세요:</p>
        <p style={{ marginTop: '8px' }}>
          이메일: <a href="mailto:tlsfkaus0711@gmail.com" style={{ color: '#2563eb' }}>tlsfkaus0711@gmail.com</a>
        </p>
      </section>

      <div style={{ marginTop: '48px', borderTop: '1px solid #eee', paddingTop: '20px', textAlign: 'center' }}>
        <a href="/" style={{ color: '#2563eb', marginRight: '16px' }}>홈으로</a>
        <a href="/terms-of-service" style={{ color: '#2563eb', marginRight: '16px' }}>이용약관</a>
        <a href="/cookie-policy" style={{ color: '#2563eb' }}>쿠키 정책</a>
      </div>
    </main>
  )
}
