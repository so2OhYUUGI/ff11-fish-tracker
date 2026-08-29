/**
 * ============================================================================
 * [FilePath] src/features/fishtracker/bait/BaitDetailView.tsx
 * [Role] 餌詳細情報表示コンポーネント
 * 
 * [概要]
 * - 共通ヘッダーコンポーネント（`DetailHeader`）を利用してヘッダー部分を統一
 * - ヘッダー（餌名・システム属性）を固定し、コンテンツ部分全体を独立スクロール表示
 * - 該当する餌で釣れる魚一覧（釣獲チェック状態、スキル上限、サイズ区分）を表示
 * - 魚タグ・カードクリックによる魚詳細画面（`FishDetailView`）への相互遷移サポート
 * - 説明文（`description`）の表示
 * - 全スタイルの参照を `DETAIL_STYLES` / `DETAIL_TABLE_STYLES` および `COMMON_TOKENS` へ完全移行
 * ============================================================================
 */

import React, { useMemo } from 'react';
import { Anchor, CheckSquare, Square } from 'lucide-react';
import type { BaitMaster, FishMaster } from '@/types/fishtracker';
import { FISH_BAIT_RELATIONS } from '@/data';
import { DETAIL_STYLES } from '@/styles/components/detailStyles';
import { COMMON_TOKENS } from '@/styles/tokens/commonTokens';
import { DetailHeader } from '@/features/fishtracker/common/DetailHeader';
import { SkillBadge, SizeBadge } from '@/features/fishtracker/common/FishBadges';

type BaitDetailViewProps = {
	bait: BaitMaster;
	allFishes: FishMaster[];
	checkedFishIds: number[];
	onToggleCheck: (fishId: number) => void;
	onClose: () => void;
	onBack?: () => void;
	canGoBack?: boolean;
	onClickFishDetail?: (fish: FishMaster) => void;
};

export const BaitDetailView: React.FC<BaitDetailViewProps> = ({
	bait,
	allFishes,
	checkedFishIds,
	onToggleCheck,
	onClose,
	onBack,
	canGoBack = false,
	onClickFishDetail,
}) => {
	const checkedSet = useMemo(() => new Set(checkedFishIds), [checkedFishIds]);

	// 1. この餌で釣れる魚の抽出（メモ化）
	const targetFishes = useMemo(() => {
		const targetFishIds = new Set(
			FISH_BAIT_RELATIONS
				.filter((rel) => rel.baitId === bait.id)
				.map((rel) => rel.fishId)
		);
		return allFishes.filter((fish) => targetFishIds.has(fish.id));
	}, [bait.id, allFishes]);

	// 2. 釣獲達成度の算出
	const checkedCount = useMemo(() => {
		return targetFishes.filter((fish) => checkedSet.has(fish.id)).length;
	}, [targetFishes, checkedSet]);

	// 3. 改行コード（\n および \\n）で分割した説明文行リスト
	const descriptionLines = useMemo(() => {
		if (!bait.description) return [];
		return bait.description.split(/\r?\n|\\n/);
	}, [bait.description]);

	return (
		<div className={DETAIL_STYLES.panelBase}>
			{/* 1. 共通固定ヘッダー */}
			<DetailHeader
				titleJa={bait.ja}
				titleEn={bait.en}
				categoryName="餌"
				icon={<Anchor className={`w-5 h-5 shrink-0 ${COMMON_TOKENS.entity.bait.text}`} />}
				canGoBack={canGoBack}
				onBack={onBack}
				onClose={onClose}
			/>

			{/* 2. 一括スクロール可能なコンテンツ領域 */}
			<div className={DETAIL_STYLES.scrollContent}>
				{/* 基本情報・釣獲進捗ステータス */}
				<div>
					<h3 className={DETAIL_STYLES.sectionTitle}>基本情報</h3>
					<div className="flex items-center gap-3 text-sm text-slate-300">
						<span>対象魚数: <strong className="text-white">{targetFishes.length}</strong> 種類</span>
						<span>・</span>
						<span>釣獲済み: <strong className="text-emerald-400">{checkedCount}</strong> / {targetFishes.length}</span>
					</div>
				</div>

				{/* 釣れる魚一覧 */}
				<div>
					<h3 className={DETAIL_STYLES.sectionTitle}>
						釣れる魚 ({targetFishes.length} 種類)
					</h3>
					{targetFishes.length > 0 ? (
						<div className="space-y-2">
							{targetFishes.map((fish) => {
								const isChecked = checkedSet.has(fish.id);
								return (
									<div
										key={fish.id}
										className="flex items-center justify-between p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/50 hover:border-slate-600 transition-colors"
									>
										<div className="flex items-center gap-2.5 min-w-0">
											<button
												type="button"
												onClick={() => onToggleCheck(fish.id)}
												className="p-1 text-slate-400 hover:text-white transition-colors shrink-0"
												aria-label={`${fish.ja}のチェック状態切り替え`}
											>
												{isChecked ? (
													<CheckSquare className="w-5 h-5 text-emerald-400" />
												) : (
													<Square className="w-5 h-5 text-slate-500" />
												)}
											</button>
											<button
												type="button"
												onClick={() => onClickFishDetail?.(fish)}
												className="text-left font-medium text-slate-200 hover:text-cyan-300 transition-colors truncate"
											>
												{fish.ja}
											</button>
										</div>

										<div className="flex items-center gap-1.5 shrink-0 ml-2">
											<SkillBadge maxSkill={fish.maxSkill} />
											<SizeBadge sizeType={fish.sizeType} />
										</div>
									</div>
								);
							})}
						</div>
					) : (
						<p className={DETAIL_STYLES.emptyText}>この餌で釣れる魚のデータがありません</p>
					)}
				</div>

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
			</div>
		</div>
	);
};