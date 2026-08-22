/**
 * ============================================================================
 * [FilePath] src/components/bait/BaitDetailView.tsx
 * [Role] 餌の詳細情報表示コンポーネント
 * 
 * [概要]
 * - ヘッダー（餌名）を固定し、コンテンツ部分全体を独立スクロール表示
 * - `@/data` の中間マスタを参照し、その餌で釣れる魚の一覧を抽出・描画
 * - 対象の魚一覧を属性・スキル上限付きのリスト形式で表示し、視認性を向上
 * ============================================================================
 */

import React from 'react';
import { ArrowLeft, Utensils, Fish, X } from 'lucide-react';
import type { BaitMaster, FishMaster, SizeType, WaterType } from '@/types/fish';
import { FISH_BAIT_RELATIONS } from '@/data';
import { DETAIL_STYLES } from '@/styles/detailStyles';

type BaitDetailViewProps = {
	bait: BaitMaster | null;
	allFishes: FishMaster[];
	onClose: () => void;
	onBack?: () => void;
	canGoBack?: boolean;
	onClickFishDetail?: (fish: FishMaster) => void;
};

// サイズ表記のスタイル
const SIZE_CONFIG: Record<SizeType, { label: string; style: string }> = {
	small: { label: '小型', style: 'bg-emerald-950/60 text-emerald-300 border-emerald-800/50' },
	large: { label: '大型', style: 'bg-amber-950/60 text-amber-300 border-amber-800/50' },
	unknown: { label: '不明', style: 'bg-slate-800/60 text-slate-400 border-slate-700/50' },
};

// 水質表記のスタイル
const WATER_CONFIG: Record<WaterType, { label: string; style: string }> = {
	freshwater: { label: '淡水', style: 'bg-teal-950/60 text-teal-300 border-teal-800/50' },
	saltwater: { label: '海水', style: 'bg-blue-950/60 text-blue-300 border-blue-800/50' },
	gedou: { label: '外道', style: 'bg-purple-950/60 text-purple-300 border-purple-800/50' },
	unknown: { label: '不明', style: 'bg-slate-800/60 text-slate-400 border-slate-700/50' },
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
			<div className="h-full min-h-[300px] flex flex-col items-center justify-center p-8 bg-slate-800/50 border border-slate-700/60 rounded-xl text-slate-400">
				<Utensils className="w-12 h-12 mb-3 text-slate-600" />
				<p className="text-sm font-medium">リストから餌を選択すると詳細が表示されます</p>
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
						<Utensils className="w-5 h-5 text-amber-400 shrink-0" />
						<div className="min-w-0 flex-1">
							<h2 className="text-base font-bold text-slate-100 truncate leading-tight">
								{bait.ja}
							</h2>
							<p className="text-xs text-slate-400 font-mono truncate">
								{bait.en}
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

				{/* 釣れる魚一覧（リスト形式へ変更） */}
				<div>
					<h3 className={`${DETAIL_STYLES.sectionTitle} mb-3 flex items-center gap-2`}>
						<Fish className="w-4 h-4 text-cyan-400" />
						<span>対象の魚 ({targetFishes.length} 種)</span>
					</h3>

					{targetFishes.length > 0 ? (
						<div className="space-y-2">
							{targetFishes.map((fish) => {
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