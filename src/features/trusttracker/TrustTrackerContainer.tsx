/**
 * ============================================================================
 * [FilePath] src/features/trusttracker/TrustTrackerContainer.tsx
 * [Role] フェイスチェッカー（TrustTracker）全体のメインコンテナ
 * 
 * [概要]
 * - フィルターバー（FilterBar）とメインコンテンツ（TrustTrackerContent）の統合
 * - 各種状態管理（サブタイプ切替、ステータスフィルター、検索クエリ、修得済みIDリスト）
 * - FilterBar への渡す Props（totalTrustCount, activeCharacter）の整合性維持
 * 
 * [依存関係・関連ファイル]
 * - 型定義  : src/types/trusttracker.ts
 * - 関連    : src/features/trusttracker/FilterBar.tsx
 * - 関連    : src/features/trusttracker/TrustTrackerContent.tsx
 * ============================================================================
 */

import React, { useState, useCallback, useMemo } from 'react';
import type { TrustSubtype, StatusFilter, TrustMaster } from '@/types/trusttracker';
import type { CharacterProgress } from '@/types/fishtracker';
import { FilterBar } from './FilterBar';
import { TrustTrackerContent } from './TrustTrackerContent';

// ※ 実際の運用時には src/data/trusts.ts 等からマスターデータをインポートします
const MOCK_TRUSTS: TrustMaster[] = [
	{
		id: 896,
		en: 'Shantotto',
		ja: 'シャントット',
		icon_id: 1029,
		party_name: 'Shantotto',
		job: '黒魔道士',
		combatType: '魔法攻撃',
		isLimited: false,
		acquireInfo: '通常',
		item: {
			id: 0,
			en: '',
			ja: '盟-シャントット',
			desc_jp: '',
			desc_en: '',
		},
	},
	{
		id: 897,
		en: 'Naji',
		ja: 'ナジ',
		icon_id: 1010,
		party_name: 'Naji',
		job: '戦士',
		combatType: '近接物理',
		isLimited: false,
		acquireInfo: '新魔法フェイス（バストゥーク）',
		item: {
			id: 0,
			en: '',
			ja: '盟-ナジ',
			desc_jp: '',
			desc_en: '',
		},
	},
	{
		id: 898,
		en: 'Kupipi',
		ja: 'クピピ',
		icon_id: 1038,
		party_name: 'Kupipi',
		job: '白魔道士',
		combatType: '回復',
		isLimited: false,
		acquireInfo: '新魔法フェイス（ウィンダス）',
		item: {
			id: 0,
			en: '',
			ja: '盟-クピピ',
			desc_jp: '',
			desc_en: '',
		},
	},
];

export const TrustTrackerContainer: React.FC = () => {
	// 1. サブタイプ（メインタブ）
	const [activeType, setActiveType] = useState<TrustSubtype>('trust');

	// 2. 修得ステータスフィルター
	const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

	// 3. 検索クエリ
	const [searchQuery, setSearchQuery] = useState<string>('');

	// 4. 修得済みフェイスIDリスト（動作テスト用状態）
	const [checkedTrustIds, setCheckedTrustIds] = useState<number[]>([]);

	// 修得トグル処理
	const handleToggleCheck = useCallback((trustId: number) => {
		setCheckedTrustIds((prev) =>
			prev.includes(trustId) ? prev.filter((id) => id !== trustId) : [...prev, trustId]
		);
	}, []);

	// FilterBar 互換用のダミーキャラクターオブジェクト（checkedFishIds に checkedTrustIds をマッピング）
	const activeCharacter: CharacterProgress = useMemo(
		() => ({
			characterId: 'default',
			characterName: 'メインキャラ',
			checkedFishIds: checkedTrustIds,
			checkedZoneIds: [],
			checkedBaitIds: [],
		}),
		[checkedTrustIds]
	);

	return (
		<div className="w-full flex flex-col gap-4">
			{/* 1. フィルターバー */}
			<FilterBar
				activeType={activeType}
				onTypeChange={setActiveType}
				activeCharacter={activeCharacter}
				statusFilter={statusFilter}
				onStatusFilterChange={setStatusFilter}
				searchQuery={searchQuery}
				onSearchQueryChange={setSearchQuery}
				totalTrustCount={MOCK_TRUSTS.length}
			/>

			{/* 2. メインコンテンツ領域 */}
			<div className="flex-1 min-h-[500px]">
				<TrustTrackerContent
					activeType={activeType}
					statusFilter={statusFilter}
					searchQuery={searchQuery}
					trusts={MOCK_TRUSTS}
					checkedTrustIds={checkedTrustIds}
					onToggleCheck={handleToggleCheck}
				/>
			</div>
		</div>
	);
};