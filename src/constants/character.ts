/**
 * ============================================================================
 * [FilePath] src/constants/character.tsx
 * [Role] キャラクター管理・識別用定数定義
 * 
 * [概要]
 * - 共有データ表示用IDおよびキャラ未登録時のフォールバック用定数を定義する
 * 
 * [依存関係・関連ファイル]
 * - 型定義   : src/types/fishtracker.ts
 * - 参照元   : src/contexts/UserDataContext.tsx, src/App.tsx
 * 
 * [編集・改修時の注意事項（AI/エンジニア共通指示）]
 * 1. 【定数の一元化】 ゲスト判定文字列等を直接ハードコードせず本ファイルからインポートして参照すること
 * ============================================================================
 */

import type { CharacterProgress } from '@/types/';

export const SHARED_GUEST_CHARACTER_ID = 'shared-guest-character';

export const FALLBACK_GUEST_CHARACTER: CharacterProgress = {
	id: 'guest-fallback',
	name: 'ゲスト',
	checkedFishIds: [],
	createdAt: 0,
	updatedAt: 0,
};