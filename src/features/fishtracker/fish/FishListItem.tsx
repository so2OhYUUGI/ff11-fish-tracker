/**
 * ============================================================================
 * [FilePath] src/features/fishtracker/components/lists/FishListItem.tsx
 * [Role] 魚データ（個別）のリスト表示コンポーネント
 * 
 * [概要]
 * - 魚の基本情報（和名、英名）のリスト形式（高密度レイアウト）表示
 * - 魚名称の日本語・英語表記を縦並び（カッコ外し）へ統一
 * - FISH_LOCATIONS から生息エリア数を算出し、右端属性領域にバッジ表示
 * - 属性情報（生息エリア数・上限スキル・サイズ・水質）の全表示を統一
 * - `variant` Props（'default' | 'inline'）によりメイン一覧用と詳細画面インライン用のスタイル切替に対応
 * - 獲得/達成状態（チェック状態）のチェックボックス描画およびトグル操作
 * - チェック済・選択中（アクティブ）・デフォルト状態に応じたスタイリング切り替え
 * ============================================================================
 */

import React, { useMemo } from 'react';
import { Check, MapPin } from 'lucide-react';
import type { FishMaster, ZoneMaster } from '@/types/fish';
import { FISH_LOCATIONS } from '@/data';
import { LIST_STYLES } from '@/styles/components/listStyles';
import { FISH_STYLES, BADGE_BASE_STYLE } from '@/styles/features/FishTrackerStyle';
import {
	SizeBadge,
	WaterBadge,
} from '@/features/fishtracker/common/FishBadges';

type Props = {
	fish: FishMaster;
	zones?: ZoneMaster[];
	isChecked?: boolean;
	isSelected?: boolean;
	variant?: 'default' | 'inline';
	onToggleCheck?: (fishId: number) => void;
	onClickDetail?: (fish: FishMaster) => void;
};

export const FishListItem: React.FC<Props> = ({
	fish,
	zones = [],
	isChecked = false,
	isSelected = false,
	variant = 'default',
	onToggleCheck,
	onClickDetail,
}) => {
	// 生息エリア数を算出（重複を除外して正確にカウント、メモ化）
	const totalZones = useMemo(() => {
		const targetZoneIds = new Set(
			FISH_LOCATIONS
				.filter((loc) => loc.fishId === fish.id)
				.map((loc) => loc.zoneId)
		);

		if (zones.length > 0) {
			return zones.filter((zone) => targetZoneIds.has(zone.id)).length;
		}
		return targetZoneIds.size;
	}, [fish.id, zones]);

	const isInline = variant === 'inline';

	// コンテナスタイル判定
	const containerStyle = isInline
		? `${LIST_STYLES.inlineBase} ${onClickDetail ? LIST_STYLES.inlineInteractive : ''} ${isChecked ? LIST_STYLES.dimmed : ''
		}`
		: `${LIST_STYLES.base} ${LIST_STYLES.fishRow} ${isSelected
			? `${LIST_STYLES.selected} ${isChecked ? 'opacity-90' : ''}`
			: isChecked
				? LIST_STYLES.checked
				: LIST_STYLES.default
		}`;

	// タイトル（魚名）スタイル判定
	const titleStyle = isInline
		? isChecked
			? LIST_STYLES.titleInlineJaChecked
			: LIST_STYLES.titleInlineJa
		: isSelected
			? LIST_STYLES.titleJaSelected
			: isChecked
				? LIST_STYLES.titleJaChecked
				: LIST_STYLES.titleJaDefault;

	return (
		<div
			onClick={() => onClickDetail?.(fish)}
			className={containerStyle}
		>
			{/* 左側：チェックボックス ＋ 魚名（日本語・英語） */}
			<div className="flex items-center gap-2.5 min-w-0 flex-1">
				{onToggleCheck && (
					<button
						type="button"
						onClick={(e) => {
							e.stopPropagation();
							onToggleCheck(fish.id);
						}}
						className={`${LIST_STYLES.checkboxBase} ${isChecked ? LIST_STYLES.checkboxChecked : LIST_STYLES.checkboxDefault
							}`}
						title={isChecked ? '未獲得にする' : '獲得済みにする'}
					>
						{isChecked && <Check className="w-4 h-4 stroke-[3]" />}
					</button>
				)}

				<div className="flex flex-col min-w-0 flex-1">
					<span className={`truncate ${titleStyle}`}>
						{fish.ja}
					</span>
					<span className={isInline ? LIST_STYLES.titleInlineEn : LIST_STYLES.titleEn}>
						{fish.en}
					</span>
				</div>
			</div>

			{/* 右側：属性バッジ群（狭い領域での自動折り返しに対応） */}
			<div className="flex flex-wrap items-center justify-end gap-1 shrink-0 max-w-[50%]">
				{/* 生息エリア数 */}
				{totalZones > 0 && (
					<span
						className={`${LIST_STYLES.zoneCountBase} ${totalZones === 1 ? LIST_STYLES.zoneCountSingle : LIST_STYLES.zoneCountMultiple
							}`}
						title={`生息エリア: ${totalZones}箇所`}
					>
						<MapPin className="w-3 h-3 text-red-400 opacity-90 shrink-0" />
						<span>{totalZones}</span>
					</span>
				)}

				{/* 上限スキル */}
				<span className={`${BADGE_BASE_STYLE} ${FISH_STYLES.badgeSkill}`}>
					上限: {fish.maxSkill}
				</span>

				{/* サイズ & 水質 */}
				<SizeBadge sizeType={fish.sizeType} useShortLabel />
				<WaterBadge waterType={fish.waterType} />
			</div>
		</div>
	);
};