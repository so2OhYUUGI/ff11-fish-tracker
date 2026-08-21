/**
 * ============================================================================
 * [FilePath] src/components/fish/FishListItem.tsx
 * [Role] 魚データ（個別）のリスト表示コンポーネント
 * 
 * [概要]
 * - 魚の基本情報（和名、英名）のリスト形式（高密度レイアウト）表示
 * - 魚名称の日本語・英語表記を縦並び（カッコ外し）へ統一
 * - サイズ（大型/小型/不明）および水質（淡水/海水/外道/不明）のバッジ表示
 * - 獲得/達成状態（チェック状態）のチェックボックス描画およびトグル操作
 * - チェック済・選択中（アクティブ）・デフォルト状態に応じた行全体のスタイリング切り替え
 * 
 * [編集・改修時の注意事項]
 * 1. 【スタイルの参照】
 *    Tailwind CSS クラスは `@/styles/listStyles` の `LIST_STYLES` を定数参照しています。
 * ============================================================================
 */

import React from 'react';
import type { FishMaster, ZoneMaster, SizeType, WaterType } from '@/types/fish';
import { LIST_STYLES } from '@/styles/listStyles';
import { Check } from 'lucide-react';

type Props = {
	fish: FishMaster;
	zones?: ZoneMaster[];
	isChecked: boolean;
	isSelected?: boolean;
	onToggleCheck: (fishId: number) => void;
	onClickDetail: (fish: FishMaster) => void;
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

export const FishListItem: React.FC<Props> = ({
	fish,
	isChecked,
	isSelected,
	onToggleCheck,
	onClickDetail,
}) => {
	// スタイルの判定を分離・整理
	const containerStyle = isSelected
		? `${LIST_STYLES.selected} ${isChecked ? 'opacity-90' : ''}`
		: isChecked
			? LIST_STYLES.checked
			: LIST_STYLES.default;

	const sizeInfo = SIZE_CONFIG[fish.sizeType] ?? SIZE_CONFIG.unknown;
	const waterInfo = WATER_CONFIG[fish.waterType] ?? WATER_CONFIG.unknown;

	return (
		<div
			onClick={() => onClickDetail(fish)}
			className={`${LIST_STYLES.base} ${containerStyle} flex items-center justify-between gap-3 cursor-pointer py-2 px-3`}
		>
			<div className="flex items-center gap-3 min-w-0 flex-1">
				{/* チェックボックス領域 */}
				<button
					type="button"
					onClick={(e) => {
						e.stopPropagation();
						onToggleCheck(fish.id);
					}}
					className={`${LIST_STYLES.checkboxBase} ${isChecked ? LIST_STYLES.checkboxChecked : LIST_STYLES.checkboxDefault
						}`}
				>
					{isChecked && <Check className="w-4 h-4 stroke-[3]" />}
				</button>

				{/* 魚名表示領域：縦並び（改行）へ改修 */}
				<div className="flex flex-col min-w-0 flex-1">
					<span
						className={`truncate ${LIST_STYLES.titleJa} ${isSelected
								? 'text-cyan-300 font-extrabold'
								: isChecked
									? LIST_STYLES.titleJaChecked
									: LIST_STYLES.titleJaDefault
							}`}
					>
						{fish.ja}
					</span>
					<span className="truncate text-xs text-slate-400 font-mono font-normal">
						{fish.en}
					</span>
				</div>
			</div>

			{/* バッジ表示（サイズ・水質） */}
			<div className="flex items-center gap-1.5 shrink-0">
				<span
					className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium border ${sizeInfo.style}`}
				>
					{sizeInfo.label}
				</span>
				<span
					className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium border ${waterInfo.style}`}
				>
					{waterInfo.label}
				</span>
			</div>
		</div>
	);
};