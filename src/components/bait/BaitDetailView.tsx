/**
 * ============================================================================
 * [FilePath] src/components/bait/BaitDetailView.tsx
 * [Role] 餌の詳細情報表示コンポーネント
 * 
 * [概要]
 * - 選択された餌の基本情報・説明文の表示
 * - 中間データ（`FishBaitRelation`）に基づいた、その餌で釣れる対象魚一覧の抽出と表示
 * ============================================================================
 */

import React from 'react';
import { ArrowLeft, Fish, X } from 'lucide-react';
import type { BaitMaster, FishMaster, FishBaitRelation } from '@/types/fish';

type BaitDetailViewProps = {
	bait: BaitMaster | null;
	allFishes: FishMaster[];
	fishBaitRelations?: FishBaitRelation[];
	onClose?: () => void;
};

export const BaitDetailView: React.FC<BaitDetailViewProps> = ({
	bait,
	allFishes,
	fishBaitRelations = [],
	onClose,
}) => {
	if (!bait) {
		return (
			<div className="h-full min-h-[300px] flex flex-col items-center justify-center p-8 bg-slate-800/50 border border-slate-700/60 rounded-xl text-slate-400">
				<Fish className="w-12 h-12 mb-3 text-slate-600" />
				<p className="text-sm font-medium">リストから餌を選択すると詳細が表示されます</p>
			</div>
		);
	}

	// 中間データ (FishBaitRelation) を参照して該当する餌で釣れる魚のIDセットを作成
	const targetFishIds = new Set(
		fishBaitRelations
			.filter((rel) => rel.baitId === bait.id)
			.map((rel) => rel.fishId)
	);

	// 該当する魚の一覧を取得
	const targetFishes = allFishes.filter((fish) => targetFishIds.has(fish.id));

	return (
		<div className="bg-slate-800 border border-slate-700 rounded-xl p-5 md:p-6 flex flex-col gap-6 h-full relative">
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
					<div>
						<h2 className="text-xl font-bold text-slate-100">{bait.ja}</h2>
						<p className="text-xs text-slate-400 font-mono">{bait.en}</p>
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

			{/* 説明文 */}
			{bait.description && (
				<div className="bg-slate-900/60 p-3.5 rounded-lg border border-slate-700/50 text-sm text-slate-300 leading-relaxed">
					{bait.description.split('\\n').map((line, index) => (
						<span key={index} className="block">
							{line}
						</span>
					))}
				</div>
			)}

			{/* 釣れる魚の一覧 */}
			<div className="flex-1">
				<h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
					対象の魚 ({targetFishes.length} 種)
				</h3>
				{targetFishes.length > 0 ? (
					<div className="flex flex-wrap gap-2">
						{targetFishes.map((fish) => (
							<span
								key={fish.id}
								className="bg-slate-900/80 border border-slate-700 text-slate-200 text-xs px-2.5 py-1 rounded-md"
							>
								{fish.ja}
							</span>
						))}
					</div>
				) : (
					<p className="text-xs text-slate-500">対象の魚データがありません</p>
				)}
			</div>
		</div>
	);
};