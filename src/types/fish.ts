// --- Windower Zone (zones.lua) 準拠データ ---
export type ZoneMaster = {
	id: number;            // ゾーンID (例: 248)
	en: string;            // 英語名 (例: "Selbina")
	ja: string;            // 日本語名 (例: "セルビナ")
	regionId?: number;     // リージョンID
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

export type ViewMode = 'card' | 'list';

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

	zoneIds: number[];     // 釣れるゾーンIDのリスト (ZoneMaster.id の配列)
	baitItemIds?: number[];// 効く餌・仕掛けのアイテムID

	// 釣竿ごとの相性・破損設定
	rodDurabilities?: RodDurability[]; // 各釣竿での糸切れ・竿折れ挙動のリスト

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