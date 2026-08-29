/**
 * ============================================================================
 * [FilePath] src/hooks/useSharedProgress.ts
 * [Role]     URLパラメータに基づく共有進捗データの読み込み・状態管理フック
 * 
 * [設計方針]
 * - 初回マウント時の window.location.search から share パラメータを一度だけ安全にデコードする
 * - URLクリーンアップ（パラメータ削除）が行われても共有データが失われないよう、依存関係を持たない useMemo で保持する
 * ============================================================================
 */

import { useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { SharedProgress } from '@/utils/shareEncoding';
import { decodeSharedProgress } from '@/utils/shareEncoding';

export interface UseSharedProgressReturn {
	sharedProgress: SharedProgress | null;
	isSharedMode: boolean;
	clearSharedMode: () => void;
}

export function useSharedProgress(): UseSharedProgressReturn {
	const [searchParams, setSearchParams] = useSearchParams();

	// 初回マウント時のURLから一度だけ share パラメータを抽出・デコードする
	const sharedProgress = useMemo(() => {
		const params = new URLSearchParams(window.location.search);
		const shareParam = params.get('share');
		if (!shareParam) return null;
		try {
			return decodeSharedProgress(shareParam);
		} catch {
			return null;
		}
	}, []);

	// 共有表示モードの解除（URLから share パラメータを除去）
	const clearSharedMode = useCallback(() => {
		if (!searchParams.has('share')) return;

		setSearchParams(
			(prev) => {
				const nextParams = new URLSearchParams(prev);
				nextParams.delete('share');
				return nextParams;
			},
			{ replace: true }
		);
	}, [searchParams, setSearchParams]);

	return {
		sharedProgress,
		isSharedMode: sharedProgress !== null,
		clearSharedMode,
	};
}