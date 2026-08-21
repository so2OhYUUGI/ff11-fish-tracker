/**
 * ============================================================================
 * [FilePath] src/hooks/useNavigationStack.ts
 * [Role] 詳細画面群（魚・エリア・餌）における相互循環遷移および履歴（スタック）管理カスタムフック
 * 
 * [概要]
 * - 「エリア詳細 ➔ 生息する魚 ➔ 釣れる別のエリア」といった横断的・ドリルダウン移動の履歴を管理
 * - 後入れ先出し（LIFO）のスタック構造により、「1つ前の詳細に戻る」挙動と「全消去（閉じる）」挙動を制御
 * - 表示中の詳細エンティティ（`current`）を一元保持し、既存コンポーネントの破綻を防ぎつつ直感的なUXを提供
 * 
 * [編集・改修時の注意事項]
 * 1. 【型安全性の維持】
 *    `NavItem` で定義されるエンティティ種別（`type`）とオブジェクト（`item`）の整合性を保持してください。
 * 2. 【スタックのメモリ考慮】
 *    過度な循環遷移によるスタック膨張を防ぐため、必要に応じて重複ガードや上限スタック数の制限検討が可能です。
 * ============================================================================
 */

import { useState, useCallback } from 'react';
import type { FishMaster, ZoneMaster, BaitMaster } from '@/types/fish';

/**
 * 履歴スタック内で保持する詳細画面の要素型
 */
export type NavItem =
	| { type: 'fish'; item: FishMaster }
	| { type: 'area'; item: ZoneMaster }
	| { type: 'bait'; item: BaitMaster };

export const useNavigationStack = () => {
	const [stack, setStack] = useState<NavItem[]>([]);

	/**
	 * 新しい詳細画面へ遷移し、履歴スタックに追加（Push）
	 */
	const push = useCallback((navItem: NavItem) => {
		setStack((prev) => [...prev, navItem]);
	}, []);

	/**
	 * 1つ前の詳細画面へ戻る（Pop）
	 */
	const pop = useCallback(() => {
		setStack((prev) => prev.slice(0, -1));
	}, []);

	/**
	 * 全ての履歴を破棄し、詳細パネルを閉じる（Clear）
	 */
	const clear = useCallback(() => {
		setStack([]);
	}, []);

	/**
	 * 現在最前面に表示すべき詳細情報（スタックの末尾要素）
	 */
	const current = stack.length > 0 ? stack[stack.length - 1] : null;

	return {
		stack,
		current,
		push,
		pop,
		clear,
		canGoBack: stack.length > 1,
	};
};