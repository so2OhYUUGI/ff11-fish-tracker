/**
 * ============================================================================
 * [FilePath] src/utils/slug.ts
 * [Role] 英名(en)とURL用スラッグ文字列の相互変換ユーティリティ
 * ============================================================================
 */

/**
 * 文字列を URL 用スラッグに変換
 * 例: "Giant Catfish" -> "giant-catfish"
 *     "Bibiki Urchin" -> "bibiki-urchin"
 */
export const toSlug = (str: string): string => {
	return str
		.toLowerCase()
		.replace(/[^a-z0-9\s-]/g, '') // 英数字・スペース・ハイフン以外を除去
		.trim()
		.replace(/\s+/g, '-'); // 連続するスペースをハイフンに置換
};

/**
 * スラッグ文字列から対象のマスタデータ要素を検索
 */
export const findBySlug = <T extends { en: string }>(
	items: T[],
	slug?: string
): T | undefined => {
	if (!slug) return undefined;
	return items.find((item) => toSlug(item.en) === slug);
};