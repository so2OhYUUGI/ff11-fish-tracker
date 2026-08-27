/**
 * ============================================================================
 * [FilePath] src/hooks/useNavigationStack.ts
 * ============================================================================
 */

import { useState, useCallback, useEffect } from 'react';
import type { FishMaster, ZoneMaster, BaitMaster } from '@/types/fishtracker';
import { FISHES, ZONES, BAITS } from '@/data/';
import { findBySlug } from '@/utils/slug';

export type NavItem =
	| { type: 'fish'; item: FishMaster }
	| { type: 'area'; item: ZoneMaster }
	| { type: 'bait'; item: BaitMaster };

export const useNavigationStack = (_type?: string, slug?: string) => {
	const [stack, setStack] = useState<NavItem[]>([]);

	// URLパラメータ (:slug) の変更を検知して全マスターデータから該当アイテムを判定・スタック同期
	useEffect(() => {
		if (!slug) {
			setStack((prev) => (prev.length === 0 ? prev : []));
			return;
		}

		// 1. 魚、2. エリア、3. 餌の順で検索
		const fish = findBySlug(FISHES, slug);
		const area = !fish ? findBySlug(ZONES, slug) : null;
		const bait = !fish && !area ? findBySlug(BAITS, slug) : null;

		let foundItem: NavItem | null = null;
		if (fish) {
			foundItem = { type: 'fish', item: fish };
		} else if (area) {
			foundItem = { type: 'area', item: area };
		} else if (bait) {
			foundItem = { type: 'bait', item: bait };
		}

		if (!foundItem) {
			setStack((prev) => (prev.length === 0 ? prev : []));
			return;
		}

		const targetItem = foundItem;

		setStack((prev) => {
			const last = prev[prev.length - 1];
			if (last && last.type === targetItem.type && last.item.id === targetItem.item.id) {
				return prev;
			}
			if (prev.length === 0) {
				return [targetItem];
			}
			return [...prev, targetItem];
		});
	}, [slug]);

	const push = useCallback((navItem: NavItem) => {
		setStack((prev) => {
			const last = prev[prev.length - 1];
			if (last && last.type === navItem.type && last.item.id === navItem.item.id) {
				return prev;
			}
			return [...prev, navItem];
		});
	}, []);

	const replace = useCallback((navItem: NavItem) => {
		setStack([navItem]);
	}, []);

	const pop = useCallback(() => {
		setStack((prev) => (prev.length > 0 ? prev.slice(0, -1) : []));
	}, []);

	const clear = useCallback(() => {
		setStack((prev) => (prev.length === 0 ? prev : []));
	}, []);

	const current = stack.length > 0 ? stack[stack.length - 1] : null;

	return {
		stack,
		current,
		push,
		replace,
		pop,
		clear,
		canGoBack: stack.length > 1,
	};
};

export type UseNavigationStackReturn = ReturnType<typeof useNavigationStack>;

export type NavigationStackHandle = UseNavigationStackReturn & {
	selectFromList?: (item: NavItem) => void;
};