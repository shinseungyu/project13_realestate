"use client";

import { useState, useMemo } from "react";
import { Home, HelpCircle, AlertTriangle } from "lucide-react";
import styles from "./page.module.css";

type TransactionType = "sale" | "jeonse" | "monthly";

// 매매 요율표
const SALE_RATES = [
  { max: 50_000_000, rate: 0.006, limit: 250_000 },
  { max: 200_000_000, rate: 0.005, limit: 800_000 },
  { max: 900_000_000, rate: 0.004, limit: null },
  { max: 1_200_000_000, rate: 0.005, limit: null },
  { max: 1_500_000_000, rate: 0.006, limit: null },
  { max: Infinity, rate: 0.007, limit: null },
];

// 전월세 요율표
const RENT_RATES = [
  { max: 50_000_000, rate: 0.005, limit: 200_000 },
  { max: 100_000_000, rate: 0.004, limit: 300_000 },
  { max: 600_000_000, rate: 0.003, limit: null },
  { max: 1_200_000_000, rate: 0.004, limit: null },
  { max: 1_500_000_000, rate: 0.005, limit: null },
  { max: Infinity, rate: 0.006, limit: null },
];

function calcFee(amount: number, isSale: boolean) {
  const table = isSale ? SALE_RATES : RENT_RATES;
  const tier = table.find((t) => amount < t.max) ?? table[table.length - 1];
  const fee = Math.floor(amount * tier.rate);
  return tier.limit ? Math.min(fee, tier.limit) : fee;
}

export default function Page() {
  const [type, setType] = useState<TransactionType>("sale");
  const [price, setPrice] = useState("");
  const [deposit, setDeposit] = useState("");
  const [monthly, setMonthly] = useState("");
  const [includeVat, setIncludeVat] = useState(false);

  const result = useMemo(() => {
    if (type === "sale") {
      const amount = parseFloat(price.replace(/,/g, "")) || 0;
      if (amount <= 0) return null;
      const fee = calcFee(amount, true);
      const vat = Math.floor(fee * 0.1);
      const total = includeVat ? fee + vat : fee;
      const tier = SALE_RATES.find((t) => amount < t.max) ?? SALE_RATES[SALE_RATES.length - 1];
      return { amount, fee, vat, total, rate: tier.rate, hasLimit: !!tier.limit, limit: tier.limit };
    }

    if (type === "jeonse") {
      const amount = parseFloat(price.replace(/,/g, "")) || 0;
      if (amount <= 0) return null;
      const fee = calcFee(amount, false);
      const vat = Math.floor(fee * 0.1);
      const total = includeVat ? fee + vat : fee;
      const tier = RENT_RATES.find((t) => amount < t.max) ?? RENT_RATES[RENT_RATES.length - 1];
      return { amount, fee, vat, total, rate: tier.rate, hasLimit: !!tier.limit, limit: tier.limit };
    }

    // 월세
    const dep = parseFloat(deposit.replace(/,/g, "")) || 0;
    const mon = parseFloat(monthly.replace(/,/g, "")) || 0;
    if (dep <= 0 && mon <= 0) return null;
    const converted = dep + mon * 100;
    const fee = calcFee(converted, false);
    const vat = Math.floor(fee * 0.1);
    const total = includeVat ? fee + vat : fee;
    const tier = RENT_RATES.find((t) => converted < t.max) ?? RENT_RATES[RENT_RATES.length - 1];
    return { amount: converted, dep, mon, fee, vat, total, rate: tier.rate, hasLimit: !!tier.limit, limit: tier.limit };
  }, [type, price, deposit, monthly, includeVat]);

  const fmt = (n: number) => n.toLocaleString("ko-KR");

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        {/* Header */}
        <header className={styles.header}>
          <div className={styles.headerIcon}>
            <Home size={24} />
          </div>
          <h1 className={styles.title}>부동산 중개수수료 계산기</h1>
          <p className={styles.subtitle}>
            매매·전세·월세 복비를 법정 상한 요율로 1초 만에 계산하세요
          </p>
        </header>

        {/* 거래 유형 */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>거래 유형</h2>
          <div className={styles.radioGroup}>
            {[
              { id: "sale", label: "매매" },
              { id: "jeonse", label: "전세" },
              { id: "monthly", label: "월세" },
            ].map((t) => (
              <div key={t.id} className={styles.radioOption}>
                <input
                  type="radio"
                  id={`type-${t.id}`}
                  name="type"
                  value={t.id}
                  checked={type === t.id}
                  onChange={(e) => setType(e.target.value as TransactionType)}
                  className={styles.radioInput}
                />
                <label htmlFor={`type-${t.id}`} className={styles.radioLabel}>
                  {t.label}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* 금액 입력 */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>거래 금액</h2>

          {type === "monthly" ? (
            <>
              <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="deposit">보증금 (원)</label>
                <input
                  id="deposit"
                  type="number"
                  className={styles.input}
                  placeholder="예: 50000000"
                  value={deposit}
                  onChange={(e) => setDeposit(e.target.value)}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="monthly-rent">월세 (원)</label>
                <input
                  id="monthly-rent"
                  type="number"
                  className={styles.input}
                  placeholder="예: 500000"
                  value={monthly}
                  onChange={(e) => setMonthly(e.target.value)}
                />
              </div>
              <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 8 }}>
                환산보증금 = 보증금 + (월세 × 100)으로 계산합니다
              </div>
            </>
          ) : (
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="price">
                {type === "sale" ? "매매가" : "전세금"} (원)
              </label>
              <input
                id="price"
                type="number"
                className={styles.input}
                placeholder="예: 500000000"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
          )}

          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 16 }}>
            <input
              type="checkbox"
              id="vat"
              checked={includeVat}
              onChange={(e) => setIncludeVat(e.target.checked)}
              style={{ width: 16, height: 16, cursor: "pointer" }}
            />
            <label htmlFor="vat" style={{ fontSize: 14, color: "var(--text-secondary)", cursor: "pointer" }}>
              부가세(VAT 10%) 포함하여 계산
            </label>
          </div>
        </div>

        {/* 결과 */}
        {result && (
          <div className={styles.resultCard}>
            <div className={styles.resultHeader}>
              <p className={styles.resultLabel}>예상 중개수수료</p>
              <p className={styles.resultTotal}>
                {fmt(result.total)}
                <span className={styles.resultTotalSuffix}>원</span>
              </p>
            </div>
            <div className={styles.resultBody}>
              {type === "monthly" && "dep" in result && (
                <div className={styles.resultRow}>
                  <p className={styles.resultRowLabel}>환산보증금</p>
                  <p className={styles.resultRowValue}>{fmt(result.amount)}원</p>
                </div>
              )}
              <div className={styles.resultRow}>
                <p className={styles.resultRowLabel}>적용 요율 (상한)</p>
                <p className={styles.resultRowValue}>{(result.rate * 100).toFixed(1)}%</p>
              </div>
              <div className={styles.resultRow}>
                <p className={styles.resultRowLabel}>중개수수료 (세전)</p>
                <p className={styles.resultRowValue}>{fmt(result.fee)}원</p>
              </div>
              {includeVat && (
                <div className={styles.resultRow}>
                  <p className={styles.resultRowLabel}>부가세 (10%)</p>
                  <p className={styles.resultRowValue}>{fmt(result.vat)}원</p>
                </div>
              )}
              <div className={styles.resultRow}>
                <p className={styles.resultRowLabel} style={{ fontWeight: 600, color: "var(--text-primary)" }}>
                  최종 수수료 {includeVat ? "(VAT 포함)" : ""}
                </p>
                <p className={styles.resultRowValue} style={{ color: "var(--primary)" }}>
                  {fmt(result.total)}원
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 부동산 중개수수료란? */}
        <div className={styles.infoSection}>
          <h2 className={styles.infoTitle}>
            <HelpCircle size={20} className={styles.infoIcon} />
            부동산 중개수수료란?
          </h2>
          <div className={styles.infoContent}>
            <p>
              <strong>부동산 중개수수료</strong>(흔히 '복비'라고 함)는 부동산 거래 시 공인중개사가 계약을 중개하고 성사시킨 대가로 받는 보수입니다. 계약서 작성부터 물건 확인, 권리 관계 분석 등 안전한 거래를 돕는 서비스에 대한 비용입니다.
            </p>
            <p>
              누가 내나요? <strong>매도인과 매수인(또는 임대인과 임대차인) 쌍방</strong>이 각각 지급하는 것이 원칙입니다.
            </p>
            <p>
              언제 내나요? 보통 <strong>잔금 지불일</strong>에 지급하지만, 계약 시 별도 약정이 있다면 그에 따릅니다.
            </p>
            <p>
              협의가 가능한가요? 네, 법으로 정해진 요율은 <strong>상한 요율</strong>일 뿐입니다. 한도 내에서 공인중개사와 미리 협의하여 금액을 조정할 수 있습니다.
            </p>
          </div>
        </div>

        {/* 안내 */}
        <div className={styles.warning} style={{ marginBottom: 16 }}>
          <AlertTriangle size={16} className={styles.warningIcon} />
          <p className={styles.warningText}>
            본 계산기는 법정 <strong>상한 요율</strong> 기준입니다. 실제 수수료는 공인중개사와 협의하여 상한 이하로 결정할 수 있습니다.
          </p>
        </div>

        <p className={styles.footerInfo}>
          본 계산기는 참고용이며, 실제 중개수수료는 공인중개사와 협의한 금액이 우선합니다.
        </p>

        {/* 가이드 섹션 */}
        <article className={styles.guideSection}>
          <h2 style={{ fontSize: "26px", fontWeight: "800", lineHeight: "1.4" }}>
            부동산 중개수수료(복비) 완벽 가이드: 요율표부터 절약 팁까지
          </h2>
          <p>
            집을 사거나 전세·월세를 구할 때 빠질 수 없는 비용이 바로 <strong>중개수수료(복비)</strong>입니다.
            거래금액이 클수록 수백만 원을 넘기도 하지만, 많은 분들이 정확한 계산법을 몰라 손해를 보거나
            공인중개사가 요구하는 금액을 그냥 납부하는 경우가 많습니다.
            법정 상한 요율을 미리 파악하고, 상한 이하로 협상하는 것이 절약의 핵심입니다.
          </p>

          <section>
            <h3>1. 2026년 매매 중개수수료 요율표</h3>
            <div style={{ overflowX: "auto", marginBottom: 16 }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
                <thead>
                  <tr style={{ background: "var(--primary-light)" }}>
                    <th style={{ padding: "10px 12px", textAlign: "left", borderBottom: "2px solid var(--primary)", color: "var(--primary)" }}>거래금액</th>
                    <th style={{ padding: "10px 12px", textAlign: "center", borderBottom: "2px solid var(--primary)", color: "var(--primary)" }}>상한 요율</th>
                    <th style={{ padding: "10px 12px", textAlign: "center", borderBottom: "2px solid var(--primary)", color: "var(--primary)" }}>한도액</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["5천만원 미만", "0.6%", "25만원"],
                    ["5천만원 ~ 2억원 미만", "0.5%", "80만원"],
                    ["2억원 ~ 9억원 미만", "0.4%", "없음"],
                    ["9억원 ~ 12억원 미만", "0.5%", "없음"],
                    ["12억원 ~ 15억원 미만", "0.6%", "없음"],
                    ["15억원 이상", "0.7%", "없음"],
                  ].map(([range, rate, limit], i) => (
                    <tr key={i} style={{ borderBottom: "1px solid var(--border-color)", background: i % 2 === 0 ? "var(--bg-card)" : "var(--bg-page)" }}>
                      <td style={{ padding: "10px 12px", color: "var(--text-primary)" }}>{range}</td>
                      <td style={{ padding: "10px 12px", textAlign: "center", fontWeight: 600, color: "var(--primary)" }}>{rate}</td>
                      <td style={{ padding: "10px 12px", textAlign: "center", color: "var(--text-secondary)" }}>{limit}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h3>2. 2026년 전월세 중개수수료 요율표</h3>
            <div style={{ overflowX: "auto", marginBottom: 16 }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
                <thead>
                  <tr style={{ background: "var(--primary-light)" }}>
                    <th style={{ padding: "10px 12px", textAlign: "left", borderBottom: "2px solid var(--primary)", color: "var(--primary)" }}>거래금액</th>
                    <th style={{ padding: "10px 12px", textAlign: "center", borderBottom: "2px solid var(--primary)", color: "var(--primary)" }}>상한 요율</th>
                    <th style={{ padding: "10px 12px", textAlign: "center", borderBottom: "2px solid var(--primary)", color: "var(--primary)" }}>한도액</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["5천만원 미만", "0.5%", "20만원"],
                    ["5천만원 ~ 1억원 미만", "0.4%", "30만원"],
                    ["1억원 ~ 6억원 미만", "0.3%", "없음"],
                    ["6억원 ~ 12억원 미만", "0.4%", "없음"],
                    ["12억원 ~ 15억원 미만", "0.5%", "없음"],
                    ["15억원 이상", "0.6%", "없음"],
                  ].map(([range, rate, limit], i) => (
                    <tr key={i} style={{ borderBottom: "1px solid var(--border-color)", background: i % 2 === 0 ? "var(--bg-card)" : "var(--bg-page)" }}>
                      <td style={{ padding: "10px 12px", color: "var(--text-primary)" }}>{range}</td>
                      <td style={{ padding: "10px 12px", textAlign: "center", fontWeight: 600, color: "var(--primary)" }}>{rate}</td>
                      <td style={{ padding: "10px 12px", textAlign: "center", color: "var(--text-secondary)" }}>{limit}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h3>3. 중개수수료 절약 꿀팁</h3>
            <ul>
              <li><strong>상한 요율은 협상 가능합니다.</strong> 법정 상한 이하에서 공인중개사와 협의할 수 있습니다. 거래 전 명시적으로 요율을 확인하세요.</li>
              <li><strong>부가세 별도 여부를 확인하세요.</strong> 공인중개사가 일반과세자인 경우 VAT 10%가 추가됩니다.</li>
              <li><strong>영수증을 꼭 받으세요.</strong> 중개수수료 영수증은 소득공제 서류로 활용 가능합니다.</li>
              <li><strong>허위과다 청구는 신고 대상입니다.</strong> 법정 상한을 초과한 수수료를 요구받으면 시·군·구청 또는 한국공인중개사협회에 신고하세요.</li>
            </ul>
          </section>

          <section className={styles.guideCallout}>
            <h4>💡 지금 바로 계산해보세요</h4>
            <p>
              위의 계산기에 거래 유형과 금액을 입력하면 법정 상한 요율 기준 예상 수수료를 바로 확인할 수 있습니다.
              협상 전 미리 확인해 두면 손해 없이 거래를 마무리할 수 있습니다.
            </p>
          </section>
        </article>

        {/* FAQ 섹션 */}
        <article style={{ marginTop: "40px", paddingTop: "40px", borderTop: "1px solid var(--border-color)" }}>
          <h2 style={{ fontSize: "24px", fontWeight: "700", marginBottom: "24px", display: "flex", alignItems: "center", gap: "8px" }}>
            <HelpCircle size={28} color="var(--primary)" />
            중개수수료 자주 묻는 질문 BEST 5
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {[
              {
                q: "부동산 중개수수료(복비)는 어떻게 계산하나요?",
                a: "중개수수료는 거래금액 × 요율로 계산합니다. 요율은 거래 유형(매매·전세·월세)과 거래금액 구간에 따라 법정 상한이 정해져 있으며, 공인중개사와 협의하여 상한 이하로 결정할 수 있습니다.",
              },
              {
                q: "2026년 매매 중개수수료 요율은 얼마인가요?",
                a: "2026년 기준 2억원 미만 0.5%, 2억~9억원 미만 0.4%, 9억~12억원 미만 0.5%, 12억~15억원 미만 0.6%, 15억원 이상 0.7%입니다. 5천만원 미만은 0.6%이나 한도액 25만원이 적용됩니다.",
              },
              {
                q: "월세 중개수수료는 어떻게 계산하나요?",
                a: "월세는 보증금 + (월세 × 100)으로 환산보증금을 계산한 뒤 해당 구간의 전월세 요율을 적용합니다. 예를 들어 보증금 1천만원, 월세 50만원이면 환산보증금은 6천만원이 되어 0.3% 요율이 적용됩니다.",
              },
              {
                q: "중개수수료에 부가세(VAT)가 붙나요?",
                a: "공인중개사가 일반과세자인 경우 중개수수료에 VAT 10%가 추가됩니다. 간이과세자는 면제될 수 있으니 거래 전 확인하세요. 본 계산기에서 'VAT 포함' 옵션을 체크하면 포함 금액을 확인할 수 있습니다.",
              },
              {
                q: "오피스텔 중개수수료 요율은 주택과 다른가요?",
                a: "주거용 오피스텔(전용면적 85㎡ 이하)은 매매 0.5%, 임대차 0.4% 상한이 적용됩니다. 업무용(비주거용) 오피스텔은 거래금액의 0.9% 이내에서 협의합니다.",
              },
              {
                q: "2026년 부동산 중개수수료 개편 내용이 있나요?",
                a: "2026년 현재 중개수수료 요율은 2021년 개편 기준이 유지되고 있습니다. 9억원 이상 고가 주택의 상한 요율이 기존보다 낮아진 구조로, 매매 9억~12억원 0.5%, 12억~15억원 0.6%, 15억원 이상 0.7%가 적용됩니다. 정확한 수수료는 위 계산기에서 바로 확인하세요.",
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

        {/* 유용한 관련 사이트 */}
        <article style={{ marginTop: "40px", paddingTop: "32px", borderTop: "1px solid var(--border-color)" }}>
          <h2 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "16px", color: "var(--text-primary)" }}>유용한 관련 사이트</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "12px" }}>
            <a href="https://importtaxcalc.com" target="_blank" rel="noopener noreferrer" style={{ display: "block", padding: "16px", background: "var(--bg-card)", border: "1px solid var(--border-color)", borderRadius: "10px", textDecoration: "none", transition: "border-color 0.2s" }}>
              <div style={{ fontSize: "24px", marginBottom: "8px" }}>🛃</div>
              <p style={{ margin: "0 0 4px", fontSize: "14px", fontWeight: "700", color: "var(--text-primary)" }}>해외직구 관세 계산기</p>
              <p style={{ margin: 0, fontSize: "12px", color: "var(--text-secondary)" }}>미국·일본·중국 등 7개국 실시간 환율 기반 관부가세 자동 계산</p>
            </a>
            <a href="https://www.nailstartup.com/" target="_blank" rel="noopener noreferrer" style={{ display: "block", padding: "16px", background: "var(--bg-card)", border: "1px solid var(--border-color)", borderRadius: "10px", textDecoration: "none", transition: "border-color 0.2s" }}>
              <div style={{ fontSize: "24px", marginBottom: "8px" }}>💅</div>
              <p style={{ margin: "0 0 4px", fontSize: "14px", fontWeight: "700", color: "var(--text-primary)" }}>네일 창업 정보</p>
              <p style={{ margin: 0, fontSize: "12px", color: "var(--text-secondary)" }}>네일샵 창업부터 운영까지 실전 정보 제공</p>
            </a>
          </div>
        </article>

        {/* 관련 계산기 */}
        <article style={{ marginTop: "40px", paddingTop: "32px", borderTop: "1px solid var(--border-color)" }}>
          <h2 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "16px", color: "var(--text-primary)" }}>관련 부동산 계산기</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "12px" }}>
            {[
              { href: "/registration-tax", icon: "🏠", title: "취등록세 계산기", desc: "주택 매수 시 취득세·지방교육세 계산" },
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

        {/* 부동산 가이드 */}
        <article style={{ marginTop: "40px", paddingTop: "32px", borderTop: "1px solid var(--border-color)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
            <h2 style={{ fontSize: "18px", fontWeight: "700", color: "var(--text-primary)", margin: 0 }}>부동산 가이드</h2>
            <a href="/board" style={{ fontSize: "13px", color: "var(--primary)", textDecoration: "none", fontWeight: 600 }}>전체 보기 →</a>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {[
              { id: 1, category: "중개수수료", title: "2026년 부동산 중개수수료 요율 완전정리 — 매매·전세·월세 모두" },
              { id: 2, category: "취득세", title: "취득세 절약하는 법 — 1주택자·생애최초 감면 조건 총정리" },
              { id: 4, category: "양도소득세", title: "1세대 1주택 양도소득세 비과세 조건 완전정리" },
              { id: 3, category: "전세·월세", title: "전세 vs 월세 — 2026년 금리 환경에서 어느 게 더 유리할까?" },
              { id: 5, category: "계약 가이드", title: "부동산 매매 계약 전 꼭 확인해야 할 체크리스트 10가지" },
            ].map((post) => (
              <a key={post.id} href={`/board?id=${post.id}`} style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "14px 16px",
                background: "var(--bg-card)",
                border: "1px solid var(--border-color)",
                borderRadius: "8px",
                textDecoration: "none",
              }}>
                <span style={{
                  flexShrink: 0,
                  fontSize: "11px",
                  fontWeight: 700,
                  color: "var(--primary)",
                  background: "var(--primary-light)",
                  padding: "2px 8px",
                  borderRadius: "4px",
                  whiteSpace: "nowrap",
                }}>
                  {post.category}
                </span>
                <span style={{ fontSize: "14px", color: "var(--text-primary)", fontWeight: 500, lineHeight: 1.4 }}>
                  {post.title}
                </span>
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
