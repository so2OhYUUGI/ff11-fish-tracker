/**
 * ============================================================================
 * [FilePath] src/components/fish/FishListItem.tsx
 * [Role] 魚データ（個別）のリスト表示コンポーネント
 * 
 * [概要]
 * - 魚の基本情報（和名、英名）のリスト形式（高密度レイアウト）表示
 * - 魚名称の日本語・英語表記を縦並び（カッコ外し）へ統一
 * - FISH_LOCATIONS から生息エリア数を算出し、右端属性領域にバッジ表示
 * - サイズ（大型/小型/不明）および水質（淡水/海水/外道/不明）のバッジ表示
 * - 獲得/達成状態（チェック状態）のチェックボックス描画およびトグル操作
 * - チェック済・選択中（アクティブ）・デフォルト状態に応じた行全体のスタイリング切り替え
 * ============================================================================
 */

import React from 'react';
import { Check, MapPin } from 'lucide-react';
import type { FishMaster, ZoneMaster, SizeType, WaterType } from '@/types/fish';
import { FISH_LOCATIONS } from '@/data';
import { LIST_STYLES } from '@/styles/components/listStyles';
import { FISH_STYLES } from '@/styles/features/fishStyles';

type Props = {
	fish: FishMaster;
	zones?: ZoneMaster[];
	isChecked: boolean;
	isSelected?: boolean;
	onToggleCheck: (fishId: number) => void;
	onClickDetail: (fish: FishMaster) => void;
};

// サイズ表記のラベルとスタイルマッピング（FISH_STYLES を参照）
const SIZE_CONFIG: Record<SizeType, { label: string; style: string }> = {
	small: { label: '小型', style: FISH_STYLES.badgeSmall },
	large: { label: '大型', style: FISH_STYLES.badgeLarge },
	unknown: { label: '不明', style: FISH_STYLES.badgeSizeUnknown },
};

// 水質表記のラベルとスタイルマッピング（FISH_STYLES を参照）
const WATER_CONFIG: Record<WaterType, { label: string; style: string }> = {
	freshwater: { label: '淡水', style: FISH_STYLES.badgeFreshwater },
	saltwater: { label: '海水', style: FISH_STYLES.badgeSaltwater },
	gedou: { label: '外道', style: FISH_STYLES.badgeGedou },
	unknown: { label: '不明', style: FISH_STYLES.badgeWaterUnknown },
};

export const FishListItem: React.FC<Props> = ({
	fish,
	zones = [],
	isChecked,
	isSelected,
	onToggleCheck,
	onClickDetail,
}) => {
	// 生息エリア数を算出
	const targetZoneIds = FISH_LOCATIONS
		.filter((loc) => loc.fishId === fish.id)
		.map((loc) => loc.zoneId);

	const totalZones = zones.length > 0
		? zones.filter((zone) => targetZoneIds.includes(zone.id)).length
		: targetZoneIds.length;

	// 行全体のスタイル適用
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

				{/* 魚名表示領域（縦並び） */}
				<div className="flex flex-col min-w-0 flex-1">
					<span
						className={`truncate ${LIST_STYLES.titleJa} ${isSelected
							? LIST_STYLES.titleJaSelected
							: isChecked
								? LIST_STYLES.titleJaChecked
								: LIST_STYLES.titleJaDefault
							}`}
					>
						{fish.ja}
					</span>
					<span className={LIST_STYLES.titleEn}>
						{fish.en}
					</span>
				</div>
			</div>

			{/* 右端属性表示領域（生息エリア数・サイズ・水質） */}
			<div className="flex items-center gap-1.5 shrink-0">
				{totalZones > 0 && (
					<span
						className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-medium border shrink-0 ${totalZones === 1
							? 'bg-amber-950/50 text-amber-300 border-amber-800/40'
							: 'bg-slate-800/80 text-slate-300 border-slate-700/60'
							}`}
						title={`生息エリア: ${totalZones}箇所`}
					>
						<MapPin className="w-3 h-3 text-red-400 opacity-90" />
						<span>{totalZones}</span>
					</span>
				)}
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