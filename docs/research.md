# 人生レシート 2026 調査メモ

作成日: 2026-05-23

## 採用するアプリ

**人生レシート 2026** を作る。ユーザーが1週間の睡眠、仕事、歩く、友達、創作、スクロール、回復、考えすぎ、おうちカフェ、よろこびを入力すると、SNSに貼りやすい縦長のレシート画像へ変換するフロントエンド完結アプリ。

## なぜ今作るか

- TikTok Next 2026 は、過度に作り込まれた演出より、現実感、制作過程、共同体験、感情の検証へ寄ると示している。生活ログを「ちゃんと生きてる」証拠に変換する体験はこの流れに合う。
- TikTok Next 2026 の Emotional ROI は、消費や行動の意味を再計算する文脈を押し出している。人生レシートは、お金ではなく時間と回復の価値を再計算する。
- Pew Research Center の2026年4月調査では、米国ティーンはTikTok/Instagram/Snapchatを娯楽とつながりに使い、TikTok利用者の約6割が商品レビュー目的でも使う。共有できる「自分の結果」は、娯楽と会話の両方に乗りやすい。
- Pinterest Predicts 2026 は、手紙、懐古、個人美学、変な美しさのような触感ある自己表現を予測している。コンビニレシート風の紙モチーフは、デジタルなのに触感がある。
- Adobe 2026 Creative Trends は、感情接続、人間味、ローカル文化、遊びある実験を重視している。日本語のレシート表現は、海外のWrapped/Receiptify型を日本語圏に寄せられる。

## フロントエンド完結の設計

- 保存: `localStorage` に入力値、テーマ、文面を保存する。MDNは `localStorage` がブラウザーセッションを越えて保存されるWeb Storageであると説明している。
- 画像化: `canvas.toBlob()` でレシートをPNG化する。MDNは `toBlob()` がキャンバス内容を表す `Blob` を作るAPIだと説明している。
- 共有: 対応環境では Web Share API で画像ファイルまたはテキストを共有し、非対応環境ではPNGダウンロードへフォールバックする。
- 個人情報: すべて端末内で処理し、ログイン、外部API、トラッキング、画像アップロードを使わない。

## バズ仮説

- 1分以内に入力が終わり、結果が縦長画像として単体で意味を持つ。
- 「TOTAL 168h」「EMOTIONAL TAX」「RECOVERY CREDIT」のように、真面目だが少し笑える言葉で自己開示しやすい。
- 2016フィルター、Glitchy Glam、Poetcore、Reali-Tea のテーマで、同じフォーマットでも投稿者ごとの見た目が変わる。
- 友達に「今週の人生レシート」を送りやすく、比較とツッコミが自然に発生する。

## 主要ソース

- TikTok For Business: https://ads.tiktok.com/business/en/next
- Pew Research Center: https://www.pewresearch.org/internet/2026/04/15/teens-experiences-on-tiktok-instagram-and-snapchat/
- Pinterest Predicts 2026: https://business.pinterest.com/en-gb/pdf/pinterest-predicts/2026-marketing-playbook
- Adobe Creative Trends: https://business.adobe.com/au/resources/creative-trends-report.html
- MDN `HTMLCanvasElement.toBlob()`: https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toBlob
- MDN Web Share API: https://developer.mozilla.org/en-US/docs/Web/API/Web_Share_API
- MDN `localStorage`: https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage

## デザイン参照

生成したコンセプト: `assets/life-receipt-concept.png`
