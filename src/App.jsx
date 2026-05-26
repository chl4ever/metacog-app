import React, { useState } from "react";

// ============================================================
//  思维框架诊断 — 八维固定轴
//  每题选项 = 纯思维动作;dims = 该选项测的维度(可多维)
// ============================================================

const DIMS = {
  prob: "概率与不确定性",
  system: "二阶与系统",
  contra: "逆向与反共识",
  transfer: "跨域迁移",
  falsify: "证伪与校准",
  incentive: "激励与博弈",
  bias: "认知偏误自检",
  tempo: "认知节奏",
};
const DIM_ORDER = ["prob", "system", "contra", "transfer", "falsify", "incentive", "bias", "tempo"];
const DIM_SHORT = {
  prob: "概率", system: "系统", contra: "逆向", transfer: "跨域",
  falsify: "证伪", incentive: "激励", bias: "偏误", tempo: "节奏",
};

const QUIZ = [
  {
    q: "一个确定收益、但附带未来排他代价的合作机会找上门。哪些念头会真实出现?",
    opts: [
      { t: "估算:这笔确定收益 vs 放弃的潜在收益,哪个期望值高", d: ["prob"] },
      { t: "推演:签了之后会连带改变什么(议价权、其他关系)", d: ["system"] },
      { t: "对方愿出钱还要排他,他真实图的是什么", d: ["incentive"] },
      { t: "大家都觉得排他吃亏,反过来想它会不会反而是好事", d: ["contra"] },
      { t: "那个'扛不住的损失',什么情况下会真的发生——先想清这条线", d: ["falsify"] },
    ],
  },
  {
    q: "两个你都信任的人,给了完全相反的建议。哪些念头会真实出现?",
    opts: [
      { t: "这两人各自的立场和利益,如何影响了他们的结论", d: ["incentive"] },
      { t: "这种'两个人打架'的局面我以前遇过吗,那次最后谁对了", d: ["transfer"] },
      { t: "我是不是只想找人支持我本来就有的倾向", d: ["bias"] },
      { t: "跳出两人的框架:他们是不是都漏看了同一个东西", d: ["contra"] },
      { t: "这个判断,该靠直觉,还是该慢慢分析", d: ["tempo"] },
    ],
  },
  {
    q: "你对一件长期在做的事,产生了说不清的别扭感。哪些念头会真实出现?",
    opts: [
      { t: "这种别扭感过去出现时,后来多是真问题还是多虑(看老账)", d: ["prob"] },
      { t: "拆解:是哪个环节、和什么相互作用出了问题", d: ["system"] },
      { t: "如果今天从零开始,我还会选这条路吗", d: ["contra"] },
      { t: "我是不是在压抑这个信号,因为承认它代价太大", d: ["bias"] },
      { t: "这是该立刻深想的信号,还是该让它再沉淀几天", d: ["tempo"] },
    ],
  },
  {
    q: "一个限时、信息不全、必须很快决定的机会。哪些念头会真实出现?",
    opts: [
      { t: "信息不全下,先估各种结果的可能性和赔率,而非求确定答案", d: ["prob"] },
      { t: "时间压力是不是被人为制造的,好让我来不及细想", d: ["incentive"] },
      { t: "时间有限,这是该靠经验直觉拍板、还是必须挤时间核一下的事", d: ["tempo"] },
      { t: "抓住它会触发什么后续连锁", d: ["system"] },
      { t: "这局面像不像我以前遇过的某个,那次的规律还适用吗", d: ["transfer"] },
    ],
  },
  {
    q: "投入很久的一件事,越来越像当初判断错了。哪些念头会真实出现?",
    opts: [
      { t: "只看从现在起往前的期望值,沉没的不算", d: ["prob"] },
      { t: "分清:是当初方向就错了,还是执行/运气的问题", d: ["falsify"] },
      { t: "我是不是在为了不认错而死扛", d: ["bias"] },
      { t: "这次失败,能不能用别领域的某个规律来解释", d: ["transfer"] },
      { t: "退出这个决定,会连带影响什么", d: ["system"] },
    ],
  },
  {
    q: "一个广为流传、听起来很有道理的说法。哪些念头会真实出现?",
    opts: [
      { t: "它若为真该有什么证据、若为假该有什么反例", d: ["falsify"] },
      { t: "谁在传播它、谁从大家相信它当中获益", d: ["incentive"] },
      { t: "它在什么条件下成立、什么条件下不成立", d: ["system"] },
      { t: "'很多人都信'是它可信的理由,还是该警惕的信号", d: ["contra"] },
      { t: "我是不是因为希望它真、或它符合我既有看法才信", d: ["bias"] },
    ],
  },
  {
    q: "面对一个全新的陌生问题,一时无从下手。哪些念头会真实出现?",
    opts: [
      { t: "它在结构上,像我熟悉的哪个东西", d: ["transfer"] },
      { t: "我怎么判断自己是真搞懂了,还是只是自以为懂", d: ["falsify"] },
      { t: "这种'搞不懂'的感觉,是该硬啃还是先放一放", d: ["tempo"] },
      { t: "谁在这个领域最懂、他们的利益又在哪", d: ["incentive"] },
      { t: "先估一下:我大概多大把握能搞定它", d: ["prob"] },
    ],
  },
  {
    q: "你要在两个差不多好的选项里二选一,却迟迟定不下来。哪些念头会真实出现?",
    opts: [
      { t: "把'选错的代价'在两边各推演一遍,哪个更扛得住", d: ["falsify"] },
      { t: "反过来想:哪个选项我将来更可能后悔,先排除它", d: ["contra"] },
      { t: "我迟迟定不下,是真难选,还是在逃避某种损失", d: ["bias"] },
      { t: "这种纠结值不值得再耗,还是该设个期限拍板", d: ["tempo"] },
      { t: "借个别处的类比:类似的两难,别人或别的领域怎么破", d: ["transfer"] },
    ],
  },
];

// 计算八维频次:first = 作为第一反应被某维命中的次数;also = 其余选择命中
function tally(answers) {
  const score = {};
  DIM_ORDER.forEach((k) => (score[k] = { first: 0, also: 0 }));
  answers.forEach((a) => {
    if (!a) return;
    const { firstIdx, picks, qi } = a;
    picks.forEach((optIdx) => {
      const opt = QUIZ[qi].opts[optIdx];
      const isFirst = optIdx === firstIdx;
      opt.d.forEach((dim) => {
        if (isFirst) score[dim].first += 1;
        else score[dim].also += 1;
      });
    });
  });
  return score;
}

// 每个维度在整个题库里作为选项出现的总次数 = 该维度的理论最大值
// (配平后每维应为 5,这里从 QUIZ 实际统计,避免硬编码出错)
const DIM_MAX = (() => {
  const m = {};
  DIM_ORDER.forEach((k) => (m[k] = 0));
  QUIZ.forEach((item) => item.opts.forEach((o) => o.d.forEach((dim) => { m[dim] = (m[dim] || 0) + 1; })));
  return m;
})();

const gold = "#c9a227";

export default function App() {
  const [stage, setStage] = useState("intro"); // intro | quiz | result
  const [qi, setQi] = useState(0);
  const [answers, setAnswers] = useState(() => QUIZ.map(() => null)); // 按题索引存

  const start = () => { setStage("quiz"); setQi(0); setAnswers(QUIZ.map(() => null)); };

  const submit = (rec) => {
    const na = [...answers];
    na[rec.qi] = rec;
    setAnswers(na);
    if (qi < QUIZ.length - 1) setQi(qi + 1);
    else setStage("result");
  };

  const back = () => { if (qi > 0) setQi(qi - 1); };

  return (
    <div style={S.root}>
      <style>{CSS}</style>
      {stage === "intro" && (
        <div style={S.wrap}>
          <div style={S.kicker}>THINKING FRAMEWORKS · 八维诊断</div>
          <h1 style={S.title}>你的思维框架使用图谱</h1>
          <p style={S.sub}>
            8 个真实决策场景,每题勾出会真实出现的念头(可多选),并指定一个最先冒出来的。
            测的是:面对判断,你的脑子里会调用哪些思维框架。<b>不评判高下,只照见你用什么。</b>
          </p>
          <button style={S.btn} onClick={start}>开始</button>
        </div>
      )}

      {stage === "quiz" && (
        <Quiz key={qi} qi={qi} onSubmit={submit} onBack={back}
          isLast={qi === QUIZ.length - 1} canBack={qi > 0}
          initial={answers[qi]} />
      )}

      {stage === "result" && <Result score={tally(answers.filter(Boolean))} onRestart={start} />}
    </div>
  );
}

function Quiz({ qi, onSubmit, onBack, isLast, canBack, initial }) {
  // 合并为单一 state,杜绝两个 setState 嵌套导致的时序/重渲染问题
  const [sel, setSel] = useState({
    picks: initial ? initial.picks : [],
    firstIdx: initial ? initial.firstIdx : null,
  });
  const { picks, firstIdx } = sel;
  const item = QUIZ[qi];

  const toggle = (i) => {
    setSel((prev) => {
      const has = prev.picks.includes(i);
      const picks = has ? prev.picks.filter((x) => x !== i) : [...prev.picks, i];
      let firstIdx = prev.firstIdx;
      if (has && firstIdx === i) firstIdx = picks[0] ?? null; // 取消的是第一反应则顺延
      if (!has && firstIdx === null) firstIdx = i;            // 首个勾选自动设为第一反应
      return { picks, firstIdx };
    });
  };
  const setFirst = (i) => setSel((prev) => ({ ...prev, firstIdx: i }));

  return (
    <div style={S.wrap}>
      <div style={S.prog}>
        <div style={S.progBar}><div style={{ ...S.progFill, width: `${(qi / QUIZ.length) * 100}%` }} /></div>
        <span style={S.progTxt}>{qi + 1} / {QUIZ.length}</span>
      </div>
      <h2 style={S.q}>{item.q}</h2>
      <p style={S.hint}>勾出所有会出现的(可多选);★ 标一个最先冒出来的</p>
      <div style={S.opts}>
        {item.opts.map((o, i) => {
          const on = picks.includes(i);
          const first = firstIdx === i && on;
          return (
            <div key={i} style={{ ...S.opt, ...(on ? S.optOn : {}) }} onClick={() => toggle(i)}>
              <span style={{ ...S.check, ...(on ? S.checkOn : {}) }}>{on ? "✓" : ""}</span>
              <span style={S.optTxt}>{o.t}</span>
              {on && (
                <span
                  onClick={(e) => { e.stopPropagation(); setFirst(i); }}
                  style={{ ...S.star, ...(first ? S.starOn : {}) }}
                  title="设为第一反应"
                >★</span>
              )}
            </div>
          );
        })}
      </div>
      <div style={S.navRow}>
        <button style={{ ...S.backBtn, visibility: canBack ? "visible" : "hidden" }} onClick={onBack}>
          ← 上一题
        </button>
        <button style={{ ...S.btn, opacity: picks.length ? 1 : 0.4 }}
          onClick={() => picks.length && onSubmit({ qi, picks, firstIdx: picks.includes(firstIdx) ? firstIdx : picks[0] })}>
          {isLast ? "看结果 →" : "下一题 →"}
        </button>
      </div>
    </div>
  );
}

function Result({ score, onRestart }) {
  // 雷达双层,按每维"实际出现总题数"归一化(真实数据,全选则撑满=如实反映)
  const radar = DIM_ORDER.map((k) => {
    const s = score[k];
    const maxN = DIM_MAX[k] || 1;
    const total = s.first + s.also;
    return {
      key: k, name: DIMS[k], first: s.first, also: s.also, maxN, total,
      firstV: s.first / maxN,   // 第一反应占比(分母=该维真实出现次数)
      totalV: total / maxN,     // 总量占比
    };
  });
  const rows = [...radar].sort((a, b) => (b.first * 2 + b.also) - (a.first * 2 + a.also));
  return (
    <div style={S.wrap}>
      <div style={S.kicker}>结果 · 八维固定轴</div>
      <h1 style={S.title}>你的思维框架使用图谱</h1>

      <Radar data={radar} />

      <div style={S.legend}>
        <span><i style={{ ...S.dot, background: gold }} />金色实心 = 第一反应(本能)</span>
        <span><i style={{ ...S.dot, background: "#7a6f4a" }} />虚线外圈 = 含其余会想(广度)</span>
      </div>

      <div style={S.list}>
        {rows.map((f, i) => {
          return (
            <div key={f.key} className="row" style={{ animationDelay: `${i * 50}ms` }}>
              <div style={S.rowHead}>
                <span style={S.fname}>
                  {f.name}
                  <span style={S.maxTag}>{f.total}/{f.maxN}</span>
                </span>
                <span style={S.count}>
                  {f.first > 0 && <b style={{ color: gold }}>第一反应 ×{f.first}　</b>}
                  {f.also > 0 && <span style={{ color: "#8a8170" }}>其余 ×{f.also}</span>}
                  {f.total === 0 && <span style={{ color: "#5a5347" }}>本次未出现</span>}
                </span>
              </div>
              <div style={S.bar}>
                <div style={{ ...S.fillFirst, width: `${(f.first / f.maxN) * 100}%` }} />
                <div style={{ ...S.fillAlso, width: `${(f.also / f.maxN) * 100}%` }} />
              </div>
            </div>
          );
        })}
      </div>
      <div style={S.note}>
        八个维度是固定的思维框架体系。本次「未出现」不代表你不具备,只代表这 8 个场景里它没被你最先想到。
        这张图测的是「第一反应调用哪些框架」,测不到「你会不会在该用时真用上、事后是否回头校准」。
      </div>
      <button style={S.btn} onClick={onRestart}>重新测一次</button>
    </div>
  );
}

function Radar({ data }) {
  const size = 320, cx = size / 2, cy = size / 2, R = 100;
  const padX = 70; // 左右留白给长标签
  const n = data.length;
  const ang = (i) => (Math.PI * 2 * i) / n - Math.PI / 2;
  const pt = (i, r) => [cx + Math.cos(ang(i)) * r, cy + Math.sin(ang(i)) * r];
  const rings = [0.25, 0.5, 0.75, 1].map((f) =>
    data.map((_, i) => pt(i, R * f).join(",")).join(" "));
  const totalPoly = data.map((d, i) => pt(i, R * Math.max(d.totalV, 0.03)).join(",")).join(" ");
  const firstPoly = data.map((d, i) => pt(i, R * Math.max(d.firstV, 0.03)).join(",")).join(" ");
  return (
    <svg width="100%" viewBox={`${-padX} 0 ${size + padX * 2} ${size}`} style={{ display: "block", margin: "0 auto 8px", maxWidth: 420 }}>
      {rings.map((p, i) => (
        <polygon key={i} points={p} fill="none" stroke="#2a2620" strokeWidth="1" />
      ))}
      {data.map((_, i) => {
        const [x, y] = pt(i, R);
        return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="#2a2620" strokeWidth="1" />;
      })}
      {/* 外层:总量(第一反应+其余),浅色描边 */}
      <polygon points={totalPoly} fill="none" stroke="#7a6f4a" strokeWidth="1.5" strokeDasharray="4 3" />
      {/* 内层:第一反应,金色实心 */}
      <polygon points={firstPoly} fill="#c9a22740" stroke={gold} strokeWidth="2" />
      {data.map((d, i) => {
        const [x, y] = pt(i, R * Math.max(d.firstV, 0.03));
        return <circle key={i} cx={x} cy={y} r="3" fill={d.first > 0 ? gold : "transparent"} />;
      })}
      {data.map((d, i) => {
        const [x, y] = pt(i, R + 20);
        const anchor = Math.abs(x - cx) < 8 ? "middle" : x > cx ? "start" : "end";
        const name = DIMS[d.key];                 // 用全名,与明细一一对应
        const lines = name.length > 3              // 超过3字折成两行
          ? [name.slice(0, Math.ceil(name.length / 2)), name.slice(Math.ceil(name.length / 2))]
          : [name];
        return (
          <text key={i} x={x} y={y - (lines.length - 1) * 6} fontSize="10" fill="#bdb6a4"
            textAnchor={anchor} dominantBaseline="middle" fontFamily="'Spectral',serif">
            {lines.map((ln, li) => (
              <tspan key={li} x={x} dy={li === 0 ? 0 : 12}>{ln}</tspan>
            ))}
          </text>
        );
      })}
    </svg>
  );
}

const S = {
  root: { minHeight: "100vh", background: "#0d0c0a", color: "#e8e2d4", fontFamily: "'Spectral', Georgia, serif", padding: "40px 20px" },
  wrap: { maxWidth: 680, margin: "0 auto" },
  kicker: { fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: "0.28em", color: gold, marginBottom: 14 },
  title: { fontSize: 30, margin: "0 0 16px", color: "#f3eede" },
  sub: { color: "#bdb6a4", fontSize: 15, lineHeight: 1.75, marginBottom: 26 },
  btn: { background: gold, color: "#0d0c0a", border: "none", padding: "13px 30px", borderRadius: 2, fontSize: 15, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", marginTop: 8 },
  navRow: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginTop: 8 },
  backBtn: { background: "transparent", color: "#8a8170", border: "1px solid #3a352b", padding: "13px 22px", borderRadius: 2, fontSize: 14, cursor: "pointer", fontFamily: "inherit" },
  prog: { display: "flex", alignItems: "center", gap: 14, marginBottom: 28 },
  progBar: { flex: 1, height: 4, background: "#221f19", borderRadius: 4, overflow: "hidden" },
  progFill: { height: "100%", background: gold, transition: "width .3s" },
  progTxt: { fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: "#8a8170" },
  q: { fontSize: 22, color: "#f3eede", lineHeight: 1.5, margin: "0 0 8px" },
  hint: { fontSize: 13, color: "#8a8170", fontStyle: "italic", marginBottom: 22 },
  opts: { display: "flex", flexDirection: "column", gap: 11, marginBottom: 26 },
  opt: { display: "flex", alignItems: "center", gap: 13, background: "#16140f", border: "1px solid #2a2620", borderRadius: 4, padding: "15px 16px", cursor: "pointer", transition: "all .15s" },
  optOn: { borderColor: gold, background: "#241f12" },
  check: { width: 22, height: 22, minWidth: 22, borderRadius: 4, border: "1px solid #3a352b", display: "flex", alignItems: "center", justifyContent: "center", color: gold, fontSize: 14 },
  checkOn: { borderColor: gold, background: "#2e2713" },
  optTxt: { flex: 1, fontSize: 15, color: "#ddd6c4", lineHeight: 1.5 },
  star: { fontSize: 18, color: "#3a352b", cursor: "pointer", padding: "0 4px" },
  starOn: { color: gold },
  legend: { display: "flex", gap: 22, fontSize: 13, color: "#bdb6a4", marginBottom: 26 },
  dot: { display: "inline-block", width: 11, height: 11, borderRadius: 2, marginRight: 7, verticalAlign: "middle" },
  list: { display: "flex", flexDirection: "column", gap: 18 },
  rowHead: { display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8, flexWrap: "wrap", gap: 4 },
  fname: { fontSize: 17, color: "#f3eede", fontWeight: 600 },
  maxTag: { fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: "#5a5347", marginLeft: 10, fontWeight: 400 },
  count: { fontFamily: "'JetBrains Mono', monospace", fontSize: 12 },
  bar: { display: "flex", height: 10, background: "#161410", borderRadius: 5, overflow: "hidden", border: "1px solid #221f19" },
  fillFirst: { background: gold, height: "100%" },
  fillAlso: { background: "#4a4636", height: "100%" },
  note: { marginTop: 34, padding: "18px 20px", background: "#161410", border: "1px solid #2a2620", borderLeft: "2px solid " + gold, borderRadius: 3, fontSize: 13.5, lineHeight: 1.75, color: "#bdb6a4", marginBottom: 24 },
};
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Spectral:ital,wght@0,400;0,600;1,400&family=JetBrains+Mono:wght@400;500&display=swap');
* { box-sizing: border-box; }
.row { animation: rise .5s ease both; }
@keyframes rise { from { opacity:0; transform: translateY(12px);} to {opacity:1; transform:translateY(0);} }
button:hover { opacity: .9; }
`;
