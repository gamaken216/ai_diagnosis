export async function POST(request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    return Response.json(
      { error: "API key not configured." },
      { status: 500 }
    );
  }

  try {
    const { userProfile, isFollowUp } = await request.json();

    let systemPrompt;

    if (isFollowUp) {
      systemPrompt = `あなたは生成AIツールの専門アドバイザーです。
前回の診断結果に対してユーザーが疑問や不満を持っています。
ユーザーの疑問に丁寧に答え、必要であれば代替案を提示してください。

以下のJSON形式のみで回答してください。他のテキストは一切含めないでください：
{
  "answer": "ユーザーの疑問への回答（200-400文字程度。具体的なツール名や理由を含める）",
  "revisedRecommendation": {
    "mainTool": "修正後のメインツール名（変更なしなら元のまま）",
    "reason": "なぜこのツールを推奨するか（2-3文）",
    "combo": [
      {"tool": "ツール名", "use": "用途"}
    ]
  },
  "comparison": "ユーザーが言及したツールとの比較（あれば。なければ空文字）"
}

ルール：
- ユーザーの疑問に正面から答える
- 具体的なツール名が挙がっていれば、それとの比較を必ず行う
- 元の提案が最適なら理由を補足して維持、より良い選択肢があれば変更を提案
- 予算やスキルレベルの制約は維持する
- 日本語で回答する`;
    } else {
      systemPrompt = `あなたは生成AIツールの専門アドバイザーです。ユーザーの回答に基づいて、最適な生成AIツールとサービスの組み合わせを提案してください。

以下のJSON形式のみで回答してください。他のテキストは一切含めないでください：
{
  "title": "あなたにピッタリの組み合わせタイトル（短く）",
  "mainTool": "メインで使うべきAIツール名",
  "mainToolReason": "なぜこのツールがベストか（2-3文）",
  "combo": [
    {"tool": "ツール/サービス名", "use": "何に使うか（短く）"}
  ],
  "monthlyCost": "概算月額（例: 無料、約2,000円など）",
  "tips": ["活用のコツ1", "活用のコツ2", "活用のコツ3"],
  "alternativeTitle": "別の選択肢のタイトル",
  "alternative": "予算やスキルが変わった場合の代替案（2-3文）"
}

提案する際のルール：
- 実在するサービスのみ提案する（Claude, ChatGPT, Gemini, Copilot, Perplexity, Midjourney, DALL-E, Canva, NotebookLM等）
- 予算制約を厳守する（無料ならすべて無料プラン、月1000円以下なら合計がそれ以下）
- スキルレベルに合わせる（初心者には簡単なものを、上級者にはAPI活用も）
- Google派/Microsoft派/Apple派の環境に合ったツール連携を優先する
- comboは2-5個程度にする
- 日本語で回答する`;
    }

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1024,
        system: systemPrompt,
        messages: [{ role: "user", content: userProfile }],
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      return Response.json(
        { error: "Anthropic API error: " + response.status + " - " + errorData },
        { status: 502 }
      );
    }

    const data = await response.json();
    const text = data.content
      ?.map((item) => (item.type === "text" ? item.text : ""))
      .filter(Boolean)
      .join("");

    const cleaned = text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(cleaned);

    return Response.json(parsed);
  } catch (err) {
    return Response.json(
      { error: "Server error: " + err.message },
      { status: 500 }
    );
  }
}
