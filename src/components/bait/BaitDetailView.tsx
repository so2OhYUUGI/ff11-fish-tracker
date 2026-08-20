/**
 * ============================================================================
 * [FilePath] src/components/bait/BaitDetailView.tsx
 * [Role] 餌の詳細情報表示コンポーネント
 * 
 * [概要]
 * - ヘッダー（餌名）を固定し、コンテンツ部分全体を独立スクロール表示
 * - `@/data` の中間マスタを参照し、その餌で釣れる魚の一覧を抽出・描画
 * ============================================================================
 */

import React from 'react';
import { ArrowLeft, Fish, X } from 'lucide-react';
import type { BaitMaster, FishMaster } from '@/types/fish';
import { FISH_BAIT_RELATIONS } from '@/data';
import { DETAIL_STYLES } from '@/styles/detailStyles';

type BaitDetailViewProps = {
	bait: BaitMaster | null;
	allFishes: FishMaster[];
	onClose: () => void;
};

export const BaitDetailView: React.FC<BaitDetailViewProps> = ({
	bait,
	allFishes,
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

	// FISH_BAIT_RELATIONS から対象の餌(bait.id)で釣れる魚のIDリストを直接抽出
	const targetFishIds = FISH_BAIT_RELATIONS
		.filter((rel) => rel.baitId === bait.id)
		.map((rel) => rel.fishId);

	// 対象となる魚のデータオブジェクトリストを取得
	const targetFishes = allFishes.filter((fish) => targetFishIds.includes(fish.id));

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
					<div>
						<h2 className={DETAIL_STYLES.titleJa}>{bait.ja}</h2>
						<p className={DETAIL_STYLES.titleEn}>{bait.en}</p>
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
					<h3 className={DETAIL_STYLES.sectionTitle}>
						対象の魚 ({targetFishes.length} 種)
					</h3>
					{targetFishes.length > 0 ? (
						<div className={DETAIL_STYLES.tagList}>
							{targetFishes.map((fish) => (
								<span key={fish.id} className={DETAIL_STYLES.tagItem}>
									{fish.ja}
									<span className="text-slate-500 text-[10px] ml-1">
										({fish.en})
									</span>
								</span>
							))}
						</div>
					) : (
						<p className={DETAIL_STYLES.emptyText}>対象の魚データがありません</p>
					)}
				</div>
			</div>
		</div>
	);
};