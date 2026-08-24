/**
 * ============================================================================
 * [FilePath] src/features/fishtracker/hooks/useTrackerNavigation.ts
 * [Role] 釣魚チェッカーのナビゲーションスタック・ルーティング・登録ガードの統合フック
 * ============================================================================
 */

import { useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNavigationStack, type NavItem } from '@/hooks/useNavigationStack';
import { useIsMobileLayout } from '@/hooks/useIsMobileLayout';
import { toSlug } from '@/utils/slug';
import type { MainTab, CharacterProgress } from '@/types/fishtracker';

type UseTrackerNavigationProps = {
	type?: string;
	slug?: string;
	mainTab: MainTab;
	isRegistered: boolean;
	activeCharacter: CharacterProgress | undefined;
	onRequestRegistration: (message: string) => void;
};

export const useTrackerNavigation = ({
	type,
	slug,
	mainTab,
	isRegistered,
	activeCharacter,
	onRequestRegistration,
}: UseTrackerNavigationProps) => {
	const navigate = useNavigate();
	const navStack = useNavigationStack(type, slug);
	const isMobileLayout = useIsMobileLayout();

	const handleSelectFromList = useCallback(
		(item: NavItem) => {
			if (!isRegistered || !activeCharacter) {
				onRequestRegistration('キャラクターを登録すると詳細の回遊や記録が行えます');
				return;
			}

			const itemSlug = toSlug(item.item.en);
			// item.type ではなく、現在の親タブ(mainTab)のパスを固定して引き継ぐ
			const targetPath = `/fishtracker/${mainTab}/${itemSlug}`;

			if (isMobileLayout) {
				navStack.push(item);
			} else {
				navStack.replace(item);
			}
			navigate(targetPath);
		},
		[isMobileLayout, navStack, navigate, mainTab, isRegistered, activeCharacter, onRequestRegistration]
	);

	const handlePop = useCallback(() => {
		if (navStack.stack.length > 1) {
			const previousItem = navStack.stack[navStack.stack.length - 2];
			const itemSlug = toSlug(previousItem.item.en);
			navStack.pop();
			// 戻る際も親タブ(mainTab)のパスを維持
			navigate(`/fishtracker/${mainTab}/${itemSlug}`);
		} else {
			navClear();
			navigate(`/fishtracker/${mainTab}`);
		}
	}, [navStack, navigate, mainTab]);

	const canGoBackEffective = navStack.stack.length > 1;

	const { push: navPush, replace: navReplace, clear: navClear } = navStack;

	const effectiveNavStack = useMemo(
		() => ({
			...navStack,
			push: (item: NavItem) => {
				if (!isRegistered || !activeCharacter) {
					onRequestRegistration('キャラクターを登録すると詳細の回遊や記録が行えます');
					return;
				}
				navPush(item);
				const itemSlug = toSlug(item.item.en);
				// item.type ではなく mainTab を使用
				navigate(`/fishtracker/${mainTab}/${itemSlug}`);
			},
			replace: (item: NavItem) => {
				if (!isRegistered || !activeCharacter) {
					onRequestRegistration('キャラクターを登録すると詳細の回遊や記録が行えます');
					return;
				}
				navReplace(item);
				const itemSlug = toSlug(item.item.en);
				// item.type ではなく mainTab を使用
				navigate(`/fishtracker/${mainTab}/${itemSlug}`);
			},
			pop: handlePop,
			clear: () => {
				navClear();
				navigate(`/fishtracker/${mainTab}`);
			},
			selectFromList: handleSelectFromList,
			canGoBack: canGoBackEffective,
		}),
		[
			navStack,
			navPush,
			navReplace,
			navClear,
			navigate,
			handlePop,
			handleSelectFromList,
			mainTab,
			canGoBackEffective,
			isRegistered,
			activeCharacter,
			onRequestRegistration,
		]
	);

	return {
		effectiveNavStack,
	};
};