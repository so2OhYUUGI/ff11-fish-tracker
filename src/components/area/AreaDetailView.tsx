/**
 * ============================================================================
 * [FilePath] src/components/area/AreaDetailView.tsx
 * [Role] 選択されたエリアの詳細情報および釣れる魚一覧の表示コンポーネント
 * 
 * [概要]
 * - ヘッダー（エリア名）を固定し、コンテンツ部分全体を独立スクロール表示
 * - `regionList` から `area.regionId` に一致するリージョン情報を参照して描画
 * - 中間データ `FISH_LOCATIONS` を参照し、当該エリア（`area.id`）で釣れる魚を抽出・一覧表示
 * ============================================================================
 */

import React from 'react';
import { ArrowLeft, MapPin, X } from 'lucide-react';
import type { ZoneMaster, FishMaster, RegionMaster } from '@/types/fish';
import { FISH_LOCATIONS } from '@/data';
import { DETAIL_STYLES } from '@/styles/detailStyles';

type Props = {
	area: ZoneMaster;
	allFishes: FishMaster[];
	regionList: RegionMaster[];
	onClose: () => void;
};

export const AreaDetailView: React.FC<Props> = ({
	area,
	allFishes,
	regionList,
	onClose,
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
		<div className="flex flex-col h-full min-h-0 overflow-hidden">
			{/* 1. 固定ヘッダー領域 */}
			<div className={`${DETAIL_STYLES.header} flex-shrink-0 z-10 bg-slate-900 shadow-md border-b border-slate-800`}>
				<div className={DETAIL_STYLES.headerLeft}>
					<button
						type="button"
						onClick={onClose}
						className={DETAIL_STYLES.backButton}
					>
						<ArrowLeft className="w-4 h-4" />
						<span>一覧へ戻る</span>
					</button>
					<div className="flex items-center gap-2">
						<MapPin className="w-5 h-5 text-cyan-400 shrink-0" />
						<div>
							<h2 className={DETAIL_STYLES.titleJa}>{area.ja}</h2>
							<p className={DETAIL_STYLES.titleEn}>{area.en}</p>
						</div>
					</div>
				</div>

				<div className={DETAIL_STYLES.headerRight}>
					<button
						type="button"
						onClick={onClose}
						title="詳細を閉じる"
						className={DETAIL_STYLES.closeButton}
					>
						<X className="w-5 h-5" />
					</button>
				</div>
			</div>

			{/* 2. 一括スクロール可能なコンテンツ領域 */}
			<div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-6">
				{/* 所属リージョン表示 */}
				{belongsRegion && (
					<div className="flex items-center gap-2 text-xs text-slate-300 bg-slate-800/40 p-2.5 rounded-lg border border-slate-700/50">
						<span className="text-slate-400">リージョン:</span>
						<span className="font-medium text-slate-200">
							{belongsRegion.ja}
							<span className="text-slate-500 font-mono ml-1">({belongsRegion.en})</span>
						</span>
					</div>
				)}

				{/* 説明文 */}
				{area.description && (
					<div className={DETAIL_STYLES.descriptionBox}>
						{area.description.split('\\n').map((line, index) => (
							<React.Fragment key={index}>
								{index > 0 && <br />}
								{line}
							</React.Fragment>
						))}
					</div>
				)}

				{/* 釣れる魚一覧 */}
				<div>
					<h3 className={DETAIL_STYLES.sectionTitle}>
						生息する魚 ({catchableFishes.length} 種)
					</h3>
					{catchableFishes.length > 0 ? (
						<div className={DETAIL_STYLES.tagList}>
							{catchableFishes.map((fish) => (
								<span key={fish.id} className={DETAIL_STYLES.tagItem}>
									{fish.ja}
									<span className="text-slate-500 text-[10px] ml-1">
										({fish.en})
									</span>
									{fish.maxSkill > 0 && (
										<span className="text-cyan-400/80 text-[10px] ml-1.5 font-mono">
											[上限:{fish.maxSkill}]
										</span>
									)}
								</span>
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