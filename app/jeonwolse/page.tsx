"use client";

import { useState, useMemo } from "react";
import { ArrowLeftRight, HelpCircle, Info } from "lucide-react";
import styles from "../page.module.css";

type Mode = "jeonse-to-monthly" | "monthly-to-jeonse";

// 전월세 전환율 (법정 기준율 + 기준금리)
// 2026년 기준 법정 전환율 상한 = 기준금리(3.5%) + 2% = 5.5%
const LEGAL_RATE = 5.5;

export default function JeonwolsePage() {
  const [mode, setMode] = useState<Mode>("jeonse-to-monthly");
  const [jeonseAmount, setJeonseAmount] = useState("");
  const [deposit, setDeposit] = useState("");
  const [monthlyRent, setMonthlyRent] = useState("");
  const [customRate, setCustomRate] = useState("");

  const appliedRate = parseFloat(customRate) || LEGAL_RATE;

  const result = useMemo(() => {
    if (mode === "jeonse-to-monthly") {
      // 전세 → 월세: 월세 = (전세금 - 보증금) × 전환율 / 12
      const jeonse = parseFloat(jeonseAmount) || 0;
      const dep = parseFloat(deposit) || 0;
      if (jeonse <= 0) return null;
      const gap = jeonse - dep;
      if (gap <= 0) return null;
      const monthly = Math.round((gap * (appliedRate / 100)) / 12);
      return { mode, jeonse, dep, gap, monthly, appliedRate };
    } else {
      // 월세 → 전세: 전세 = 보증금 + (월세 × 12 / 전환율)
      const dep = parseFloat(deposit) || 0;
      const monthly = parseFloat(monthlyRent) || 0;
      if (monthly <= 0) return null;
      const jeonse = Math.round(dep + (monthly * 12) / (appliedRate / 100));
      return { mode, dep, monthly, jeonse, appliedRate };
    }
  }, [mode, jeonseAmount, deposit, monthlyRent, appliedRate]);

  const fmt = (n: number) => n.toLocaleString("ko-KR");

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        {/* Header */}
        <header className={styles.header}>
          <div className={styles.headerIcon}>
            <ArrowLeftRight size={24} />
          </div>
          <h1 className={styles.title}>전월세 전환율 계산기</h1>
          <p className={styles.subtitle}>
            전세→월세, 월세→전세 적정 금액을 1초 만에 계산하세요
          </p>
        </header>

        {/* 전환 방향 */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>전환 방향</h2>
          <div className={styles.radioGroup}>
            <div className={styles.radioOption}>
              <input
                type="radio"
                id="to-monthly"
                name="mode"
                value="jeonse-to-monthly"
                checked={mode === "jeonse-to-monthly"}
                onChange={() => setMode("jeonse-to-monthly")}
                className={styles.radioInput}
              />
              <label htmlFor="to-monthly" className={styles.radioLabel}>
                전세 → 월세
              </label>
            </div>
            <div className={styles.radioOption}>
              <input
                type="radio"
                id="to-jeonse"
                name="mode"
                value="monthly-to-jeonse"
                checked={mode === "monthly-to-jeonse"}
                onChange={() => setMode("monthly-to-jeonse")}
                className={styles.radioInput}
              />
              <label htmlFor="to-jeonse" className={styles.radioLabel}>
                월세 → 전세
              </label>
            </div>
          </div>
        </div>

        {/* 금액 입력 */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>금액 입력</h2>

          {mode === "jeonse-to-monthly" ? (
            <>
              <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="jeonse">전세금 (원)</label>
                <input
                  id="jeonse"
                  type="number"
                  className={styles.input}
                  placeholder="예: 300000000"
                  value={jeonseAmount}
                  onChange={(e) => setJeonseAmount(e.target.value)}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="deposit-j">월세 보증금 (원)</label>
                <input
                  id="deposit-j"
                  type="number"
                  className={styles.input}
                  placeholder="예: 50000000 (없으면 0)"
                  value={deposit}
                  onChange={(e) => setDeposit(e.target.value)}
                />
              </div>
            </>
          ) : (
            <>
              <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="deposit-m">보증금 (원)</label>
                <input
                  id="deposit-m"
                  type="number"
                  className={styles.input}
                  placeholder="예: 50000000"
                  value={deposit}
                  onChange={(e) => setDeposit(e.target.value)}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="monthly">월세 (원)</label>
                <input
                  id="monthly"
                  type="number"
                  className={styles.input}
                  placeholder="예: 800000"
                  value={monthlyRent}
                  onChange={(e) => setMonthlyRent(e.target.value)}
                />
              </div>
            </>
          )}
        </div>

        {/* 전환율 설정 */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>전환율 설정</h2>
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="rate">
              연 전환율 (%) — 법정 상한 {LEGAL_RATE}%
            </label>
            <input
              id="rate"
              type="number"
              className={styles.input}
              placeholder={`기본값: ${LEGAL_RATE}%`}
              value={customRate}
              onChange={(e) => setCustomRate(e.target.value)}
              step="0.1"
            />
          </div>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 8, marginTop: 8, padding: "10px 14px", background: "var(--primary-light)", borderRadius: 8, border: "1px solid rgba(37,99,235,0.1)" }}>
            <Info size={14} color="var(--primary)" style={{ marginTop: 2, flexShrink: 0 }} />
            <p style={{ margin: 0, fontSize: 13, color: "var(--primary)", lineHeight: 1.5 }}>
              2026년 법정 전월세 전환율 상한은 <strong>{LEGAL_RATE}%</strong>입니다. 집주인이 이 비율을 초과하여 월세를 요구할 수 없습니다.
            </p>
          </div>
        </div>

        {/* 결과 */}
        {result && (
          <div className={styles.resultCard}>
            <div className={styles.resultHeader}>
              <p className={styles.resultLabel}>
                {result.mode === "jeonse-to-monthly" ? "적정 월세" : "상응하는 전세금"}
              </p>
              <p className={styles.resultTotal}>
                {result.mode === "jeonse-to-monthly"
                  ? fmt(result.monthly ?? 0)
                  : fmt(result.jeonse ?? 0)}
                <span className={styles.resultTotalSuffix}>원</span>
                {result.mode === "jeonse-to-monthly" && (
                  <span style={{ fontSize: 14, opacity: 0.8, marginLeft: 6 }}>/월</span>
                )}
              </p>
            </div>
            <div className={styles.resultBody}>
              {result.mode === "jeonse-to-monthly" ? (
                <>
                  <div className={styles.resultRow}>
                    <p className={styles.resultRowLabel}>전세금</p>
                    <p className={styles.resultRowValue}>{fmt(result.jeonse ?? 0)}원</p>
                  </div>
                  <div className={styles.resultRow}>
                    <p className={styles.resultRowLabel}>월세 보증금</p>
                    <p className={styles.resultRowValue}>{fmt(result.dep ?? 0)}원</p>
                  </div>
                  <div className={styles.resultRow}>
                    <p className={styles.resultRowLabel}>전환 대상 금액</p>
                    <p className={styles.resultRowValue}>{fmt(result.gap ?? 0)}원</p>
                  </div>
                  <div className={styles.resultRow}>
                    <p className={styles.resultRowLabel}>적용 전환율</p>
                    <p className={styles.resultRowValue}>{result.appliedRate}%</p>
                  </div>
                  <div className={styles.resultRow}>
                    <p className={styles.resultRowLabel} style={{ fontWeight: 600, color: "var(--text-primary)" }}>월세</p>
                    <p className={styles.resultRowValue} style={{ color: "var(--primary)" }}>{fmt(result.monthly ?? 0)}원/월</p>
                  </div>
                </>
              ) : (
                <>
                  <div className={styles.resultRow}>
                    <p className={styles.resultRowLabel}>보증금</p>
                    <p className={styles.resultRowValue}>{fmt(result.dep ?? 0)}원</p>
                  </div>
                  <div className={styles.resultRow}>
                    <p className={styles.resultRowLabel}>월세</p>
                    <p className={styles.resultRowValue}>{fmt(result.monthly ?? 0)}원/월</p>
                  </div>
                  <div className={styles.resultRow}>
                    <p className={styles.resultRowLabel}>적용 전환율</p>
                    <p className={styles.resultRowValue}>{result.appliedRate}%</p>
                  </div>
                  <div className={styles.resultRow}>
                    <p className={styles.resultRowLabel} style={{ fontWeight: 600, color: "var(--text-primary)" }}>상응 전세금</p>
                    <p className={styles.resultRowValue} style={{ color: "var(--primary)" }}>{fmt(result.jeonse ?? 0)}원</p>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        <p className={styles.footerInfo}>
          법정 전환율은 기준금리 변동에 따라 달라질 수 있습니다. 실제 계약 전 최신 기준금리를 확인하세요.
        </p>

        {/* 가이드 섹션 */}
        <article className={styles.guideSection}>
          <h2 style={{ fontSize: "26px", fontWeight: "800", lineHeight: "1.4" }}>
            전월세 전환율 완벽 가이드: 법정 상한과 계산법
          </h2>
          <p>
            전세를 월세로 바꾸거나 월세를 전세로 전환할 때 가장 중요한 기준이 <strong>전월세 전환율</strong>입니다.
            집주인이 전환율을 너무 높게 적용하면 세입자는 시세보다 훨씬 높은 월세를 내게 됩니다.
            법정 상한을 미리 알고 협상에 활용하세요.
          </p>

          <section>
            <h3>1. 전월세 전환율이란?</h3>
            <p>
              전세금을 월세로 전환할 때 적용하는 연간 이자율입니다.
              <strong> 전환율이 높을수록 월세가 높아지고</strong>, 세입자에게 불리합니다.
              주택임대차보호법에 따라 법정 상한이 정해져 있어 집주인이 임의로 높게 요구할 수 없습니다.
            </p>
          </section>

          <section>
            <h3>2. 계산 공식</h3>
            <div style={{ background: "var(--bg-secondary)", borderRadius: 8, padding: "16px 20px", marginBottom: 16, fontFamily: "monospace", fontSize: 15 }}>
              <p style={{ margin: "0 0 8px", color: "var(--text-primary)" }}>
                <strong>전세 → 월세:</strong><br />
                월세 = (전세금 - 보증금) × 전환율 ÷ 12
              </p>
              <p style={{ margin: 0, color: "var(--text-primary)" }}>
                <strong>월세 → 전세:</strong><br />
                전세금 = 보증금 + (월세 × 12 ÷ 전환율)
              </p>
            </div>
          </section>

          <section>
            <h3>3. 2026년 법정 전환율 상한</h3>
            <div style={{ overflowX: "auto", marginBottom: 16 }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
                <thead>
                  <tr style={{ background: "var(--primary-light)" }}>
                    <th style={{ padding: "10px 12px", textAlign: "left", borderBottom: "2px solid var(--primary)", color: "var(--primary)" }}>구성</th>
                    <th style={{ padding: "10px 12px", textAlign: "center", borderBottom: "2px solid var(--primary)", color: "var(--primary)" }}>비율</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["한국은행 기준금리", "3.5%"],
                    ["법정 가산율", "+ 2.0%"],
                    ["법정 전환율 상한", "= 5.5%"],
                  ].map(([label, rate], i) => (
                    <tr key={i} style={{ borderBottom: "1px solid var(--border-color)", background: i === 2 ? "var(--primary-light)" : i % 2 === 0 ? "var(--bg-card)" : "var(--bg-page)" }}>
                      <td style={{ padding: "10px 12px", fontWeight: i === 2 ? 700 : 400, color: i === 2 ? "var(--primary)" : "var(--text-primary)" }}>{label}</td>
                      <td style={{ padding: "10px 12px", textAlign: "center", fontWeight: i === 2 ? 700 : 600, color: "var(--primary)" }}>{rate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p style={{ fontSize: 13, color: "var(--text-muted)" }}>※ 기준금리 변동 시 법정 상한도 변경됩니다</p>
          </section>

          <section>
            <h3>4. 실제 계산 예시</h3>
            <ul>
              <li><strong>전세 3억 → 보증금 5천만원 + 월세:</strong> (3억 - 5천만원) × 5.5% ÷ 12 = <strong>약 114만원/월</strong></li>
              <li><strong>보증금 5천만원 + 월세 80만원 → 전세:</strong> 5천만원 + (80만원 × 12 ÷ 5.5%) = <strong>약 2억 2,400만원</strong></li>
            </ul>
          </section>

          <section className={styles.guideCallout}>
            <h4>💡 중개수수료도 함께 확인하세요</h4>
            <p>
              전월세 계약 시 발생하는 중개수수료도 미리 계산해보세요.
              <a href="/" style={{ color: "var(--primary)", fontWeight: 600, marginLeft: 4 }}>중개수수료 계산기 바로가기 →</a>
            </p>
          </section>
        </article>

        {/* FAQ */}
        <article style={{ marginTop: "40px", paddingTop: "40px", borderTop: "1px solid var(--border-color)" }}>
          <h2 style={{ fontSize: "24px", fontWeight: "700", marginBottom: "24px", display: "flex", alignItems: "center", gap: "8px" }}>
            <HelpCircle size={28} color="var(--primary)" />
            전월세 전환 자주 묻는 질문
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {[
              {
                q: "집주인이 법정 전환율보다 높게 요구하면 어떻게 하나요?",
                a: "주택임대차보호법에 따라 법정 상한을 초과한 전환율은 무효입니다. 집주인이 상한을 초과한 월세를 요구하면 법정 상한 기준으로 재산정할 것을 요청할 수 있으며, 분쟁이 생기면 주택임대차분쟁조정위원회에 신청할 수 있습니다.",
              },
              {
                q: "전월세 전환율 법정 상한은 어떻게 결정되나요?",
                a: "주택임대차보호법 시행령에 따라 한국은행 기준금리에 대통령령으로 정한 이율(현재 2%)을 더한 값이 상한이 됩니다. 기준금리가 변경되면 상한도 함께 바뀝니다.",
              },
              {
                q: "전세에서 반전세(보증금+월세)로 바꿀 때 적용되나요?",
                a: "네, 전세를 보증금+월세 형태로 전환할 때도 동일하게 법정 전환율 상한이 적용됩니다. 전환 금액은 전세금에서 보증금을 뺀 금액에 전환율을 적용합니다.",
              },
              {
                q: "신규 계약에도 전환율 상한이 적용되나요?",
                a: "법정 전환율 상한은 기존 계약을 전세에서 월세로 전환할 때 적용됩니다. 신규 계약은 당사자 간 자유롭게 협의할 수 있으나, 임대차 3법에 따른 계약갱신청구권 사용 시에는 상한이 적용됩니다.",
              },
              {
                q: "월세를 전세로 바꿀 때도 같은 전환율을 쓰나요?",
                a: "네, 월세→전세 전환 시에도 동일한 전환율 공식을 역으로 적용합니다. 전세금 = 보증금 + (월세 × 12 ÷ 전환율)로 계산하면 됩니다.",
              },
            ].map((item, i) => (
              <div key={i} style={{ background: "var(--bg-card)", padding: "20px", borderRadius: "8px", border: "1px solid var(--border-color)" }}>
                <h3 style={{ fontSize: "16px", margin: "0 0 8px 0", color: "var(--text-primary)" }}>
                  <span style={{ color: "var(--primary)", marginRight: "8px" }}>Q.</span>{item.q}
                </h3>
                <p style={{ margin: 0, fontSize: "14px", color: "var(--text-secondary)", lineHeight: "1.6" }}>
                  <strong>A.</strong> {item.a}
                </p>
              </div>
            ))}
          </div>
        </article>

        {/* 관련 계산기 */}
        <article style={{ marginTop: "40px", paddingTop: "32px", borderTop: "1px solid var(--border-color)" }}>
          <h2 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "16px", color: "var(--text-primary)" }}>관련 부동산 계산기</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "12px" }}>
            {[
              { href: "/", icon: "🏢", title: "중개수수료 계산기", desc: "매매·전세·월세 복비 계산" },
              { href: "/registration-tax", icon: "🏠", title: "취등록세 계산기", desc: "주택 매수 시 취득세·지방교육세 계산" },
              { href: "/capital-gains-tax", icon: "📈", title: "양도소득세 계산기", desc: "주택 매도 시 양도세 계산" },
            ].map((item) => (
              <a key={item.href} href={item.href} style={{ display: "block", padding: "16px", background: "var(--bg-card)", border: "1px solid var(--border-color)", borderRadius: "10px", textDecoration: "none", transition: "border-color 0.2s" }}>
                <div style={{ fontSize: "24px", marginBottom: "8px" }}>{item.icon}</div>
                <p style={{ margin: "0 0 4px", fontSize: "14px", fontWeight: "700", color: "var(--text-primary)" }}>{item.title}</p>
                <p style={{ margin: 0, fontSize: "12px", color: "var(--text-secondary)" }}>{item.desc}</p>
              </a>
            ))}
          </div>
        </article>

        {/* 푸터 */}
        <footer style={{ marginTop: "24px", paddingTop: "16px", borderTop: "1px solid var(--border-color)", textAlign: "center" }}>
          <nav style={{ display: "flex", justifyContent: "center", gap: "20px", flexWrap: "wrap" }}>
            <a href="/privacy-policy" style={{ fontSize: "12px", color: "var(--text-muted)", textDecoration: "none" }}>개인정보 처리방침</a>
            <a href="/terms-of-service" style={{ fontSize: "12px", color: "var(--text-muted)", textDecoration: "none" }}>이용약관</a>
            <a href="/cookie-policy" style={{ fontSize: "12px", color: "var(--text-muted)", textDecoration: "none" }}>쿠키 정책</a>
          </nav>
          <p style={{ marginTop: "8px", fontSize: "11px", color: "var(--text-muted)" }}>
            © 2026 · 문의: tlsfkaus0711@gmail.com
          </p>
        </footer>
      </div>
    </div>
  );
}
