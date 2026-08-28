/**
 * ============================================================================
 * [FilePath] src/features/fishtracker/hooks/useTrackerNavigation.ts
 * [Role] 釣魚チェッカーのルーティングおよびJSネイティブの戻る・遷移制御フック
 * 
 * [概要]
 * - 魚・エリア・餌詳細画面への遷移（push, replace, selectFromList）および戻る（pop, clear）の制御
 * - 未登録ユーザーアクセス時における遷移ロックおよび登録誘導モーダルの呼び出し
 * 
 * [依存関係・関連ファイル]
 * - 型定義   : src/types/fishtracker.ts, src/components/layout/Header.ts
 * - 参照元   : src/features/fishtracker/FishTrackerContainer.tsx
 * 
 * [編集・改修時の注意事項（AI/エンジニア共通指示）]
 * 1. 【アクセス制御】 未登録ユーザー (isRegistered === false) の場合は詳細の回遊・遷移を拒否し、
 *    必ず onRequestRegistration を実行してガードすること。
 * 2. 【履歴制御】 Browser/React Router のネイティブ履歴操作 (navigate(-1) 等) を基準とすること。
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
	onRequestRegistration,
}: UseTrackerNavigationProps) => {
	const navigate = useNavigate();
	const location = useLocation();
	const isMobileLayout = useIsMobileLayout();

	const [canGoBackEffective, setCanGoBackEffective] = useState(false);
	const depthRef = useRef<number>(0);
	const lastSlugRef = useRef<string | undefined>(slug);

	useEffect(() => {
		if (!slug) {
			depthRef.current = 0;
			setCanGoBackEffective(false);
			lastSlugRef.current = undefined;
			return;
		}

		if (!lastSlugRef.current) {
			depthRef.current = 0;
			setCanGoBackEffective(false);
		}

		lastSlugRef.current = slug;
	}, [slug]);

	const handleSelectFromList = useCallback(
		(item: NavItem) => {
			if (!isRegistered) {
				onRequestRegistration('キャラクターを登録すると詳細の回遊や記録が行えます');
				return;
			}

			const itemSlug = toSlug(item.item.en);
			const targetPath = `/fishtracker/${mainTab}/${itemSlug}${location.search}`;

			depthRef.current = 0;
			setCanGoBackEffective(false);
			lastSlugRef.current = itemSlug;

			navigate(targetPath, { replace: !isMobileLayout });
		},
		[isMobileLayout, navigate, mainTab, isRegistered, onRequestRegistration, location.search]
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
			if (!isRegistered) {
				onRequestRegistration('キャラクターを登録すると詳細の回遊や記録が行えます');
				return;
			}

			const itemSlug = toSlug(item.item.en);
			depthRef.current += 1;
			setCanGoBackEffective(true);
			lastSlugRef.current = itemSlug;
			navigate(`/fishtracker/${mainTab}/${itemSlug}${location.search}`);
		},
		[isRegistered, onRequestRegistration, mainTab, navigate, location.search]
	);

	const handleReplace = useCallback(
		(item: NavItem) => {
			if (!isRegistered) {
				onRequestRegistration('キャラクターを登録すると詳細の回遊や記録が行えます');
				return;
			}

			const itemSlug = toSlug(item.item.en);
			setCanGoBackEffective(depthRef.current > 0);
			lastSlugRef.current = itemSlug;
			navigate(`/fishtracker/${mainTab}/${itemSlug}${location.search}`, { replace: true });
		},
		[isRegistered, onRequestRegistration, mainTab, navigate, location.search]
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