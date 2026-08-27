/**
 * ============================================================================
 * [FilePath] src/utils/shareEncoding.ts
 * [Role]     SNS共有用進捗データのシリアライズ / デシリアライズユーティリティ
 * 
 * [概要]
 * - 共有対象（キャラ名、達成済み魚IDリスト、作成日時）をURLクエリパラメータ向けに相互変換
 * - 閲覧者の既存進捗データ（LocalStorage）と分離された独立データ構造として扱う
 * 
 * [調整内容]
 * - encodeSharedProgress 内のバイナリ文字列構築を効率化
 * - decodeSharedProgress 内の any 型キャストを unknown と型チェックへ置き換え型安全性を向上
 * ============================================================================
 */

export interface SharedProgress {
	characterName: string;
	checkedFishIds: number[];
	createdAt: number;
}

/**
 * SharedProgress オブジェクトを URLセーフな Base64 文字列にエンコードします。
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
 * URLセーフな Base64 文字列から SharedProgress オブジェクトを復元します。
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