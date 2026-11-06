"use client";
import { motion } from "framer-motion";
import { EASE } from "@/lib/motion";

// SVG building blocks for the system diagrams. viewBox is 600 x 440 everywhere.
// Entrance: edges draw in, nodes pop with a small overshoot, then packets run forever (ambient).

const ACID = "#c8ff2e";

export function Edge({ d, i = 0, dim = false }: { d: string; i?: number; dim?: boolean }) {
  return (
    <g>
      <motion.path d={d} fill="none" stroke={dim ? "#333" : "#3a3a3a"} strokeWidth={1.2}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.9, ease: EASE, delay: 0.1 + i * 0.04 }} />
      {!dim && <path d={d} fill="none" stroke={ACID} strokeOpacity={0.35} strokeWidth={1.2} className="dash-flow" />}
    </g>
  );
}

export function Packet({ d, dur = 2, delay = 0, r = 3.5, color = ACID }: { d: string; dur?: number; delay?: number; r?: number; color?: string }) {
  return (
    <circle r={r} fill={color} className="packet">
      <animateMotion dur={`${dur}s`} begin={`${-delay}s`} repeatCount="indefinite" path={d} keyPoints="0;1" keyTimes="0;1" calcMode="spline" keySplines="0.45 0 0.55 1" />
    </circle>
  );
}

export function Node({ x, y, label, sub, w = 104, h = 40, i = 0, hot = false, pulse = false }:
  { x: number; y: number; label: string; sub?: string; w?: number; h?: number; i?: number; hot?: boolean; pulse?: boolean }) {
  return (
    <motion.g initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.15 + i * 0.05 }}
      style={{ transformOrigin: `${x}px ${y}px`, transformBox: "view-box" }}>
      {pulse && <rect x={x - w / 2 - 6} y={y - h / 2 - 6} width={w + 12} height={h + 12} rx={14} fill="none" stroke={ACID} strokeOpacity={0.5} className="node-pulse" />}
      <rect x={x - w / 2} y={y - h / 2} width={w} height={h} rx={10} fill={hot ? ACID : "#111"} stroke={hot ? ACID : "#333"} />
      <text x={x} y={sub ? y - 2 : y + 4} textAnchor="middle" fontSize={12} fontWeight={600} fill={hot ? "#050505" : "#f2f2ee"} fontFamily="var(--font-geist-sans)">{label}</text>
      {sub && <text x={x} y={y + 12} textAnchor="middle" fontSize={9} fill={hot ? "#050505" : "#8a8a8a"} fontFamily="var(--font-geist-mono)">{sub}</text>}
    </motion.g>
  );
}

function Label({ x, y, children, anchor = "start" }: { x: number; y: number; children: React.ReactNode; anchor?: "start" | "middle" | "end" }) {
  return <text x={x} y={y} fontSize={10} fill="#8a8a8a" textAnchor={anchor} fontFamily="var(--font-geist-mono)" letterSpacing="0.12em">{children}</text>;
}

/* 1. Kotak: loan origination pipeline, a loan travels through six stages */
export function LoansDiagram() {
  const stages = [
    ["Application", 110, 90], ["KYC", 300, 90], ["Valuation", 490, 90],
    ["Underwriting", 490, 250], ["Sanction", 300, 250], ["Disbursement", 110, 250],
  ] as const;
  const d = "M110,90 L300,90 L490,90 L490,250 L300,250 L110,250";
  return (
    <svg viewBox="0 0 600 440" className="h-full w-full">
      <Label x={40} y={40}>GLOS · VLOS · RETAIL LOAN LIFECYCLE</Label>
      <Edge d={d} />
      {[0, 0.9, 1.8, 2.7].map((dl) => <Packet key={dl} d={d} dur={3.6} delay={dl} r={4.5} />)}
      {stages.map(([l, x, y], i) => <Node key={l} x={x} y={y} label={l} sub={`0${i + 1}`} w={118} i={i} hot={i === 5} pulse={i === 1} />)}
      <motion.g initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7, duration: 0.6, ease: EASE }}>
        <rect x={150} y={330} width={300} height={56} rx={12} fill="#0c0c0c" stroke="#232323" />
        <text x={300} y={354} textAnchor="middle" fontSize={11} fill="#f2f2ee" fontFamily="var(--font-geist-sans)">Gold Loan · Vehicle Loan</text>
        <text x={300} y={372} textAnchor="middle" fontSize={9} fill="#8a8a8a" fontFamily="var(--font-geist-mono)">secure · high availability · auditable</text>
      </motion.g>
    </svg>
  );
}

/* 2. Clientell: MCP fan out to nine providers and merge back */
export function McpDiagram() {
  const providers = ["Gmail", "Outlook", "Calendar", "Drive", "SharePoint", "Teams", "Dropbox", "Jira", "Salesforce"];
  const hub = { x: 250, y: 220 };
  return (
    <svg viewBox="0 0 600 440" className="h-full w-full">
      <Label x={40} y={40}>PARALLEL FAN OUT → MERGE</Label>
      <Edge d="M70,220 L200,220" />
      <Packet d="M70,220 L200,220" dur={1.4} />
      {providers.map((p, i) => {
        const y = 60 + i * 40;
        const d = `M${hub.x + 50},${hub.y} C 390,${hub.y} 400,${y} 500,${y}`;
        return (
          <g key={p}>
            <Edge d={d} i={i} />
            <Packet d={d} dur={1.6} delay={i * 0.17} r={3} />
            <Packet d={`M500,${y} C 400,${y} 390,${hub.y} ${hub.x + 50},${hub.y}`} dur={1.6} delay={0.8 + i * 0.17} r={2.2} color="#f2f2ee" />
            <Node x={530} y={y} label={p} w={92} h={28} i={i + 2} />
          </g>
        );
      })}
      <Node x={70} y={220} label="Agent" sub="1,000+ orgs" w={96} h={44} i={0} />
      <Node x={hub.x} y={hub.y} label="MCP layer" sub="multi tenant" w={110} h={54} i={1} hot pulse />
      <Label x={250} y={300} anchor="middle">2,000+ EXECUTIONS / DAY</Label>
    </svg>
  );
}

/* 3. Clientell: hierarchical LLM router that bypasses the 225KB prompt */
export function RouterDiagram() {
  const leaves = [["Email", 380], ["Docs", 450], ["Tickets", 520], ["CRM", 310]] as const;
  return (
    <svg viewBox="0 0 600 440" className="h-full w-full">
      <Label x={40} y={40}>HIERARCHICAL LLM CLASSIFIER</Label>
      <Node x={90} y={120} label="Query" w={90} i={0} />
      <Edge d="M135,120 L215,120" />
      <Packet d="M135,120 L215,120" dur={1.2} />
      <Node x={270} y={120} label="Classifier" sub="tier 1" w={110} i={1} hot pulse />
      <Edge d="M270,140 C 270,190 200,190 200,230" i={1} />
      <Edge d="M270,140 C 270,190 400,190 400,230" i={2} />
      <Packet d="M270,140 C 270,190 400,190 400,230" dur={1.4} delay={0.3} />
      <Node x={200} y={250} label="Ops" sub="tier 2" w={90} i={2} />
      <Node x={400} y={250} label="Data" sub="tier 2" w={90} i={3} hot />
      {leaves.map(([l, x], i) => (
        <g key={l}>
          <Edge d={`M400,270 C 400,310 ${x},310 ${x},340`} i={i + 3} dim={l !== "Docs"} />
          <Node x={x} y={360} label={l} w={64} h={30} i={i + 4} hot={l === "Docs"} />
        </g>
      ))}
      <Packet d="M400,270 C 400,310 450,310 450,340" dur={1.4} delay={0.7} />
      {/* the bypassed giant prompt */}
      <motion.g initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5, duration: 0.7, ease: EASE }}>
        <rect x={430} y={70} width={130} height={100} rx={10} fill="#0c0c0c" stroke="#333" strokeDasharray="4 4" />
        <text x={495} y={112} textAnchor="middle" fontSize={16} fontWeight={600} fill="#555" fontFamily="var(--font-geist-sans)">225KB</text>
        <text x={495} y={130} textAnchor="middle" fontSize={9} fill="#555" fontFamily="var(--font-geist-mono)">unified prompt</text>
        <motion.line x1={438} y1={162} x2={552} y2={78} stroke={ACID} strokeWidth={2} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 1, duration: 0.5, ease: EASE }} />
      </motion.g>
      <Label x={40} y={420}>CONTEXT</Label>
      <rect x={110} y={412} width={450} height={8} rx={4} fill="#1a1a1a" />
      <motion.rect x={110} y={412} height={8} rx={4} fill={ACID} initial={{ width: 450 }} animate={{ width: 22 }} transition={{ delay: 0.6, duration: 1.6, ease: EASE }} />
      <motion.text x={565} y={420} textAnchor="end" fontSize={10} fill={ACID} fontFamily="var(--font-geist-mono)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8 }}>−95%</motion.text>
    </svg>
  );
}

/* 4. Clientell: sync to async on Redis queues, 11 workers, p95 gauge */
export function AsyncDiagram() {
  const workers = Array.from({ length: 11 }, (_, i) => i);
  return (
    <svg viewBox="0 0 600 440" className="h-full w-full">
      <Label x={40} y={40}>REDIS QUEUES → 11 UVICORN WORKERS</Label>
      <Node x={80} y={200} label="Requests" w={96} i={0} />
      <Edge d="M128,200 L190,200" />
      {[0, 0.3, 0.6].map((d) => <Packet key={d} d="M128,200 L190,200" dur={0.9} delay={d} />)}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
        <rect x={190} y={140} width={90} height={120} rx={10} fill="#0c0c0c" stroke={ACID} strokeOpacity={0.6} />
        {[0, 1, 2, 3, 4].map((i) => (
          <motion.rect key={i} x={202} width={66} height={14} rx={3} fill={ACID} fillOpacity={0.15 + i * 0.12}
            initial={{ y: 130 }} animate={{ y: 236 - i * 20 }} transition={{ type: "spring", stiffness: 300, damping: 16, delay: 0.4 + i * 0.08 }} />
        ))}
        <text x={235} y={278} textAnchor="middle" fontSize={10} fill="#8a8a8a" fontFamily="var(--font-geist-mono)">redis</text>
      </motion.g>
      {workers.map((w) => {
        const y = 70 + w * 26;
        const d = `M280,200 C 330,200 330,${y} 380,${y}`;
        return (
          <g key={w}>
            <Edge d={d} i={w} />
            <Packet d={d} dur={1.2} delay={w * 0.11} r={2.6} />
            <Node x={420} y={y} label={`worker ${w + 1}`} w={76} h={20} i={w + 1} />
          </g>
        );
      })}
      {/* p95 gauge */}
      <g transform="translate(530,330)">
        <path d="M-50,0 A50,50 0 0,1 50,0" fill="none" stroke="#232323" strokeWidth={8} strokeLinecap="round" />
        <motion.path d="M-50,0 A50,50 0 0,1 50,0" fill="none" stroke={ACID} strokeWidth={8} strokeLinecap="round"
          initial={{ pathLength: 0.95 }} animate={{ pathLength: 0.28 }} transition={{ delay: 0.6, duration: 1.8, ease: EASE }} />
        <text y={-12} textAnchor="middle" fontSize={15} fontWeight={600} fill="#f2f2ee" fontFamily="var(--font-geist-mono)">250ms</text>
        <text y={14} textAnchor="middle" fontSize={9} fill="#8a8a8a" fontFamily="var(--font-geist-mono)">p95 · was 900</text>
      </g>
    </svg>
  );
}

/* 5. WizCommerce: event driven ERP sync on Pub/Sub + CDC */
export function EventsDiagram() {
  const erps = [["QuickBooks", 120], ["NetSuite", 300], ["SOS Inventory", 480]] as const;
  const bus = "M40,220 L560,220";
  return (
    <svg viewBox="0 0 600 440" className="h-full w-full">
      <Label x={40} y={40}>EVENT BUS · PUB/SUB · CLOUD TASKS · CDC</Label>
      {erps.map(([l, x], i) => (
        <g key={l}>
          <Edge d={`M${x},120 L${x},210`} i={i} />
          <Packet d={`M${x},120 L${x},218`} dur={1.3} delay={i * 0.4} />
          <Node x={x} y={100} label={l} w={118} i={i} />
        </g>
      ))}
      <motion.path d={bus} stroke={ACID} strokeWidth={3} strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1, ease: EASE }} />
      {[0, 0.5, 1, 1.5, 2, 2.5].map((d) => <Packet key={d} d={bus} dur={3} delay={d} r={4} color="#f2f2ee" />)}
      <text x={300} y={244} textAnchor="middle" fontSize={10} fill="#8a8a8a" fontFamily="var(--font-geist-mono)">pub/sub topic</text>
      <Edge d="M180,230 L180,320" i={3} />
      <Edge d="M420,230 L420,320" i={4} />
      <Packet d="M420,230 L420,320" dur={1.2} delay={0.2} />
      <Packet d="M180,320 L180,230" dur={1.2} delay={0.6} />
      <Node x={180} y={340} label="CDC" sub="change capture" w={120} i={4} hot pulse />
      <Node x={420} y={340} label="Catalog DB" sub="PIM · RBAC" w={120} i={5} />
      <Label x={40} y={410}>100% ACCURACY · 5K+ FILES/MO · 99.9% UPTIME</Label>
    </svg>
  );
}

/* 6. Cogno: SQS feeding a burst of Lambdas for a million users */
export function LambdaDiagram() {
  const cols = 12, rows = 7;
  return (
    <svg viewBox="0 0 600 440" className="h-full w-full">
      <Label x={40} y={40}>SQS → AWS LAMBDA FAN OUT</Label>
      <Node x={90} y={220} label="Campaign" sub="1M+ users" w={110} h={48} i={0} />
      <Edge d="M145,220 L200,220" />
      <Packet d="M145,220 L200,220" dur={0.8} />
      <Node x={240} y={220} label="SQS" w={70} h={40} i={1} hot pulse />
      {Array.from({ length: cols * rows }, (_, k) => {
        const c = k % cols, r = Math.floor(k / cols);
        const x = 300 + c * 22, y = 150 + r * 22;
        return (
          <motion.rect key={k} x={x} y={y} width={14} height={14} rx={3} fill={ACID}
            initial={{ opacity: 0.06 }} animate={{ opacity: [0.06, 0.9, 0.18] }}
            transition={{ duration: 1.6, delay: 0.3 + (c * 0.035 + r * 0.02), repeat: Infinity, repeatDelay: 1.2, ease: EASE }} />
        );
      })}
      <Edge d="M275,220 L296,220" />
      <text x={430} y={330} textAnchor="middle" fontSize={10} fill="#8a8a8a" fontFamily="var(--font-geist-mono)">λ concurrent executions</text>
      <g fontFamily="var(--font-geist-mono)">
        <text x={300} y={392} fontSize={22} fill="#555" textDecoration="line-through">5h</text>
        <text x={345} y={392} fontSize={22} fill="#8a8a8a">→</text>
        <motion.g initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.9, duration: 0.6, ease: EASE }}><text x={380} y={392} fontSize={22} fontWeight={600} fill={ACID}>30m</text></motion.g>
      </g>
    </svg>
  );
}

export const DIAGRAMS = {
  loans: LoansDiagram, mcp: McpDiagram, router: RouterDiagram, async: AsyncDiagram, events: EventsDiagram, lambda: LambdaDiagram,
} as const;
