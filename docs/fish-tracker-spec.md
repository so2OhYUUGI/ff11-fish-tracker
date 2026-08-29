/**
 * ============================================================================
 * [FilePath] docs/fish-tracker-spec.md
 * [Role]     釣魚チェッカーの機能仕様、データ構造、およびファイル配置の定義
 * 
 * [概要]
 * - FF11の釣魚進捗管理および釣りデータ（魚、エリア、餌、竿）の参照Webアプリ機能の専用仕様書。
 * - LocalStorage によるユーザー進捗管理とURLエンコードによる共有・OGP機能を統合。
 * 
 * [データ構造仕様]
 * - マスターデータ (fishes, zones, baits, locations, relations)
 * - ユーザー進捗 (checkedFishIds: number[])
 * 
 * [編集・改修時の注意事項]
 * 1. 【リレーション参照】魚・エリア・餌の結びつきは単体埋め込みではなく必ずマスターリレーションを参照すること。
 * 2. 【カード・リスト仕様】カードは3段構成、リストは横並び1行（高密度2段）の垂直高さを維持すること。
 * ============================================================================
 */

# 釣魚チェッカー 仕様書

## 1. 概要
- **目的**: FF11の釣魚進捗管理および釣りデータ（魚・エリア・餌・竿）の参照。
- **データ設計指針**: Windower Resources のデータ仕様・ID体系をベースとし、アプリ独自の補足データ（上限スキル、ハラキリ等）と LocalStorage によるユーザー進捗を統合。

---

## 2. 釣魚チェッカー専用ファイル一覧

| ファイル | 役割 |
|---|---|
| `src/types/fishtracker.ts` | 釣魚チェッカーの型定義（Windower互換データ、アプリ拡張、進捗構造） |
| `src/features/fishtracker/FilterBar.tsx` | メインナビゲーション（魚/エリア/餌切替）、達成状態フィルター、プログレス表示、検索フォーム |
| `src/features/fishtracker/FishTrackerContainer.tsx` | 魚チェッカーメイン領域のコンテナ。タブ切替・フィルター状態管理・チェック操作の受付 |
| `src/features/fishtracker/FishTrackerContent.tsx` | 魚チェッカーメイン領域の表示切替（魚/エリア/餌の各カード・リスト・詳細表示） |
| `src/features/fishtracker/fish/FishCard.tsx` | 個別魚カード（スペック表示、エリア情報の表示と+Nバッジ表示、アクセシビリティ対応） |
| `src/features/fishtracker/fish/FishListItem.tsx` | リスト表示用個別魚行コンポーネント（詳細パネル内での `variant="inline"` 対応、アクセシビリティ対応） |
| `src/features/fishtracker/fish/FishDetailView.tsx` | 魚詳細情報表示コンポーネント（アクセシビリティ・ユニークキー対応） |
| `src/features/fishtracker/area/AreaCard.tsx` | 個別エリアカード（基本情報および釣れる魚のタグ一覧＋+Nバッジ表示、アクセシビリティ・ユニークキー対応） |
| `src/features/fishtracker/area/AreaListItem.tsx` | リスト表示用個別エリア行コンポーネント（対象魚の総数バッジ表示、`useMemo`・改行エスケープ最適化、アクセシビリティ対応） |
| `src/features/fishtracker/area/AreaDetailView.tsx` | エリア詳細情報表示コンポーネント（魚チェック・スタック遷移連携、アクセシビリティ・ユニークキー対応） |
| `src/features/fishtracker/bait/BaitCard.tsx` | 個別餌カード（基本情報および釣れる魚のタグ一覧＋+Nバッジ表示、アクセシビリティ対応） |
| `src/features/fishtracker/bait/BaitListItem.tsx` | リスト表示用個別餌行コンポーネント（説明文横並び＋対象魚の総数バッジ表示、`useMemo`・改行エスケープ最適化、アクセシビリティ対応） |
| `src/features/fishtracker/bait/BaitDetailView.tsx` | 餌詳細情報表示コンポーネント（魚チェック・スタック遷移連携、アクセシビリティ対応） |
| `src/styles/features/FishTrackerStyle.ts` | 魚チェッカー CSSクラス定義（`FISH_STYLES`） |
| `src/data/` | マスターデータおよびリレーション定義（`fishes`, `zones`, `baits`, `locations`, `relations`） |

---

## 3. データ構造仕様 (`src/types/fishtracker.ts`)

### **データ宣言**
- `src/types/`以下にあるファイルの宣言に従うこと。

### **リレーションデータ**
- `FISH_LOCATIONS`: 魚ID (`fishId`) と エリアID (`zoneId`) の紐付け
- `FISH_BAIT_RELATIONS`: 魚ID (`fishId`) と 餌ID (`baitId`) の紐付け
- `FISH_ROD_RELATIONS`: 魚ID (`fishId`) と 竿ID (`rodId`) の相性データ

### **ユーザー進捗 (`CharacterProgress`)**
- LocalStorage キー: `ff11_fish_tracker_user_data`
- `checkedFishIds`: 達成済みの魚ID（`number[]`）を保持

### **共有・OGP関連データ**
- 共有URLクエリパラメータ: `share`（Base64 URL Safe等でエンコードされた文字列）
- デコード後構造: `{ characterName: string, checkedFishIds: number[] }`
- OGPカード生成用データ: `buildShareCardData` により算出（キャラクター名、達成数、全魚種数、達成率、上位獲得魚リスト等）

---

## 4. UI/UX・表示仕様

### **カード表示 (`AreaCard`, `BaitCard`, `FishCard`)**
- カードの垂直高さを適正に保ちつつ、情報網羅性を高める **3段構成** を採用する。
  1. **上段:** 名称表示領域（日本語名・英語名の縦並び）
  2. **中段:** 説明文領域 (`CARD_STYLES.descriptionBox`)
  3. **下段:** 関連データ一覧表示（`Fish`アイコン + 「釣れる魚 (N):」 + タグ最大2件 + 超過分の `+N` バッジ）

### **リスト表示 (`AreaListItem`, `BaitListItem`, `FishListItem`)**
- 垂直方向への高速スキャンと高密度表示を実現する **横並び構成** を採用する。
  - 縦に段数を増やさず（3段目の追加を禁止）、1行（高密度2段）の垂直高さを維持する。
  - **構成:** 左側:名称（縦並び） / 中央:説明文（1行 truncate・右寄せ） / 右端:総数インジケーター（`Fish`アイコン + 件数バッジ）。

### **ヘッダーアイコンのカラー定義**
- **魚（Fish）:** シアン (`text-cyan-400`)
- **エリア（MapPin）:** エメラルド / レッド (`text-red-400` 等)
- **エサ（Disc / Utensils）:** アンバー (`text-amber-400`)

---

## 5. 主要機能仕様

### **① 魚・エリア・餌の切替表示とフィルタリング**
- 各タブ（魚 / エリア / 餌）でのカード表示およびリスト表示の切り替え。
- 達成状態フィルターやキーワード検索による絞り込み。

### **② 詳細ビューとスタック遷移連携**
- 各アイテム選択時の詳細情報表示、および関連データ（釣れる魚やエリア等）への相互リンク・スタック遷移。

### **③ SNS共有と動的OGP**
- クエリパラメータ `share` を用いた釣獲進捗データのエンコード・デコード、および Cloudflare Workers / OGP画像生成（/api/ogp）によるSNS共有対応。

---

## 6. 実装規約（釣魚チェッカー固有）

- **リレーションデータの参照基準**:
  - 魚・エリア・餌の結びつきを表示する際は、単体マスターの埋め込み配列ではなく、必ずマスターリレーションデータ（`FISH_LOCATIONS`, `FISH_BAIT_RELATIONS` 等）を参照して動的に算出すること。
- **カード内要素の溢れ制限デザイン**:
  - カード内に可変長の関連要素（エリア名や魚名）をタグ表示する場合は、原則として上位2件を表示し、超過分は `+N` のバッジ形式でカウント表示してカードの高さを保持すること。
- **改行処理およびキー指定**:
  - テキストデータ改行時の安全な分割レンダリング（`/\r?\n|\\n/`）およびユニークなキー（`key={`${index}-${line.slice(0, 10)}`}`）指定を徹底すること。