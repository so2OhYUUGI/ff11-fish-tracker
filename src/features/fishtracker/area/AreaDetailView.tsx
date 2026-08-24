/**
 * ============================================================================
 * [FilePath] src/features/fishtracker/area/AreaDetailView.tsx
 * [Role] 選択されたエリアの詳細情報および釣れる魚一覧の表示コンポーネント
 * 
 * [概要]
 * - 共通ヘッダーコンポーネント（`DetailHeader`）を利用してヘッダー部分を統一
 * - ヘッダー（エリア名・共有）を固定し、コンテンツ部分全体を独立スクロール表示
 * - `regionList` から `area.regionId` に一致するリージョン情報を参照して描画
 * - 中間データ `FISH_LOCATIONS` を参照し、当該エリア（`area.id`）で釣れる魚を抽出・スキル昇順ソートして表示
 * - 釣れる魚一覧の各行を統合作成した FishListItem（variant="inline"）へ置き換え
 * - 全スタイルの参照を `DETAIL_STYLES` および `COMMON_TOKENS` へ完全集約
 * ============================================================================
 */

import React, { useMemo } from 'react';
import { MapPin, Fish } from 'lucide-react';
import type { ZoneMaster, FishMaster, RegionMaster } from '@/types/fishtracker';
import { FISH_LOCATIONS } from '@/data';
import { DETAIL_STYLES } from '@/styles/components/detailStyles';
import { COMMON_TOKENS } from '@/styles/tokens/commonTokens';
import { DetailHeader } from '@/features/fishtracker/common/DetailHeader';
import { FishListItem } from '@/features/fishtracker/fish/FishListItem';

type AreaDetailViewProps = {
	area: ZoneMaster;
	allFishes: FishMaster[];
	regionList: RegionMaster[];
	checkedFishIds?: number[];
	onClose: () => void;
	onBack?: () => void;
	canGoBack?: boolean;
	onToggleCheck?: (fishId: number) => void;
	onClickFishDetail?: (fish: FishMaster) => void;
};

export const AreaDetailView: React.FC<AreaDetailViewProps> = ({
	area,
	allFishes,
	regionList,
	checkedFishIds = [],
	onClose,
	onBack,
	canGoBack = false,
	onToggleCheck,
	onClickFishDetail,
}) => {
	// FISH_LOCATIONS から当該エリア (area.id) で釣れる魚のデータリストを取得（maxSkill昇順ソート）
	const catchableFishes = useMemo(() => {
		if (!area) return [];
		const targetFishIds = new Set(
			FISH_LOCATIONS
				.filter((loc) => loc.zoneId === area.id)
				.map((loc) => loc.fishId)
		);
		return allFishes
			.filter((fish) => targetFishIds.has(fish.id))
			.sort((a, b) => (a.maxSkill ?? 0) - (b.maxSkill ?? 0));
	}, [area, allFishes]);

	// チェック済み魚IDの高速判定用 Set
	const checkedSet = useMemo(() => new Set(checkedFishIds), [checkedFishIds]);

	// area.regionId に一致するリージョン情報を検索
	const belongsRegion = useMemo(() => {
		if (area.regionId === undefined) return undefined;
		return regionList.find(
			(r) => String(r.id) === String(area.regionId)
		);
	}, [area.regionId, regionList]);

	// 改行コードで分割した説明文行リスト
	const descriptionLines = useMemo(() => {
		if (!area.description) return [];
		return area.description.split(/\r?\n|\\n/);
	}, [area.description]);

	return (
		<div className={DETAIL_STYLES.panelBase}>
			{/* 1. 共通固定ヘッダー */}
			<DetailHeader
				titleJa={area.ja}
				titleEn={area.en}
				categoryName="エリア"
				icon={<MapPin className={`w-5 h-5 shrink-0 ${COMMON_TOKENS.entity.area.text}`} />}
				canGoBack={canGoBack}
				onBack={onBack}
				onClose={onClose}
			/>

			{/* 2. 一括スクロール可能なコンテンツ領域 */}
			<div className={DETAIL_STYLES.scrollContent}>
				{/* 所属リージョン表示 */}
				{belongsRegion && (
					<div className={DETAIL_STYLES.regionInfo}>
						<span className={DETAIL_STYLES.regionLabel}>リージョン:</span>
						<span className={DETAIL_STYLES.regionNameJa}>
							{belongsRegion.ja}
							<span className={DETAIL_STYLES.regionNameEn}>({belongsRegion.en})</span>
						</span>
					</div>
				)}

				{/* 説明文 */}
				{descriptionLines.length > 0 && (
					<div className={DETAIL_STYLES.descriptionBox}>
						{descriptionLines.map((line, index) => (
							<React.Fragment key={`${index}-${line.slice(0, 10)}`}>
								{index > 0 && <br />}
								{line}
							</React.Fragment>
						))}
					</div>
				)}

				{/* 釣れる魚一覧（リスト形式） */}
				<div>
					<h3 className={`${DETAIL_STYLES.sectionTitle} flex items-center gap-2`}>
						<Fish className={`w-4 h-4 shrink-0 ${COMMON_TOKENS.entity.fish.text}`} />
						<span>生息する魚 ({catchableFishes.length} 種)</span>
					</h3>

					{catchableFishes.length > 0 ? (
						<div className={DETAIL_STYLES.relatedList}>
							{catchableFishes.map((fish) => (
								<FishListItem
									key={fish.id}
									fish={fish}
									variant="inline"
									isChecked={checkedSet.has(fish.id)}
									onToggleCheck={onToggleCheck}
									onClickDetail={onClickFishDetail}
								/>
							))}
						</div>
					) : (
						<p className={DETAIL_STYLES.emptyText}>このエリアで釣れる魚の情報はありません</p>
					)}
				</div>
			</div>
		</div>
	);
};