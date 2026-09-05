"use client";

import { useState, useMemo } from "react";
import { Building2, HelpCircle, AlertTriangle } from "lucide-react";
import styles from "../page.module.css";

type HouseCount = "1" | "2" | "3plus";

function calcTax(price: number, houseCount: HouseCount, isAdjusted: boolean, isLargeArea: boolean) {
  let acquisitionRate: number;

  if (houseCount === "3plus") {
    acquisitionRate = isAdjusted ? 0.12 : 0.08;
  } else if (houseCount === "2" && isAdjusted) {
    acquisitionRate = 0.08;
  } else {
    // 1주택 or 2주택 비조정
    if (price <= 600_000_000) {
      acquisitionRate = 0.01;
    } else if (price <= 900_000_000) {
      acquisitionRate = price / 150_000_000 / 100 - 0.03;
    } else {
      acquisitionRate = 0.03;
    }
  }

  const acquisitionTax = Math.floor(price * acquisitionRate);

  let localEducationTax: number;
  let ruralTax: number;

  if (acquisitionRate >= 0.08) {
    localEducationTax = Math.floor(price * 0.004);
    ruralTax = isLargeArea
      ? Math.floor(price * (acquisitionRate === 0.08 ? 0.006 : 0.01))
      : 0;
  } else {
    localEducationTax = Math.floor(acquisitionTax * 0.1);
    ruralTax = isLargeArea ? Math.floor(price * 0.002) : 0;
  }

  return {
    acquisitionRate,
    acquisitionTax,
    localEducationTax,
    ruralTax,
    total: acquisitionTax + localEducationTax + ruralTax,
  };
}

export default function RegistrationTaxPage() {
  const [price, setPrice] = useState("");
  const [houseCount, setHouseCount] = useState<HouseCount>("1");
  const [isAdjusted, setIsAdjusted] = useState(false);
  const [isLargeArea, setIsLargeArea] = useState(false);

  const result = useMemo(() => {
    const amount = parseFloat(price.replace(/,/g, "")) || 0;
    if (amount <= 0) return null;
    return calcTax(amount, houseCount, isAdjusted, isLargeArea);
  }, [price, houseCount, isAdjusted, isLargeArea]);

  const fmt = (n: number) => n.toLocaleString("ko-KR");

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        {/* Header */}
        <header className={styles.header}>
          <div className={styles.headerIcon}>
            <Building2 size={24} />
          </div>
          <h1 className={styles.title}>취등록세 계산기</h1>
          <p className={styles.subtitle}>
            2026년 아파트·주택 취득세·지방교육세·농특세를 1초 만에 계산하세요
          </p>
        </header>

        {/* 거래금액 */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>거래 금액</h2>
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="price">매매가 (원)</label>
            <input
              id="price"
              type="number"
              className={styles.input}
              placeholder="예: 500000000"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
        </div>

        {/* 주택 수 */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>취득 후 보유 주택 수</h2>
          <div className={styles.radioGroup}>
            {[
              { id: "1", label: "1주택" },
              { id: "2", label: "2주택" },
              { id: "3plus", label: "3주택 이상" },
            ].map((t) => (
              <div key={t.id} className={styles.radioOption}>
                <input
                  type="radio"
                  id={`house-${t.id}`}
                  name="houseCount"
                  value={t.id}
                  checked={houseCount === t.id}
                  onChange={(e) => setHouseCount(e.target.value as HouseCount)}
                  className={styles.radioInput}
                />
                <label htmlFor={`house-${t.id}`} className={styles.radioLabel}>
                  {t.label}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* 추가 조건 */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>추가 조건</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {houseCount !== "1" && (
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <input
                  type="checkbox"
                  id="adjusted"
                  checked={isAdjusted}
                  onChange={(e) => setIsAdjusted(e.target.checked)}
                  style={{ width: 16, height: 16, cursor: "pointer" }}
                />
                <label htmlFor="adjusted" style={{ fontSize: 14, color: "var(--text-secondary)", cursor: "pointer" }}>
                  조정대상지역 내 주택 (강남·서초·송파·용산 등)
                </label>
              </div>
            )}
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <input
                type="checkbox"
                id="largeArea"
                checked={isLargeArea}
                onChange={(e) => setIsLargeArea(e.target.checked)}
                style={{ width: 16, height: 16, cursor: "pointer" }}
              />
              <label htmlFor="largeArea" style={{ fontSize: 14, color: "var(--text-secondary)", cursor: "pointer" }}>
                전용면적 85㎡ 초과 (농어촌특별세 부과)
              </label>
            </div>
          </div>
        </div>

        {/* 결과 */}
        {result && (
          <div className={styles.resultCard}>
            <div className={styles.resultHeader}>
              <p className={styles.resultLabel}>총 취등록세</p>
              <p className={styles.resultTotal}>
                {fmt(result.total)}
                <span className={styles.resultTotalSuffix}>원</span>
              </p>
            </div>
            <div className={styles.resultBody}>
              <div className={styles.resultRow}>
                <p className={styles.resultRowLabel}>취득세율</p>
                <p className={styles.resultRowValue}>{(result.acquisitionRate * 100).toFixed(2)}%</p>
              </div>
              <div className={styles.resultRow}>
                <p className={styles.resultRowLabel}>취득세</p>
                <p className={styles.resultRowValue}>{fmt(result.acquisitionTax)}원</p>
              </div>
              <div className={styles.resultRow}>
                <p className={styles.resultRowLabel}>지방교육세</p>
                <p className={styles.resultRowValue}>{fmt(result.localEducationTax)}원</p>
              </div>
              <div className={styles.resultRow}>
                <p className={styles.resultRowLabel}>농어촌특별세</p>
                <p className={styles.resultRowValue}>{fmt(result.ruralTax)}원</p>
              </div>
              <div className={styles.resultRow}>
                <p className={styles.resultRowLabel} style={{ fontWeight: 600, color: "var(--text-primary)" }}>
                  합계
                </p>
                <p className={styles.resultRowValue} style={{ color: "var(--primary)" }}>
                  {fmt(result.total)}원
                </p>
              </div>
            </div>
          </div>
        )}

        <div className={styles.warning} style={{ marginBottom: 16 }}>
          <AlertTriangle size={16} className={styles.warningIcon} />
          <p className={styles.warningText}>
            본 계산기는 <strong>참고용</strong>입니다. 일시적 2주택·상속·증여 등 특수한 경우 세율이 다를 수 있으며, 정확한 세액은 관할 시·군·구청에서 확인하세요.
          </p>
        </div>

        <p className={styles.footerInfo}>
          취득세는 잔금일 기준 60일 이내 신고·납부해야 합니다. 기한 초과 시 가산세가 부과됩니다.
        </p>

        {/* 가이드 섹션 */}
        <article className={styles.guideSection}>
          <h2 style={{ fontSize: "26px", fontWeight: "800", lineHeight: "1.4" }}>
            2026년 취등록세 완벽 가이드: 세율표부터 절약 방법까지
          </h2>
          <p>
            부동산을 취득할 때 가장 큰 세금 부담 중 하나가 <strong>취득세(취등록세)</strong>입니다.
            주택 수와 조정대상지역 여부에 따라 세율이 최대 12배까지 차이나기 때문에,
            매수 전 정확한 세액을 미리 파악하는 것이 매우 중요합니다.
          </p>

          <section>
            <h3>1. 2026년 주택 취득세율표</h3>
            <div style={{ overflowX: "auto", marginBottom: 16 }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
                <thead>
                  <tr style={{ background: "var(--primary-light)" }}>
                    <th style={{ padding: "10px 12px", textAlign: "left", borderBottom: "2px solid var(--primary)", color: "var(--primary)" }}>구분</th>
                    <th style={{ padding: "10px 12px", textAlign: "center", borderBottom: "2px solid var(--primary)", color: "var(--primary)" }}>6억 이하</th>
                    <th style={{ padding: "10px 12px", textAlign: "center", borderBottom: "2px solid var(--primary)", color: "var(--primary)" }}>6억~9억</th>
                    <th style={{ padding: "10px 12px", textAlign: "center", borderBottom: "2px solid var(--primary)", color: "var(--primary)" }}>9억 초과</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["1주택", "1%", "1~3%", "3%"],
                    ["2주택 (비조정)", "1%", "1~3%", "3%"],
                    ["2주택 (조정)", "8%", "8%", "8%"],
                    ["3주택+ (비조정)", "8%", "8%", "8%"],
                    ["3주택+ (조정)", "12%", "12%", "12%"],
                  ].map(([label, a, b, c], i) => (
                    <tr key={i} style={{ borderBottom: "1px solid var(--border-color)", background: i % 2 === 0 ? "var(--bg-card)" : "var(--bg-page)" }}>
                      <td style={{ padding: "10px 12px", fontWeight: 600, color: "var(--text-primary)" }}>{label}</td>
                      <td style={{ padding: "10px 12px", textAlign: "center", color: "var(--primary)" }}>{a}</td>
                      <td style={{ padding: "10px 12px", textAlign: "center", color: "var(--primary)" }}>{b}</td>
                      <td style={{ padding: "10px 12px", textAlign: "center", color: "var(--primary)" }}>{c}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p style={{ fontSize: 13, color: "var(--text-muted)" }}>※ 6억~9억 구간: 취득세율 = (매매가 ÷ 1.5억) - 3 (%)로 계산</p>
          </section>

          <section>
            <h3>2. 취득세 외 추가 세금</h3>
            <ul>
              <li><strong>지방교육세:</strong> 취득세의 약 10% 추가 (중과세율 적용 시 과세표준의 0.4%)</li>
              <li><strong>농어촌특별세:</strong> 전용면적 85㎡ 초과 시 부과 (일반: 0.2%, 중과세: 0.6~1%)</li>
              <li><strong>인지세:</strong> 1억 초과 부동산 거래 시 5만원~35만원 납부</li>
            </ul>
          </section>

          <section>
            <h3>3. 취득세 절약 포인트</h3>
            <ul>
              <li><strong>일시적 2주택 비과세:</strong> 기존 주택을 3년 내 처분하는 조건으로 1주택 세율 적용 가능</li>
              <li><strong>생애최초 주택 감면:</strong> 생애 최초 주택 구입 시 200만원 한도로 취득세 감면</li>
              <li><strong>신혼부부 감면:</strong> 혼인신고 5년 이내, 6억 이하 주택은 취득세 50% 감면 (최대 300만원)</li>
              <li><strong>잔금일 기준 60일 내 신고:</strong> 기한 내 자진신고 시 신고불성실 가산세 없음</li>
            </ul>
          </section>

          <section className={styles.guideCallout}>
            <h4>💡 중개수수료도 함께 계산해보세요</h4>
            <p>
              취득세와 함께 꼭 확인해야 할 비용이 중개수수료(복비)입니다.
              <a href="/" style={{ color: "var(--primary)", fontWeight: 600, marginLeft: 4 }}>중개수수료 계산기 바로가기 →</a>
            </p>
          </section>
        </article>

        {/* FAQ 섹션 */}
        <article style={{ marginTop: "40px", paddingTop: "40px", borderTop: "1px solid var(--border-color)" }}>
          <h2 style={{ fontSize: "24px", fontWeight: "700", marginBottom: "24px", display: "flex", alignItems: "center", gap: "8px" }}>
            <HelpCircle size={28} color="var(--primary)" />
            취등록세 자주 묻는 질문
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {[
              {
                q: "취득세는 언제까지 납부해야 하나요?",
                a: "잔금 납부일 또는 등기 접수일 중 빠른 날로부터 60일 이내에 신고·납부해야 합니다. 기한을 초과하면 신고불성실가산세(20%)와 납부지연가산세가 추가로 부과됩니다.",
              },
              {
                q: "6억~9억 구간 취득세율은 어떻게 계산하나요?",
                a: "취득세율(%) = (매매가 ÷ 1억5천만원) - 3으로 계산합니다. 예를 들어 7억원이면 (7억 ÷ 1.5억) - 3 = 1.67%가 됩니다. 이 구간은 가격이 높아질수록 세율이 점진적으로 올라가는 구조입니다.",
              },
              {
                q: "일시적 2주택이면 취득세 중과를 피할 수 있나요?",
                a: "네, 기존 주택을 새 주택 취득일로부터 3년 이내에 처분하면 1주택자 세율이 적용됩니다. 단, 조정대상지역 내 2주택은 요건이 더 엄격할 수 있으니 관할 구청에 확인하세요.",
              },
              {
                q: "생애최초 주택 구입 시 취득세 혜택이 있나요?",
                a: "네, 생애 최초로 주택을 구입하는 경우 취득세의 200만원 한도 내에서 감면 혜택을 받을 수 있습니다. 소득 기준 등 세부 조건이 있으므로 관할 구청에서 확인하시기 바랍니다.",
              },
              {
                q: "오피스텔 취득세율은 주택과 다른가요?",
                a: "업무용 오피스텔은 주택 수에 포함되지 않아 취득세 4%가 적용됩니다. 다만 주거용으로 사용 중인 오피스텔은 주택으로 간주될 수 있어 주택 수에 포함될 수 있습니다.",
              },
            ].map((item, i) => (
              <div key={i} style={{ background: "var(--bg-card)", padding: "20px", borderRadius: "8px", border: "1px solid var(--border-color)" }}>
                <h3 style={{ fontSize: "16px", margin: "0 0 8px 0", color: "var(--text-primary)" }}>
                  <span style={{ color: "var(--primary)", marginRight: "8px" }}>Q.</span>
                  {item.q}
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
              { href: "/capital-gains-tax", icon: "📈", title: "양도소득세 계산기", desc: "주택 매도 시 양도세 계산" },
              { href: "/jeonwolse", icon: "🔄", title: "전월세 전환율 계산기", desc: "전세↔월세 적정 금액 계산" },
            ].map((item) => (
              <a key={item.href} href={item.href} style={{ display: "block", padding: "16px", background: "var(--bg-card)", border: "1px solid var(--border-color)", borderRadius: "10px", textDecoration: "none", transition: "border-color 0.2s" }}>
                <div style={{ fontSize: "24px", marginBottom: "8px" }}>{item.icon}</div>
                <p style={{ margin: "0 0 4px", fontSize: "14px", fontWeight: "700", color: "var(--text-primary)" }}>{item.title}</p>
                <p style={{ margin: 0, fontSize: "12px", color: "var(--text-secondary)" }}>{item.desc}</p>
              </a>
            ))}
          </div>
        </article>

        {/* 푸터는 app/layout.tsx 의 SiteFooter 로 통합 */}
      </div>
    </div>
  );
}
