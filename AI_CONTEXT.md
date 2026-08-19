# AI Development Context & Architecture Guide

このドキュメントは、本プロジェクト（ff11-fish-tracker）を開発・保守するAIアシスタントのための仕様書およびガイドラインです。

---

## 1. プロジェクト概要

- **目的**: FF11（ファイナルファンタジー11）の釣魚進捗管理Webアプリ。
- **ターゲット**: 個人プレイヤー（PC/スマホ双方対応）。
- **データ設計指針**: Windower Resources (items.lua, zones.lua) のデータ仕様・ID体系をベースとし、アプリ独自の補足データ（上限スキル、ハラキリ等）および LocalStorage によるユーザー進捗を統合。

---

## 2. 技術スタック & 設定

- **ビルドツール**: Vite
- **UIライブラリ**: React (TypeScript)
- **スタイリング**: Tailwind CSS (v4)
- **アイコン**: lucide-react
- **パスエイリアス**: @/* -> ./src/* (tsconfig.app.json および vite.config.ts でマッピング)
- **モジュール構文**: verbatimModuleSyntax 有効（型インポート時は import type { ... } を使用すること）

---

## 3. データ構造（src/types/fish.ts）

### **魚マスターデータ (FishMaster)**
- id: Windower items.lua 準拠のアイテムID（数値）
- ja / en: 日本語名 / 英語名
- maxSkill: 限界スキルレベル
- sizeType: 'small' | 'large'
- harakiri: ハラキリ対象フラグ (boolean)
- ebisu: 恵比寿の竿関連フラグ (boolean)
- taikobou: 太公望の竿関連フラグ (boolean)
- zoneIds: 釣れるゾーンのID配列（ZoneMaster.id の配列）

### **ユーザー進捗 (UserData / CharacterProgress)**
- LocalStorage キー: ff11_fish_tracker_user_data
- checkedFishIds: 達成済みの魚ID（number[]）を保持

---

## 4. コンポーネント構成と役割

| ファイル | 役割 |
|---|---|
| src/types/fish.ts | 型定義（Windower互換データ、アプリ拡張、進捗構造） |
| src/hooks/useUserData.ts | LocalStorage永続化、キャラ追加/削除/切替、魚チェックON/OFFロジック |
| src/components/Header.tsx | アプリタイトル、キャラ切替UI、進捗バー表示 |
| src/components/FilterBar.tsx | 達成状態フィルター（すべて/未達成/達成済）、名称検索フォーム |
| src/components/FishCard.tsx | 個別魚カード（スペック表示、ワンタップでのチェック切替） |
| src/components/AdBanner.tsx | マネタイズ用広告枠コンポーネント |
| src/data/mockData.ts | 開発・テスト用の模擬マスターデータ |

---

## 5. ユーザープロファイル・応答制約（開発AI向け）

- **応答の原則**: 結論・要点を先に述べ、簡潔かつ直接的に回答すること。
- **締め言葉の禁止**: 回答末尾での感想の質問、感情への同意の要求、過度なまとめや演出、問いかけは一切禁止。結論または成果物の提示のみで簡潔に終了すること。
- **Git運用**: 基本的に main から切り出した機能ブランチ（feature/*）で開発を進める。