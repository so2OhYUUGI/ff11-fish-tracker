/**
 * ============================================================================
 * [FilePath] src/components/area/AreaDetailView.tsx
 * [Role] 選択されたエリアの詳細情報および釣れる魚一覧の表示コンポーネント
 * 
 * [概要]
 * - ヘッダー（エリア名）を固定し、コンテンツ部分全体を独立スクロール表示
 * - `regionList` から `area.regionId` に一致するリージョン情報を参照して描画
 * - 中間データ `FISH_LOCATIONS` を参照し、当該エリア（`area.id`）で釣れる魚を抽出・一覧表示
 * - 生息魚一覧をバッジ形式から属性情報付きのリスト形式へ変更し、視認性と比較の容易性を向上
 * ============================================================================
 */

import React from 'react';
import { ArrowLeft, MapPin, X, Fish } from 'lucide-react';
import type { ZoneMaster, FishMaster, RegionMaster, SizeType, WaterType } from '@/types/fish';
import { FISH_LOCATIONS } from '@/data';
import { DETAIL_STYLES } from '@/styles/detailStyles';

type Props = {
	area: ZoneMaster;
	allFishes: FishMaster[];
	regionList: RegionMaster[];
	onClose: () => void;
	onBack?: () => void;
	canGoBack?: boolean;
	onClickFishDetail?: (fish: FishMaster) => void;
};

// サイズ表記のラベルとスタイルマッピング
const SIZE_CONFIG: Record<SizeType, { label: string; style: string }> = {
	small: { label: '小型', style: 'bg-emerald-950/60 text-emerald-300 border-emerald-800/50' },
	large: { label: '大型', style: 'bg-amber-950/60 text-amber-300 border-amber-800/50' },
	unknown: { label: '不明', style: 'bg-slate-800/60 text-slate-400 border-slate-700/50' },
};

// 水質表記のラベルとスタイルマッピング
const WATER_CONFIG: Record<WaterType, { label: string; style: string }> = {
	freshwater: { label: '淡水', style: 'bg-teal-950/60 text-teal-300 border-teal-800/50' },
	saltwater: { label: '海水', style: 'bg-blue-950/60 text-blue-300 border-blue-800/50' },
	gedou: { label: '外道', style: 'bg-purple-950/60 text-purple-300 border-purple-800/50' },
	unknown: { label: '不明', style: 'bg-slate-800/60 text-slate-400 border-slate-700/50' },
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
		<div className="flex flex-col h-full min-h-0 overflow-hidden">
			{/* 1. 固定ヘッダー領域（幅縮小時・縦表示時の潰れ・押し出しを防止） */}
			<div className="flex-shrink-0 z-10 bg-slate-900 shadow-md border-b border-slate-800 p-3 flex items-center justify-between gap-2 min-w-0">
				{/* 左側：戻るボタン ＋ タイトル */}
				<div className="flex items-center gap-2 min-w-0 flex-1">
					{canGoBack && onBack && (
						<button
							type="button"
							onClick={onBack}
							className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded border border-slate-700 shrink-0 transition-colors"
							title="前の画面へ戻る"
						>
							<ArrowLeft className="w-4 h-4 shrink-0" />
							<span>戻る</span>
						</button>
					)}
					<div className="flex items-center gap-2 min-w-0 flex-1">
						<MapPin className="w-5 h-5 text-cyan-400 shrink-0" />
						<div className="min-w-0 flex-1">
							<h2 className="text-base font-bold text-slate-100 truncate leading-tight">
								{area.ja}
							</h2>
							<p className="text-xs text-slate-400 font-mono truncate">
								{area.en}
							</p>
						</div>
					</div>
				</div>

				{/* 右側：閉じるボタン */}
				<div className="flex items-center shrink-0">
					<button
						type="button"
						onClick={onClose}
						title="詳細を閉じる"
						className="p-1.5 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition-colors shrink-0"
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
					<h3 className={`${DETAIL_STYLES.sectionTitle} mb-3 flex items-center gap-2`}>
						<Fish className="w-4 h-4 text-cyan-400" />
						<span>生息する魚 ({catchableFishes.length} 種)</span>
					</h3>

					{catchableFishes.length > 0 ? (
						<div className="space-y-2">
							{catchableFishes.map((fish) => {
								const sizeInfo = SIZE_CONFIG[fish.sizeType] ?? SIZE_CONFIG.unknown;
								const waterInfo = WATER_CONFIG[fish.waterType] ?? WATER_CONFIG.unknown;

								return (
									<div
										key={fish.id}
										onClick={() => onClickFishDetail?.(fish)}
										className={`p-3 rounded-lg bg-slate-800/60 border border-slate-700/50 flex flex-wrap items-center justify-between gap-2 ${onClickFishDetail ? 'cursor-pointer hover:bg-slate-800 transition-colors' : ''
											}`}
									>
										{/* 左側：魚名（日本語・英語） */}
										<div className="flex flex-col min-w-[140px]">
											<span className="text-sm font-bold text-slate-200">
												{fish.ja}
											</span>
											<span className="text-xs text-slate-400 font-mono">
												{fish.en}
											</span>
										</div>

										{/* 右側：属性・上限スキルバッジ群 */}
										<div className="flex items-center gap-1.5 flex-wrap shrink-0">
											<span className="px-2 py-0.5 rounded text-xs font-mono bg-slate-900/80 text-cyan-300 border border-slate-700">
												上限: {fish.maxSkill}
											</span>
											<span className={`px-1.5 py-0.5 rounded text-xs border ${sizeInfo.style}`}>
												{sizeInfo.label}
											</span>
											<span className={`px-1.5 py-0.5 rounded text-xs border ${waterInfo.style}`}>
												{waterInfo.label}
											</span>
											{fish.harakiri && (
												<span className="px-1.5 py-0.5 rounded text-xs bg-red-950/60 text-red-300 border border-red-800/50">
													ハラキリ
												</span>
											)}
										</div>
									</div>
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