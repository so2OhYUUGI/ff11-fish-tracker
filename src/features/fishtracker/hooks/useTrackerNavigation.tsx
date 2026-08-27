/**
 * ============================================================================
 * [FilePath] src/features/fishtracker/hooks/useTrackerNavigation.ts
 * [Role] 釣魚チェッカーのナビゲーションスタック・ルーティング・登録ガードの統合フック
 * 
 * [調整内容]
 * - 共有キャラクター閲覧中（activeCharacter.isShared）の詳細画面遷移を許可するようガード条件を変更
 * - 画面遷移時に URL クエリパラメータ（共有データキー等）を保持する処理を追加
 * ============================================================================
 */

import { useMemo, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useNavigationStack, type NavItem } from '@/hooks/useNavigationStack';
import { useIsMobileLayout } from '@/hooks/useIsMobileLayout';
import { toSlug } from '@/utils/slug';
import type { MainTab, CharacterProgress } from '@/types/fishtracker';
import type { DisplayCharacterProgress } from '@/components/layout/Header';

type UseTrackerNavigationProps = {
	type?: string;
	slug?: string;
	mainTab: MainTab;
	isRegistered: boolean;
	activeCharacter: CharacterProgress | DisplayCharacterProgress | undefined;
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
	const location = useLocation();
	const navStack = useNavigationStack(type, slug);
	const isMobileLayout = useIsMobileLayout();

	// 閲覧権限判定（ユーザーが登録済み、または共有キャラ閲覧中の場合）
	const canNavigate = isRegistered || !!(activeCharacter as DisplayCharacterProgress)?.isShared;

	const handleSelectFromList = useCallback(
		(item: NavItem) => {
			if (!canNavigate) {
				onRequestRegistration('キャラクターを登録すると詳細の回遊や記録が行えます');
				return;
			}

			const itemSlug = toSlug(item.item.en);
			const targetPath = `/fishtracker/${mainTab}/${itemSlug}${location.search}`;

			if (isMobileLayout) {
				navStack.push(item);
			} else {
				navStack.replace(item);
			}
			navigate(targetPath);
		},
		[isMobileLayout, navStack, navigate, mainTab, canNavigate, onRequestRegistration, location.search]
	);

	const handlePop = useCallback(() => {
		if (navStack.stack.length > 1) {
			const previousItem = navStack.stack[navStack.stack.length - 2];
			const itemSlug = toSlug(previousItem.item.en);
			navStack.pop();
			navigate(`/fishtracker/${mainTab}/${itemSlug}${location.search}`);
		} else {
			navClear();
			navigate(`/fishtracker/${mainTab}${location.search}`);
		}
	}, [navStack, navigate, mainTab, location.search]);

	const canGoBackEffective = navStack.stack.length > 1;

	const { push: navPush, replace: navReplace, clear: navClear } = navStack;

	const effectiveNavStack = useMemo(
		() => ({
			...navStack,
			push: (item: NavItem) => {
				if (!canNavigate) {
					onRequestRegistration('キャラクターを登録すると詳細の回遊や記録が行えます');
					return;
				}
				navPush(item);
				const itemSlug = toSlug(item.item.en);
				navigate(`/fishtracker/${mainTab}/${itemSlug}${location.search}`);
			},
			replace: (item: NavItem) => {
				if (!canNavigate) {
					onRequestRegistration('キャラクターを登録すると詳細の回遊や記録が行えます');
					return;
				}
				navReplace(item);
				const itemSlug = toSlug(item.item.en);
				navigate(`/fishtracker/${mainTab}/${itemSlug}${location.search}`);
			},
			pop: handlePop,
			clear: () => {
				navClear();
				navigate(`/fishtracker/${mainTab}${location.search}`);
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
			canNavigate,
			onRequestRegistration,
			location.search,
		]
	);

	return {
		effectiveNavStack,
	};
};