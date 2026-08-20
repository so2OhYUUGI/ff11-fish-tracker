/**
 * ============================================================================
 * [FilePath] src/components/area/AreaDetailView.tsx
 * [Role] 選択されたエリアの詳細情報および釣れる魚一覧の表示コンポーネント
 * 
 * [概要]
 * - 選択中エリア（`ZoneMaster`）の基本情報（和名、英名、所属リージョン、説明文等）を表示
 * - `regionList` から `area.regionId` に一致するリージョン情報を参照して描画
 * - 中間データ `FISH_LOCATIONS` を参照し、当該エリア（`area.id`）で釣れる魚を抽出・一覧表示
 * - モバイル用「一覧へ戻る」ボタンおよびPC用閉じる（X）ボタンによる選択解除操作
 * 
 * [編集・改修時の注意事項]
 * 1. 【魚とエリアの関連付け仕様】
 *    `FishDetailView` と同様に `FISH_LOCATIONS` を参照し、`loc.zoneId === area.id`
 *    の条件で `fishId` 配列を抽出して `allFishes` と照合します。
 * ============================================================================
 */

import React from 'react';
import { ArrowLeft, X, MapPin, Fish, Globe } from 'lucide-react';
import type { ZoneMaster, FishMaster, RegionMaster } from '@/types/fish';
import { FISH_LOCATIONS } from '@/data';
import { DETAIL_STYLES } from '@/styles/detailStyles';

type Props = {
	area: ZoneMaster;
	allFishes: FishMaster[];
	regionList: RegionMaster[];
	onClose: () => void;
};

export const AreaDetailView: React.FC<Props> = ({ area, allFishes, regionList, onClose }) => {
	// FISH_LOCATIONS から当該エリア (area.id) に該当する fishId の配列を取得
	const targetFishIds = FISH_LOCATIONS
		.filter((loc) => loc.zoneId === area.id)
		.map((loc) => loc.fishId);

	// fishId に一致する魚情報を取得
	const catchableFishes = allFishes.filter((fish) => targetFishIds.includes(fish.id));

	// area.regionId に一致するリージョン情報を検索
	const belongsRegion = regionList.find((r) => r.id === area.regionId);

	return (
		<div className={DETAIL_STYLES.container}>
			{/* ヘッダー領域 */}
			<div className="flex items-center justify-between border-b border-slate-700 pb-4">
				<div className="flex items-center gap-3">
					{/* モバイル用：一覧へ戻るボタン */}
					{onClose && (
						<button
							type="button"
							onClick={onClose}
							className="lg:hidden flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 bg-slate-700/60 px-3 py-1.5 rounded-lg border border-slate-600 transition-colors"
						>
							<ArrowLeft className="w-4 h-4" />
							<span>一覧へ戻る</span>
						</button>
					)}
					<div className="flex items-center gap-2">
						<MapPin className="w-5 h-5 text-cyan-400 shrink-0" />
						<div>
							<h2 className={DETAIL_STYLES.titleJa}>{area.ja}</h2>
							<p className={DETAIL_STYLES.titleEn}>{area.en}</p>
						</div>
					</div>
				</div>

				{/* 横長（PC）表示時用：詳細閉じる（X）ボタン */}
				{onClose && (
					<button
						type="button"
						onClick={onClose}
						title="詳細を閉じる"
						className="hidden lg:flex items-center justify-center p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-700/60 rounded-lg transition-colors"
					>
						<X className="w-5 h-5" />
					</button>
				)}
			</div>

			{/* 所属リージョン表示 */}
			{belongsRegion && (
				<div className="flex items-center gap-1.5 mt-2 text-xs text-slate-300">
					<Globe className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
					<span className="text-slate-400">リージョン:</span>
					<span className="font-medium text-slate-200">
						{belongsRegion.ja} <span className="text-slate-400 font-mono">({belongsRegion.en})</span>
					</span>
				</div>
			)}

			{/* 説明文 */}
			{area.description && (
				<div className={DETAIL_STYLES.descriptionBox}>
					{area.description.split('\\n').map((line, index) => (
						<p key={index}>{line}</p>
					))}
				</div>
			)}

			{/* 釣れる魚一覧領域 */}
			<div className="mt-4">
				<div className="flex items-center gap-2 mb-2 text-sm font-bold text-slate-200">
					<Fish className="w-4 h-4 text-cyan-400" />
					<span>生息する魚 ({catchableFishes.length}種)</span>
				</div>

				{catchableFishes.length > 0 ? (
					<div className="flex flex-col gap-1.5 max-h-[300px] overflow-y-auto pr-1">
						{catchableFishes.map((fish) => (
							<div
								key={fish.id}
								className="flex items-center justify-between p-2 rounded bg-slate-900/60 border border-slate-700/50 text-xs"
							>
								<div className="flex items-center gap-2">
									<span className="font-medium text-white">{fish.ja}</span>
									<span className="text-slate-400 text-[10px]">({fish.en})</span>
								</div>
								<span className="text-slate-400">上限: {fish.maxSkill}</span>
							</div>
						))}
					</div>
				) : (
					<p className="text-xs text-slate-400 p-3 bg-slate-900/40 rounded border border-slate-800">
						このエリアで釣れる魚の情報はありません。
					</p>
				)}
			</div>
		</div>
	);
};