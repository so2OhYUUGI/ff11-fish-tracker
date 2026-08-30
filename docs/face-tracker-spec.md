/**
 * ============================================================================
 * [FilePath] docs/face-tracker-spec.md
 * [Role]     フェイス取得チェッカーの機能仕様、データ構造、およびファイル配置の定義
 * 
 * [概要]
 * - FF11のフェイス取得進捗管理、目標リスト（最大3個）、マイフェイス編成の作成・管理・共有機能の専用仕様書。
 * - LocalStorage によるユーザー進捗管理とURLクエリパラメータ（エンコード方式）によるサーバーレス共有機能を統合。
 * - UI表示は横並び高密度リスト（FaceListItem）に一本化し、高速スキャンと情報網羅性を両立。
 * 
 * [データ構造仕様]
 * - マスターデータ (faces, faceCategories, faceRoles)
 * - ユーザー進捗 (checkedFaceIds: number[], targetLists: TargetList[], myParties: MyParty[])
 * 
 * [編集・改修時の注意事項]
 * 1. 【UI/UXの踏襲】高密度横並びリスト、共通トークンの設計思想を適用すること。（カード表示は非採用）
 * 2. 【サーバーレス共有】データの共有はURLエンコード方式を維持し、バックエンドDBに依存しない設計とすること。
 * ============================================================================
 */

# フェイス取得チェッカー 仕様書

## 1. 概要
- **目的**: FF11のフェイス取得進捗管理、ログインキャンペーン等を見据えた「今から集めたいフェイス（最大3つの目標リスト）」、および「マイフェイス編成」の作成とユーザー間共有。
- **対象ユーザー**: 複数キャラクターを管理し、パーティ構成や取得状況を整理したいプレイヤー。
- **データ設計指針**: フェイス基本情報（名前、ロール、カテゴリ、取得方法）と、LocalStorage によるユーザー進捗（取得済み、目標、編成）を統合。

---

## 2. フェイスチェッカー専用ファイル一覧

| ファイル | 役割 |
|---|---|
| `src/types/facetracker.ts` | フェイスチェッカーの型定義（マスターデータ、目標リスト、マイフェイス編成、進捗構造） |
| `src/features/facetracker/FilterBar.tsx` | メインナビゲーション（一覧/目標リスト/マイフェイス切替）、達成状態フィルター、プログレス表示、検索フォーム |
| `src/features/facetracker/FaceTrackerContainer.tsx` | フェイスチェッカーメイン領域のコンテナ。タブ切替・フィルター状態管理・チェック操作の受付 |
| `src/features/facetracker/FaceTrackerContent.tsx` | フェイスチェッカーメイン領域の表示切替（フェイスリスト・詳細表示、目標リスト・編成管理ビュー） |
| `src/features/facetracker/face/FaceListItem.tsx` | リスト表示用個別フェイス行コンポーネント（詳細パネル内での `variant="inline"` 対応、高密度構成、アクセシビリティ対応） |
| `src/features/facetracker/face/FaceDetailView.tsx` | フェイス詳細情報表示コンポーネント（取得方法の改行エスケープ対応、関連目標/編成バッジ表示） |
| `src/features/facetracker/target/TargetListManager.tsx` | 目標リスト（最大3つ）の作成・編集・フェイス追加/削除および共有機能 |
| `src/features/facetracker/party/MyPartyManager.tsx` | マイフェイス編成の作成・メンバー（最大5名＋自分）構成・共有機能 |
| `src/data/faces.ts` | フェイスマスターデータ定義 (`faces`, `faceCategories`, `faceRoles`) |

---

## 3. 共通スタイル・トークン定義ファイル一覧

| ファイル | 役割 |
|---|---|
| `src/styles/tokens/commonTokens.ts` | アプリ全体の共通デザイントークン（カラー、テキスト、バッジ、状態別共通スタイル `COMMON_TOKENS`） |
| `src/styles/components/listStyles.ts` | 横並び高密度リスト専用の共通スタイル定義（`LIST_STYLES`） |
| `src/styles/features/FishTrackerStyle.ts` | 釣魚チェッカー固有スタイル定義（`FISH_STYLES`） |
| `src/styles/features/FaceTrackerStyle.ts` | フェイスチェッカー固有スタイル定義（`FACE_STYLES`） |

---

## 4. データ構造仕様 (`src/types/facetracker.ts`)

### **データ宣言**
- `src/types/`以下にあるファイルの宣言に従うこと。

### **フェイスマスターデータ**
- `faceId`: 数値ID (`number`)
- `name`: 日本語名 (`string`)
- `enName`: 英語名 (`string`)
- `role`: ロールID (`FaceRoleType`: `'tank'` \| `'attacker'` \| `'healer'` \| `'support'` 等)
- `category`: 入手カテゴリID (`FaceCategoryType`: `'mission'` \| `'campaign'` \| `'rosea'` 等)
- `obtainMethod`: 取得方法の詳細説明文 (`string`)

### **目標リストデータ (`TargetList`)**
- `id`: 一意の識別子 (`string`)
- `name`: 目標リスト名 (`string`)
- `faceIds`: 登録されているフェイスID配列 (`number[]`)

### **マイフェイス編成データ (`MyParty`)**
- `id`: 一意の識別子 (`string`)
- `name`: 編成名 (`string`)
- `memberFaceIds`: 登録メンバーのフェイスID配列 (`number[]`、最大5件)

### **ユーザー進捗 (`CharacterProgress`)**
- LocalStorage キー: `ff11_face_tracker_user_data`
- `checkedFaceIds`: 取得済みのフェイスID（`number[]`）を保持
- `targetLists`: 目標リスト配列 (`TargetList[]`、最大3件)
- `myParties`: マイフェイス編成配列 (`MyParty[]`)

### **共有関連データ**
- 共有URLクエリパラメータ: `face_share`（Base64 URL Safe等でエンコードされた文字列）
- デコード後構造: `{ characterName: string, checkedFaceIds: number[], targetLists?: TargetList[], myParties?: MyParty[] }`

---

## 5. UI/UX・表示仕様

### **リスト表示 (`FaceListItem`)**
- 一覧表示はカード型を廃止し、垂直方向への高速スキャンと高密度表示を実現する **横並び構成（`FaceListItem`）に一本化** する (`LIST_STYLES` 準拠)。
  - 縦に段数を増やさず、1行（高密度2段）の垂直高さを維持する。
  - **構成:** 左側:チェックボックス ＋ 名称（縦並び） / 中央:カテゴリ名（1行 truncate・右寄せ） / 右端:ロールインジケーターバッジ。

### **ヘッダー・ロールアイコンのカラー定義**
- **盾（Tank）:** ブルー (`text-blue-400` / `bg-blue-950/50`)
- **アタッカー（Attacker）:** レッド (`text-red-400` / `bg-red-950/50`)
- **回復（Healer）:** エメラルド (`text-emerald-400` / `bg-emerald-950/50`)
- **支援（Support）:** パープル / アンバー (`text-amber-400` / `bg-amber-950/50`)

---

## 6. 主要機能仕様

### **① 一覧と取得チェック・目標振り分け**
- 所持済みチェック（`checkedFaceIds`）のトグル操作。
- 詳細画面またはコンテキスト操作による目標リスト（最大3個）およびマイフェイス編成への登録・削除。

### **② フィルタリングと詳細表示**
- ロール別、入手カテゴリ別、達成状態（未取得/取得済）での絞り込み。
- 検索フォームによる日本語名・英語名のリアルタイムフィルタリング。
- 詳細ビューによる具体的な入手手順の確認（改行分割レンダリング対応）。

### **③ ユーザー間自発的シェア機能**
- 所持状況、目標リスト、マイフェイス編成をURLセーフな文字列にエンコード。
- バックエンドDBを介さず、ワンクリックでクリップボードへコピー＆インポート・共有できる機能。

---

## 7. 実装規約（フェイス取得チェッカー固有）

- **共通スタイルトークンの参照基準**:
  - リストの装飾・状態（デフォルト/選択中/チェック済み）には、必ず `COMMON_TOKENS` および `LIST_STYLES` を使用し、ハードコードしたカラー定義を排除すること。
- **目標リスト・マイフェイス編成の制限**:
  - 目標リストは最大3つまで、マイフェイス編成の1編成あたりのメンバー数は最大5名（プレイヤー自身を除く）の制限を保持すること。
- **改行処理およびキー指定**:
  - 取得方法等のテキストデータ改行時の安全な分割レンダリング（`/\r?\n|\\n/`）およびユニークなキー（`key={`${index}-${line.slice(0, 10)}`}`）指定を徹底すること。