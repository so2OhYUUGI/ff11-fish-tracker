/**
 * ============================================================================
 * [FilePath] src/types/fishtracker.ts
 * [Role] 釣りコンプリートチェッカーの型定義（型システム・データモデル）
 * 
 * [概要]
 * - FFXI（Windowerデータ準拠）のマスタデータ型定義（Zone, Fish, Bait, Rod）
 * - ユーザーデータおよび進捗データ構造の定義（LocalStorage保存用）
 * - 生息域（FishLocation）、釣れる餌（FishBaitRelation）、釣れる竿（FishRodRelation）の中間リレーション型定義
 * - UI表示状態に関する型定義（MainTab, ViewModeなど）
 * ============================================================================
 */

// --- Windower Zone (zones.lua) 準拠データ ---
export type ZoneMaster = {
	id: number;
	ja: string;
	en: string;
	regionId?: number; // ← ? を付けてオプショナルに変更
	description?: string;
};

// --- ユーザー進捗データ (LocalStorage保存用) ---
export type CharacterProgress = {
	id: string;            // キャラクター一意ID (UUID等)
	name: string;          // キャラクター名 (例: "Toraou")
	checkedFishIds: number[]; // 釣った魚の Windower Item ID リスト
	createdAt: number;
	updatedAt: number;
};

export type UserData = {
	activeCharacterId: string;       // 現在選択中のキャラID
	characters: CharacterProgress[]; // キャラクター一覧
	viewMode?: ViewMode; // アプリ全体の表示モード（未設定時は default: 'card'）
};

// --- マスタデータ構造 ---
export type SizeType = 'small' | 'large' | 'unknown';
export type WaterType = 'freshwater' | 'saltwater' | 'gedou' | 'unknown';

export type FishMaster = {
	// Windower (items.lua) 準拠項目
	id: number;            // アイテムID (例: 4353 = ネビムコラズ)
	en: string;            // 英語名 (例: "Nebimonite")
	ja: string;            // 日本語名 (例: "ネビムコラズ")
	description: string;   // 日本語の説明
	flags?: number;        // アイテムフラグ

	// アプリ独自拡張項目
	maxSkill: number;      // 限界スキルレベル (例: 10)
	sizeType: SizeType;       // 'small' | 'large' | 'unknown'
	waterType: WaterType;     // 'freshwater' (淡水) | 'saltwater' (海水) | 'gedou' (外道) | 'unknown' (不明)

	// ハラキリ関連（アイテム名配列または称号が存在すればハラキリ対象とみなす）
	harakiriItems?: string[]; // 得られるアイテム名リスト (例: ["光のクリスタル", "黒ハガネ"])
	harakiriTitle?: string;   // 得られる称号 (例: "伝説の太公望")

	ebisu: boolean;        // 恵比寿の竿関連（腹切り/クエスト対象等）
	taikobou: boolean;     // 太公望の竿関連（10万匹・湾曲針対象等）

	notes?: string;        // 補足（時間・天候・月齢制限など）
};

// 餌マスタ型
export type BaitMaster = {
	id: number;            // アイテムID
	en: string;            // 英語名
	ja: string;            // 日本語名
	description: string;   // 日本語の説明
};

// 釣竿マスタ型
export type FishingRodMaster = {
	id: number;            // アイテムID
	en: string;            // 英語名
	ja: string;            // 日本語名
	description?: string;  // 日本語の説明
};

export type MainTab = 'fish' | 'bait' | 'area'; // 'zone' を 'area' に統一（プロジェクトの呼称に合わせる）
export type ViewMode = 'card' | 'list';

// --- 中間データ（リレーション） ---

// 生息情報（Fish ↔ Zone の中間エンティティ）
export type FishLocation = {
	id: string;            // 一意の識別子（例: "4353-248"）
	fishId: number;        // FishMaster.id
	zoneId: number;        // ZoneMaster.id
	subLocationIds?: number[];// SubLocationMaster.id（特定航路・限定便など）
	notes?: string;        // エリア限定の補足（例: "S-10付近の池"、"天候：雨のみ" など）
};

// 釣れる餌情報（Fish ↔ Bait の中間エンティティ）
export type FishBaitRelation = {
	id: string;            // 一意の識別子（例: "4353-16992"）
	fishId: number;        // FishMaster.id
	baitId: number;        // BaitMaster.id
	notes?: string;        // 補足情報
};

// 釣れる竿情報（Fish ↔ Rod の中間エンティティ）
export type FishRodRelation = {
	id: string;               // 例: "4353-17011" (魚ID-竿ID)
	fishId: number;           // FishMaster.id
	rodId: number;            // FishingRodMaster.id

	// 釣り可否・反応ステータス
	catchability?: 'unknown' | 'possible' | 'impossible'; // 釣り可能（不明 / 可能 / 不可）
	rodBreak?: 'unknown' | 'no' | 'yes';                 // 竿折れ（不明 / なし / あり）
	lineBreak?: 'unknown' | 'no' | 'yes';                // 糸切れ（不明 / なし / あり）

	notes?: string;           // 文字列による補足
};

// --- Windower Region (regions.lua) 準拠データ ---
export type RegionMaster = {
	id: number;            // リージョンID (例: 0)
	en: string;            // 英語名 (例: "San d'Oria")
	ja: string;            // 日本語名 (例: "サンドリア王国")
};

// src/data/subLocations.ts
export type SubLocationMaster = {
	id: number;      
	zoneId: number;  // 親となる Zone ID
	ja: string;      // 表示名（例: "まりも航路"）
	en: string;
};