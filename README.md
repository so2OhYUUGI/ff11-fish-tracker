# FF11 釣魚チェッカー (ff11-fish-tracker)

FINAL FANTASY XI（FF11）の釣魚進捗管理および釣りデータ参照アプリケーションです。  
Windower Resources のデータ仕様・ID体系をベースにしており、複数キャラクターの釣り達成率の管理、ハラキリ・恵比寿・太公望関連魚のフィルタリング、エリア・餌データの閲覧が可能です。

## 特徴

- **Windower Resource 準拠**: アイテムID、ゾーンID等を Windower 互換で管理
- **マルチキャラクター対応**: 複数キャラの釣果を切り替えて管理（LocalStorage保存）
- **詳細なフィルタリング機能**: 限界スキル、大型/小型、ハラキリ、クエスト対象魚での絞り込み
- **エリア・餌データの充実**: 釣れる魚の総数表示、タグ一覧表示、インタラクティブな相互リンク機能
- **カード / リスト表示切り替え**: 高密度リスト・詳細カード表示のフレキシブルなレイアウト
- **モダンなUI/UX**: Vite + React + TypeScript + Tailwind CSS (Lucide React) による高速・レスポンシブ動作

## 開発環境のセットアップ

### 前提条件
- Node.js (v18以上推奨)
- npm

### 起動手順

\`\`\`bash
# パッケージのインストール
npm install

# 開発用サーバーの起動
npm run dev
\`\`\`

ブラウザで http://localhost:5173 にアクセスします。

## ディレクトリ構成

\`\`\`text
src/
├── components/     # UIコンポーネント
│   ├── area/       # エリア関連 (AreaCard, AreaListItem, AreaDetailView)
│   ├── bait/       # 餌関連 (BaitCard, BaitListItem, BaitDetailView)
│   ├── fish/       # 魚関連 (FishCard, FishListItem, FishDetailView)
│   ├── settings/  	# ユーザの環境設定関連
│   ├── dev/     		# マスター編集関連
│   └── ...
├── data/           # マスターデータ・リレーションデータ (fishes, zones, baits, locations, etc.)
├── hooks/          # カスタムフック (useUserData.ts - LocalStorage管理)
├── styles/         # スタイル定数 (cardStyles, listStyles など)
├── types/          # TypeScript型定義 (fish.ts)
├── App.tsx         # メインアプリケーションコンポーネント
└── main.tsx        # エントリーポイント
\`\`\`

## ライセンス / 権利表記

FINAL FANTASY XI is a registered trademark of Square Enix Holdings Co., Ltd.  
© SQUARE ENIX CO., LTD. All Rights Reserved.