"use client";

import { useState, useMemo } from "react";
import { TrendingUp, HelpCircle, AlertTriangle } from "lucide-react";
import styles from "../page.module.css";

type HouseCount = "1" | "2" | "3plus";

// 기본세율 누진공제
function calcProgressiveTax(taxBase: number): number {
  const brackets = [
    { limit: 14_000_000, rate: 0.06, deduction: 0 },
    { limit: 50_000_000, rate: 0.15, deduction: 1_260_000 },
    { limit: 88_000_000, rate: 0.24, deduction: 5_760_000 },
    { limit: 150_000_000, rate: 0.35, deduction: 15_440_000 },
    { limit: 300_000_000, rate: 0.38, deduction: 19_940_000 },
    { limit: 500_000_000, rate: 0.40, deduction: 25_940_000 },
    { limit: 1_000_000_000, rate: 0.42, deduction: 35_940_000 },
    { limit: Infinity, rate: 0.45, deduction: 65_940_000 },
  ];
  const b = brackets.find((b) => taxBase <= b.limit) ?? brackets[brackets.length - 1];
  return Math.max(0, Math.floor(taxBase * b.rate - b.deduction));
}

// 일반 장기보유특별공제 (2% × 보유연수, 최대 30%)
function generalLtd(years: number): number {
  if (years < 3) return 0;
  return Math.min(Math.floor(years) * 0.02, 0.30);
}

// 1주택 장기보유특별공제 (보유 4%/년 + 거주 4%/년, 각 최대 40%, 합계 최대 80%)
function onehouseLtd(holdingYears: number, residenceYears: number): number {
  if (holdingYears < 3) return 0;
  const holdingRate = Math.min(Math.floor(holdingYears) * 0.04, 0.40);
  const residenceRate = residenceYears >= 2 ? Math.min(Math.floor(residenceYears) * 0.04, 0.40) : 0;
  return Math.min(holdingRate + residenceRate, 0.80);
}

function calcCapitalGainsTax(
  salePrice: number,
  acquisitionPrice: number,
  expenses: number,
  holdingYears: number,
  residenceYears: number,
  houseCount: HouseCount,
  isAdjusted: boolean
) {
  const gain = salePrice - acquisitionPrice - expenses;
  if (gain <= 0) return { gain, exempt: false, tax: 0, localTax: 0, total: 0, gain0: true };

  // 단기 양도
  if (holdingYears < 1) {
    const tax = Math.floor(gain * 0.70);
    return { gain, shortTerm: true, rate: 0.70, tax, localTax: Math.floor(tax * 0.1), total: Math.floor(tax * 1.1) };
  }
  if (holdingYears < 2) {
    const tax = Math.floor(gain * 0.60);
    return { gain, shortTerm: true, rate: 0.60, tax, localTax: Math.floor(tax * 0.1), total: Math.floor(tax * 1.1) };
  }

  // 1주택 비과세 체크
  if (houseCount === "1") {
    const eligible = holdingYears >= 2 && (!isAdjusted || residenceYears >= 2);
    if (eligible) {
      if (salePrice <= 1_200_000_000) {
        return { gain, exempt: true, tax: 0, localTax: 0, total: 0 };
      }
      // 12억 초과분만 과세
      const taxableRatio = (salePrice - 1_200_000_000) / salePrice;
      const taxableGain = Math.floor(gain * taxableRatio);
      const ltdRate = onehouseLtd(holdingYears, residenceYears);
      const deduction = Math.floor(taxableGain * ltdRate);
      const netGain = taxableGain - deduction;
      const basicDeduction = Math.min(2_500_000, netGain);
      const taxBase = Math.max(0, netGain - basicDeduction);
      const tax = calcProgressiveTax(taxBase);
      const localTax = Math.floor(tax * 0.1);
      return { gain, taxableGain, taxableRatio, ltdRate, deduction, netGain, basicDeduction, taxBase, partialExempt: true, tax, localTax, total: tax + localTax };
    }
  }

  // 장기보유특별공제
  let ltdRate = 0;
  if (houseCount === "1") {
    ltdRate = onehouseLtd(holdingYears, residenceYears);
  } else if (!isAdjusted) {
    ltdRate = generalLtd(holdingYears);
  }
  // 조정지역 다주택자는 장기보유특별공제 배제

  const deduction = Math.floor(gain * ltdRate);
  const netGain = gain - deduction;
  const basicDeduction = Math.min(2_500_000, netGain);
  const taxBase = Math.max(0, netGain - basicDeduction);

  // 중과세율
  const surcharge = houseCount === "2" && isAdjusted ? 0.20 : houseCount === "3plus" && isAdjusted ? 0.30 : 0;
  const baseTax = calcProgressiveTax(taxBase);
  const surchargeTax = Math.floor(taxBase * surcharge);
  const tax = baseTax + surchargeTax;
  const localTax = Math.floor(tax * 0.1);

  return { gain, ltdRate, deduction, netGain, basicDeduction, taxBase, surcharge, baseTax, surchargeTax, tax, localTax, total: tax + localTax };
}

export default function CapitalGainsTaxPage() {
  const [salePrice, setSalePrice] = useState("");
  const [acquisitionPrice, setAcquisitionPrice] = useState("");
  const [expenses, setExpenses] = useState("");
  const [holdingYears, setHoldingYears] = useState("");
  const [residenceYears, setResidenceYears] = useState("");
  const [houseCount, setHouseCount] = useState<HouseCount>("1");
  const [isAdjusted, setIsAdjusted] = useState(false);

  const result = useMemo(() => {
    const sale = parseFloat(salePrice) || 0;
    const acq = parseFloat(acquisitionPrice) || 0;
    const exp = parseFloat(expenses) || 0;
    const hold = parseFloat(holdingYears) || 0;
    const res = parseFloat(residenceYears) || 0;
    if (sale <= 0 || acq <= 0) return null;
    return calcCapitalGainsTax(sale, acq, exp, hold, res, houseCount, isAdjusted);
  }, [salePrice, acquisitionPrice, expenses, holdingYears, residenceYears, houseCount, isAdjusted]);

  const fmt = (n: number) => n.toLocaleString("ko-KR");

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        {/* Header */}
        <header className={styles.header}>
          <div className={styles.headerIcon}>
            <TrendingUp size={24} />
          </div>
          <h1 className={styles.title}>양도소득세 계산기</h1>
          <p className={styles.subtitle}>
            부동산 매도 시 예상 양도소득세를 1초 만에 계산하세요
          </p>
        </header>

        {/* 거래 금액 */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>거래 금액</h2>
          <div className={styles.row}>
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="salePrice">매도가 (원)</label>
              <input id="salePrice" type="number" className={styles.input} placeholder="예: 800000000" value={salePrice} onChange={(e) => setSalePrice(e.target.value)} />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="acquisitionPrice">취득가 (원)</label>
              <input id="acquisitionPrice" type="number" className={styles.input} placeholder="예: 500000000" value={acquisitionPrice} onChange={(e) => setAcquisitionPrice(e.target.value)} />
            </div>
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="expenses">필요경비 (원, 선택)</label>
            <input id="expenses" type="number" className={styles.input} placeholder="취득세·중개수수료·인테리어비 등" value={expenses} onChange={(e) => setExpenses(e.target.value)} />
          </div>
        </div>

        {/* 보유·거주 기간 */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>보유 · 거주 기간</h2>
          <div className={styles.row}>
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="holdingYears">보유기간 (년)</label>
              <input id="holdingYears" type="number" className={styles.input} placeholder="예: 5" value={holdingYears} onChange={(e) => setHoldingYears(e.target.value)} />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="residenceYears">거주기간 (년)</label>
              <input id="residenceYears" type="number" className={styles.input} placeholder="예: 3" value={residenceYears} onChange={(e) => setResidenceYears(e.target.value)} />
            </div>
          </div>
        </div>

        {/* 주택 수 및 조건 */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>주택 수 · 지역</h2>
          <div className={styles.radioGroup} style={{ marginBottom: 16 }}>
            {[
              { id: "1", label: "1주택" },
              { id: "2", label: "2주택" },
              { id: "3plus", label: "3주택 이상" },
            ].map((t) => (
              <div key={t.id} className={styles.radioOption}>
                <input type="radio" id={`house-${t.id}`} name="houseCount" value={t.id} checked={houseCount === t.id} onChange={(e) => setHouseCount(e.target.value as HouseCount)} className={styles.radioInput} />
                <label htmlFor={`house-${t.id}`} className={styles.radioLabel}>{t.label}</label>
              </div>
            ))}
          </div>
          {houseCount !== "1" && (
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <input type="checkbox" id="adjusted" checked={isAdjusted} onChange={(e) => setIsAdjusted(e.target.checked)} style={{ width: 16, height: 16, cursor: "pointer" }} />
              <label htmlFor="adjusted" style={{ fontSize: 14, color: "var(--text-secondary)", cursor: "pointer" }}>
                조정대상지역 내 주택 (강남·서초·송파·용산 등)
              </label>
            </div>
          )}
        </div>

        {/* 결과 */}
        {result && (
          <>
            {"exempt" in result && result.exempt ? (
              <div style={{ background: "var(--success-light)", border: "1px solid var(--success-border)", borderRadius: "var(--border-radius)", padding: 24, textAlign: "center", marginBottom: 16 }}>
                <p style={{ fontSize: 20, fontWeight: 700, color: "var(--success)", marginBottom: 8 }}>1주택 비과세 대상입니다</p>
                <p style={{ fontSize: 14, color: "var(--text-secondary)" }}>양도차익 {fmt(result.gain)}원에 대해 양도소득세가 부과되지 않습니다.</p>
              </div>
            ) : (
              <div className={styles.resultCard}>
                <div className={styles.resultHeader}>
                  <p className={styles.resultLabel}>예상 양도소득세 (지방소득세 포함)</p>
                  <p className={styles.resultTotal}>
                    {"gain0" in result && result.gain0 ? "0" : fmt(result.total)}
                    <span className={styles.resultTotalSuffix}>원</span>
                  </p>
                </div>
                <div className={styles.resultBody}>
                  <div className={styles.resultRow}>
                    <p className={styles.resultRowLabel}>양도차익</p>
                    <p className={styles.resultRowValue}>{fmt(result.gain)}원</p>
                  </div>
                  {"shortTerm" in result && result.shortTerm ? (
                    <div className={styles.resultRow}>
                      <p className={styles.resultRowLabel}>단기 양도세율 ({((result.rate ?? 0) * 100).toFixed(0)}%)</p>
                      <p className={styles.resultRowValue}>{fmt(result.tax)}원</p>
                    </div>
                  ) : (
                    <>
                      {"partialExempt" in result && result.partialExempt && (
                        <div className={styles.resultRow}>
                          <p className={styles.resultRowLabel}>과세 양도차익 (12억 초과분)</p>
                          <p className={styles.resultRowValue}>{fmt(result.taxableGain ?? 0)}원</p>
                        </div>
                      )}
                      {"ltdRate" in result && (result.ltdRate ?? 0) > 0 && (
                        <div className={styles.resultRow}>
                          <p className={styles.resultRowLabel}>장기보유특별공제 ({((result.ltdRate ?? 0) * 100).toFixed(0)}%)</p>
                          <p className={styles.resultRowValue}>- {fmt(result.deduction ?? 0)}원</p>
                        </div>
                      )}
                      {"basicDeduction" in result && (
                        <div className={styles.resultRow}>
                          <p className={styles.resultRowLabel}>기본공제</p>
                          <p className={styles.resultRowValue}>- {fmt(result.basicDeduction ?? 0)}원</p>
                        </div>
                      )}
                      {"taxBase" in result && (
                        <div className={styles.resultRow}>
                          <p className={styles.resultRowLabel}>과세표준</p>
                          <p className={styles.resultRowValue}>{fmt(result.taxBase ?? 0)}원</p>
                        </div>
                      )}
                      {"surcharge" in result && (result.surcharge ?? 0) > 0 && (
                        <div className={styles.resultRow}>
                          <p className={styles.resultRowLabel}>중과세 ({((result.surcharge ?? 0) * 100).toFixed(0)}%p 추가)</p>
                          <p className={styles.resultRowValue}>{fmt(result.surchargeTax ?? 0)}원</p>
                        </div>
                      )}
                      <div className={styles.resultRow}>
                        <p className={styles.resultRowLabel}>양도소득세</p>
                        <p className={styles.resultRowValue}>{fmt(result.tax)}원</p>
                      </div>
                    </>
                  )}
                  <div className={styles.resultRow}>
                    <p className={styles.resultRowLabel}>지방소득세 (10%)</p>
                    <p className={styles.resultRowValue}>{fmt(result.localTax)}원</p>
                  </div>
                  <div className={styles.resultRow}>
                    <p className={styles.resultRowLabel} style={{ fontWeight: 600, color: "var(--text-primary)" }}>합계</p>
                    <p className={styles.resultRowValue} style={{ color: "var(--primary)" }}>{fmt(result.total)}원</p>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        <div className={styles.warning} style={{ marginBottom: 16 }}>
          <AlertTriangle size={16} className={styles.warningIcon} />
          <p className={styles.warningText}>
            본 계산기는 <strong>참고용</strong>입니다. 세법 개정·비과세 특례·감면 등 개인 상황에 따라 실제 세액이 크게 달라질 수 있습니다. 정확한 세액은 세무사 상담을 권장합니다.
          </p>
        </div>

        {/* 가이드 섹션 */}
        <article className={styles.guideSection}>
          <h2 style={{ fontSize: "26px", fontWeight: "800", lineHeight: "1.4" }}>
            2026년 양도소득세 완벽 가이드
          </h2>
          <p>
            부동산을 팔 때 발생하는 <strong>양도소득세</strong>는 주택 수, 보유기간, 거주기간, 조정대상지역 여부에 따라 세율이 크게 달라집니다.
            1주택자는 비과세 혜택을 받을 수 있고, 다주택자는 중과세율이 적용될 수 있으므로 매도 전 반드시 확인이 필요합니다.
          </p>

          <section>
            <h3>1. 1주택 비과세 요건</h3>
            <ul>
              <li><strong>보유기간 2년 이상</strong> (취득일~양도일)</li>
              <li><strong>조정대상지역:</strong> 보유 2년 + 거주 2년 이상</li>
              <li><strong>매도가 12억 이하:</strong> 전액 비과세</li>
              <li><strong>매도가 12억 초과:</strong> 초과분에 해당하는 양도차익만 과세</li>
            </ul>
          </section>

          <section>
            <h3>2. 장기보유특별공제율</h3>
            <div style={{ overflowX: "auto", marginBottom: 16 }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
                <thead>
                  <tr style={{ background: "var(--primary-light)" }}>
                    <th style={{ padding: "10px 12px", textAlign: "left", borderBottom: "2px solid var(--primary)", color: "var(--primary)" }}>보유기간</th>
                    <th style={{ padding: "10px 12px", textAlign: "center", borderBottom: "2px solid var(--primary)", color: "var(--primary)" }}>1주택 (거주 2년+)</th>
                    <th style={{ padding: "10px 12px", textAlign: "center", borderBottom: "2px solid var(--primary)", color: "var(--primary)" }}>일반</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["3년", "12% + 거주공제", "6%"],
                    ["5년", "20% + 거주공제", "10%"],
                    ["7년", "28% + 거주공제", "14%"],
                    ["10년 이상", "최대 80%", "20%"],
                    ["15년 이상", "최대 80%", "30%"],
                  ].map(([years, one, general], i) => (
                    <tr key={i} style={{ borderBottom: "1px solid var(--border-color)", background: i % 2 === 0 ? "var(--bg-card)" : "var(--bg-page)" }}>
                      <td style={{ padding: "10px 12px", fontWeight: 600 }}>{years}</td>
                      <td style={{ padding: "10px 12px", textAlign: "center", color: "var(--primary)" }}>{one}</td>
                      <td style={{ padding: "10px 12px", textAlign: "center", color: "var(--text-secondary)" }}>{general}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p style={{ fontSize: 13, color: "var(--text-muted)" }}>※ 조정지역 다주택자는 장기보유특별공제 배제</p>
          </section>

          <section>
            <h3>3. 기본세율표</h3>
            <div style={{ overflowX: "auto", marginBottom: 16 }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
                <thead>
                  <tr style={{ background: "var(--primary-light)" }}>
                    <th style={{ padding: "10px 12px", textAlign: "left", borderBottom: "2px solid var(--primary)", color: "var(--primary)" }}>과세표준</th>
                    <th style={{ padding: "10px 12px", textAlign: "center", borderBottom: "2px solid var(--primary)", color: "var(--primary)" }}>세율</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["1,400만원 이하", "6%"],
                    ["1,400만원~5,000만원", "15%"],
                    ["5,000만원~8,800만원", "24%"],
                    ["8,800만원~1.5억", "35%"],
                    ["1.5억~3억", "38%"],
                    ["3억~5억", "40%"],
                    ["5억~10억", "42%"],
                    ["10억 초과", "45%"],
                  ].map(([range, rate], i) => (
                    <tr key={i} style={{ borderBottom: "1px solid var(--border-color)", background: i % 2 === 0 ? "var(--bg-card)" : "var(--bg-page)" }}>
                      <td style={{ padding: "10px 12px" }}>{range}</td>
                      <td style={{ padding: "10px 12px", textAlign: "center", fontWeight: 600, color: "var(--primary)" }}>{rate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p style={{ fontSize: 13, color: "var(--text-muted)" }}>※ 다주택자 조정지역: 2주택 +20%p, 3주택 이상 +30%p 중과 / 단기양도: 1년 미만 70%, 1~2년 60%</p>
          </section>

          <section className={styles.guideCallout}>
            <h4>💡 취득할 때 세금도 확인해보세요</h4>
            <p>
              양도세와 함께 취득 시 납부했던 취득세도 필요경비로 공제됩니다.
              <a href="/registration-tax" style={{ color: "var(--primary)", fontWeight: 600, marginLeft: 4 }}>취등록세 계산기 바로가기 →</a>
            </p>
          </section>
        </article>

        {/* FAQ */}
        <article style={{ marginTop: "40px", paddingTop: "40px", borderTop: "1px solid var(--border-color)" }}>
          <h2 style={{ fontSize: "24px", fontWeight: "700", marginBottom: "24px", display: "flex", alignItems: "center", gap: "8px" }}>
            <HelpCircle size={28} color="var(--primary)" />
            양도소득세 자주 묻는 질문
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {[
              {
                q: "1주택자는 양도소득세를 안 내도 되나요?",
                a: "2년 이상 보유(조정지역은 2년 거주 추가)하고 매도가 12억원 이하이면 양도소득세가 전액 비과세됩니다. 12억 초과 부분은 초과분에 해당하는 양도차익에 대해서만 과세됩니다.",
              },
              {
                q: "필요경비로 인정되는 항목은 무엇인가요?",
                a: "취득 시 납부한 취득세, 법무사 비용, 중개수수료, 자본적 지출(발코니 확장·보일러 교체 등 구조 변경 공사비)이 필요경비로 인정됩니다. 단순 수선·유지비는 인정되지 않습니다.",
              },
              {
                q: "양도소득세 신고 기한은 언제인가요?",
                a: "잔금 수령일이 속한 달의 말일로부터 2개월 이내에 신고·납부해야 합니다. 예를 들어 3월 15일에 잔금을 받았다면 5월 31일까지 신고해야 합니다.",
              },
              {
                q: "일시적 2주택자는 양도세 중과를 피할 수 있나요?",
                a: "신규 주택 취득 후 3년 이내에 기존 주택을 처분하면 일시적 2주택으로 인정되어 1주택자 세율이 적용됩니다. 기간 내 처분하지 못하면 소급하여 중과세율이 적용될 수 있습니다.",
              },
              {
                q: "장기보유특별공제는 다주택자도 받을 수 있나요?",
                a: "조정대상지역 내 다주택자는 장기보유특별공제가 배제됩니다. 비조정지역 다주택자는 일반 공제율(최대 30%)이 적용됩니다.",
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
