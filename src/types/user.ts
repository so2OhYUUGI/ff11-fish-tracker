/**
 * ============================================================================
 * [FilePath] src/types/user.ts
 * [Role]     共通ユーザーデータ・進捗構造の型定義
 * 
 * [概要]
 * - 複数キャラクターの所持状況、各機能（釣魚・トラスト）の進捗統合管理。
 * - LocalStorage 永続化データ（UserData）およびアプリケーション全般の設定。
 * ============================================================================
 */

import type { Wishlist, MyMacro } from "./trusttracker";

export type ViewMode = 'card' | 'list';

/**
 * キャラクターごとの総合進捗データ
 */
export type CharacterProgress = {
	id: string;                 // キャラクター一意ID (UUID等)
	name: string;               // キャラクター名 (例: "Toraou")

	// --- 釣魚チェッカー進捗 ---
	checkedFishIds?: number[];   // 釣った魚の Item ID リスト

	// --- トラストチェッカー進捗 ---
	checkedTrustIds?: number[];  // 修得済みトラストの ID リスト
	wishlists?: Wishlist[]; 	// トラスト目標リスト（最大3件）
	macros?: MyMacro[];      // マイマクロリスト

	createdAt: number;
	updatedAt: number;
};

export type NormalizedCharacterProgress = CharacterProgress & {
	checkedFishIds: number[];
	checkedTrustIds: number[];

}

/**
 * アプリ全体で保持するユーザー設定およびデータ構造
 */
export type UserData = {
	activeCharacterId: string;       // 現在選択中のキャラID
	characters: NormalizedCharacterProgress[]; // キャラクター一覧
	wishlists:Wishlist[],
	viewMode?: ViewMode;             // 全体の表示モード（未設定時は default: 'card'）
};