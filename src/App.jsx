import { useState, useCallback, useMemo, useEffect } from "react";

const C = {
  primary: "#005EB8",
  primaryDark: "#003F7F",
  primaryLight: "#E8F0F9",
  primaryMid: "#1E88E5",
  accent: "#F26522",
  accentDark: "#D4510E",
  accentLight: "#FFF3EB",
  wood: "#D2B48C",
  woodDark: "#A88A5F",
  woodLight: "#F5EDE0",
  chasBlue: "#1565C0",
  chasOrange: "#E65100",
  chasGreen: "#2E7D32",
  white: "#FFFFFF",
  pageBg: "#F7FAFC",
  cardBg: "#FFFFFF",
  gray50: "#F5F7FA",
  gray100: "#EEF1F5",
  gray200: "#DFE3E8",
  gray300: "#C4CDD5",
  gray400: "#919EAB",
  gray500: "#637381",
  gray600: "#454F5B",
  gray700: "#333D47",
  gray800: "#1C252E",
  teal: "#00897B",
  tealLight: "#E0F2F1",
  hsgGreen: "#1B5E20",
  hsgGreenLight: "#E8F5E9",
  hsgGreenMid: "#43A047",
  govRed: "#CF1F2B",
  singpassRed: "#B71C1C",
  shadow: "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)",
  shadowMd: "0 4px 12px rgba(0,0,0,0.08)",
  shadowLg: "0 8px 24px rgba(0,0,0,0.10)",
};


const HSG_VAX_FEES = {
  hepB:      { enrolled: 0, pg: 9,  mgBlueOrange: 19, greenNon: 38 },
  hpv:       { enrolled: 0, pg: null, mgBlueOrange: 23, greenNon: 45 },
  influenza: { enrolled: 0, pg: 9,  mgBlueOrange: 18, greenNon: 35 },
  mmr:       { enrolled: 0, pg: 9,  mgBlueOrange: 19, greenNon: 38 },
  pcv13:     { enrolled: 0, pg: 16, mgBlueOrange: 31, greenNon: 63 },
  pcv20:     { enrolled: 0, pg: 17, mgBlueOrange: 34, greenNon: 68 },
  ppsv23:    { enrolled: 0, pg: 11, mgBlueOrange: 22, greenNon: 43 },
  shingrix:  { enrolled: null, pg: 38, mgBlueOrange: 75, greenNon: 150 },
  tdap:      { enrolled: 0, pg: null, mgBlueOrange: 20, greenNon: 40 },
  varicella: { enrolled: 0, pg: 11, mgBlueOrange: 23, greenNon: 45 },
};

const TIERS = {
  blue: {
    label: "Blue", bg: "#1565C0", textColor: "#FFF", incomeRange: "≤ $1,500",
    desc: "Household monthly income per person ≤ $1,500",
    medical: { commonIllness: { perVisit: 18.5, maxVisits: 24 }, chronicSimple: { perVisit: 80, annualCap: 320 }, chronicComplex: { perVisit: 125, annualCap: 500 }, screening: { fee: 2, label: "$2 per screening visit" } },
    hsgChronic: { medSubsidy: "Up to 87.5%", medCap: "No dollar cap", svcPerVisit: 125, svcAnnualCap: 500 },
    dental: { consultation: 20.5, extractionAnterior: 28.5, extractionPosterior: 68.5, fillingSimple: 30, fillingComplex: 50, dentureComplete: 408.5, denturePartialSimple: 304, denturePartialComplex: 385.5, dentureRepair: 75, crown: 615, recementation: 35, rootCanalAnterior: 326, rootCanalPremolar: 462.5, rootCanalMolar: 584.5, polishing: 20.5, scaling: 30, fluoride: 20.5, xray: 11 },
  },
  orange: {
    label: "Orange", bg: "#E65100", textColor: "#FFF", incomeRange: "$1,501 – $2,300",
    desc: "Household monthly income per person $1,501 – $2,300",
    medical: { commonIllness: { perVisit: 10, maxVisits: 24 }, chronicSimple: { perVisit: 50, annualCap: 200 }, chronicComplex: { perVisit: 80, annualCap: 320 }, screening: { fee: 2, label: "$2 per screening visit" } },
    hsgChronic: { medSubsidy: "Up to 87.5%", medCap: "No dollar cap", svcPerVisit: 80, svcAnnualCap: 320 },
    dental: { consultation: 13.5, extractionAnterior: 19, extractionPosterior: 45.5, fillingSimple: 20, fillingComplex: 33.5, dentureComplete: 272.5, denturePartialSimple: 202.5, denturePartialComplex: 257, dentureRepair: 50, crown: 410, recementation: 23.5, rootCanalAnterior: 217.5, rootCanalPremolar: 308.5, rootCanalMolar: 389.5, polishing: 13.5, scaling: 20, fluoride: 13.5, xray: 7.5 },
  },
  green: {
    label: "Green", bg: "#2E7D32", textColor: "#FFF", incomeRange: "> $2,300",
    desc: "Household monthly income per person > $2,300",
    medical: { commonIllness: null, chronicSimple: { perVisit: 28, annualCap: 112 }, chronicComplex: { perVisit: 40, annualCap: 160 }, screening: { fee: 5, label: "$5 per screening visit" } },
    hsgChronic: { medSubsidy: "Up to 50%", medCap: "No dollar cap", svcPerVisit: 40, svcAnnualCap: 160 },
    dental: { consultation: null, extractionAnterior: null, extractionPosterior: null, fillingSimple: null, fillingComplex: null, dentureComplete: 170.5, denturePartialSimple: 65.5, denturePartialComplex: 140, dentureRepair: 50, crown: 84.5, recementation: null, rootCanalAnterior: 109.5, rootCanalPremolar: 140, rootCanalMolar: 170.5, polishing: null, scaling: null, fluoride: null, xray: null },
  },
  mg: {
    label: "Merdeka Generation", bg: "#6D1A36", textColor: "#FFF", incomeRange: "MG Senior",
    desc: "Merdeka Generation senior — enhanced CHAS subsidies",
    medical: { commonIllness: { perVisit: 23.5, maxVisits: 24 }, chronicSimple: { perVisit: 85, annualCap: 340 }, chronicComplex: { perVisit: 130, annualCap: 520 }, screening: { fee: 2, label: "$2 per screening visit" } },
    hsgChronic: { medSubsidy: "Up to 87.5%", medCap: "No dollar cap", svcPerVisit: 130, svcAnnualCap: 520 },
    dental: { consultation: 25.5, extractionAnterior: 33.5, extractionPosterior: 73.5, fillingSimple: 35, fillingComplex: 55, dentureComplete: 413.5, denturePartialSimple: 309, denturePartialComplex: 390.5, dentureRepair: 80, crown: 620, recementation: 40, rootCanalAnterior: 331, rootCanalPremolar: 467.5, rootCanalMolar: 589.5, polishing: 25.5, scaling: 35, fluoride: 25.5, xray: 16 },
  },
  pg: {
    label: "Pioneer Generation", bg: "#8B6914", textColor: "#FFF", incomeRange: "PG Senior",
    desc: "Pioneer Generation senior — highest CHAS subsidies",
    medical: { commonIllness: { perVisit: 28.5, maxVisits: 24 }, chronicSimple: { perVisit: 90, annualCap: 360 }, chronicComplex: { perVisit: 135, annualCap: 540 }, screening: { fee: 0, label: "Free for PG seniors" } },
    hsgChronic: { medSubsidy: "Up to 87.5%", medCap: "No dollar cap", svcPerVisit: 135, svcAnnualCap: 540 },
    dental: { consultation: 30.5, extractionAnterior: 38.5, extractionPosterior: 78.5, fillingSimple: 40, fillingComplex: 60, dentureComplete: 418.5, denturePartialSimple: 314, denturePartialComplex: 395.5, dentureRepair: 85, crown: 625, recementation: 45, rootCanalAnterior: 336, rootCanalPremolar: 472.5, rootCanalMolar: 594.5, polishing: 30.5, scaling: 40, fluoride: 30.5, xray: 21 },
  },
  pa: {
    label: "Public Assistance", bg: "#37474F", textColor: "#FFF", incomeRange: "PA Cardholder",
    desc: "ComCare Long-Term Assistance (Public Assistance) — full subsidies",
    medical: { commonIllness: { perVisit: 30, maxVisits: 24 }, chronicSimple: { perVisit: 100, annualCap: 400 }, chronicComplex: { perVisit: 150, annualCap: 600 }, screening: { fee: 0, label: "Free for PA cardholders" } },
    hsgChronic: { medSubsidy: "Up to 87.5%", medCap: "No dollar cap", svcPerVisit: 150, svcAnnualCap: 600 },
    dental: { consultation: 35, extractionAnterior: 70, extractionPosterior: 150, fillingSimple: 60, fillingComplex: 100, dentureComplete: 650, denturePartialSimple: 450, denturePartialComplex: 550, dentureRepair: 120, crown: 900, recementation: 60, rootCanalAnterior: 500, rootCanalPremolar: 700, rootCanalMolar: 900, polishing: 40, scaling: 60, fluoride: 35, xray: 25 },
  },
};

const DENTAL_SERVICES = [
  { key: "consultation", name: "Consultation", limit: "Up to 2/yr", cat: "preventive", cost: 35 },
  { key: "scaling", name: "Scaling", limit: "Up to 2/yr", cat: "preventive", cost: 60 },
  { key: "polishing", name: "Polishing", limit: "Up to 2/yr", cat: "preventive", cost: 40 },
  { key: "fluoride", name: "Topical fluoride", limit: "Up to 2/yr", cat: "preventive", cost: 35 },
  { key: "xray", name: "X-Ray", limit: "Up to 6/yr", cat: "preventive", cost: 25 },
  { key: "extractionAnterior", name: "Extraction (anterior)", limit: "Up to 4/yr", cat: "surgical", cost: 70 },
  { key: "extractionPosterior", name: "Extraction (posterior)", limit: "Up to 4/yr", cat: "surgical", cost: 150 },
  { key: "fillingSimple", name: "Filling (simple)", limit: "Up to 6/yr", cat: "restorative", cost: 60 },
  { key: "fillingComplex", name: "Filling (complex)", limit: "Up to 6/yr", cat: "restorative", cost: 100 },
  { key: "crown", name: "Permanent crown", limit: "Up to 4/yr", cat: "restorative", cost: 900 },
  { key: "recementation", name: "Re-cementation", limit: "Up to 2/yr", cat: "restorative", cost: 60 },
  { key: "rootCanalAnterior", name: "Root canal (anterior)", limit: "Up to 2/yr", cat: "restorative", cost: 500 },
  { key: "rootCanalPremolar", name: "Root canal (pre-molar)", limit: "Up to 2/yr", cat: "restorative", cost: 700 },
  { key: "rootCanalMolar", name: "Root canal (molar)", limit: "Up to 2/yr", cat: "restorative", cost: 900 },
  { key: "dentureComplete", name: "Denture, complete", limit: "1 upper + 1 lower per 3 yrs", cat: "denture", cost: 650 },
  { key: "denturePartialSimple", name: "Denture, partial simple", limit: "1 upper + 1 lower per 3 yrs", cat: "denture", cost: 450 },
  { key: "denturePartialComplex", name: "Denture, partial complex", limit: "1 upper + 1 lower per 3 yrs", cat: "denture", cost: 550 },
  { key: "dentureRepair", name: "Denture reline/repair", limit: "1 upper + 1 lower per yr", cat: "denture", cost: 120 },
];

const getTier = (profile) => {
  if (profile.tierOverride) return profile.tierOverride;
  const inc = profile.income || 0;
  return inc <= 1500 ? "blue" : inc <= 2300 ? "orange" : "green";
};
const getAge = (dob) => { const t = new Date(2026, 3, 13), b = new Date(dob); let a = t.getFullYear() - b.getFullYear(); const m = t.getMonth() - b.getMonth(); if (m < 0 || (m === 0 && t.getDate() < b.getDate())) a--; return a; };

function getScreenings(age, gender) {
  const l = [];
  if (age >= 18) l.push({ name: "Cardiovascular Risk Assessment", desc: "Diabetes, hypertension, high cholesterol, obesity", eligible: true, frequency: "Every 3 years", nextDue: "Available now", icon: "heart", isFlatFee: true });
  if (gender === "female" && age >= 25 && age <= 69) l.push({ name: "Cervical Cancer Screening", desc: "Pap smear or HPV test", eligible: true, frequency: "Every 3–5 years", nextDue: "Available now", icon: "shield", isFlatFee: true });
  if (age >= 50) l.push({ name: "Colorectal Cancer Screening (FIT)", desc: "Faecal Immunochemical Test for early detection", eligible: true, frequency: "Annually", nextDue: "Available now", icon: "search", isFlatFee: true });
  if (gender === "female" && age >= 50 && age <= 69) l.push({ name: "Breast Cancer Screening", desc: "Mammogram at selected polyclinics", eligible: true, frequency: "Every 2 years", nextDue: "Available now", icon: "ribbon", isBreast: true, breastFee: 50, breastHsgFee: 0 });
  else if (gender === "female" && age >= 40 && age < 50) l.push({ name: "Breast Cancer Screening", desc: "Mammogram at selected polyclinics", eligible: true, frequency: "Annually", nextDue: "Available now", icon: "ribbon", isBreast: true, breastFee: 50, breastHsgFee: 0 });
  return l;
}

function getVaccinations(age, gender) {
  const l = [];
  if (age >= 18) l.push({ name: "Influenza (Flu)", desc: "Annual flu vaccination", feeKey: "influenza", typicalCost: 40, eligible: true, nextDue: "2026-04-15", doses: "1 dose annually", icon: "syringe" });
  if (age >= 65) {
    l.push({ name: "Pneumococcal (PCV20)", desc: "Protects against pneumococcal disease", feeKey: "pcv20", typicalCost: 150, eligible: true, nextDue: "Available now", doses: "1 dose", icon: "syringe" });
    l.push({ name: "Pneumococcal (PPSV23)", desc: "Additional pneumonia protection", feeKey: "ppsv23", typicalCost: 80, eligible: true, nextDue: "Available now", doses: "1+ doses", icon: "syringe" });
  } else if (age >= 18) l.push({ name: "Pneumococcal (PCV13)", desc: "Pneumonia protection (medical conditions)", feeKey: "pcv13", typicalCost: 120, eligible: false, nextDue: "Consult doctor", doses: "1 dose", icon: "syringe", note: "For specific medical conditions" });
  if (age >= 60) l.push({ name: "Shingles (Shingrix)", desc: "Recombinant herpes zoster vaccine", feeKey: "shingrix", typicalCost: 400, eligible: true, nextDue: "Available now", doses: "2 doses", icon: "shield", note: "Fee cap applies even for HSG enrollees" });
  if (age >= 18) l.push({ name: "Tdap", desc: "Tetanus, diphtheria, and pertussis", feeKey: "tdap", typicalCost: 60, eligible: true, nextDue: "Consult doctor", doses: gender === "female" ? "1 dose; each pregnancy" : "1 dose", icon: "syringe" });
  if (gender === "female" && age >= 18 && age <= 26) l.push({ name: "HPV", desc: "Protects against HPV-related cancers", feeKey: "hpv", typicalCost: 180, eligible: true, nextDue: "Available now", doses: "3 doses", icon: "shield" });
  if (age >= 18) {
    l.push({ name: "Hepatitis B", desc: "Protection against hepatitis B", feeKey: "hepB", typicalCost: 50, eligible: true, nextDue: "Consult doctor", doses: "3 doses", icon: "syringe" });
    l.push({ name: "MMR", desc: "Measles, mumps, and rubella", feeKey: "mmr", typicalCost: 50, eligible: true, nextDue: "Consult doctor", doses: "2 doses", icon: "syringe" });
    l.push({ name: "Varicella", desc: "Chickenpox protection", feeKey: "varicella", typicalCost: 65, eligible: true, nextDue: "Consult doctor", doses: "2 doses", icon: "syringe" });
    l.push({ name: "COVID-19 Booster", desc: "Updated COVID-19 vaccine", feeKey: null, typicalCost: 0, eligible: true, nextDue: "Annually", doses: "1 dose (2025/2026)", icon: "syringe", isFree: true, note: "Free under National Vaccination Programme" });
  }
  return l;
}

const Ico = {
  syringe: ({s=20,c="currentColor"}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m18 2 4 4"/><path d="m17 7 3-3"/><path d="M19 9 8.7 19.3c-1 1-2.5 1-3.4 0l-.6-.6c-1-1-1-2.5 0-3.4L15 5"/><path d="m9 11 4 4"/><path d="m5 19-3 3"/><path d="m14 4 6 6"/></svg>,
  heart: ({s=20,c="currentColor"}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>,
  shield: ({s=20,c="currentColor"}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/></svg>,
  search: ({s=20,c="currentColor"}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>,
  ribbon: ({s=20,c="currentColor"}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a5 5 0 0 0-5 5c0 3.5 3 6.5 5 8.5 2-2 5-5 5-8.5a5 5 0 0 0-5-5z"/><path d="M7 13.4V22l5-3 5 3v-8.6"/></svg>,
  check: ({s=18,c=C.hsgGreen}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>,
  info: ({s=16,c=C.gray400}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>,
  logout: ({s=20,c="currentColor"}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16,17 21,12 16,7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  medical: ({s=20,c="currentColor"}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 2v4"/><path d="M16 2v4"/><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M9 14h6"/><path d="M12 11v6"/></svg>,
  tooth: ({s=20,c="currentColor"}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2C9.5 2 7 3.5 7 6c0 1.5.5 2.8 1 4 .8 2 1.2 4 1 6 0 1.5.5 4 3 4s3-2.5 3-4c-.2-2 .2-4 1-6 .5-1.2 1-2.5 1-4 0-2.5-2.5-4-5-4z"/></svg>,
  leaf: ({s=20,c="currentColor"}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.9C15.5 4.9 17 3.5 19 2c1 2 2 4.5 2 8 0 5.5-4.5 10-10 10Z"/><path d="M2 21c0-3 1.9-5.8 4.5-7.3"/></svg>,
};

function HsgBadge({ small }) {
  return <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: small ? 10 : 11, fontWeight: 700, padding: small ? "2px 6px" : "3px 8px", borderRadius: 4, background: C.hsgGreenLight, color: C.hsgGreen }}><Ico.leaf s={small ? 10 : 12} c={C.hsgGreen}/>HSG</span>;
}

function Toggle({ checked, onChange }) {
  return (
    <div onClick={onChange} style={{ width: 44, height: 24, borderRadius: 12, background: checked ? C.hsgGreen : C.gray300, position: "relative", transition: "background 0.2s", cursor: "pointer", flexShrink: 0 }}>
      <div style={{ width: 20, height: 20, borderRadius: "50%", background: C.white, position: "absolute", top: 2, left: checked ? 22 : 2, transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }}/>
    </div>
  );
}

function GovMasthead() {
  return (
    <div style={{ background: C.gray50, borderBottom: `1px solid ${C.gray200}`, padding: "6px 0", fontSize: 16, color: C.gray500 }}>
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 20px", display: "flex", alignItems: "center", gap: 8 }}>
        <svg width="14" height="14" viewBox="0 0 32 32"><circle cx="16" cy="20" r="6" fill="none" stroke={C.govRed} strokeWidth="1.5"/><path d="M13 20c0-1.7 1.3-3 3-3s3 1.3 3 3" fill="none" stroke={C.govRed} strokeWidth="1"/></svg>
        <span>A Singapore Government Agency Website</span>
      </div>
    </div>
  );
}

function AppHeader({ isLoggedIn, onLogout, title = "MOH Subsidy Advisor", subtitle = "Ministry of Health" }) {
  return (
    <div style={{ background: C.primary, position: "sticky", top: 0, zIndex: 100, boxShadow: C.shadowMd }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "12px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 42, height: 42, borderRadius: 10, background: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", padding: 3, boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
            <img src={LOGO_IMG} alt="Logo" style={{ width: "100%", height: "100%", objectFit: "contain" }}/>
          </div>
          <div><div style={{ fontWeight: 700, fontSize: 18, color: "#FFF", letterSpacing: -0.2 }}>{title}</div><div style={{ fontSize: 13, color: "rgba(255,255,255,0.75)" }}>{subtitle}</div></div>
        </div>
        {isLoggedIn && <button onClick={onLogout} style={{ background: "rgba(255,255,255,0.15)", border: "none", color: "rgba(255,255,255,0.9)", cursor: "pointer", padding: "9px 12px", borderRadius: 8, display: "flex", alignItems: "center", gap: 6, fontSize: 14, fontWeight: 600 }}><Ico.logout s={16} c="rgba(255,255,255,0.9)"/>Logout</button>}
      </div>
    </div>
  );
}

function Footer() {
  return (
    <footer style={{ background: C.gray800, color: C.gray400, marginTop: "auto" }}>
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "32px 20px 20px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 24, marginBottom: 24 }}>
          {[["About","About MOH,Contact Us,Feedback"],["Resources","CHAS Subsidies,HealthierSG,Vaccination Info"],["Links","HealthHub,Singpass,gov.sg"]].map(([t,items])=>(
            <div key={t}><div style={{ fontWeight: 600, fontSize: 16, color: "rgba(255,255,255,0.6)", marginBottom: 10, textTransform: "uppercase", letterSpacing: 1 }}>{t}</div><div style={{ fontSize: 17, lineHeight: 2.2 }}>{items.split(",").map(i=><div key={i} style={{ cursor: "pointer" }}>{i}</div>)}</div></div>
          ))}
        </div>
        <div style={{ borderTop: `1px solid ${C.gray700}`, paddingTop: 16, fontSize: 16, color: C.gray500, textAlign: "center" }}>
          <div>Last updated: 13 Apr 2026</div>
          <div style={{ marginTop: 6, fontSize: 15, color: C.gray600 }}>Demo application for educational purposes. Not affiliated with the Singapore Government.</div>
        </div>
      </div>
    </footer>
  );
}

const LOGO_IMG = "data:image/jpeg;base64,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";

function useIsDesktop(breakpoint = 768) {
  const [isDesktop, setIsDesktop] = useState(typeof window !== "undefined" ? window.innerWidth >= breakpoint : true);
  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= breakpoint);
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [breakpoint]);
  return isDesktop;
}

function LandingPage({ onLogin }) {
  const isDesktop = useIsDesktop();
  const LockIcon = ({s=18,c="#FFF"}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>;
  const ArrowIcon = ({s=18,c="#FFF"}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>;

  return (
    <div style={{ flex: 1, background: C.white }}>
      {/* Hero Banner */}
      <div style={{
        background: `linear-gradient(135deg, ${C.primaryLight} 0%, #FFFFFF 45%, ${C.woodLight} 100%)`,
        position: "relative",
        overflow: "hidden",
        borderBottom: `1px solid ${C.gray100}`,
      }}>
        {/* Decorative shapes */}
        <div aria-hidden style={{ position: "absolute", top: -80, right: -80, width: 260, height: 260, borderRadius: "50%", background: `${C.primary}0A`, pointerEvents: "none" }}/>
        <div aria-hidden style={{ position: "absolute", bottom: -100, left: -60, width: 220, height: 220, borderRadius: "50%", background: `${C.wood}26`, pointerEvents: "none" }}/>

        {/* Top nav bar within hero */}
        <div style={{
          position: "relative",
          maxWidth: 1200, margin: "0 auto",
          padding: isDesktop ? "20px 32px" : "14px 18px",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          gap: 12,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
            <img src={LOGO_IMG} alt="MOH Subsidy Advisor" style={{ width: 44, height: 48, objectFit: "contain", flexShrink: 0 }}/>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontWeight: 700, fontSize: isDesktop ? 18 : 16, color: C.gray800, letterSpacing: -0.2, lineHeight: 1.2 }}>MOH Subsidy Advisor</div>
              <div style={{ fontSize: isDesktop ? 14 : 12, color: C.gray500, lineHeight: 1.3 }}>Ministry of Health · Singapore</div>
            </div>
          </div>
          <button onClick={onLogin} style={{
            background: C.primary, color: "#FFF", border: "none",
            padding: isDesktop ? "12px 22px" : "11px 18px",
            borderRadius: 10, fontWeight: 700, fontSize: isDesktop ? 16 : 15,
            cursor: "pointer", boxShadow: "0 2px 8px rgba(0,94,184,0.25)",
            display: "inline-flex", alignItems: "center", gap: 8,
            whiteSpace: "nowrap",
            transition: "transform 0.15s, box-shadow 0.15s",
          }}
          onMouseDown={e => e.currentTarget.style.transform = "scale(0.97)"}
          onMouseUp={e => e.currentTarget.style.transform = "scale(1)"}>
            <LockIcon s={18}/>
            Login
          </button>
        </div>

        {/* Hero content */}
        <div style={{
          position: "relative",
          maxWidth: 1200, margin: "0 auto",
          padding: isDesktop ? "60px 32px 90px" : "32px 20px 56px",
          display: "grid",
          gridTemplateColumns: isDesktop ? "1.15fr 1fr" : "1fr",
          gap: isDesktop ? 56 : 32,
          alignItems: "center",
        }}>
          {/* Text column */}
          <div style={{ textAlign: isDesktop ? "left" : "center" }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: C.woodLight, color: C.woodDark,
              padding: "7px 16px", borderRadius: 999,
              fontSize: 14, fontWeight: 700,
              marginBottom: 22,
              border: `1px solid ${C.wood}66`,
            }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: C.hsgGreen }}/>
              For Singapore Residents & Permanent Residents
            </div>
            <h1 style={{
              fontSize: isDesktop ? 48 : 32,
              fontWeight: 800, color: C.gray800,
              letterSpacing: -0.8, lineHeight: 1.1,
              margin: "0 0 18px",
            }}>
              Simplifying Your <span style={{ color: C.primary }}>Healthcare&nbsp;Subsidies</span>
            </h1>
            <p style={{
              fontSize: isDesktop ? 19 : 17, color: C.gray600,
              lineHeight: 1.6, margin: "0 0 32px",
              maxWidth: isDesktop ? 540 : "100%",
              marginLeft: isDesktop ? 0 : "auto",
              marginRight: isDesktop ? 0 : "auto",
            }}>
              Check your CHAS tier, medical & dental subsidies, HealthierSG benefits, and eligibility for screenings and vaccinations — all in one secure place.
            </p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: isDesktop ? "flex-start" : "center", marginBottom: isDesktop ? 0 : 8 }}>
              <button onClick={onLogin} style={{
                background: C.primary, color: "#FFF", border: "none",
                padding: "16px 30px", borderRadius: 12,
                fontWeight: 700, fontSize: 17,
                cursor: "pointer", boxShadow: "0 4px 16px rgba(0,94,184,0.3)",
                display: "inline-flex", alignItems: "center", gap: 10,
                transition: "transform 0.15s, box-shadow 0.15s",
              }}
              onMouseDown={e => e.currentTarget.style.transform = "scale(0.97)"}
              onMouseUp={e => e.currentTarget.style.transform = "scale(1)"}>
                <LockIcon s={20}/>
                Get Started with Singpass
                <ArrowIcon s={18}/>
              </button>
            </div>
            {/* Trust indicators */}
            <div style={{
              marginTop: 28,
              display: "flex", gap: 20, flexWrap: "wrap",
              justifyContent: isDesktop ? "flex-start" : "center",
            }}>
              {[
                ["Official", "Ministry of Health"],
                ["Secure", "Singpass-protected"],
                ["Free", "No charge to use"],
              ].map(([label, sub]) => (
                <div key={label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Ico.check s={18} c={C.hsgGreen}/>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: C.gray800, lineHeight: 1.2 }}>{label}</div>
                    <div style={{ fontSize: 13, color: C.gray500, lineHeight: 1.2 }}>{sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Logo/visual column */}
          <div style={{
            display: "flex", justifyContent: "center", alignItems: "center",
            position: "relative",
          }}>
            <div style={{
              position: "relative",
              width: isDesktop ? 340 : 220, height: isDesktop ? 340 : 220,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              {/* Decorative rings */}
              <div aria-hidden style={{ position: "absolute", inset: 0, borderRadius: "50%", background: `${C.primaryLight}`, opacity: 0.6 }}/>
              <div aria-hidden style={{ position: "absolute", inset: isDesktop ? 28 : 18, borderRadius: "50%", background: C.white, boxShadow: C.shadowMd }}/>
              {/* Logo */}
              <img src={LOGO_IMG} alt="MOH Subsidy Advisor"
                style={{
                  position: "relative",
                  width: isDesktop ? 220 : 150, height: "auto",
                  objectFit: "contain",
                  filter: "drop-shadow(0 6px 18px rgba(0,94,184,0.2))",
                }}/>
            </div>
          </div>
        </div>
      </div>

      {/* Feature cards section */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: isDesktop ? "56px 32px 64px" : "36px 20px 48px" }}>
        <div style={{ textAlign: "center", marginBottom: isDesktop ? 36 : 24 }}>
          <div style={{ fontSize: isDesktop ? 14 : 13, fontWeight: 700, color: C.primary, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 8 }}>What you can check</div>
          <h2 style={{ fontSize: isDesktop ? 28 : 22, fontWeight: 700, color: C.gray800, margin: 0, letterSpacing: -0.3 }}>Everything you need in one place</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fit, minmax(${isDesktop ? 220 : 160}px, 1fr))`, gap: isDesktop ? 20 : 14 }}>
          {[
            { title: "CHAS Tier", desc: "Blue, Orange or Green tier based on household income.", ico: "wallet", color: C.primary },
            { title: "Medical & Dental", desc: "Per-visit subsidies for illnesses, chronic conditions, and dental.", ico: "medical", color: C.accent },
            { title: "Screenings", desc: "Nationally subsidised screenings by age and gender.", ico: "clipboard", color: C.teal },
            { title: "Vaccinations", desc: "NAIS vaccines and subsidy amounts at CHAS clinics.", ico: "vaccine", color: C.primaryMid },
          ].map((item, i) => (
            <div key={i} style={{
              background: C.white, borderRadius: 14,
              padding: isDesktop ? 20 : 16,
              boxShadow: C.shadow, border: `1px solid ${C.gray100}`,
              cursor: "default",
              transition: "transform 0.15s, box-shadow 0.15s",
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = C.shadowMd; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = C.shadow; }}>
              <div style={{ width: 44, height: 44, borderRadius: 10, background: `${item.color}14`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
                {item.ico === "wallet" && <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={item.color} strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2"/><path d="M1 10h22"/></svg>}
                {item.ico === "medical" && <Ico.medical s={20} c={item.color}/>}
                {item.ico === "clipboard" && <Ico.search s={20} c={item.color}/>}
                {item.ico === "vaccine" && <Ico.syringe s={20} c={item.color}/>}
              </div>
              <h3 style={{ fontSize: 17, fontWeight: 700, color: C.gray800, marginBottom: 6, marginTop: 0 }}>{item.title}</h3>
              <p style={{ fontSize: 15, color: C.gray600, lineHeight: 1.55, margin: 0 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const PROFILES = [
  { name: "TAN AH KOW", nric: "S1234567A", dob: "1965-03-15", gender: "male", income: 1200 },
  { name: "LIM MEI LING", nric: "S8876543B", dob: "1988-07-22", gender: "female", income: 3200 },
  { name: "WONG KAI MING", nric: "S5512345C", dob: "1955-11-08", gender: "male", income: 800 },
  { name: "SARAH TAN", nric: "S9987654D", dob: "1999-01-30", gender: "female", income: 2000 },
  { name: "CHAN HUI YING", nric: "S7712345E", dob: "1977-06-18", gender: "female", income: 1400, isNonChas: true },
  { name: "ONG CHEE KEONG", nric: "S5098765F", dob: "1950-04-12", gender: "male", income: 900, tierOverride: "mg" },
  { name: "LEE SOO HUA", nric: "S4512345G", dob: "1943-09-25", gender: "female", income: 600, tierOverride: "pg" },
  { name: "AHMAD BIN HASSAN", nric: "S6087654H", dob: "1960-12-03", gender: "male", income: 0, tierOverride: "pa" },
];

function SingpassModal({ onClose, onAuth }) {
  const [sel, setSel] = useState(0);
  const [custom, setCustom] = useState(false);
  const [form, setForm] = useState({ name: "TAN AH KOW", nric: "S1234567A", dob: "1965-03-15", gender: "male", income: 1200 });
  const [loading, setLoading] = useState(false);
  const go = () => { setLoading(true); setTimeout(() => onAuth(custom ? form : PROFILES[sel]), 1500); };
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,30,50,0.6)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20, backdropFilter: "blur(4px)" }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ background: C.white, borderRadius: 20, width: "100%", maxWidth: 420, maxHeight: "90vh", overflow: "auto", boxShadow: C.shadowLg }}>
        <div style={{ background: C.primary, borderRadius: "20px 20px 0 0", padding: "22px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4" fill="none" stroke="white" strokeWidth="2"/></svg>
            </div>
            <div><div style={{ fontWeight: 700, fontSize: 20, color: "#FFF" }}>Singpass</div><div style={{ fontSize: 15, color: "rgba(255,255,255,0.65)" }}>Demo Authentication</div></div>
          </div>
          <button onClick={onClose} style={{ background: "rgba(255,255,255,0.1)", border: "none", fontSize: 22, cursor: "pointer", color: "rgba(255,255,255,0.7)", padding: "4px 8px", borderRadius: 6 }}>✕</button>
        </div>
        <div style={{ padding: 24 }}>
          {loading ? (
            <div style={{ textAlign: "center", padding: "44px 0" }}>
              <div style={{ width: 48, height: 48, border: `4px solid ${C.gray200}`, borderTopColor: C.accent, borderRadius: "50%", margin: "0 auto 16px", animation: "sp .8s linear infinite" }}/><style>{`@keyframes sp{to{transform:rotate(360deg)}}`}</style>
              <div style={{ fontWeight: 600, color: C.gray700 }}>Authenticating...</div><div style={{ fontSize: 17, color: C.gray400 }}>Retrieving Myinfo data</div>
            </div>
          ) : (<>
            <div style={{ display: "flex", borderRadius: 10, overflow: "hidden", border: `1px solid ${C.gray200}`, marginBottom: 20 }}>
              {["Demo profiles","Custom"].map((l,i) => <button key={i} onClick={() => setCustom(!!i)} style={{ flex: 1, padding: "11px 0", border: "none", cursor: "pointer", fontSize: 17, fontWeight: 600, background: custom === !!i ? C.primary : C.white, color: custom === !!i ? "#FFF" : C.gray500, transition: "all 0.15s" }}>{l}</button>)}
            </div>
            {!custom ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
                {PROFILES.map((p, i) => { const a = getAge(p.dob), t = getTier(p); const td = TIERS[t]; const badgeLabel = t === "mg" ? "Merdeka Gen" : t === "pg" ? "Pioneer Gen" : t === "pa" ? "PA Card" : `CHAS ${td.label}`; return (
                  <div key={i} onClick={() => setSel(i)} style={{ border: `2px solid ${sel === i ? C.primary : C.gray200}`, borderRadius: 12, padding: "12px 14px", cursor: "pointer", background: sel === i ? C.primaryLight : C.white, transition: "all 0.15s" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div><div style={{ fontWeight: 600, fontSize: 18, color: C.gray800 }}>{p.name}</div><div style={{ fontSize: 16, color: C.gray500 }}>{p.gender === "male" ? "M" : "F"}, {a} yrs</div></div>
                      {p.isNonChas ? (
                        <span style={{ fontSize: 14, fontWeight: 700, padding: "3px 10px", borderRadius: 6, background: C.gray100, color: C.gray600, border: `1px solid ${C.gray300}` }}>Not Enrolled</span>
                      ) : (
                        <span style={{ fontSize: 13, fontWeight: 700, padding: "3px 10px", borderRadius: 6, background: td.bg, color: "#FFF" }}>{badgeLabel}</span>
                      )}
                    </div>
                  </div>); })}
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 20 }}>
                <div><label style={{ fontSize: 16, fontWeight: 600, color: C.gray600, display: "block", marginBottom: 5 }}>Full name</label><input value={form.name} onChange={e => setForm({...form, name: e.target.value.toUpperCase()})} style={{ width: "100%", padding: "11px 14px", border: `1.5px solid ${C.gray200}`, borderRadius: 10, fontSize: 18, boxSizing: "border-box", outline: "none" }}/></div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div><label style={{ fontSize: 16, fontWeight: 600, color: C.gray600, display: "block", marginBottom: 5 }}>Date of birth</label><input type="date" value={form.dob} onChange={e => setForm({...form, dob: e.target.value})} style={{ width: "100%", padding: "11px 14px", border: `1.5px solid ${C.gray200}`, borderRadius: 10, fontSize: 18, boxSizing: "border-box" }}/></div>
                  <div><label style={{ fontSize: 16, fontWeight: 600, color: C.gray600, display: "block", marginBottom: 5 }}>Gender</label><select value={form.gender} onChange={e => setForm({...form, gender: e.target.value})} style={{ width: "100%", padding: "11px 14px", border: `1.5px solid ${C.gray200}`, borderRadius: 10, fontSize: 18, boxSizing: "border-box", background: C.white }}><option value="male">Male</option><option value="female">Female</option></select></div>
                </div>
                <div>
                  <label style={{ fontSize: 16, fontWeight: 600, color: C.gray600, display: "block", marginBottom: 5 }}>Income per person: <strong style={{ color: C.primary }}>${Number(form.income).toLocaleString()}</strong></label>
                  <input type="range" min="500" max="8000" step="100" value={form.income} onChange={e => setForm({...form, income: +e.target.value})} style={{ width: "100%", accentColor: C.primary }}/>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 15, color: C.gray400, marginTop: 2 }}><span>$500</span><span style={{ color: TIERS[getTier(form)].bg, fontWeight: 700 }}>CHAS {TIERS[getTier(form)].label}</span><span>$8,000</span></div>
                </div>
              </div>
            )}
            <button onClick={go} style={{ width: "100%", padding: "14px 0", background: C.accent, color: "#FFF", border: "none", borderRadius: 10, fontSize: 19, fontWeight: 600, cursor: "pointer", boxShadow: "0 2px 8px rgba(242,101,34,0.3)" }}>Log in</button>
            <div style={{ textAlign: "center", fontSize: 15, color: C.gray400, marginTop: 14 }}>Demo only. No real data transmitted.</div>
          </>)}
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, note, accent, typicalCost, subsidyAmt }) {
  return (
    <div style={{ padding: "10px 0", borderBottom: `1px solid ${C.gray100}` }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontSize: 17, color: C.gray700 }}>{label}</div>{note && <div style={{ fontSize: 15, color: C.gray400, marginTop: 2 }}>{note}</div>}</div>
        <div style={{ fontWeight: 600, fontSize: 17, color: accent || C.gray800, whiteSpace: "nowrap", marginLeft: 12 }}>{value}</div>
      </div>
      {typicalCost != null && (
        <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
          <span style={{ fontSize: 15, color: C.gray400, background: C.gray50, padding: "2px 8px", borderRadius: 4 }}>Typical ~${typicalCost}</span>
          {subsidyAmt != null && <span style={{ fontSize: 15, color: C.primary, background: C.primaryLight, padding: "2px 8px", borderRadius: 4 }}>Subsidy ${subsidyAmt}</span>}
        </div>
      )}
    </div>
  );
}

function HsgBanner({ enrolled }) {
  if (!enrolled) return (
    <div style={{ background: C.primaryLight, border: `1px solid ${C.gray200}`, borderRadius: 12, padding: "12px 14px", marginBottom: 16, display: "flex", gap: 10 }}>
      <Ico.info s={20} c={C.primaryMid}/><div style={{ fontSize: 17, color: C.gray600, lineHeight: 1.5 }}>Enable <strong style={{ color: C.primary }}>HealthierSG enrollment</strong> above to see enhanced benefits including fully-subsidised vaccinations and chronic medication subsidies.</div>
    </div>
  );
  return (
    <div style={{ background: C.hsgGreenLight, border: `1px solid #A5D6A7`, borderRadius: 12, padding: "14px", marginBottom: 16 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}><Ico.leaf s={20} c={C.hsgGreen}/><span style={{ fontWeight: 700, fontSize: 18, color: C.hsgGreen }}>HealthierSG benefits active</span></div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        {[["Vaccinations","$0 for most NAIS vaccines"],["Chronic meds","Up to 87.5% subsidy"],["Health Plan","Fully-subsidised consult"],["MediSave","No cash co-pay for CDMP"]].map(([t,d]) => (
          <div key={t} style={{ background: "rgba(255,255,255,0.8)", borderRadius: 8, padding: "8px 10px" }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: C.hsgGreen, marginBottom: 2 }}>{t}</div>
            <div style={{ fontSize: 15, color: C.gray600, lineHeight: 1.55 }}>{d}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MedicalTab({ tier, td, enrolled }) {
  const med = td.medical, hsg = td.hsgChronic;
  const tierLabel = ["mg","pg","pa"].includes(tier) ? td.label : `CHAS ${td.label}`;
  const medItems = [
    med.commonIllness ? { name: "Common Illnesses", desc: "Cough, cold, fever, and other acute conditions", detail: `Up to ${med.commonIllness.maxVisits} visits/yr`, subsidy: med.commonIllness.perVisit, typical: 30 } : null,
    { name: "Chronic Conditions (Simple)", desc: "Single chronic condition e.g. diabetes, hypertension", detail: `Annual cap: $${med.chronicSimple.annualCap}/yr`, subsidy: med.chronicSimple.perVisit, typical: 65 },
    { name: "Chronic Conditions (Complex)", desc: "Multiple chronic conditions or with complications", detail: `Annual cap: $${med.chronicComplex.annualCap}/yr`, subsidy: med.chronicComplex.perVisit, typical: 140 },
  ].filter(Boolean);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
        <Ico.medical s={20} c={C.gray600}/><span style={{ fontSize: 18, fontWeight: 600, color: C.gray700 }}>Medical subsidies</span>
        <span style={{ marginLeft: "auto", fontSize: 13, fontWeight: 700, padding: "3px 10px", borderRadius: 6, background: td.bg, color: "#FFF" }}>{tierLabel}</span>
      </div>
      {medItems.map((item, i) => {
        const youPay = Math.max(0, item.typical - item.subsidy);
        const isFree = youPay === 0;
        return (
          <div key={i} style={{ background: C.white, borderRadius: 14, boxShadow: C.shadow, border: "1.5px solid transparent", padding: "16px 20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div style={{ display: "flex", gap: 10, flex: 1 }}>
                <Ico.check s={18} c={C.primary}/>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 18, color: C.gray800 }}>{item.name}</div>
                  <div style={{ fontSize: 16, color: C.gray500, marginTop: 3 }}>{item.desc}</div>
                  <div style={{ fontSize: 16, color: C.gray400, marginTop: 3 }}>{item.detail}</div>
                  <div style={{ display: "flex", gap: 6, marginTop: 6, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 15, color: C.gray400, background: C.gray50, padding: "2px 8px", borderRadius: 4 }}>Typical ~${item.typical}</span>
                    <span style={{ fontSize: 15, color: C.primary, background: C.primaryLight, padding: "2px 8px", borderRadius: 4 }}>Subsidy ${item.subsidy}</span>
                  </div>
                </div>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0, marginLeft: 12 }}>
                <div style={{ fontSize: 14, color: C.gray400 }}>You pay</div>
                <div style={{ fontSize: 28, fontWeight: 700, color: isFree ? C.hsgGreen : C.primary }}>{isFree ? "FREE" : `~$${youPay.toFixed(0)}`}</div>
                <div style={{ fontSize: 13, color: C.gray400 }}>per visit</div>
              </div>
            </div>
          </div>
        );
      })}
      {!med.commonIllness && (
        <div style={{ background: C.white, borderRadius: 14, boxShadow: C.shadow, padding: "16px 20px", opacity: 0.6 }}>
          <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
            <Ico.info s={18} c={C.gray400}/>
            <div>
              <div style={{ fontWeight: 600, fontSize: 18, color: C.gray800 }}>Common Illnesses</div>
              <div style={{ fontSize: 16, color: C.gray500, marginTop: 3 }}>Not applicable for {tierLabel} cardholders</div>
            </div>
          </div>
        </div>
      )}
      {enrolled && (
        <div style={{ background: C.white, borderRadius: 14, border: `1.5px solid ${C.hsgGreenMid}`, overflow: "hidden", boxShadow: C.shadow }}>
          <div style={{ padding: "16px 20px", borderBottom: `1px solid ${C.hsgGreenLight}`, background: C.hsgGreenLight, display: "flex", alignItems: "center", gap: 8 }}>
            <Ico.leaf s={20} c={C.hsgGreen}/><span style={{ fontWeight: 700, fontSize: 18, color: C.hsgGreen }}>HealthierSG Chronic Tier</span><HsgBadge small/>
          </div>
          <div style={{ padding: "14px 20px 18px", fontSize: 17, color: C.gray600, lineHeight: 1.7 }}>
            <div style={{ marginBottom: 12 }}>Enhanced chronic medication subsidies at your enrolled GP clinic, at prices comparable to polyclinics.</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <div style={{ background: C.hsgGreenLight, borderRadius: 10, padding: "12px" }}>
                <div style={{ fontSize: 15, color: C.hsgGreen, fontWeight: 600 }}>Selected chronic meds</div>
                <div style={{ fontSize: 28, fontWeight: 700, color: C.hsgGreen, marginTop: 4 }}>{hsg.medSubsidy}</div>
                <div style={{ fontSize: 15, color: C.gray500 }}>{hsg.medCap}</div>
              </div>
              <div style={{ background: C.hsgGreenLight, borderRadius: 10, padding: "12px" }}>
                <div style={{ fontSize: 15, color: C.hsgGreen, fontWeight: 600 }}>Services & other meds</div>
                <div style={{ fontSize: 28, fontWeight: 700, color: C.hsgGreen, marginTop: 4 }}>${hsg.svcPerVisit}/visit</div>
                <div style={{ fontSize: 15, color: C.gray500 }}>Capped ${hsg.svcAnnualCap}/yr</div>
              </div>
            </div>
            <div style={{ fontSize: 16, color: C.gray500, fontStyle: "italic", marginTop: 10 }}>Choose CHAS or HSG Chronic Tier at each visit — whichever benefits you more.</div>
          </div>
        </div>
      )}
    </div>
  );
}

function DentalTab({ tier, td }) {
  const [df, setDf] = useState("all");
  const den = td.dental;
  const tierLabel = ["mg","pg","pa"].includes(tier) ? td.label : `CHAS ${td.label}`;
  const cats = { all: "All", preventive: "Preventive", surgical: "Surgical", restorative: "Restorative", denture: "Denture" };
  const filtered = DENTAL_SERVICES.filter(s => df === "all" || s.cat === df);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
        <Ico.tooth s={20} c={C.gray600}/><span style={{ fontSize: 18, fontWeight: 600, color: C.gray700 }}>Dental subsidies</span>
        <span style={{ marginLeft: "auto", fontSize: 13, fontWeight: 700, padding: "3px 10px", borderRadius: 6, background: td.bg, color: "#FFF" }}>{tierLabel}</span>
      </div>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 4 }}>
        {Object.entries(cats).map(([k, l]) => <button key={k} onClick={() => setDf(k)} style={{ padding: "5px 14px", borderRadius: 20, border: `1.5px solid ${df === k ? C.accent : C.gray200}`, background: df === k ? C.accentLight : C.white, color: df === k ? C.accent : C.gray500, fontSize: 16, fontWeight: 600, cursor: "pointer", transition: "all 0.15s" }}>{l}</button>)}
      </div>
      {filtered.map(s => {
        const sub = den[s.key];
        const eligible = sub != null;
        const youPay = eligible ? Math.max(0, s.cost - sub) : null;
        const isFree = eligible && youPay === 0;
        return (
          <div key={s.key} style={{ background: C.white, borderRadius: 14, boxShadow: C.shadow, border: "1.5px solid transparent", padding: "16px 20px", opacity: eligible ? 1 : 0.6 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div style={{ display: "flex", gap: 10, flex: 1 }}>
                {eligible ? <Ico.check s={18} c={C.accent}/> : <Ico.info s={18} c={C.gray400}/>}
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 18, color: C.gray800 }}>{s.name}</div>
                  <div style={{ fontSize: 16, color: C.gray400, marginTop: 3 }}>{s.limit}</div>
                  {eligible && (
                    <div style={{ display: "flex", gap: 6, marginTop: 6, flexWrap: "wrap" }}>
                      <span style={{ fontSize: 15, color: C.gray400, background: C.gray50, padding: "2px 8px", borderRadius: 4 }}>Typical ~${s.cost}</span>
                      <span style={{ fontSize: 15, color: C.primary, background: C.primaryLight, padding: "2px 8px", borderRadius: 4 }}>Subsidy ${sub.toFixed(2)}</span>
                    </div>
                  )}
                </div>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0, marginLeft: 12 }}>
                {eligible ? (<>
                  <div style={{ fontSize: 14, color: C.gray400 }}>You pay</div>
                  <div style={{ fontSize: 28, fontWeight: 700, color: isFree ? C.hsgGreen : C.accent }}>{isFree ? "FREE" : `~$${youPay.toFixed(0)}`}</div>
                  <div style={{ fontSize: 13, color: C.gray400 }}>per procedure</div>
                </>) : (
                  <div style={{ fontSize: 15, fontWeight: 600, color: C.gray400 }}>Not eligible</div>
                )}
              </div>
            </div>
          </div>
        );
      })}
      {tier === "green" && (
        <div style={{ padding: "12px 16px", background: C.primaryLight, borderRadius: 12, fontSize: 15, color: C.gray600, display: "flex", gap: 8 }}>
          <Ico.info s={16} c={C.primaryMid}/>
          <span>CHAS Green cardholders are eligible for selected dental subsidies including dentures, crowns, and root canal treatments.</span>
        </div>
      )}
    </div>
  );
}

function VaxTab({ vaccinations, tier, enrolled, expandedCard, setExpanded }) {
  const eligible = vaccinations.filter(v => v.eligible);
  const feeCol = tier === "pg" ? "pg" : tier === "green" ? "greenNon" : "mgBlueOrange";
  const isPa = tier === "pa";
  return (<>
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
      <Ico.syringe s={20} c={C.gray600}/><span style={{ fontSize: 18, fontWeight: 600, color: C.gray700 }}>Available vaccinations</span>
      <span style={{ fontSize: 16, color: C.gray400, marginLeft: "auto" }}>{eligible.length} eligible</span>
    </div>
    {enrolled && (
      <div style={{ background: C.hsgGreenLight, borderRadius: 12, padding: "12px 16px", marginBottom: 12, display: "flex", gap: 8, boxShadow: C.shadow }}>
        <Ico.leaf s={16} c={C.hsgGreen}/>
        <div style={{ fontSize: 16, color: C.hsgGreen, lineHeight: 1.5 }}><strong>HealthierSG enrolled:</strong> $0 for most NAIS vaccines at your enrolled clinic.</div>
      </div>
    )}
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {vaccinations.map((v, i) => {
        const fees = v.feeKey ? HSG_VAX_FEES[v.feeKey] : null;
        const enrolledFee = fees?.enrolled;
        const regularFee = isPa ? 0 : fees ? fees[feeCol] : null;
        const showFree = v.isFree || isPa || (enrolled && enrolledFee === 0);
        const youPay = showFree ? 0 : (enrolled && enrolledFee != null) ? enrolledFee : regularFee;
        const feeDisplay = showFree ? "FREE" : youPay != null ? `$${youPay}` : "—";
        const subsidyAmt = v.typicalCost && youPay != null ? Math.max(0, v.typicalCost - youPay) : null;
        const expanded = expandedCard === `v-${i}`;
        return (
          <div key={i} onClick={() => setExpanded(expanded ? null : `v-${i}`)} style={{ background: C.white, borderRadius: 14, boxShadow: C.shadow, border: enrolled && enrolledFee === 0 ? `1.5px solid #A5D6A7` : "1.5px solid transparent", padding: "16px 20px", cursor: "pointer", opacity: v.eligible ? 1 : 0.6, transition: "box-shadow 0.15s" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div style={{ display: "flex", gap: 10, flex: 1 }}>
                <Ico.check s={18} c={showFree ? C.hsgGreen : v.eligible ? C.primaryMid : C.gray300}/>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}><span style={{ fontWeight: 600, fontSize: 18, color: C.gray800 }}>{v.name}</span>{enrolled && enrolledFee === 0 && <HsgBadge small/>}</div>
                  <div style={{ fontSize: 16, color: C.gray500, marginTop: 3 }}>{v.desc}</div>
                  <div style={{ fontSize: 16, color: C.gray400, marginTop: 3 }}>Next due: {v.nextDue}</div>
                  {v.eligible && v.typicalCost > 0 && (
                    <div style={{ display: "flex", gap: 6, marginTop: 6, flexWrap: "wrap" }}>
                      <span style={{ fontSize: 15, color: C.gray400, background: C.gray50, padding: "2px 8px", borderRadius: 4 }}>Typical ~${v.typicalCost}/dose</span>
                      {subsidyAmt != null && <span style={{ fontSize: 15, color: C.primary, background: C.primaryLight, padding: "2px 8px", borderRadius: 4 }}>Subsidy ~${subsidyAmt}</span>}
                    </div>
                  )}
                </div>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0, marginLeft: 12 }}>
                <div style={{ fontSize: 14, color: C.gray400 }}>You pay</div>
                <div style={{ fontSize: 28, fontWeight: 700, color: showFree ? C.hsgGreen : C.accent }}>{feeDisplay}</div>
                {!showFree && youPay != null && <div style={{ fontSize: 13, color: C.gray400 }}>per dose</div>}
              </div>
            </div>
            {expanded && (
              <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${C.gray100}`, fontSize: 17 }}>
                <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "6px 12px" }}>
                  {v.doses && <><span style={{ color: C.gray400 }}>Doses</span><span>{v.doses}</span></>}
                  <span style={{ color: C.gray400 }}>Where</span><span>CHAS GP clinics and polyclinics</span>
                  {fees && !enrolled && <><span style={{ color: C.gray400 }}>If HSG enrolled</span><span style={{ color: C.hsgGreen, fontWeight: 600 }}>{enrolledFee === 0 ? "$0 at enrolled clinic" : "Fee capped"}</span></>}
                  {v.note && <><span style={{ color: C.gray400 }}>Note</span><span>{v.note}</span></>}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  </>);
}

function ScreenTab({ screenings, td, tier, enrolled, expandedCard, setExpanded }) {
  const eligible = screenings.filter(s => s.eligible);
  const scrFee = td.medical.screening.fee;
  const flatScreenings = screenings.filter(s => s.isFlatFee);
  const breastScreenings = screenings.filter(s => s.isBreast);
  const getBreastFee = (isEnrolled) => {
    if (isEnrolled) return 0;
    if (tier === "pg") return 25;
    if (tier === "mg") return 37.5;
    if (tier === "pa") return 0;
    return 50;
  };
  return (<>
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
      <Ico.search s={20} c={C.gray600}/><span style={{ fontSize: 18, fontWeight: 600, color: C.gray700 }}>Available screenings</span>
      <span style={{ fontSize: 16, color: C.gray400, marginLeft: "auto" }}>{eligible.length} eligible</span>
    </div>
    {enrolled && (
      <div style={{ background: C.hsgGreenLight, borderRadius: 12, padding: "12px 16px", marginBottom: 12, display: "flex", gap: 8, boxShadow: C.shadow }}>
        <Ico.leaf s={16} c={C.hsgGreen}/>
        <div style={{ fontSize: 16, color: C.hsgGreen, lineHeight: 1.5 }}><strong>HealthierSG enrolled:</strong> $0 for all eligible screening tests at your enrolled clinic.</div>
      </div>
    )}
    {screenings.length === 0 ? (
      <div style={{ background: C.white, borderRadius: 14, boxShadow: C.shadow, padding: "36px 20px", textAlign: "center", color: C.gray500 }}>No subsidised screenings for your age/gender profile.</div>
    ) : (
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {/* Flat-fee screenings card */}
        {flatScreenings.length > 0 && (
          <div style={{ background: C.white, borderRadius: 14, boxShadow: C.shadow, border: enrolled ? "1.5px solid #A5D6A7" : "1.5px solid transparent", padding: "16px 20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 18, color: C.gray800, marginBottom: 4 }}>Health Screening Visit</div>
                <div style={{ fontSize: 15, color: C.gray500, lineHeight: 1.5 }}>All eligible tests included in one visit at CHAS GP clinics. Includes one follow-up consultation if required.</div>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0, marginLeft: 16 }}>
                <div style={{ fontSize: 14, color: C.gray400 }}>You pay</div>
                <div style={{ fontSize: 28, fontWeight: 700, color: enrolled ? C.hsgGreen : C.teal }}>
                  {enrolled ? "FREE" : `$${scrFee}`}
                </div>
                <div style={{ fontSize: 13, color: C.gray400 }}>per visit</div>
              </div>
            </div>
            <div style={{ borderTop: `1px solid ${C.gray100}`, paddingTop: 12, display: "flex", flexDirection: "column", gap: 10 }}>
              {flatScreenings.map((s, i) => (
                <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                  <Ico.check s={18} c={enrolled ? C.hsgGreen : C.teal}/>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 16, color: C.gray800 }}>{s.name}</div>
                    <div style={{ fontSize: 14, color: C.gray500, lineHeight: 1.4 }}>{s.desc}</div>
                    <div style={{ fontSize: 14, color: C.gray400, marginTop: 2 }}>Frequency: {s.frequency}</div>
                  </div>
                </div>
              ))}
            </div>
            {!enrolled && (
              <div style={{ marginTop: 12, padding: "10px 12px", background: C.hsgGreenLight, borderRadius: 8, display: "flex", gap: 8, alignItems: "center" }}>
                <Ico.leaf s={16} c={C.hsgGreen}/>
                <span style={{ fontSize: 14, color: C.hsgGreen }}>With HealthierSG enrollment: <strong>$0</strong> at your enrolled clinic</span>
              </div>
            )}
          </div>
        )}
        {/* Breast cancer screening cards */}
        {breastScreenings.map((s, i) => {
          const expanded = expandedCard === `sb-${i}`;
          const youPay = getBreastFee(enrolled);
          return (
            <div key={`b-${i}`} onClick={() => setExpanded(expanded ? null : `sb-${i}`)} style={{ background: C.white, borderRadius: 14, boxShadow: C.shadow, border: enrolled ? "1.5px solid #A5D6A7" : "1.5px solid transparent", padding: "16px 20px", cursor: "pointer" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ display: "flex", gap: 10, flex: 1 }}>
                  <Ico.check s={18} c={enrolled ? C.hsgGreen : C.teal}/>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}><span style={{ fontWeight: 600, fontSize: 18, color: C.gray800 }}>{s.name}</span>{enrolled && <HsgBadge small/>}</div>
                    <div style={{ fontSize: 16, color: C.gray500, marginTop: 3 }}>{s.desc}</div>
                    <div style={{ fontSize: 16, color: C.gray400, marginTop: 3 }}>Frequency: {s.frequency}</div>
                  </div>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0, marginLeft: 12 }}>
                  <div style={{ fontSize: 14, color: C.gray400 }}>You pay</div>
                  <div style={{ fontSize: 28, fontWeight: 700, color: youPay === 0 ? C.hsgGreen : C.teal }}>
                    {youPay === 0 ? "FREE" : `$${youPay}`}
                  </div>
                </div>
              </div>
              {expanded && (
                <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${C.gray100}`, fontSize: 17 }}>
                  <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "6px 12px" }}>
                    <span style={{ color: C.gray400 }}>Next due</span><span>{s.nextDue}</span>
                    <span style={{ color: C.gray400 }}>Where</span><span>Selected polyclinics</span>
                    {!enrolled && <><span style={{ color: C.gray400 }}>If HSG enrolled</span><span style={{ color: C.hsgGreen, fontWeight: 600 }}>$0 at enrolled clinic</span></>}
                  </div>
                  <div style={{ marginTop: 10, fontSize: 14, color: C.gray500, lineHeight: 1.5 }}>
                    Breast cancer screening is offered at selected polyclinics. Rates: $0 (HSG enrolled), $25 (PG), $37.50 (MG), $50 (SC), $75 (PR).
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    )}
  </>);
}

function ConsentPage({ profile, onConsent }) {
  const [consent, setConsent] = useState(false);
  const nric = profile.nric.slice(0, 1) + "****" + profile.nric.slice(-3);
  return (
    <div style={{ flex: 1, background: C.pageBg }}>
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "20px 16px 40px", display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ background: C.white, borderRadius: 14, boxShadow: C.shadow, padding: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
            <div style={{ width: 44, height: 44, borderRadius: 10, background: C.primaryLight, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Ico.shield s={24} c={C.primary}/>
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 20, color: C.gray800 }}>Welcome, {profile.name}</div>
              <div style={{ fontSize: 16, color: C.gray500, marginTop: 2 }}>{nric}</div>
            </div>
          </div>
          <div style={{ borderTop: `1px solid ${C.gray100}`, paddingTop: 14, fontSize: 17, color: C.gray700, lineHeight: 1.6 }}>
            We notice you are not enrolled in <strong style={{ color: C.primary }}>CHAS</strong> or <strong style={{ color: C.primary }}>HealthierSG</strong> yet.
          </div>
        </div>

        <div style={{ background: C.white, borderRadius: 14, boxShadow: C.shadow, padding: 20 }}>
          <div style={{ fontWeight: 700, fontSize: 19, color: C.gray800, marginBottom: 16 }}>What we will check</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {[
              { title: "Your CHAS eligibility", desc: "Based on your National Means Test Status (NMTS)" },
              { title: "HealthierSG clinic options", desc: "Find clinics near your address for enrollment" },
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <Ico.check s={22} c={C.primary}/>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 17, color: C.gray800 }}>{item.title}</div>
                  <div style={{ fontSize: 15, color: C.gray500, marginTop: 3, lineHeight: 1.5 }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: "#FFF8F0", border: `1.5px solid ${C.accent}`, borderRadius: 14, padding: 18 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <Ico.info s={22} c={C.accent}/>
            <span style={{ fontWeight: 700, fontSize: 17, color: C.accentDark }}>Your consent is required</span>
          </div>
          <div style={{ fontSize: 15, color: C.gray700, lineHeight: 1.6 }}>
            We need your permission to retrieve your National Means Test Status (NMTS) from HOMES to determine your CHAS card eligibility.
          </div>
        </div>

        <div onClick={() => setConsent(!consent)} style={{ background: C.white, borderRadius: 14, boxShadow: C.shadow, padding: 18, display: "flex", gap: 12, alignItems: "flex-start", cursor: "pointer" }}>
          <div style={{ width: 24, height: 24, borderRadius: 4, border: `2px solid ${consent ? C.primary : C.gray300}`, background: consent ? C.primary : C.white, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
            {consent && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
          </div>
          <div style={{ fontSize: 15, color: C.gray700, lineHeight: 1.6 }}>
            I give consent for MOH to retrieve my NMTS status to check my CHAS eligibility and HealthierSG enrollment options.
          </div>
        </div>

        <button onClick={consent ? onConsent : undefined} disabled={!consent} style={{
          background: consent ? C.primary : C.gray300, color: consent ? "#FFF" : C.gray500,
          border: "none", padding: "18px 0", borderRadius: 12, fontSize: 18, fontWeight: 700,
          cursor: consent ? "pointer" : "not-allowed", boxShadow: consent ? C.shadowMd : "none", transition: "all 0.15s",
        }}>Continue</button>

        <div style={{ textAlign: "center", fontSize: 14, color: C.gray500, marginTop: 4, lineHeight: 1.5 }}>
          Your information is protected under the Personal Data Protection Act (PDPA)
        </div>
      </div>
    </div>
  );
}

function EligibilityPage({ profile, onViewSubsidies }) {
  const tier = getTier(profile);
  const td = TIERS[tier];
  const tierName = td.label.toUpperCase();
  return (
    <div style={{ flex: 1, background: C.pageBg }}>
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "20px 16px 40px", display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ background: C.hsgGreenLight, border: `1.5px solid ${C.hsgGreenMid}`, borderRadius: 14, padding: "16px 20px", display: "flex", alignItems: "center", gap: 14 }}>
          <Ico.check s={32} c={C.hsgGreen}/>
          <div>
            <div style={{ fontWeight: 700, fontSize: 19, color: C.hsgGreen }}>Good news!</div>
            <div style={{ fontSize: 16, color: C.gray700, marginTop: 2 }}>You are eligible for subsidies</div>
          </div>
        </div>

        <div style={{ background: C.white, borderRadius: 14, boxShadow: C.shadow, padding: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={C.gray700} strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2"/><path d="M1 10h22"/></svg>
            <span style={{ fontWeight: 700, fontSize: 19, color: C.gray800 }}>CHAS Eligibility</span>
          </div>
          <div style={{ background: td.bg, borderRadius: 12, padding: "18px 20px", color: "#FFF", marginBottom: 14, boxShadow: C.shadowMd }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FFF" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2"/><path d="M1 10h22"/></svg>
              <span style={{ fontWeight: 700, fontSize: 22, letterSpacing: 0.5 }}>CHAS {tierName}</span>
            </div>
            <div style={{ fontSize: 15, opacity: 0.95 }}>Household monthly income per person {td.incomeRange}</div>
          </div>
          <div style={{ fontSize: 16, color: C.gray700, lineHeight: 1.6 }}>
            Based on your NMTS, you qualify for <strong>CHAS {tierName}</strong> card with enhanced subsidies for medical, dental, and chronic care.
          </div>
        </div>

        <div style={{ background: C.white, borderRadius: 14, boxShadow: C.shadow, padding: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <Ico.leaf s={22} c={C.hsgGreen}/>
            <span style={{ fontWeight: 700, fontSize: 19, color: C.gray800 }}>HealthierSG Benefits</span>
          </div>
          <div style={{ fontSize: 16, color: C.gray700, marginBottom: 14, lineHeight: 1.55 }}>
            With CHAS {tierName} and HealthierSG enrollment, you can enjoy:
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { title: "Fully-subsidised vaccinations", desc: "Annual flu shots and pneumonia vaccines at $0" },
              { title: "Enhanced chronic care subsidies", desc: `Up to $${td.medical.chronicComplex.annualCap}/year cap for diabetes, hypertension management` },
              { title: "Subsidised health screenings", desc: "All eligible screening tests for only $2 per visit, or $0 with HealthierSG enrollment" },
            ].map((b, i) => (
              <div key={i} style={{ background: C.primaryLight, borderRadius: 10, padding: "12px 14px", display: "flex", gap: 12, alignItems: "flex-start" }}>
                <Ico.check s={22} c={C.primary}/>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 16, color: C.gray800 }}>{b.title}</div>
                  <div style={{ fontSize: 14, color: C.gray600, marginTop: 3, lineHeight: 1.5 }}>{b.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: C.gray50, border: `1px solid ${C.gray200}`, borderRadius: 14, padding: 18, display: "flex", gap: 12 }}>
          <Ico.info s={20} c={C.gray500}/>
          <div style={{ fontSize: 14, color: C.gray600, lineHeight: 1.6 }}>
            On the next page, you can toggle <strong style={{ color: C.gray800 }}>HealthierSG enrollment</strong> to see how much you can save with a clinic enrollment. This is an indication of how much you need to pay after subsidies. We'll also show nearby clinics for your reference.
          </div>
        </div>

        <button onClick={onViewSubsidies} style={{
          background: C.primary, color: "#FFF", border: "none",
          padding: "18px 0", borderRadius: 12, fontSize: 18, fontWeight: 700,
          cursor: "pointer", boxShadow: C.shadowMd,
        }}>View My Subsidies</button>

        <div style={{ textAlign: "center", fontSize: 14, color: C.gray500, marginTop: 4 }}>
          You can explore your benefits and nearby clinics
        </div>
      </div>
    </div>
  );
}

function Dashboard({ profile }) {
  const [tab, setTab] = useState("medical");
  const [expandedCard, setExpandedCard] = useState(null);
  const [enrolled, setEnrolled] = useState(false);
  const age = useMemo(() => getAge(profile.dob), [profile.dob]);
  const tier = useMemo(() => getTier(profile), [profile.income, profile.tierOverride]);
  const td = TIERS[tier];
  const vax = useMemo(() => getVaccinations(age, profile.gender), [age, profile.gender]);
  const scr = useMemo(() => getScreenings(age, profile.gender), [age, profile.gender]);
  const nric = profile.nric.slice(0, 1) + "****" + profile.nric.slice(-3);
  const cap = td.medical.chronicComplex?.annualCap || 0;

  const tabs = [
    { key: "medical", label: "Medical", icon: Ico.medical, color: C.primary },
    { key: "dental", label: "Dental", icon: Ico.tooth, color: C.accent },
    { key: "vaccination", label: "Vaccination", icon: Ico.syringe, color: C.primaryMid },
    { key: "screening", label: "Screening", icon: Ico.search, color: C.teal },
  ];

  return (
    <div style={{ flex: 1, background: C.pageBg }}>
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "24px 16px 48px" }}>
        <div style={{ background: C.white, borderRadius: 14, boxShadow: C.shadow, padding: 20, marginBottom: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, paddingBottom: 12, borderBottom: `1px solid ${C.gray100}` }}>
            <span style={{ fontSize: 19, fontWeight: 700, color: C.gray800 }}>Your information</span>
            {enrolled && <HsgBadge/>}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "10px 16px", fontSize: 18 }}>
            {[["Name", profile.name],["NRIC", nric],["DOB", profile.dob],["Age", `${age} years`],["Gender", profile.gender === "male" ? "Male" : "Female"],["Income tier", `${td.incomeRange}/person`]].map(([k, v]) => (
              <><span key={k} style={{ color: C.gray500 }}>{k}</span><span style={{ textAlign: "right", fontWeight: 600, color: C.gray800 }}>{v}</span></>
            ))}
          </div>
        </div>

        <div style={{ background: C.white, borderRadius: 14, boxShadow: C.shadow, border: enrolled ? `1.5px solid ${C.hsgGreenMid}` : "1.5px solid transparent", padding: "16px 20px", marginBottom: 16, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: enrolled ? C.hsgGreenLight : C.gray50, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Ico.leaf s={18} c={enrolled ? C.hsgGreen : C.gray400}/>
            </div>
            <div><div style={{ fontSize: 18, fontWeight: 600, color: enrolled ? C.hsgGreen : C.gray700 }}>HealthierSG enrollment</div><div style={{ fontSize: 16, color: C.gray500 }}>For Singapore Citizens aged 40+</div></div>
          </div>
          <Toggle checked={enrolled} onChange={() => setEnrolled(!enrolled)}/>
        </div>

        <div style={{ background: `linear-gradient(135deg, ${td.bg} 0%, ${td.bg}CC 100%)`, borderRadius: 14, padding: "22px 20px 20px", color: "#FFF", marginBottom: 16, position: "relative", overflow: "hidden", boxShadow: C.shadowMd }}>
          <div style={{ position: "absolute", top: -30, right: -30, width: 120, height: 120, borderRadius: "50%", background: "rgba(255,255,255,0.07)" }}/>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, position: "relative" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2"/><path d="M1 10h22"/></svg>
            <span style={{ fontWeight: 700, fontSize: 18, textTransform: "uppercase", letterSpacing: 0.5 }}>{["mg","pg","pa"].includes(tier) ? td.label : `CHAS ${td.label}`}</span>
            {enrolled && <span style={{ fontSize: 14, background: "rgba(255,255,255,0.2)", padding: "2px 8px", borderRadius: 4 }}>+ HSG</span>}
          </div>
          <div style={{ fontSize: 17, opacity: 0.85, position: "relative", marginBottom: 14 }}>{td.desc}</div>
          <div style={{ position: "relative", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <div style={{ background: "rgba(255,255,255,0.12)", borderRadius: 10, padding: "12px" }}>
              <div style={{ fontSize: 15, opacity: 0.75 }}>Chronic (complex) cap</div>
              <div style={{ fontSize: 32, fontWeight: 700 }}>${cap}</div>
              <div style={{ fontSize: 15, opacity: 0.65 }}>per year</div>
            </div>
            <div style={{ background: "rgba(255,255,255,0.12)", borderRadius: 10, padding: "12px" }}>
              <div style={{ fontSize: 15, opacity: 0.75 }}>{enrolled ? "HSG chronic meds" : "Common illness"}</div>
              <div style={{ fontSize: 32, fontWeight: 700 }}>{enrolled ? td.hsgChronic.medSubsidy : (td.medical.commonIllness ? `$${td.medical.commonIllness.perVisit}` : "N/A")}</div>
              <div style={{ fontSize: 15, opacity: 0.65 }}>{enrolled ? "no dollar cap" : td.medical.commonIllness ? "per visit" : ""}</div>
            </div>
          </div>
        </div>

        <HsgBanner enrolled={enrolled}/>

        <div style={{ fontSize: 19, fontWeight: 700, color: C.gray800, marginBottom: 12 }}>Choose claim type</div>
        <div style={{ display: "flex", gap: 6, marginBottom: 22, flexWrap: "wrap" }}>
          {tabs.map(t => (
            <button key={t.key} onClick={() => { setTab(t.key); setExpandedCard(null); }} style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "10px 12px", borderRadius: 12, cursor: "pointer", fontWeight: 600, fontSize: 16,
              background: tab === t.key ? C.primary : C.white, boxShadow: tab === t.key ? C.shadowMd : C.shadow,
              border: "none", color: tab === t.key ? "#FFF" : C.gray600, whiteSpace: "nowrap", flex: "1 1 auto", minWidth: "calc(50% - 6px)", transition: "all 0.15s",
            }}><t.icon s={16} c={tab === t.key ? "#FFF" : C.gray400}/>{t.label}</button>
          ))}
        </div>

        {tab === "medical" && <MedicalTab tier={tier} td={td} enrolled={enrolled}/>}
        {tab === "dental" && <DentalTab tier={tier} td={td}/>}
        {tab === "vaccination" && <VaxTab vaccinations={vax} tier={tier} enrolled={enrolled} expandedCard={expandedCard} setExpanded={setExpandedCard}/>}
        {tab === "screening" && <ScreenTab screenings={scr} td={td} tier={tier} enrolled={enrolled} expandedCard={expandedCard} setExpanded={setExpandedCard}/>}

        <div style={{ marginTop: 24, background: C.primaryLight, border: `1px solid ${C.gray200}`, borderRadius: 12, padding: "14px 16px", display: "flex", gap: 10 }}>
          <Ico.info s={20} c={C.primaryMid}/><div style={{ fontSize: 17, color: C.gray600, lineHeight: 1.5 }}><strong>Disclaimer:</strong> Demo application. Typical costs are estimates and actual clinic charges may vary. Subsidy amounts are based on MOH published rates. Visit <span style={{ color: C.primary, fontWeight: 600 }}>moh.gov.sg</span> or <span style={{ color: C.primary, fontWeight: 600 }}>healthiersg.gov.sg</span> for official information.</div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [view, setView] = useState("landing");
  const [showModal, setShowModal] = useState(false);
  const [profile, setProfile] = useState(null);
  const onAuth = useCallback((p) => { setProfile(p); setShowModal(false); setView(p.isNonChas ? "consent" : "dashboard"); }, []);
  const onLogout = useCallback(() => { setProfile(null); setView("landing"); }, []);
  const headerTitle = view === "consent" ? "Enrollment Required" : view === "eligibility" ? "Your Eligibility" : "MOH Subsidy Advisor";
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", fontFamily: "'Source Sans 3','Inter','Segoe UI',system-ui,-apple-system,sans-serif", background: C.pageBg }}>
      <GovMasthead/>
      {view !== "landing" && <AppHeader isLoggedIn={view !== "landing"} onLogout={onLogout} title={headerTitle}/>}
      {view === "landing" && <LandingPage onLogin={() => setShowModal(true)}/>}
      {view === "consent" && profile && <ConsentPage profile={profile} onConsent={() => setView("eligibility")}/>}
      {view === "eligibility" && profile && <EligibilityPage profile={profile} onViewSubsidies={() => setView("dashboard")}/>}
      {view === "dashboard" && profile && <Dashboard profile={profile}/>}
      {showModal && <SingpassModal onClose={() => setShowModal(false)} onAuth={onAuth}/>}
      <Footer/>
    </div>
  );
}
