/**
 * ============================================================================
 * [FilePath] src/features/fishtracker/components/lists/FishListItem.tsx
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
import type { FishMaster, ZoneMaster } from '@/types/fish';
import { FISH_LOCATIONS } from '@/data';
import { LIST_STYLES } from '@/styles/components/listStyles';
import {
	SizeBadge,
	WaterBadge,
} from '@/features/fishtracker/common/FishBadges';

type Props = {
	fish: FishMaster;
	zones?: ZoneMaster[];
	isChecked: boolean;
	isSelected?: boolean;
	onToggleCheck: (fishId: number) => void;
	onClickDetail: (fish: FishMaster) => void;
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

	return (
		<div
			onClick={() => onClickDetail(fish)}
			className={`${LIST_STYLES.base} ${LIST_STYLES.fishRow} ${containerStyle}`}
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
						className={`${LIST_STYLES.zoneCountBase} ${totalZones === 1
								? LIST_STYLES.zoneCountSingle
								: LIST_STYLES.zoneCountMultiple
							}`}
						title={`生息エリア: ${totalZones}箇所`}
					>
						<MapPin className="w-3 h-3 text-red-400 opacity-90" />
						<span>{totalZones}</span>
					</span>
				)}
				<SizeBadge sizeType={fish.sizeType} useShortLabel />
				<WaterBadge waterType={fish.waterType} />
			</div>
		</div>
	);
};