/**
 * ============================================================================
 * [FilePath] src/features/trusttracker/TrustTrackerContainer.tsx
 * [Role] フェイスチェッカー（TrustTracker）全体のメインコンテナ
 * 
 * [概要]
 * - UserDataContext から状態および操作関数を取得し、進捗の永続化・反映を実施
 * - タブ切り替え時の URL クエリパラメータ（location.search）保持
 * - checkedTrustIds の数値化・正規化ロジックの適用
 * - 閲覧専用状態（共有キャラ）および未登録ガード判定、Undoアクション付きトーストの実装
 * 
 * [依存関係・関連ファイル]
 * - データ      : src/data/trusts.ts
 * - Context     : src/contexts/UserDataContext.tsx
 * - 関連        : src/features/trusttracker/FilterBar.tsx
 * - 関連        : src/features/trusttracker/TrustTrackerContent.tsx
 * - 型定義      : src/types/trusttracker.ts, src/components/layout/Header.ts
 * ============================================================================
 */

import React, { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';

import { TRUSTS } from '@/data/trusts';
import type { TrustSubtype, StatusFilter } from '@/types/trusttracker';
import type { DisplayCharacterProgress } from '@/components/layout/Header';
import { useUserDataContext } from '@/contexts/UserDataContext';
import { FilterBar } from './FilterBar';
import { TrustTrackerContent } from './TrustTrackerContent';
import { LAYOUT_TOKENS } from '@/styles/tokens/layoutTokens';

export const TrustTrackerContainer: React.FC = () => {
	const [searchParams, setSearchParams] = useSearchParams();

	const {
		activeCharacter,
		isRegistered,
		toggleTrustCheck,
		setRegistrationMessage: onRequestRegistration,
	} = useUserDataContext();

	// 1. サブタイプ（メインタブ）
	const activeType = (searchParams.get('type') as TrustSubtype) || 'trust';

	// 2. 修得ステータスフィルター
	const statusFilter = (searchParams.get('status') as StatusFilter) || 'all';

	// 3. 検索クエリ
	const searchQuery = searchParams.get('q') || '';

	// activeCharacter 内の checkedTrustIds を数値配列へ安全に正規化
	const effectiveActiveCharacter: DisplayCharacterProgress = useMemo(() => {
		if (!activeCharacter) {
			return {
				id: 'guest',
				name: 'ゲスト',
				checkedFishIds: [],
				checkedTrustIds: [],
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
		};
	}, [activeCharacter]);

	const checkedTrustIds = effectiveActiveCharacter.checkedTrustIds || [];

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

	// 修得トグル処理
	const handleToggleCheck = useCallback(
		(trustId: number) => {
			// 共有キャラの閲覧時はチェック操作不可
			if (effectiveActiveCharacter.isShared) {
				toast.info('共有キャラクターの修得状況は変更できません（閲覧専用）');
				return;
			}

			// 未登録かつ非共有時のガード
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
			<div className={LAYOUT_TOKENS.header.stickyFilterBar}>
			{/* 1. フィルターバー */}
			<FilterBar
				activeType={activeType}
				onTypeChange={handleTypeChange}
				activeCharacter={effectiveActiveCharacter}
				statusFilter={statusFilter}
				onStatusFilterChange={handleStatusFilterChange}
				searchQuery={searchQuery}
				onSearchQueryChange={handleSearchQueryChange}
				totalTrustCount={TRUSTS.length}
			/>

			{/* 2. メインコンテンツ領域 */}
			<div className="flex-1 min-h-[500px]">
				<TrustTrackerContent
					activeType={activeType}
					statusFilter={statusFilter}
					searchQuery={searchQuery}
					trusts={TRUSTS}
					checkedTrustIds={checkedTrustIds}
					onToggleCheck={handleToggleCheck}
				/>
			</div>
		</div>
	);
};