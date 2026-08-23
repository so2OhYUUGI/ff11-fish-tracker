/**
 * ============================================================================
 * [FilePath] src/hooks/useNavigationStack.ts
 * ============================================================================
 */

import { useState, useCallback } from 'react';
import type { FishMaster, ZoneMaster, BaitMaster } from '@/types/fish';

export type NavItem =
	| { type: 'fish'; item: FishMaster }
	| { type: 'area'; item: ZoneMaster }
	| { type: 'bait'; item: BaitMaster };

export const useNavigationStack = () => {
	const [stack, setStack] = useState<NavItem[]>([]);

	// 詳細画面内からのドリルダウン用（履歴を追加）
	const push = useCallback((navItem: NavItem) => {
		setStack((prev) => {
			const last = prev[prev.length - 1];
			if (last && last.type === navItem.type && last.item.id === navItem.item.id) {
				return prev;
			}
			return [...prev, navItem];
		});
	}, []);

	// 一覧リストからの選択用（履歴を新しい1件で置き換え）
	const replace = useCallback((navItem: NavItem) => {
		setStack([navItem]);
	}, []);

	const pop = useCallback(() => {
		setStack((prev) => (prev.length > 0 ? prev.slice(0, -1) : []));
	}, []);

	const clear = useCallback(() => {
		setStack([]);
	}, []);

	const current = stack.length > 0 ? stack[stack.length - 1] : null;

	return {
		stack,
		current,
		push,
		replace,
		pop,
		clear,
		// スタックが2個以上あれば、元画面に関わらず「戻る」を有効化
		canGoBack: stack.length > 1,
	};
};

// フックの基本戻り値型
export type UseNavigationStackReturn = ReturnType<typeof useNavigationStack>;

// App.tsx 等で selectFromList などを拡張して渡す場合の統一型定義
export type NavigationStackHandle = UseNavigationStackReturn & {
	selectFromList?: (item: NavItem) => void;
};