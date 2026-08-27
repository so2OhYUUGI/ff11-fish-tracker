/**
 * ============================================================================
 * [FilePath] src/features/fishtracker/fish/FishListItem.tsx
 * [Role] 魚データ（個別）のリスト表示コンポーネント
 * 
 * [概要]
 * - 魚の基本情報（和名、英名）のリスト形式（高密度レイアウト）表示
 * - 魚名称の日本語・英語表記を縦並び（カッコ外し）へ統一
 * - FISH_LOCATIONS から生息エリア数を算出し、MapPin アイコンとともに右端属性領域にバッジ表示
 * - 属性情報（生息エリア数・上限スキル・サイズ・水質）の全表示を統一
 * - `variant` Props（'default' | 'inline'）によりメイン一覧用と詳細画面インライン用のスタイル切替に対応
 * - 獲得/達成状態（チェック状態）のチェックボックス描画およびトグル操作
 * - チェック済・選択中（アクティブ）・デフォルト状態に応じたスタイリング切り替え
 * 
 * [調整内容]
 * - テンプレートリテラル内の改行・インデント混入を解消し className を整形
 * - totalZones 算出処理を zones.filter で簡潔化
 * ============================================================================
 */

import React, { useMemo } from 'react';
import { Check, MapPin } from 'lucide-react';
import type { FishMaster, ZoneMaster } from '@/types/fishtracker';
import { FISH_LOCATIONS } from '@/data';
import { LIST_STYLES } from '@/styles/components/listStyles';
import { COMMON_TOKENS } from '@/styles/tokens/commonTokens';
import {
	SizeBadge,
	WaterBadge,
	SkillBadge,
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
	// 生息エリア数を算出
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
	const defaultStateStyle = isSelected
		? `${LIST_STYLES.selected} ${isChecked ? LIST_STYLES.selectedCheckedOpacity : ''}`
		: isChecked
			? LIST_STYLES.checked
			: LIST_STYLES.default;

	const containerStyle = isInline
		? `${LIST_STYLES.inlineBase} ${onClickDetail ? LIST_STYLES.inlineInteractive : ''} ${isChecked ? LIST_STYLES.dimmed : ''}`.trim()
		: `${LIST_STYLES.base} ${LIST_STYLES.fishRow} ${defaultStateStyle}`.trim();

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

	const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
		// 子要素（チェックボックスボタン）でのキー操作時は発火を防止
		if (e.target !== e.currentTarget) return;

		if (onClickDetail && (e.key === 'Enter' || e.key === ' ')) {
			e.preventDefault();
			onClickDetail(fish);
		}
	};

	const zoneBadgeStyle = totalZones === 1 ? LIST_STYLES.zoneCountSingle : LIST_STYLES.zoneCountMultiple;

	return (
		<div
			onClick={() => onClickDetail?.(fish)}
			onKeyDown={handleKeyDown}
			role={onClickDetail ? 'button' : undefined}
			tabIndex={onClickDetail ? 0 : undefined}
			className={containerStyle}
		>
			{/* 左側：チェックボックス ＋ 魚名（日本語・英語） */}
			<div className={LIST_STYLES.leftGroupContainer}>
				{onToggleCheck && (
					<button
						type="button"
						onClick={(e) => {
							e.stopPropagation();
							onToggleCheck(fish.id);
						}}
						className={`${LIST_STYLES.checkboxBase} ${isChecked ? LIST_STYLES.checkboxChecked : LIST_STYLES.checkboxDefault}`}
						title={isChecked ? '未獲得にする' : '獲得済みにする'}
						aria-label={`${fish.ja}の獲得状態の切り替え（現在: ${isChecked ? '獲得済み' : '未獲得'}）`}
						aria-pressed={isChecked}
					>
						{isChecked && <Check className="w-4 h-4 stroke-3" />}
					</button>
				)}

				<div className={LIST_STYLES.titleGroup}>
					<span className={`truncate ${titleStyle}`}>{fish.ja}</span>
					<span className={isInline ? LIST_STYLES.titleInlineEn : LIST_STYLES.titleEn}>
						{fish.en}
					</span>
				</div>
			</div>

			{/* 右側：属性バッジ群 */}
			<div className={LIST_STYLES.badgeGroupContainer}>
				{totalZones > 0 && (
					<span
						className={`${LIST_STYLES.zoneCountBase} ${zoneBadgeStyle}`}
						title={`生息エリア: ${totalZones}箇所`}
					>
						<MapPin className={`w-3 h-3 shrink-0 ${COMMON_TOKENS.entity.area.text}`} />
						<span>{totalZones}</span>
					</span>
				)}

				<SkillBadge maxSkill={fish.maxSkill} useShortLabel />
				<SizeBadge sizeType={fish.sizeType} useShortLabel />
				<WaterBadge waterType={fish.waterType} />
			</div>
		</div>
	);
};