/**
 * ============================================================================
 * [FilePath] src/hooks/useSharedProgress.ts
 * [Role]     URLパラメータに基づく共有進捗データの読み込み・状態管理フック
 * 
 * [概要]
 * - URLクエリ（`?share=...`）の変更を検知し、共有進捗データ（SharedProgress）を復元・保持
 * - 閲覧者の既存データ（useUserData/LocalStorage）と共有データを完全に分離して管理
 * - 共有閲覧モードの解除（通常表示モードへの復帰）処理を提供
 * 
 * [調整内容]
 * - clearSharedMode 内の setSearchParams で new URLSearchParams(prev) を生成し、参照同一性による更新スキップを防止
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

	// share パラメータの変化に応じて共有進捗データを復元
	const sharedProgress = useMemo(() => {
		if (!shareParam) return null;
		return decodeSharedProgress(shareParam);
	}, [shareParam]);

	// 共有表示モードの解除（URLから share パラメータを除去）
	const clearSharedMode = useCallback(() => {
		setSearchParams(
			(prev) => {
				const nextParams = new URLSearchParams(prev);
				nextParams.delete('share');
				return nextParams;
			},
			{ replace: true }
		);
	}, [setSearchParams]);

	return {
		sharedProgress,
		isSharedMode: sharedProgress !== null,
		clearSharedMode,
	};
}