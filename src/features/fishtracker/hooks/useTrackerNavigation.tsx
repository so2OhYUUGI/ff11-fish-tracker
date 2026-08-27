/**
 * ============================================================================
 * [FilePath] src/features/fishtracker/hooks/useTrackerNavigation.ts
 * [Role] 釣魚チェッカーのルーティングおよびJSネイティブの戻る・遷移制御フック
 * ============================================================================
 */

import { useCallback, useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useIsMobileLayout } from '@/hooks/useIsMobileLayout';
import { toSlug } from '@/utils/slug';
import type { MainTab, CharacterProgress, FishMaster, ZoneMaster, BaitMaster } from '@/types/fishtracker';
import type { DisplayCharacterProgress } from '@/components/layout/Header';

export type NavItem =
	| { type: 'fish'; item: FishMaster }
	| { type: 'area'; item: ZoneMaster }
	| { type: 'bait'; item: BaitMaster };

type UseTrackerNavigationProps = {
	type?: string;
	slug?: string;
	mainTab: MainTab;
	isRegistered: boolean;
	activeCharacter: CharacterProgress | DisplayCharacterProgress | undefined;
	onRequestRegistration: (message: string) => void;
};

export const useTrackerNavigation = ({
	slug,
	mainTab,
	isRegistered,
	activeCharacter,
	onRequestRegistration,
}: UseTrackerNavigationProps) => {
	const navigate = useNavigate();
	const location = useLocation();
	const isMobileLayout = useIsMobileLayout();

	const canNavigate = isRegistered || !!(activeCharacter as DisplayCharacterProgress)?.isShared;

	const [canGoBackEffective, setCanGoBackEffective] = useState(false);
	const depthRef = useRef<number>(0);
	const lastSlugRef = useRef<string | undefined>(slug);

	// slug や location の変化を監視して履歴の深さ（スタック階層）を追跡
	useEffect(() => {
		if (!slug) {
			depthRef.current = 0;
			setCanGoBackEffective(false);
			lastSlugRef.current = undefined;
			return;
		}

		// 一覧から新たに選択された、または別ルートで直アクセスされた場合
		if (!lastSlugRef.current) {
			depthRef.current = 0;
			setCanGoBackEffective(false);
		}

		lastSlugRef.current = slug;
	}, [slug]);

	const handleSelectFromList = useCallback(
		(item: NavItem) => {
			if (!canNavigate) {
				onRequestRegistration('キャラクターを登録すると詳細の回遊や記録が行えます');
				return;
			}

			const itemSlug = toSlug(item.item.en);
			const targetPath = `/fishtracker/${mainTab}/${itemSlug}${location.search}`;

			// リストからの選択時は深さをリセットし、戻るを非表示にする
			depthRef.current = 0;
			setCanGoBackEffective(false);
			lastSlugRef.current = itemSlug;

			navigate(targetPath, { replace: !isMobileLayout });
		},
		[isMobileLayout, navigate, mainTab, canNavigate, onRequestRegistration, location.search]
	);

	const handlePop = useCallback(() => {
		if (depthRef.current > 0) {
			depthRef.current -= 1;
		}
		if (depthRef.current === 0) {
			setCanGoBackEffective(false);
		}
		navigate(-1);
	}, [navigate]);

	const handlePush = useCallback(
		(item: NavItem) => {
			if (!canNavigate) {
				onRequestRegistration('キャラクターを登録すると詳細の回遊や記録が行えます');
				return;
			}
			const itemSlug = toSlug(item.item.en);
			depthRef.current += 1;
			setCanGoBackEffective(true);
			lastSlugRef.current = itemSlug;
			navigate(`/fishtracker/${mainTab}/${itemSlug}${location.search}`);
		},
		[canNavigate, onRequestRegistration, mainTab, navigate, location.search]
	);

	const handleReplace = useCallback(
		(item: NavItem) => {
			if (!canNavigate) {
				onRequestRegistration('キャラクターを登録すると詳細の回遊や記録が行えます');
				return;
			}
			const itemSlug = toSlug(item.item.en);
			setCanGoBackEffective(depthRef.current > 0);
			lastSlugRef.current = itemSlug;
			navigate(`/fishtracker/${mainTab}/${itemSlug}${location.search}`, { replace: true });
		},
		[canNavigate, onRequestRegistration, mainTab, navigate, location.search]
	);

	const handleClear = useCallback(() => {
		depthRef.current = 0;
		setCanGoBackEffective(false);
		lastSlugRef.current = undefined;
		navigate(`/fishtracker/${mainTab}${location.search}`);
	}, [navigate, mainTab, location.search]);

	const effectiveNavStack = {
		push: handlePush,
		replace: handleReplace,
		pop: handlePop,
		clear: handleClear,
		selectFromList: handleSelectFromList,
		canGoBack: canGoBackEffective,
		current: null,
		stack: [],
	};

	return {
		effectiveNavStack,
	};
};