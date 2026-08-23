/**
 * ============================================================================
 * [FilePath] src/features/fishtracker/FishTrackerContent.tsx
 * [Role]     メイン領域の表示切替・フィルタリング・ルーティングコンポーネント
 * 
 * [概要]
 * - 選択中のタブ（`mainTab`: 'fish' | 'bait' | 'area'）に応じた表示ビューの切替
 * - 魚データ（`FISHES`）に対するフィルタリング（チェック状態：`statusFilter` / 検索文字列：`searchQuery`）の適用
 * - 餌データ（`BAITS`）に対する検索フィルタリングの適用
 * - エリアデータ（`ZONES`）に対する検索フィルタリングの適用
 * - ナビゲーションスタック（`navStack`）を受け取り、各一覧ビューへ詳細循環遷移ロジックを伝達
 * - フィルタリング処理の最適化（`useMemo` によるメモ化）
 * - タブ・フィルター状態に応じたSEOメタデータ（`<SEO />`）の動的書き換え
 * 
 * [依存関係・関連ファイル]
 * - コンポーネント : SEO (src/components/SEO.tsx)
 * - データ       : src/data/
 * - ビュー       : FishView, BaitView, AreaView
 * - 型定義       : src/types/fish, FilterBar
 * 
 * [編集・改修時の注意事項（AI/エンジニア共通指示）]
 * 1. 【SEO連動】 タブ選択（mainTab）および検索・フィルター状態に合わせた適切なタイトルとメタ説明文を SEO コンポーネントへ渡すこと。詳細スタック選択時は子ビュー側のSEO設定を優先すること。
 * 2. 【メモ化維持】 useMemo によるフィルタリング最適化を崩さないこと。
 * ============================================================================
 */

import React, { useMemo } from 'react';
import { FISHES, ZONES, BAITS } from '@/data/';
import { SEO } from '@/components/SEO';
import { FishView } from './fish/FishView';
import { BaitView } from './bait/BaitView';
import { AreaView } from './area/AreaView';
import type { MainTab, ViewMode, CharacterProgress } from '@/types/fishtracker';
import type { StatusFilter } from '@/features/fishtracker/FilterBar';
import type { useNavigationStack } from '@/hooks/useNavigationStack';

type FishTrackerContentProps = {
	mainTab: MainTab;
	statusFilter: StatusFilter;
	searchQuery: string;
	viewMode: ViewMode;
	activeCharacter: CharacterProgress;
	onToggleCheck: (fishId: number) => void;
	navStack: ReturnType<typeof useNavigationStack>;
};

const TAB_SEO_CONFIG: Record<MainTab, { title: string; description: string }> = {
	fish: {
		title: '魚一覧・チェッカー',
		description: 'FF11の釣魚データ一覧。限界スキル、ハラキリ対象、竿の相性、生息エリアや適正エサの確認・進捗管理が可能です。',
	},
	bait: {
		title: 'エサ一覧',
		description: 'FF11の釣りエサ一覧。各エサで釣ることができる対象魚や関連データを検索・確認できます。',
	},
	area: {
		title: 'エリア一覧',
		description: 'FF11の釣りエリア（ゾーン）一覧。各エリアで釣れる魚の検索および詳細情報を確認できます。',
	},
};

export const FishTrackerContent: React.FC<FishTrackerContentProps> = ({
	mainTab,
	statusFilter,
	searchQuery,
	viewMode,
	activeCharacter,
	onToggleCheck,
	navStack,
}) => {
	const filteredFishes = useMemo(() => {
		return FISHES.filter((fish) => {
			const isChecked = activeCharacter.checkedFishIds.includes(fish.id);
			if (statusFilter === 'checked' && !isChecked) return false;
			if (statusFilter === 'unchecked' && isChecked) return false;

			if (searchQuery.trim()) {
				const query = searchQuery.toLowerCase();
				const matchJa = fish.ja.toLowerCase().includes(query);
				const matchEn = fish.en.toLowerCase().includes(query);
				if (!matchJa && !matchEn) return false;
			}

			return true;
		});
	}, [activeCharacter.checkedFishIds, statusFilter, searchQuery]);

	const filteredBaits = useMemo(() => {
		if (!searchQuery.trim()) return BAITS;
		const query = searchQuery.toLowerCase();
		return BAITS.filter(
			(bait) =>
				bait.ja.toLowerCase().includes(query) ||
				bait.en.toLowerCase().includes(query)
		);
	}, [searchQuery]);

	const filteredAreas = useMemo(() => {
		if (!searchQuery.trim()) return ZONES;
		const query = searchQuery.toLowerCase();
		return ZONES.filter(
			(zone) =>
				zone.ja.toLowerCase().includes(query) ||
				zone.en.toLowerCase().includes(query)
		);
	}, [searchQuery]);

	// SEO情報（検索条件がある場合はタイトルに反映）
	const seoConfig = TAB_SEO_CONFIG[mainTab];
	const seoTitle = searchQuery.trim()
		? `${seoConfig.title} (検索: "${searchQuery}")`
		: seoConfig.title;

	// 詳細表示中（navStack.current が存在）の場合は子ビュー側の詳細用SEO設定に委ねる
	const isDetailActive = navStack.current !== null;

	return (
		<>
			{!isDetailActive && (
				<SEO title={seoTitle} description={seoConfig.description} />
			)}
			{(() => {
				switch (mainTab) {
					case 'fish':
						return (
							<FishView
								fishes={filteredFishes}
								zones={ZONES}
								checkedFishIds={activeCharacter.checkedFishIds}
								viewMode={viewMode}
								onToggleCheck={onToggleCheck}
								navStack={navStack}
							/>
						);
					case 'bait':
						return (
							<BaitView
								baits={filteredBaits}
								allFishes={FISHES}
								checkedFishIds={activeCharacter.checkedFishIds}
								viewMode={viewMode}
								onToggleCheck={onToggleCheck}
								navStack={navStack}
							/>
						);
					case 'area':
						return (
							<AreaView
								areas={filteredAreas}
								allFishes={FISHES}
								checkedFishIds={activeCharacter.checkedFishIds}
								viewMode={viewMode}
								onToggleCheck={onToggleCheck}
								navStack={navStack}
							/>
						);
					default:
						return null;
				}
			})()}
		</>
	);
};