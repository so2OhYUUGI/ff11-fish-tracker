/**
 * ============================================================================
 * [FilePath] src/hooks/useSharedWishlist.ts
 * [Role]     URLパラメータに基づく共有ウィッシュリストデータの読み込み・状態管理フック
 * 
 * [設計方針]
 * - 初回マウント時の window.location.search から wishlist_share パラメータを一度だけ安全にデコードする
 * - URLクリーンアップ（パラメータ削除）が行われても共有データが失われないよう、依存関係を持たない useMemo で保持する
 * ============================================================================
 */

import { useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { Wishlist } from '@/types/trusttracker';
import { decodeSharedWishlistProgress } from '@/utils/shareEncoding';

export interface UseSharedWishlistReturn {
	sharedWishlist: Wishlist | null;
	isSharedWishlistMode: boolean;
	clearSharedWishlistMode: () => void;
}

export function useSharedWishlist(): UseSharedWishlistReturn {
	const [searchParams, setSearchParams] = useSearchParams();

	// 初回マウント時のURLから一度だけ wishlist_share パラメータを抽出・デコードする
	const sharedWishlist = useMemo(() => {
		const params = new URLSearchParams(window.location.search);
		const shareParam = params.get('wishlist_share');
		if (!shareParam) return null;
		try {
			return decodeSharedWishlistProgress(shareParam);
		} catch {
			return null;
		}
	}, []);

	// 共有表示モードの解除（URLから wishlist_share パラメータを除去）
	const clearSharedWishlistMode = useCallback(() => {
		if (!searchParams.has('wishlist_share')) return;

		setSearchParams(
			(prev) => {
				const nextParams = new URLSearchParams(prev);
				nextParams.delete('wishlist_share');
				return nextParams;
			},
			{ replace: true }
		);
	}, [searchParams, setSearchParams]);

	return {
		sharedWishlist,
		isSharedWishlistMode: sharedWishlist !== null,
		clearSharedWishlistMode,
	};
}