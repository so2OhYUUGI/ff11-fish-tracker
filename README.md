# FF11 釣魚チェッカー (ff11-fish-tracker)

FINAL FANTASY XI（FF11）の釣魚進捗管理アプリケーションです。  
Windower Resources のデータ仕様・ID体系をベースにしており、複数キャラクターの釣り達成率の管理、ハラキリ・恵比寿・太公望関連魚のフィルタリングが可能です。

## 特徴

- **Windower Resource 準拠**: アイテムID、ゾーンID等を Windower 互換で管理
- **マルチキャラクター対応**: 複数キャラの釣果を切り替えて管理（LocalStorage保存）
- **各種フィルタリング**: 限界スキル、大型/小型、ハラキリ、クエスト対象魚での絞り込み
- **モダンなUI/UX**: Vite + React + TypeScript + Tailwind CSS による高速・レスポンシブ動作

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
├── components/     # UIコンポーネント (Header, FilterBar, FishCard, AdBanner)
├── data/           # マスターデータ・テストデータ (mockData.ts)
├── hooks/          # カスタムフック (useUserData.ts - LocalStorage管理)
├── types/          # TypeScript型定義 (fish.ts)
├── App.tsx         # メインアプリケーションコンポーネント
└── main.tsx        # エントリーポイント
\`\`\`

## ライセンス / 権利表記

FINAL FANTASY XI is a registered trademark of Square Enix Holdings Co., Ltd.  
© SQUARE ENIX CO., LTD. All Rights Reserved.