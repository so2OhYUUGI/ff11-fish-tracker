/**
 * ============================================================================
 * [FilePath] src/hooks/useSharedProgress.ts
 * [Role]     URLパラメータに基づく共有進捗データの読み込み・状態管理フック
 * 
 * [調整内容]
 * - decodeSharedProgress 呼び出し時の try-catch による保護を追加
 * - clearSharedMode におけるパラメータ存在判定による不要な再描画の防止
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

	const shareParam = searchParams.get('share');

	// share パラメータの変化に応じて共有進捗データを復元（安全策として例外をキャッチ）
	const sharedProgress = useMemo(() => {
		if (!shareParam) return null;
		try {
			return decodeSharedProgress(shareParam);
		} catch {
			return null;
		}
	}, [shareParam]);

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