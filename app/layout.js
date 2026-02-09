export const metadata = {
  title: "生成AIツール診断 | あなたにピッタリのAIを見つけよう",
  description: "4つの質問に答えるだけで、最適な生成AIツールの組み合わせがわかる診断ツール",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
