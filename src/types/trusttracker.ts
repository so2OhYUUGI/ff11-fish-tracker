/**
 * ============================================================================
 * [FilePath] src/types/trusttracker.ts
 * [Role] フェイスチェッカー（TrustTracker）機能に関する型定義集
 * 
 * [概要]
 * - フェイスマスターデータ（TrustMaster）および関連プロパティの型定義
 * - メインタブ、フィルター、サブタイプなどの状態定義
 * - ウィッシュリスト（Wishlist: アカウント共通）およびマイフェイス編成（MyMacro）の型定義
 * - キャラクターおよびユーザーデータ全体の型定義
 * ============================================================================
 */

/**
 * ウィッシュリストに関する定数制限
 */
export const WISHLIST_LIMITS = {
	MAX_SLOTS: 3,       // 最大スロット数
	MAX_ITEMS: 30,      // 1リストあたりの最大登録フェイス数
} as const;

/**
 * 戦闘タイプの分類
 */
export type TrustCombatType =
	| '近接物理'
	| '遠隔物理'
	| '魔法攻撃'
	| '回復'
	| '支援'
	| '盾'
	| string;

/**
 * フェイスの所属分類
 */
export type TrustAffiliation =
	| 'サンドリア'   // 赤色
	| 'バストゥーク' // 青色
	| 'ウィンダス'   // 緑色
	| 'ジュノ'       // 白色
	| 'プロマシア'   // 橙色
	| 'アトルガン'   // 紫色
	| 'アルタナ'     // 真紅
	| 'アドゥリン'   // 青緑
	| 'その他';      // 灰色

/**
 * 盟（アイテム）情報
 */
export type TrustItemInfo = {
	id: number;
	en: string;
	ja: string;
	desc_jp?: string;
	desc_en?: string;
};

/**
 * フェイスマスターデータのメインインターフェース
 */
export type TrustMaster = {
	id: number;
	en: string;
	ja: string;
	icon_id: number;
	party_name: string;
	job: string;
	combatType: TrustCombatType;
	affiliation?: TrustAffiliation;
	isLimited: boolean;
	acquireInfo: string;
	item: TrustItemInfo;

	// 今後の拡張用オプショナルフィールド
	category?: string;
	description?: string;
	spSkills?: string[];
};

/**
 * ウィッシュリストデータ（アカウント共通管理）
 */
export type Wishlist = {
	id: string;
	name: string;
	trustIds: number[];
	createdAt?: number;
	updatedAt?: number;
};

/**
 * フェイスマクロデータ
 */
export type MyMacro = {
	id: string;
	name: string;
	memberTrustIds: number[];
};

/**
 * サブタイプ（メインタブ）
 */
export type TrustSubtype = 'trust' | 'wishlist' | 'macro';

/**
 * 修得ステータスフィルター
 */
export type StatusFilter = 'all' | 'checked' | 'unchecked';