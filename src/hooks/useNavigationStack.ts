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

export const useNavigationStack = (type?: string, slug?: string) => {
	const [stack, setStack] = useState<NavItem[]>([]);

	// URLパラメータ (:slug) の変更を検知して全マスターデータから該当アイテムを判定・スタック同期
	useEffect(() => {
		if (!slug) {
			setStack([]);
			return;
		}

		let foundItem: NavItem | null = null;

		// 1. 魚マスターから検索
		const fish = findBySlug(FISHES, slug);
		if (fish) {
			foundItem = { type: 'fish', item: fish };
		} else {
			// 2. エリアマスターから検索
			const area = findBySlug(ZONES, slug);
			if (area) {
				foundItem = { type: 'area', item: area };
			} else {
				// 3. 餌マスターから検索
				const bait = findBySlug(BAITS, slug);
				if (bait) {
					foundItem = { type: 'bait', item: bait };
				}
			}
		}

		if (foundItem) {
			setStack((prev) => {
				const last = prev[prev.length - 1];
				if (last && last.type === foundItem!.type && last.item.id === foundItem!.item.id) {
					return prev;
				}
				if (prev.length === 0) {
					return [foundItem!];
				}
				return [...prev, foundItem!];
			});
		}
	}, [slug]); // type への依存を外し、slug の変更のみ監視

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
		canGoBack: stack.length > 1,
	};
};

export type UseNavigationStackReturn = ReturnType<typeof useNavigationStack>;

export type NavigationStackHandle = UseNavigationStackReturn & {
	selectFromList?: (item: NavItem) => void;
};