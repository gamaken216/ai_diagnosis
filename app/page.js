"use client";
import { useState } from "react";

const PURPOSES = [
  { id: "writing", label: "文章・メール作成", icon: "✍️", desc: "ビジネスメール、ブログ、SNS投稿など" },
  { id: "presentation", label: "資料・プレゼン作成", icon: "📊", desc: "PowerPoint、企画書、提案書など" },
  { id: "data", label: "データ分析・集計", icon: "📈", desc: "Excel集計、グラフ作成、レポートなど" },
  { id: "image", label: "画像・デザイン生成", icon: "🎨", desc: "イラスト、バナー、ロゴなど" },
  { id: "translation", label: "翻訳・多言語対応", icon: "🌐", desc: "文書翻訳、多言語コンテンツなど" },
  { id: "coding", label: "プログラミング・自動化", icon: "💻", desc: "コード生成、業務自動化、マクロなど" },
  { id: "research", label: "リサーチ・情報収集", icon: "🔍", desc: "市場調査、論文調査、競合分析など" },
  { id: "summary", label: "議事録・要約・整理", icon: "📝", desc: "会議メモ、長文要約、情報整理など" },
];

const SKILLS = [
  { id: "beginner", label: "初心者", desc: "PCの基本操作はできるが、AIツールは初めて" },
  { id: "intermediate", label: "中級者", desc: "ChatGPTなど使ったことがある" },
  { id: "advanced", label: "上級者", desc: "API連携や複数ツールの組み合わせもOK" },
];

const BUDGETS = [
  { id: "free", label: "無料", desc: "無料ツールのみで始めたい" },
  { id: "1000", label: "月1,000円程度まで", desc: "最低限の投資で試したい" },
  { id: "3000", label: "月3,000円程度まで", desc: "1つの有料ツールを使いたい" },
  { id: "6000", label: "月6,000円程度まで", desc: "メインツール＋補助ツール" },
  { id: "10000", label: "月10,000円程度まで", desc: "複数の有料ツールを活用したい" },
  { id: "15000", label: "月15,000円程度まで", desc: "業務効率を本格的に上げたい" },
  { id: "unlimited", label: "必要に応じて支払ってもよい", desc: "最適な環境を追求したい" },
];

const MACHINES = [
  { id: "windows", label: "Windows", icon: "🪟" },
  { id: "mac", label: "Mac", icon: "🍎" },
  { id: "both", label: "両方使っている", icon: "💻" },
];

const APPS = [
  { category: "文書・表計算", items: [
    { id: "ms-word", label: "Microsoft Word" },
    { id: "ms-excel", label: "Microsoft Excel" },
    { id: "ms-powerpoint", label: "Microsoft PowerPoint" },
    { id: "google-docs", label: "Google ドキュメント" },
    { id: "google-sheets", label: "Google スプレッドシート" },
    { id: "google-slides", label: "Google スライド" },
  ]},
  { category: "デザイン・クリエイティブ", items: [
    { id: "adobe-photoshop", label: "Adobe Photoshop" },
    { id: "adobe-illustrator", label: "Adobe Illustrator" },
    { id: "adobe-premiere", label: "Adobe Premiere Pro" },
    { id: "figma", label: "Figma" },
    { id: "canva", label: "Canva" },
  ]},
  { category: "コミュニケーション", items: [
    { id: "outlook", label: "Outlook" },
    { id: "gmail", label: "Gmail" },
    { id: "slack", label: "Slack" },
    { id: "teams", label: "Microsoft Teams" },
    { id: "zoom", label: "Zoom" },
  ]},
  { category: "開発・その他", items: [
    { id: "vscode", label: "VS Code" },
    { id: "notion", label: "Notion" },
    { id: "github", label: "GitHub" },
  ]},
];

export default function Home() {
  const [step, setStep] = useState(0);
  const [selectedPurposes, setSelectedPurposes] = useState([]);
  const [otherPurpose, setOtherPurpose] = useState("");
  const [skill, setSkill] = useState(null);
  const [budget, setBudget] = useState(null);
  const [machine, setMachine] = useState(null);
  const [selectedApps, setSelectedApps] = useState([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [rating, setRating] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [followUp, setFollowUp] = useState(null);
  const [followUpLoading, setFollowUpLoading] = useState(false);

  const togglePurpose = (id) => setSelectedPurposes((prev) => prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]);
  const toggleApp = (id) => setSelectedApps((prev) => prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]);

  const totalSteps = 5;
  const canProceed = () => {
    if (step === 0) return selectedPurposes.length > 0 || otherPurpose.trim() !== "";
    if (step === 1) return skill !== null;
    if (step === 2) return budget !== null;
    if (step === 3) return machine !== null;
    if (step === 4) return selectedApps.length > 0;
    return false;
  };

  const handleSubmit = async () => {
    setLoading(true); setError(null);
    const purposeLabels = selectedPurposes.map((id) => PURPOSES.find((p) => p.id === id)?.label);
    const skillLabel = SKILLS.find((s) => s.id === skill)?.label;
    const budgetLabel = BUDGETS.find((b) => b.id === budget)?.label;
    const machineLabel = MACHINES.find((m) => m.id === machine)?.label;
    const appLabels = selectedApps.map((id) => APPS.flatMap(c => c.items).find((a) => a.id === id)?.label);
    const userProfile = `【ユーザーの回答】\n・目的: ${purposeLabels.join("、")}${otherPurpose ? `、その他: ${otherPurpose}` : ""}\n・スキルレベル: ${skillLabel}\n・予算: ${budgetLabel}\n・使用マシン: ${machineLabel}\n・使用アプリ: ${appLabels.join("、")}`;
    try {
      const response = await fetch("/api/diagnose", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ userProfile }) });
      const parsed = await response.json();
      if (!response.ok || parsed.error) throw new Error(parsed.error || "Diagnosis failed");
      setResult(parsed); setStep(5);
    } catch (err) {
      console.error(err);
      setError(err.message || "診断中にエラーが発生しました。もう一度お試しください。");
    } finally { setLoading(false); }
  };

  const handleFollowUp = async () => {
    setFollowUpLoading(true); setError(null);
    const purposeLabels = selectedPurposes.map((id) => PURPOSES.find((p) => p.id === id)?.label);
    const skillLabel = SKILLS.find((s) => s.id === skill)?.label;
    const budgetLabel = BUDGETS.find((b) => b.id === budget)?.label;
    const machineLabel = MACHINES.find((m) => m.id === machine)?.label;
    const appLabels = selectedApps.map((id) => APPS.flatMap(c => c.items).find((a) => a.id === id)?.label);
    const context = `【元の診断条件】\n・目的: ${purposeLabels.join("、")}${otherPurpose ? `、その他: ${otherPurpose}` : ""}\n・スキルレベル: ${skillLabel}\n・予算: ${budgetLabel}\n・使用マシン: ${machineLabel}\n・使用アプリ: ${appLabels.join("、")}\n\n【前回の提案】\nメインツール: ${result.mainTool}\n組み合わせ: ${result.combo?.map(c => c.tool + "(" + c.use + ")").join("、")}\n\n【ユーザーの評価】${rating}/5\n【ユーザーの疑問・要望】\n${feedback}`;
    try {
      const response = await fetch("/api/diagnose", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ userProfile: context, isFollowUp: true }) });
      const parsed = await response.json();
      if (!response.ok || parsed.error) throw new Error(parsed.error || "Follow-up failed");
      setFollowUp(parsed);
    } catch (err) {
      setError(err.message || "追加質問中にエラーが発生しました。");
    } finally { setFollowUpLoading(false); }
  };

  const reset = () => {
    setStep(0); setSelectedPurposes([]); setOtherPurpose("");
    setSkill(null); setBudget(null); setMachine(null); setSelectedApps([]);
    setResult(null); setError(null); setRating(null); setFeedback(""); setFollowUp(null); setFollowUpLoading(false);
  };

  const progress = step < totalSteps ? ((step + 1) / totalSteps) * 100 : 100;
  const S = {
    page: { minHeight: "100vh", background: "linear-gradient(135deg, #0a0a1a 0%, #1a1a3e 40%, #2d1b4e 70%, #1a0a2e 100%)", fontFamily: "'Segoe UI', 'Hiragino Sans', 'Noto Sans JP', sans-serif", color: "#e8e6f0", padding: "20px", display: "flex", justifyContent: "center" },
    wrap: { maxWidth: 680, width: "100%" },
    badge: { fontSize: 11, letterSpacing: 6, textTransform: "uppercase", color: "#a78bfa", marginBottom: 8, fontWeight: 600 },
    h1: { fontSize: 28, fontWeight: 800, margin: 0, background: "linear-gradient(90deg, #c4b5fd, #a78bfa, #818cf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", lineHeight: 1.3 },
    sub: { color: "#9990b8", fontSize: 13, marginTop: 8 },
    q: { fontSize: 18, fontWeight: 700, marginBottom: 4, color: "#ddd6fe" },
    hint: { fontSize: 12, color: "#8880a8", marginBottom: 16 },
    secLbl: { fontSize: 11, color: "#a78bfa", fontWeight: 600, marginBottom: 12, letterSpacing: 2 },
    catLbl: { fontSize: 12, fontWeight: 700, color: "#a78bfa", marginBottom: 8, marginTop: 14 },
  };
  const card = (sel) => ({ background: sel ? "linear-gradient(135deg, rgba(167,139,250,0.25), rgba(129,140,248,0.2))" : "rgba(255,255,255,0.04)", border: sel ? "1.5px solid rgba(167,139,250,0.6)" : "1.5px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: "14px 18px", cursor: "pointer", textAlign: "left", transition: "all 0.2s", color: "#e8e6f0" });
  const chipStyle = (sel) => ({ display: "inline-flex", alignItems: "center", padding: "8px 16px", borderRadius: 20, fontSize: 13, fontWeight: 500, cursor: "pointer", transition: "all 0.2s", background: sel ? "linear-gradient(135deg, rgba(167,139,250,0.3), rgba(129,140,248,0.25))" : "rgba(255,255,255,0.04)", border: sel ? "1.5px solid rgba(167,139,250,0.6)" : "1.5px solid rgba(255,255,255,0.1)", color: sel ? "#ddd6fe" : "#9990b8" });
  const nextBtn = (ok) => ({ padding: "10px 28px", background: ok ? "linear-gradient(135deg, #a78bfa, #818cf8)" : "rgba(255,255,255,0.06)", border: "none", borderRadius: 10, color: ok ? "#fff" : "#666", fontSize: 14, fontWeight: 600, cursor: ok ? "pointer" : "not-allowed", opacity: ok ? 1 : 0.4 });
  const rsec = { background: "rgba(255,255,255,0.04)", border: "1.5px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 20, marginBottom: 14 };

  return (
    <div style={S.page}><div style={S.wrap}>
      <div style={{ textAlign: "center", marginBottom: 32, paddingTop: 20 }}>
        <div style={S.badge}>AI Tool Diagnostic</div>
        <h1 style={S.h1}>あなたにピッタリの<br/>生成AIツール診断</h1>
        <p style={S.sub}>5つの質問に答えるだけで、最適なAIツールの組み合わせがわかります</p>
      </div>

      {step < totalSteps && <div style={{ marginBottom: 28 }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#8880a8", marginBottom: 6 }}><span>Q{step + 1} / {totalSteps}</span><span>{Math.round(progress)}%</span></div>
        <div style={{ height: 3, background: "rgba(167,139,250,0.15)", borderRadius: 2, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${progress}%`, background: "linear-gradient(90deg, #a78bfa, #818cf8)", borderRadius: 2, transition: "width 0.4s ease" }} />
        </div>
      </div>}

      {step === 0 && <div>
        <h2 style={S.q}>Q1. 何に使いたいですか？</h2>
        <p style={S.hint}>複数選択OK。当てはまるものをすべて選んでください。</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {PURPOSES.map((p) => <button key={p.id} onClick={() => togglePurpose(p.id)} style={card(selectedPurposes.includes(p.id))}>
            <div style={{ fontSize: 20, marginBottom: 4 }}>{p.icon}</div>
            <div style={{ fontSize: 13, fontWeight: 600 }}>{p.label}</div>
            <div style={{ fontSize: 11, color: "#9990b8", marginTop: 2 }}>{p.desc}</div>
          </button>)}
        </div>
        <div style={{ marginTop: 18, background: "linear-gradient(135deg, rgba(167,139,250,0.12), rgba(129,140,248,0.08))", border: "1.5px solid rgba(167,139,250,0.35)", borderRadius: 14, padding: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#c4b5fd", marginBottom: 4 }}>💬 具体的な目的があればぜひお書きください！</div>
          <div style={{ fontSize: 11, color: "#9990b8", marginBottom: 10 }}>例：「生成AIでWebアプリを作りたい」「ECサイトの業務を自動化したい」など、具体的に書くほどピッタリの提案ができます</div>
          <textarea placeholder="具体的なやりたいことを自由にお書きください..." value={otherPurpose} onChange={(e) => setOtherPurpose(e.target.value)}
            style={{ width: "100%", boxSizing: "border-box", padding: "10px 14px", background: "rgba(255,255,255,0.04)", border: "1.5px solid rgba(255,255,255,0.08)", borderRadius: 10, color: "#e8e6f0", fontSize: 13, outline: "none", minHeight: 80, resize: "vertical", fontFamily: "inherit" }} />
        </div>
      </div>}

      {step === 1 && <div>
        <h2 style={S.q}>Q2. AIツールの経験は？</h2>
        <p style={S.hint}>一番近いものを選んでください。</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {SKILLS.map((s) => <button key={s.id} onClick={() => setSkill(s.id)} style={card(skill === s.id)}>
            <div style={{ fontSize: 15, fontWeight: 600 }}>{s.label}</div>
            <div style={{ fontSize: 12, color: "#9990b8", marginTop: 3 }}>{s.desc}</div>
          </button>)}
        </div>
      </div>}

      {step === 2 && <div>
        <h2 style={S.q}>Q3. 月額の予算は？</h2>
        <p style={S.hint}>AIツールに使える毎月の金額を選んでください。</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {BUDGETS.map((b) => <button key={b.id} onClick={() => setBudget(b.id)} style={card(budget === b.id)}>
            <div style={{ fontSize: 14, fontWeight: 600 }}>{b.label}</div>
            <div style={{ fontSize: 11, color: "#9990b8", marginTop: 2 }}>{b.desc}</div>
          </button>)}
        </div>
      </div>}

      {step === 3 && <div>
        <h2 style={S.q}>Q4. 使用しているマシンは？</h2>
        <p style={S.hint}>メインで使っているものを選んでください。</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {MACHINES.map((m) => <button key={m.id} onClick={() => setMachine(m.id)} style={card(machine === m.id)}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 22 }}>{m.icon}</span>
              <span style={{ fontSize: 15, fontWeight: 600 }}>{m.label}</span>
            </div>
          </button>)}
        </div>
      </div>}

      {step === 4 && <div>
        <h2 style={S.q}>Q5. 普段使っているアプリは？</h2>
        <p style={S.hint}>複数選択OK。使っているものをすべて選んでください。</p>
        {APPS.map((cat) => (
          <div key={cat.category}>
            <div style={S.catLbl}>{cat.category}</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 4 }}>
              {cat.items.map((app) => (
                <button key={app.id} onClick={() => toggleApp(app.id)} style={chipStyle(selectedApps.includes(app.id))}>
                  {selectedApps.includes(app.id) && <span style={{ marginRight: 4 }}>✓</span>}
                  {app.label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>}

      {loading && <div style={{ textAlign: "center", padding: "60px 0" }}>
        <div style={{ width: 48, height: 48, border: "3px solid rgba(167,139,250,0.2)", borderTopColor: "#a78bfa", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 20px" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <p style={{ color: "#a78bfa", fontSize: 15, fontWeight: 600 }}>あなたに最適な組み合わせを分析中...</p>
        <p style={{ color: "#8880a8", fontSize: 12, marginTop: 4 }}>AIが回答を元にベストな提案を考えています</p>
      </div>}

      {error && <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 12, padding: 20, textAlign: "center", marginTop: 20 }}>
        <p style={{ color: "#fca5a5", fontSize: 14 }}>{error}</p>
        <button onClick={() => { setError(null); handleSubmit(); }} style={{ marginTop: 12, padding: "8px 20px", background: "rgba(239,68,68,0.2)", border: "1px solid rgba(239,68,68,0.4)", borderRadius: 8, color: "#fca5a5", cursor: "pointer", fontSize: 13 }}>リトライ</button>
      </div>}

      {step === 5 && result && !loading && <div>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{ fontSize: 11, letterSpacing: 4, color: "#a78bfa", marginBottom: 6, fontWeight: 600 }}>YOUR BEST MATCH</div>
          <h2 style={{ fontSize: 22, fontWeight: 800, margin: 0, color: "#ddd6fe" }}>{result.title}</h2>
        </div>
        <div style={{ background: "linear-gradient(135deg, rgba(167,139,250,0.15), rgba(129,140,248,0.1))", border: "1.5px solid rgba(167,139,250,0.3)", borderRadius: 16, padding: 20, marginBottom: 14 }}>
          <div style={S.secLbl}>MAIN TOOL</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: "#e8e6f0", marginBottom: 8 }}>{result.mainTool}</div>
          <p style={{ fontSize: 13, color: "#b8b0d0", lineHeight: 1.6, margin: 0 }}>{result.mainToolReason}</p>
        </div>
        <div style={rsec}>
          <div style={S.secLbl}>おすすめの組み合わせ</div>
          {result.combo?.map((c, i) => <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: i < result.combo.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none" }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(167,139,250,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#a78bfa", flexShrink: 0 }}>{i + 1}</div>
            <div><div style={{ fontSize: 14, fontWeight: 600, color: "#e8e6f0" }}>{c.tool}</div><div style={{ fontSize: 12, color: "#9990b8" }}>{c.use}</div></div>
          </div>)}
          <div style={{ marginTop: 12, padding: "8px 12px", background: "rgba(167,139,250,0.08)", borderRadius: 8, fontSize: 13, color: "#b8b0d0" }}>
            💰 月額目安: <strong style={{ color: "#ddd6fe" }}>{result.monthlyCost}</strong>
          </div>
        </div>
        <div style={rsec}>
          <div style={S.secLbl}>💡 活用のコツ</div>
          {result.tips?.map((tip, i) => <div key={i} style={{ fontSize: 13, color: "#b8b0d0", lineHeight: 1.6, padding: "6px 0", borderBottom: i < result.tips.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>{tip}</div>)}
        </div>
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px dashed rgba(255,255,255,0.1)", borderRadius: 14, padding: 16, marginBottom: 20 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: "#9990b8", marginBottom: 6 }}>🔄 {result.alternativeTitle}</div>
          <p style={{ fontSize: 12, color: "#8880a8", lineHeight: 1.6, margin: 0 }}>{result.alternative}</p>
        </div>

        <div style={{ background: "linear-gradient(135deg, rgba(167,139,250,0.1), rgba(129,140,248,0.06))", border: "1.5px solid rgba(167,139,250,0.25)", borderRadius: 16, padding: 20, marginBottom: 20 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#c4b5fd", marginBottom: 12 }}>この診断結果に納得しましたか？</div>
          <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
            {[1,2,3,4,5].map((n) => (
              <button key={n} onClick={() => setRating(n)} style={{
                width: 44, height: 44, borderRadius: 10, fontSize: 16, fontWeight: 700, cursor: "pointer",
                background: rating === n ? "linear-gradient(135deg, #a78bfa, #818cf8)" : "rgba(255,255,255,0.06)",
                border: rating === n ? "1.5px solid rgba(167,139,250,0.8)" : "1.5px solid rgba(255,255,255,0.1)",
                color: rating === n ? "#fff" : "#9990b8", transition: "all 0.2s",
              }}>{n}</button>
            ))}
            <span style={{ fontSize: 11, color: "#8880a8", alignSelf: "center", marginLeft: 4 }}>1=不満 → 5=満足</span>
          </div>

          {rating !== null && rating <= 3 && !followUp && (
            <div style={{ marginTop: 8 }}>
              <div style={{ fontSize: 12, color: "#b8b0d0", marginBottom: 8 }}>
                {rating <= 2 ? "💬 どんな点が気になりましたか？他に気になるツールがあればぜひ教えてください。" : "💬 もっと良い提案ができるかもしれません。気になる点を教えてください。"}
              </div>
              <textarea placeholder="例：Gammaの方がプレゼン作成には向いているのでは？ / もっと簡単なツールはない？" value={feedback} onChange={(e) => setFeedback(e.target.value)}
                style={{ width: "100%", boxSizing: "border-box", padding: "10px 14px", background: "rgba(255,255,255,0.04)", border: "1.5px solid rgba(255,255,255,0.08)", borderRadius: 10, color: "#e8e6f0", fontSize: 13, outline: "none", minHeight: 70, resize: "vertical", fontFamily: "inherit" }} />
              <button onClick={handleFollowUp} disabled={!feedback.trim() || followUpLoading}
                style={{ marginTop: 10, padding: "10px 24px", background: feedback.trim() ? "linear-gradient(135deg, #a78bfa, #818cf8)" : "rgba(255,255,255,0.06)", border: "none", borderRadius: 10, color: feedback.trim() ? "#fff" : "#666", fontSize: 13, fontWeight: 600, cursor: feedback.trim() ? "pointer" : "not-allowed", opacity: feedback.trim() ? 1 : 0.4 }}>
                {followUpLoading ? "分析中..." : "AIに質問する 💬"}
              </button>
            </div>
          )}

          {rating !== null && rating >= 4 && !followUp && (
            <div style={{ marginTop: 8, fontSize: 13, color: "#a78bfa" }}>✨ ありがとうございます！この組み合わせでぜひ始めてみてください。</div>
          )}
        </div>

        {followUp && (
          <div style={{ background: "linear-gradient(135deg, rgba(52,211,153,0.1), rgba(16,185,129,0.06))", border: "1.5px solid rgba(52,211,153,0.3)", borderRadius: 16, padding: 20, marginBottom: 20 }}>
            <div style={{ fontSize: 11, letterSpacing: 3, color: "#34d399", fontWeight: 600, marginBottom: 10 }}>💬 AIからの回答</div>
            <p style={{ fontSize: 13, color: "#d1fae5", lineHeight: 1.8, margin: "0 0 16px 0", whiteSpace: "pre-wrap" }}>{followUp.answer}</p>
            {followUp.comparison && (
              <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 10, padding: 14, marginBottom: 14 }}>
                <div style={{ fontSize: 11, color: "#34d399", fontWeight: 600, marginBottom: 6, letterSpacing: 2 }}>🔍 ツール比較</div>
                <p style={{ fontSize: 12, color: "#a7f3d0", lineHeight: 1.7, margin: 0 }}>{followUp.comparison}</p>
              </div>
            )}
            {followUp.revisedRecommendation && (
              <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 10, padding: 14 }}>
                <div style={{ fontSize: 11, color: "#34d399", fontWeight: 600, marginBottom: 6, letterSpacing: 2 }}>✅ 修正後のおすすめ</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#e8e6f0", marginBottom: 4 }}>{followUp.revisedRecommendation.mainTool}</div>
                <p style={{ fontSize: 12, color: "#a7f3d0", lineHeight: 1.6, margin: "0 0 8px 0" }}>{followUp.revisedRecommendation.reason}</p>
                {followUp.revisedRecommendation.combo?.map((c, i) => (
                  <div key={i} style={{ fontSize: 12, color: "#d1fae5", padding: "3px 0" }}>• {c.tool} → {c.use}</div>
                ))}
              </div>
            )}
          </div>
        )}

        <div style={{ textAlign: "center" }}>
          <button onClick={reset} style={{ padding: "12px 32px", background: "linear-gradient(135deg, rgba(167,139,250,0.2), rgba(129,140,248,0.15))", border: "1.5px solid rgba(167,139,250,0.4)", borderRadius: 10, color: "#ddd6fe", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>もう一度診断する</button>
        </div>
      </div>}

      {step < totalSteps && !loading && !error && <div style={{ display: "flex", justifyContent: "space-between", marginTop: 24, gap: 12 }}>
        <button onClick={() => setStep(Math.max(0, step - 1))} style={{ padding: "10px 20px", background: "rgba(255,255,255,0.04)", border: "1.5px solid rgba(255,255,255,0.08)", borderRadius: 10, color: "#9990b8", fontSize: 13, cursor: "pointer", visibility: step === 0 ? "hidden" : "visible" }}>← 戻る</button>
        <button onClick={() => step === totalSteps - 1 ? handleSubmit() : setStep(step + 1)} disabled={!canProceed()} style={nextBtn(canProceed())}>
          {step === totalSteps - 1 ? "診断する ✨" : "次へ →"}
        </button>
      </div>}

      <div style={{ textAlign: "center", marginTop: 40, paddingBottom: 20, fontSize: 11, color: "#5a5478" }}>
        Powered by Claude API — AI Tool Diagnostic v2.0
      </div>
    </div></div>
  );
}
