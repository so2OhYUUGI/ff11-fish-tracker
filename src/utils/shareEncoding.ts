/**
 * ============================================================================
 * [FilePath] src/utils/shareEncoding.ts
 * [Role]     SNS共有用進捗データのシリアライズ / デシリアライズユーティリティ
 * 
 * [概要]
 * - 釣魚共有対象（キャラ名、達成済み魚IDリスト、作成日時）およびウィッシュリスト共有対象（タイトル、ウィッシュリストデータ、作成日時）をURLクエリパラメータ向けに相互変換
 * - 閲覧者の既存進捗データ（LocalStorage）と分離された独立データ構造として扱う
 * 
 * [依存関係・関連ファイル]
 * - 型定義   : src/types/trusttracker.ts (Wishlist)
 * 
 * [編集・改修時の注意事項（AI/エンジニア共通指示）]
 * 1. 【互換性の維持】既存の釣魚用関数（encodeSharedProgress / decodeSharedProgress）および型定義（SharedProgress）の動作やインターフェースを破壊しないこと。
 * 2. 【型安全性の確保】復元（decode）処理時は unknown からの型ガードを行い、不正データ時にも例外をスローせず安全に null を返却すること。
 * ============================================================================
 */

import type { Wishlist } from '@/types/trusttracker';

export interface SharedProgress {
	characterName: string;
	checkedFishIds: number[];
	createdAt: number;
}

/**
 * ウィッシュリスト専用の共有データ構造
 * （`wishlist_share` クエリパラメータで使用）
 * 第一階層に Wishlist 構造を直接持たせ、余計なラッパーを排除
 */
export type SharedWishlistProgress = Wishlist;

/**
 * SharedProgress オブジェクトを URLセーフな Base64 文字列にエンコードします。（釣魚チェッカー用）
 */
export function encodeSharedProgress(data: SharedProgress): string {
	try {
		const jsonString = JSON.stringify(data);
		const utf8Bytes = new TextEncoder().encode(jsonString);
		const binary = Array.from(utf8Bytes, (byte) => String.fromCharCode(byte)).join('');
		const base64 = btoa(binary);
		return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
	} catch (error) {
		console.error('Failed to encode shared progress:', error);
		return '';
	}
}

/**
 * URLセーフな Base64 文字列から SharedProgress オブジェクトを復元します。（釣魚チェッカー用）
 */
export function decodeSharedProgress(encoded: string): SharedProgress | null {
	if (!encoded) return null;
	try {
		let base64 = encoded.replace(/-/g, '+').replace(/_/g, '/');
		while (base64.length % 4) {
			base64 += '=';
		}

		const binary = atob(base64);
		const bytes = new Uint8Array(binary.length);
		for (let i = 0; i < binary.length; i++) {
			bytes[i] = binary.charCodeAt(i);
		}
		const jsonString = new TextDecoder().decode(bytes);
		const parsed: unknown = JSON.parse(jsonString);

		if (
			typeof parsed === 'object' &&
			parsed !== null &&
			('characterName' in parsed || 'name' in parsed) &&
			'checkedFishIds' in parsed &&
			Array.isArray((parsed as Record<string, unknown>).checkedFishIds)
		) {
			const obj = parsed as Record<string, unknown>;
			const rawCheckedFishIds = obj.checkedFishIds as unknown[];

			// 数値配列へ確実に変換（文字列IDが混ざっている場合にも対応）
			const checkedFishIds = rawCheckedFishIds
				.map((id) => Number(id))
				.filter((id) => !isNaN(id));

			const characterName =
				typeof obj.characterName === 'string'
					? obj.characterName
					: typeof obj.name === 'string'
						? obj.name
						: '共有キャラクター';

			const createdAt = typeof obj.createdAt === 'number' ? obj.createdAt : Date.now();

			return {
				characterName,
				checkedFishIds,
				createdAt,
			};
		}
		return null;
	} catch (error) {
		console.error('Failed to decode shared progress:', error);
		return null;
	}
}

/**
 * Wishlist オブジェクトを直接 URLセーフな Base64 文字列にエンコードします。（ウィッシュリスト共有用）
 */
export function encodeSharedWishlistProgress(wishlist: Wishlist): string {
	try {
		const jsonString = JSON.stringify(wishlist);
		const utf8Bytes = new TextEncoder().encode(jsonString);
		const binary = Array.from(utf8Bytes, (byte) => String.fromCharCode(byte)).join('');
		const base64 = btoa(binary);
		return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
	} catch (error) {
		console.error('Failed to encode shared wishlist progress:', error);
		return '';
	}
}

/**
 * URLセーフな Base64 文字列から Wishlist オブジェクトを復元します。（ウィッシュリスト共有用）
 * 共有データ復元時は一意な `shared-` 接頭辞付きハッシュIDを新規割り当てしてローカルデータとの衝突を防止
 */
export function decodeSharedWishlistProgress(encoded: string): SharedWishlistProgress | null {
	if (!encoded) return null;
	try {
		let base64 = encoded.replace(/-/g, '+').replace(/_/g, '/');
		while (base64.length % 4) {
			base64 += '=';
		}

		const binary = atob(base64);
		const bytes = new Uint8Array(binary.length);
		for (let i = 0; i < binary.length; i++) {
			bytes[i] = binary.charCodeAt(i);
		}
		const jsonString = new TextDecoder().decode(bytes);
		const parsed: unknown = JSON.parse(jsonString);

		if (typeof parsed !== 'object' || parsed === null) {
			return null;
		}

		const rawObj = parsed as Record<string, unknown>;

		// 旧構造（{ title, wishlist: {...}, createdAt }）が存在する場合は抽出し、無ければそのまま新構造として扱う
		const targetObj = (
			typeof rawObj.wishlist === 'object' && rawObj.wishlist !== null
				? rawObj.wishlist
				: rawObj
		) as Record<string, unknown>;

		// trustIds 配列のパース・数値キャスト（安全性の保証）
		const rawTrustIds = Array.isArray(targetObj.trustIds) ? targetObj.trustIds : [];
		const trustIds = rawTrustIds
			.map((id) => Number(id))
			.filter((id) => !isNaN(id));

		// 他者のローカルIDや他の共有リストと絶対に衝突しない一意な ID を生成
		const randomHash = Math.random().toString(36).substring(2, 9);
		const id = `shared-${Date.now()}-${randomHash}`;

		const name =
			typeof targetObj.name === 'string'
				? targetObj.name
				: typeof rawObj.title === 'string'
					? rawObj.title
					: '共有ウィッシュリスト';

		const createdAt = typeof targetObj.createdAt === 'number' ? targetObj.createdAt : Date.now();
		const updatedAt = typeof targetObj.updatedAt === 'number' ? targetObj.updatedAt : Date.now();

		return {
			id,
			name,
			trustIds,
			createdAt,
			updatedAt,
		};
	} catch (error) {
		console.error('Failed to decode shared wishlist progress:', error);
		return null;
	}
}