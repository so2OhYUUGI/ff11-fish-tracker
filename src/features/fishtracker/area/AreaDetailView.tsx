/**
 * ============================================================================
 * [FilePath] src/features/fishtracker/area/AreaDetailView.tsx
 * [Role] 選択されたエリアの詳細情報および釣れる魚一覧の表示コンポーネント
 * 
 * [概要]
 * - ヘッダー（エリア名）を固定し、コンテンツ部分全体を独立スクロール表示
 * - `regionList` から `area.regionId` に一致するリージョン情報を参照して描画
 * - 中間データ `FISH_LOCATIONS` を参照し、当該エリア（`area.id`）で釣れる魚を抽出・一覧表示
 * - 生息魚一覧をバッジ形式から属性情報付きのリスト形式へ変更し、視認性と比較の容易性を向上
 * - 全スタイルの参照を `DETAIL_STYLES` および `FISH_STYLES` へ完全移行
 * ============================================================================
 */

import React from 'react';
import { ArrowLeft, MapPin, X, Fish } from 'lucide-react';
import type { ZoneMaster, FishMaster, RegionMaster } from '@/types/fish';
import { FISH_LOCATIONS } from '@/data';
import { DETAIL_STYLES } from '@/styles/components/detailStyles';
import { FISH_STYLES, BADGE_BASE_STYLE } from '@/styles/features/FishTrackerStyle';
import { COMMON_TOKENS } from '@/styles/tokens/commonTokens';
import {
	SizeBadge,
	WaterBadge,
} from '@/features/fishtracker/common/FishBadges';

type Props = {
	area: ZoneMaster;
	allFishes: FishMaster[];
	regionList: RegionMaster[];
	onClose: () => void;
	onBack?: () => void;
	canGoBack?: boolean;
	onClickFishDetail?: (fish: FishMaster) => void;
};

export const AreaDetailView: React.FC<Props> = ({
	area,
	allFishes,
	regionList,
	onClose,
	onBack,
	canGoBack = false,
	onClickFishDetail,
}) => {
	// FISH_LOCATIONS から当該エリア (area.id) に該当する fishId の配列を取得
	const targetFishIds = FISH_LOCATIONS
		.filter((loc) => loc.zoneId === area.id)
		.map((loc) => loc.fishId);

	// fishId に一致する魚情報を取得
	const catchableFishes = allFishes.filter((fish) => targetFishIds.includes(fish.id));

	// area.regionId に一致するリージョン情報を検索（型変換を考慮）
	const belongsRegion = regionList.find(
		(r) => area.regionId !== undefined && String(r.id) === String(area.regionId)
	);

	return (
		<div className={DETAIL_STYLES.panelBase}>
			{/* 1. 固定ヘッダー領域（幅縮小時・縦表示時の潰れ・押し出しを防止） */}
			<div className={DETAIL_STYLES.stickyHeader}>
				{/* 左側：戻るボタン ＋ タイトル */}
				<div className={DETAIL_STYLES.stickyHeaderLeft}>
					{canGoBack && onBack && (
						<button
							type="button"
							onClick={onBack}
							className={DETAIL_STYLES.headerBackButton}
							title="前の画面へ戻る"
						>
							<ArrowLeft className="w-4 h-4 shrink-0" />
							<span>戻る</span>
						</button>
					)}
					<div className={DETAIL_STYLES.stickyHeaderTitleGroup}>
						<MapPin className={`w-5 h-5 shrink-0 ${COMMON_TOKENS.entity.area.text}`} />
						<div className="min-w-0 flex-1">
							<h2 className={DETAIL_STYLES.stickyHeaderTitle}>
								{area.ja}
							</h2>
							<p className={DETAIL_STYLES.stickyHeaderSubTitle}>
								{area.en}
							</p>
						</div>
					</div>
				</div>

				{/* 右側：閉じるボタン */}
				<div className={DETAIL_STYLES.stickyHeaderRight}>
					<button
						type="button"
						onClick={onClose}
						title="詳細を閉じる"
						className={DETAIL_STYLES.iconCloseButton}
					>
						<X className="w-5 h-5" />
					</button>
				</div>
			</div>

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
				{area.description && (
					<div className={DETAIL_STYLES.descriptionBox}>
						{area.description.split('\\n').map((line: string, index: number) => (
							<React.Fragment key={index}>
								{index > 0 && <br />}
								{line}
							</React.Fragment>
						))}
					</div>
				)}

				{/* 釣れる魚一覧（リスト形式） */}
				<div>
					<h3 className={DETAIL_STYLES.sectionTitle}>
						<Fish className={`w-4 h-4 ${COMMON_TOKENS.entity.fish.text}`} />
						<span>生息する魚 ({catchableFishes.length} 種)</span>
					</h3>

					{catchableFishes.length > 0 ? (
						<div className={DETAIL_STYLES.relatedList}>
							{catchableFishes.map((fish) => {
								const RowComponent = onClickFishDetail ? 'button' : 'div';
								return (
									<RowComponent
										key={fish.id}
										type={onClickFishDetail ? 'button' : undefined}
										onClick={() => onClickFishDetail?.(fish)}
										className={`${DETAIL_STYLES.relatedRow} ${onClickFishDetail ? DETAIL_STYLES.relatedRowInteractive : ''
											}`}
									>
										{/* 左側：魚名（日本語・英語） */}
										<div className={DETAIL_STYLES.relatedRowTitleGroup}>
											<span className={DETAIL_STYLES.relatedRowTitle}>
												{fish.ja}
											</span>
											<span className={DETAIL_STYLES.relatedRowSubTitle}>
												{fish.en}
											</span>
										</div>

										{/* 右側：属性・上限スキルバッジ群 */}
										<div className={DETAIL_STYLES.relatedRowBadgeGroup}>
											<span className={`${BADGE_BASE_STYLE} ${FISH_STYLES.badgeSkill}`}>
												上限: {fish.maxSkill}
											</span>
											<SizeBadge sizeType={fish.sizeType} useShortLabel />
											<WaterBadge waterType={fish.waterType} />
										</div>
									</RowComponent>
								);
							})}
						</div>
					) : (
						<p className={DETAIL_STYLES.emptyText}>このエリアで釣れる魚の情報はありません</p>
					)}
				</div>
			</div>
		</div>
	);
};