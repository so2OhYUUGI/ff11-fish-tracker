/**
 * ============================================================================
 * [FilePath] src/types/fishtracker.ts
 * [Role]     釣魚チェッカー固有のマスタデータ・リレーション型定義
 * 
 * [概要]
 * - FFXI（Windowerデータ準拠）のマスタデータ型定義（Zone, Fish, Bait, Rod, Region, SubLocation）
 * - 生息域（FishLocation）、釣れる餌（FishBaitRelation）、釣れる竿（FishRodRelation）の中間リレーション定義
 * - 釣魚画面固有の表示タブ型定義（MainTab）
 * ============================================================================
 */

// --- Windower Zone (zones.lua) 準拠データ ---
export type ZoneMaster = {
	id: number;
	ja: string;
	en: string;
	regionId?: number;
	description?: string;
};

// --- Windower Region (regions.lua) 準拠データ ---
export type RegionMaster = {
	id: number;            // リージョンID (例: 0)
	en: string;            // 英語名 (例: "San d'Oria")
	ja: string;            // 日本語名 (例: "サンドリア王国")
};

// サブエリア・航路マスタ
export type SubLocationMaster = {
	id: number;
	zoneId: number;        // 親となる Zone ID
	ja: string;            // 表示名（例: "まりも航路"）
	en: string;
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
	sizeType: SizeType;
	waterType: WaterType;

	// ハラキリ関連
	harakiriItems?: string[]; // 得られるアイテム名リスト (例: ["光のクリスタル", "黒ハガネ"])
	harakiriTitle?: string;   // 得られる称号 (例: "伝説の太公望")

	ebisu: boolean;        // 恵比寿の竿関連
	taikobou: boolean;     // 太公望の竿関連

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

export type MainTab = 'fish' | 'bait' | 'area';

// --- 中間データ（リレーション） ---

// 生息情報（Fish ↔ Zone）
export type FishLocation = {
	id: string;            // 一意の識別子（例: "4353-248"）
	fishId: number;        // FishMaster.id
	zoneId: number;        // ZoneMaster.id
	subLocationIds?: number[]; // SubLocationMaster.id
	notes?: string;        // エリア限定の補足
};

// 釣れる餌情報（Fish ↔ Bait）
export type FishBaitRelation = {
	id: string;            // 一意の識別子（例: "4353-16992"）
	fishId: number;        // FishMaster.id
	baitId: number;        // BaitMaster.id
	notes?: string;        // 補足情報
};

// 釣れる竿情報（Fish ↔ Rod）
export type FishRodRelation = {
	id: string;               // 例: "4353-17011"
	fishId: number;           // FishMaster.id
	rodId: number;            // FishingRodMaster.id

	catchability?: 'unknown' | 'possible' | 'impossible'; // 釣り可能（不明 / 可能 / 不可）
	rodBreak?: 'unknown' | 'no' | 'yes';                 // 竿折れ（不明 / なし / あり）
	lineBreak?: 'unknown' | 'no' | 'yes';                // 糸切れ（不明 / なし / あり）

	notes?: string;
};