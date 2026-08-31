/**
 * ============================================================================
 * [FilePath] src/features/trusttracker/TrustTrackerContainer.tsx
 * [Role] フェイスチェッカー（TrustTracker）全体のメインコンテナ
 * 
 * [概要]
 * - UserDataContext から状態および操作関数を取得し、進捗の永続化・反映を実施
 * - タブ切り替え時の URL クエリパラメータ（location.search）保持
 * - ウィッシュリストの選択（activeWishlistId）の管理と FilterBar / Content への伝播
 * - 共有ウィッシュリスト（isShared）アクセス時の自動タブ切り替えおよび初期選択処理
 * - checkedTrustIds の数値化・正規化ロジックの適用
 * - 閲覧専用状態（共有キャラ）および未登録ガード判定、Undoアクション付きトーストの実装
 * - 共通ナビゲーションフック（useTrackerNavigation）の組み込み
 * - 限定（isLimited: true）を除外したフェイス総数の計算・伝播
 * ============================================================================
 */

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';

import { TRUSTS } from '@/data/trusts';
import type { TrustSubtype, StatusFilter, TrustMaster, CharacterProgress, Wishlist } from '@/types/';
import { WISHLIST_LIMITS } from '@/types/trusttracker';
import { useUserDataContext } from '@/contexts/UserDataContext';
import { useTrackerNavigation } from '@/hooks/useTrackerNavigation';
import { FilterBar } from './FilterBar';
import { TrustTrackerContent } from './TrustTrackerContent';
import { LAYOUT_TOKENS } from '@/styles/tokens/layoutTokens';

export interface DisplayCharacterProgress extends CharacterProgress {
	isShared?: boolean;
	checkedTrustIds: number[];
	wishlists: Wishlist[];
}

export const TrustTrackerContainer: React.FC = () => {
	const [searchParams, setSearchParams] = useSearchParams();
	const { slug } = useParams<{ slug?: string }>();

	const {
		wishlists, // Context 側で共有ウィッシュリストが合成された一覧を取得
		activeCharacter,
		isRegistered,
		toggleTrustCheck,
		addWishlist,
		setRegistrationMessage: onRequestRegistration,
	} = useUserDataContext();

	// 限定（isLimited: true）を除外したフェイスの抽出と総数
	const nonLimitedTrusts = useMemo(() => {
		return TRUSTS.filter((trust) => !trust.isLimited);
	}, []);

	const totalTrustCount = nonLimitedTrusts.length;

	// 共有ウィッシュリストを取得
	const sharedWishlist = useMemo(() => {
		return wishlists.find((w) => (w as { isShared?: boolean }).isShared || w.id.startsWith('shared-'));
	}, [wishlists]);

	const hasSharedWishlist = !!sharedWishlist;

	// 1. サブタイプ（メインタブ）
	const urlType = searchParams.get('type') as TrustSubtype | null;
	const isShareParamPresent = searchParams.has('wishlist_share');

	const activeType: TrustSubtype = useMemo(() => {
		if (urlType) return urlType;
		if (hasSharedWishlist || isShareParamPresent) return 'wishlist';
		return 'trust';
	}, [urlType, hasSharedWishlist, isShareParamPresent]);

	// 2. 修得ステータスフィルター
	const statusFilter = (searchParams.get('status') as StatusFilter) || 'all';

	// 3. 検索クエリ
	const searchQuery = searchParams.get('q') || '';

	// 4. ウィッシュリストの選択ID管理（rawState と 派生評価の分離）
	const [rawActiveWishlistId, setActiveWishlistId] = useState<string>('');

	// 実際の描画・配下に渡す有効な activeWishlistId をレンダー時に安全に評価
	const effectiveActiveWishlistId = useMemo(() => {
		if (!wishlists || wishlists.length === 0) return '';

		// 現在選択中のIDが実際に存在すればそれを採用
		const exists = wishlists.some((w) => w.id === rawActiveWishlistId);
		if (rawActiveWishlistId && exists) {
			return rawActiveWishlistId;
		}

		// 存在しない・未選択の場合は共有リスト優先、次いで先頭のリストへ自動フォールバック
		return sharedWishlist ? sharedWishlist.id : wishlists[0]?.id || '';
	}, [wishlists, rawActiveWishlistId, sharedWishlist]);

	// 共有ウィッシュリスト自動選択の重複実行・通知防止用フラグ
	const hasSelectedSharedWishlistRef = useRef(false);

	// 共有ウィッシュリストが非同期ロード等で後から追加された場合の反映・通知
	useEffect(() => {
		if (sharedWishlist && !hasSelectedSharedWishlistRef.current) {
			hasSelectedSharedWishlistRef.current = true;
			setActiveWishlistId(sharedWishlist.id);

			// URLパラメータの type を wishlist に同期
			if (searchParams.get('type') !== 'wishlist') {
				setSearchParams(
					(prev) => {
						const nextParams = new URLSearchParams(prev);
						nextParams.set('type', 'wishlist');
						return nextParams;
					},
					{ replace: true }
				);
			}

			toast.info(`共有された「${sharedWishlist.name}」を表示しています`);
		}
	}, [sharedWishlist, searchParams, setSearchParams]);

	// 5. 共通ナビゲーションフックの呼び出し
	const { effectiveNavStack } = useTrackerNavigation<TrustMaster>({
		basePath: `/trusttracker/${activeType}`,
		slug,
		isRegistered,
		onRequestRegistration,
	});

	// activeCharacter 内の checkedTrustIds を数値配列へ安全に正規化
	const effectiveActiveCharacter: DisplayCharacterProgress = useMemo(() => {
		if (!activeCharacter) {
			return {
				id: 'guest',
				name: 'ゲスト',
				checkedTrustIds: [],
				wishlists: [],
				createdAt: 0,
				updatedAt: 0,
			};
		}

		const rawIds = Array.isArray(activeCharacter.checkedTrustIds)
			? activeCharacter.checkedTrustIds
			: [];

		const normalizedIds = rawIds
			.map((id) => (typeof id === 'number' ? id : Number(id)))
			.filter((id) => Number.isInteger(id));

		return {
			...activeCharacter,
			checkedTrustIds: normalizedIds,
			wishlists: wishlists,
		};
	}, [activeCharacter, wishlists]);

	const checkedTrustIds = useMemo(() => {
		return effectiveActiveCharacter.checkedTrustIds || [];
	}, [effectiveActiveCharacter.checkedTrustIds]);

	// タブ切り替え処理（クエリパラメータを保持して遷移）
	const handleTypeChange = useCallback(
		(newType: TrustSubtype) => {
			setSearchParams(
				(prev) => {
					const nextParams = new URLSearchParams(prev);
					nextParams.set('type', newType);
					return nextParams;
				},
				{ replace: true }
			);
		},
		[setSearchParams]
	);

	// ステータスフィルター切り替え
	const handleStatusFilterChange = useCallback(
		(status: StatusFilter) => {
			setSearchParams(
				(prev) => {
					const nextParams = new URLSearchParams(prev);
					if (status === 'all') {
						nextParams.delete('status');
					} else {
						nextParams.set('status', status);
					}
					return nextParams;
				},
				{ replace: true }
			);
		},
		[setSearchParams]
	);

	// 検索クエリ変更
	const handleSearchQueryChange = useCallback(
		(query: string) => {
			setSearchParams(
				(prev) => {
					const nextParams = new URLSearchParams(prev);
					if (query.trim()) {
						nextParams.set('q', query.trim());
					} else {
						nextParams.delete('q');
					}
					return nextParams;
				},
				{ replace: true }
			);
		},
		[setSearchParams]
	);

	// ウィッシュリスト作成ハンドラ
	const handleCreateWishlist = useCallback(() => {
		const myWishlistsCount = wishlists.filter(
			(w) => !(w as { isShared?: boolean }).isShared && !w.id.startsWith('shared-')
		).length;

		if (myWishlistsCount >= WISHLIST_LIMITS.MAX_SLOTS) {
			toast.error(`ウィッシュリストは最大 ${WISHLIST_LIMITS.MAX_SLOTS} つまで作成できます。`);
			return;
		}
		const defaultName = `ウィッシュリスト ${myWishlistsCount + 1}`;
		const newId = addWishlist(defaultName);
		if (newId) {
			// 作成された ID を直接アクティブに切り替える
			setActiveWishlistId(newId);
			toast.success(`「${defaultName}」を作成しました`);
		}
	}, [wishlists, addWishlist]);

	// 修得トグル処理
	const handleToggleCheck = useCallback(
		(trustId: number) => {
			if (effectiveActiveCharacter.isShared) {
				toast.info('共有キャラクターの修得状況は変更できません（閲覧専用）');
				return;
			}

			if (!isRegistered || !activeCharacter) {
				onRequestRegistration('キャラクターを登録すると修得状況を記録できます');
				return;
			}

			const isCurrentlyChecked = checkedTrustIds.includes(trustId);
			const targetTrust = TRUSTS.find((t) => t.id === trustId);

			toggleTrustCheck(trustId);

			if (isCurrentlyChecked && targetTrust) {
				toast(`「${targetTrust.ja}」のチェックを外しました`, {
					action: {
						label: '元に戻す',
						onClick: () => toggleTrustCheck(trustId),
					},
					duration: 4000,
				});
			}
		},
		[
			isRegistered,
			activeCharacter,
			effectiveActiveCharacter.isShared,
			checkedTrustIds,
			toggleTrustCheck,
			onRequestRegistration,
		]
	);

	return (
		<>
			{/* 1. フィルターバー（sticky固定領域） */}
			<div className={LAYOUT_TOKENS.header.stickyFilterBar}>
				<FilterBar
					activeType={activeType}
					onTypeChange={handleTypeChange}
					activeCharacter={effectiveActiveCharacter}
					statusFilter={statusFilter}
					onStatusFilterChange={handleStatusFilterChange}
					searchQuery={searchQuery}
					onSearchQueryChange={handleSearchQueryChange}
					totalTrustCount={totalTrustCount}
					wishlists={wishlists}
					activeWishlistId={effectiveActiveWishlistId}
					onWishlistIdChange={setActiveWishlistId}
					onCreateWishlist={handleCreateWishlist}
				/>
			</div>

			{/* 2. メインコンテンツ領域 */}
			<div className="flex-1 min-h-500px">
				<TrustTrackerContent
					activeType={activeType}
					statusFilter={statusFilter}
					searchQuery={searchQuery}
					trusts={TRUSTS}
					checkedTrustIds={checkedTrustIds}
					onToggleCheck={handleToggleCheck}
					navStack={effectiveNavStack}
					wishlists={wishlists}
					activeWishlistId={effectiveActiveWishlistId}
					onWishlistIdChange={setActiveWishlistId}
				/>
			</div>
		</>
	);
};