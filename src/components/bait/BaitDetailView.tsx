/**
 * ============================================================================
 * [FilePath] src/components/bait/BaitDetailView.tsx
 * [Role] 餌の詳細情報表示コンポーネント
 * 
 * [概要]
 * - ヘッダー（餌名）を固定し、コンテンツ部分全体を独立スクロール表示
 * - `@/data` の中間マスタを参照し、その餌で釣れる魚の一覧を抽出・描画
 * - 全スタイルの参照を `DETAIL_STYLES` および `COMMON_TOKENS` へ完全集約
 * ============================================================================
 */

import React from 'react';
import { ArrowLeft, Utensils, Fish, X } from 'lucide-react';
import type { BaitMaster, FishMaster, SizeType, WaterType } from '@/types/fish';
import { FISH_BAIT_RELATIONS } from '@/data';
import { DETAIL_STYLES } from '@/styles/components/detailStyles';
import { COMMON_TOKENS } from '@/styles/tokens/commonTokens';

type BaitDetailViewProps = {
	bait: BaitMaster | null;
	allFishes: FishMaster[];
	onClose: () => void;
	onBack?: () => void;
	canGoBack?: boolean;
	onClickFishDetail?: (fish: FishMaster) => void;
};

// サイズ表記ラベル定義
const SIZE_LABEL: Record<SizeType, string> = {
	small: '小型',
	large: '大型',
	unknown: '不明',
};

// 水質表記ラベル定義
const WATER_LABEL: Record<WaterType, string> = {
	freshwater: '淡水',
	saltwater: '海水',
	gedou: '外道',
	unknown: '不明',
};

export const BaitDetailView: React.FC<BaitDetailViewProps> = ({
	bait,
	allFishes,
	onClose,
	onBack,
	canGoBack = false,
	onClickFishDetail,
}) => {
	if (!bait) {
		return (
			<div className={DETAIL_STYLES.emptyDetailContainer}>
				<Utensils className={DETAIL_STYLES.emptyIcon} />
				<p className={DETAIL_STYLES.emptyText}>リストから餌を選択すると詳細が表示されます</p>
			</div>
		);
	}

	// FISH_BAIT_RELATIONS から対象の餌(bait.id)で釣れる魚のIDリストを抽出
	const targetFishIds = FISH_BAIT_RELATIONS
		.filter((rel) => rel.baitId === bait.id)
		.map((rel) => rel.fishId);

	// 対象となる魚のデータオブジェクトリストを取得
	const targetFishes = allFishes.filter((fish) => targetFishIds.includes(fish.id));

	return (
		<div className={DETAIL_STYLES.panelBase}>
			{/* 1. 固定ヘッダー領域 */}
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
						<Utensils className={`w-5 h-5 shrink-0 ${COMMON_TOKENS.entity.bait.text}`} />
						<div className="min-w-0 flex-1">
							<h2 className={DETAIL_STYLES.stickyHeaderTitle}>
								{bait.ja}
							</h2>
							<p className={DETAIL_STYLES.stickyHeaderSubTitle}>
								{bait.en}
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
				{/* 説明文 */}
				{bait.description && (
					<div className={DETAIL_STYLES.descriptionBox}>
						{bait.description.split('\\n').map((line, index) => (
							<React.Fragment key={index}>
								{index > 0 && <br />}
								{line}
							</React.Fragment>
						))}
					</div>
				)}

				{/* 釣れる魚一覧 */}
				<div>
					<h3 className={`${DETAIL_STYLES.sectionTitle} mb-3 flex items-center gap-2`}>
						<Fish className={`w-4 h-4 ${COMMON_TOKENS.entity.fish.text}`} />
						<span>対象の魚 ({targetFishes.length} 種)</span>
					</h3>

					{targetFishes.length > 0 ? (
						<div className={DETAIL_STYLES.relatedList}>
							{targetFishes.map((fish) => {
								const sizeStyle = DETAIL_STYLES.badgeSize[fish.sizeType] ?? DETAIL_STYLES.badgeSize.unknown;
								const waterStyle = DETAIL_STYLES.badgeWater[fish.waterType] ?? DETAIL_STYLES.badgeWater.unknown;

								return (
									<div
										key={fish.id}
										onClick={() => onClickFishDetail?.(fish)}
										className={`${DETAIL_STYLES.relatedRow} ${onClickFishDetail ? DETAIL_STYLES.relatedRowInteractive : ''
											}`}
									>
										{/* 左側：魚名（日本語・英語） */}
										<div className="flex flex-col min-w-[140px]">
											<span className={DETAIL_STYLES.relatedRowTitle}>
												{fish.ja}
											</span>
											<span className={DETAIL_STYLES.relatedRowSubTitle}>
												{fish.en}
											</span>
										</div>

										{/* 右側：属性・上限スキルバッジ群 */}
										<div className="flex items-center gap-1.5 flex-wrap shrink-0">
											<span className={DETAIL_STYLES.badgeSkill}>
												上限: {fish.maxSkill}
											</span>
											<span className={`px-1.5 py-0.5 rounded text-xs border ${sizeStyle}`}>
												{SIZE_LABEL[fish.sizeType] ?? SIZE_LABEL.unknown}
											</span>
											<span className={`px-1.5 py-0.5 rounded text-xs border ${waterStyle}`}>
												{WATER_LABEL[fish.waterType] ?? WATER_LABEL.unknown}
											</span>
										</div>
									</div>
								);
							})}
						</div>
					) : (
						<p className={DETAIL_STYLES.emptyText}>対象の魚データがありません</p>
					)}
				</div>
			</div>
		</div>
	);
};