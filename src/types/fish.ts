/**
 * ============================================================================
 * [FilePath] src/types/fish.ts
 * [Role] 釣りコンプリートチェッカーの型定義（型システム・データモデル）
 * 
 * [概要]
 * - FFXI（Windowerデータ準拠）のマスタデータ型定義（Zone, Fish, Bait, Rod）
 * - ユーザーデータおよび進捗データ構造の定義（LocalStorage保存用）
 * - 生息域（FishLocation）および釣れる餌（FishBaitRelation）の中間リレーション型定義
 * - UI表示状態に関する型定義（MainTab, ViewModeなど）
 * ============================================================================
 */

// --- Windower Zone (zones.lua) 準拠データ ---
export type ZoneMaster = {
	id: number;
	ja: string;
	en: string;
	regionId?: number; // 所属するリージョンID
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
};

// 竿ごとの耐久・破損挙動の定義
export type RodDurability = {
	rodId: number;         // 釣竿のアイテムID (例: 太公望、恵比寿など)
	canLineBreak: boolean; // 糸切れの有無（true: 切れる / false: 切れない）
	canRodBreak: boolean;  // 竿折れの有無（true: 折れる / false: 折れない）
};

export type FishMaster = {
	// Windower (items.lua) 準拠項目
	id: number;            // アイテムID (例: 4353 = ネビムコラズ)
	en: string;            // 英語名 (例: "Nebimonite")
	ja: string;            // 日本語名 (例: "ネビムコラズ")
	description: string;   // 日本語の説明
	flags?: number;        // アイテムフラグ

	// アプリ独自拡張項目
	maxSkill: number;      // 限界スキルレベル (例: 10)
	sizeType: 'small' | 'large'; // 小型魚 / 大型魚
	harakiri: boolean;     // ハラキリ対象フラグ
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

export type MainTab = 'fish' | 'bait';
export type ViewMode = 'card' | 'list';

// --- 中間データ（リレーション） ---

// 釣り場タイプ
export type FishingSubArea = 'sea' | 'river' | 'lake' | 'pond' | 'ship' | 'all';

// 生息情報（Fish ↔ Zone の中間エンティティ）
export type FishLocation = {
	id: string;            // 一意の識別子（例: "4353-248" や UUID）
	fishId: number;        // FishMaster.id
	zoneId: number;        // ZoneMaster.id
	subArea?: FishingSubArea; // 淡水/海水/船など
	notes?: string;        // エリア限定の補足（例: "S-10付近の池"、"天候：雨のみ" など）
};

// 釣れる餌情報（Fish ↔ Bait の中間エンティティ）
export type FishBaitRelation = {
	id: string;            // 一意の識別子（例: "4353-16992"）
	fishId: number;        // FishMaster.id
	baitId: number;        // BaitMaster.id
	notes?: string;        // 補足情報
};

// --- Windower Region (regions.lua) 準拠データ ---
export type RegionMaster = {
	id: number;            // リージョンID (例: 0)
	en: string;            // 英語名 (例: "San d'Oria")
	ja: string;            // 日本語名 (例: "サンドリア王国")
};