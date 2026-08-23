/**
 * ============================================================================
 * [FilePath] src/features/fishtracker/fish/FishCard.tsx
 * [Role] 魚データ（個別）のカード表示コンポーネント
 * 
 * [概要]
 * - 魚の基本情報（和名、英名、説明文、スキル上限、サイズ区分、水質区分、属性バッジ）のカード形式表示
 * - 獲得/達成状態（チェック状態）のインジケーター描画およびトグル操作
 * - 生息エリア（FISH_LOCATIONS参照）・備考情報の表示領域保持
 * - 魚名称の日本語と英語を明示的に改行して視認性と統一感を確保
 * - スタイル定義（CARD_STYLES, FISH_STYLES）への参照集約
 * ============================================================================
 */

import React, { useMemo } from 'react';
import { Check, Info, MapPin } from 'lucide-react';
import type { FishMaster, ZoneMaster } from '@/types/fishtracker';
import { FISH_LOCATIONS } from '@/data';
import { CARD_STYLES } from '@/styles/components/cardStyles';
import { FISH_STYLES, BADGE_BASE_STYLE } from '@/styles/features/FishTrackerStyle';
import {
	SizeBadge,
	WaterBadge,
	FlagBadge,
} from '@/features/fishtracker/common/FishBadges';

type FishCardProps = {
	fish: FishMaster;
	zones: ZoneMaster[];
	isChecked: boolean;
	isSelected?: boolean;
	onToggleCheck: (id: number) => void;
	onClickDetail: (fish: FishMaster) => void;
};

export const FishCard: React.FC<FishCardProps> = ({
	fish,
	zones,
	isChecked,
	isSelected,
	onToggleCheck,
	onClickDetail,
}) => {
	// 生息エリア情報の抽出（メモ化）
	const { matchedZones, totalZones } = useMemo(() => {
		const targetZoneIds = new Set(
			FISH_LOCATIONS
				.filter((loc) => loc.fishId === fish.id)
				.map((loc) => loc.zoneId)
		);
		const matched = zones.filter((zone) => targetZoneIds.has(zone.id));
		return {
			matchedZones: matched,
			totalZones: matched.length,
		};
	}, [fish.id, zones]);

	const maxDisplayCount = 2;
	const displayZones = matchedZones.slice(0, maxDisplayCount);
	const remainingCount = totalZones - maxDisplayCount;

	const isHarakiriTarget = Boolean(
		(fish.harakiriItems && fish.harakiriItems.length > 0) || fish.harakiriTitle
	);

	// 改行コード（\n および \\n）で分割した説明文行リスト
	const descriptionLines = useMemo(() => {
		if (!fish.description) return [];
		return fish.description.split(/\r?\n|\\n/);
	}, [fish.description]);

	const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			onClickDetail(fish);
		}
	};

	return (
		<div
			role="button"
			tabIndex={0}
			onClick={() => onClickDetail(fish)}
			onKeyDown={handleKeyDown}
			className={`${CARD_STYLES.base} ${isSelected ? CARD_STYLES.selected : CARD_STYLES.default
				}`}
		>
			<div className="flex items-start justify-between gap-3">
				<div className="flex-1 min-w-0">
					{/* 日本語名と英語名 */}
					<div className="flex flex-col min-w-0">
						<h3
							className={`truncate ${CARD_STYLES.titleJa} ${isSelected
									? CARD_STYLES.titleJaSelected
									: CARD_STYLES.titleJaDefault
								}`}
						>
							{fish.ja}
						</h3>
						<span className={`truncate ${CARD_STYLES.titleEn}`}>
							{fish.en}
						</span>
					</div>

					{/* 説明文 */}
					{descriptionLines.length > 0 && (
						<div className={CARD_STYLES.boxBlock}>
							{descriptionLines.map((line, index) => (
								<React.Fragment key={`${index}-${line.slice(0, 10)}`}>
									{index > 0 && <br />}
									{line}
								</React.Fragment>
							))}
						</div>
					)}

					{/* タグ・属性バッジ領域 */}
					<div className="flex flex-wrap items-center gap-1.5 mt-2">
						<span className={`${BADGE_BASE_STYLE} ${FISH_STYLES.badgeSkill}`}>
							上限: {fish.maxSkill}
						</span>
						<SizeBadge sizeType={fish.sizeType} />
						<WaterBadge waterType={fish.waterType} />
						{isHarakiriTarget && <FlagBadge type="harakiri" />}
						{fish.ebisu && <FlagBadge type="ebisu" />}
						{fish.taikobou && <FlagBadge type="taikobou" />}
					</div>

					{/* 生息エリア */}
					<div className={CARD_STYLES.targetLabelGroup}>
						<div className={CARD_STYLES.targetLabel}>
							<MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
							<span>生息エリア ({totalZones}):</span>
						</div>

						{totalZones > 0 ? (
							<div className={CARD_STYLES.tagContainer}>
								{displayZones.map((zone) => (
									<span
										key={zone.id}
										className={CARD_STYLES.tagItem}
										title={zone.ja}
									>
										{zone.ja}
									</span>
								))}
								{remainingCount > 0 && (
									<span
										className={CARD_STYLES.tagOverflow}
										title={`他 ${remainingCount} エリア`}
									>
										+{remainingCount}
									</span>
								)}
							</div>
						) : (
							<span className={CARD_STYLES.tagEmpty}>情報なし</span>
						)}
					</div>

					{/* 備考 */}
					{fish.notes && (
						<div className={CARD_STYLES.notesBlock}>
							<Info className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
							<span>{fish.notes}</span>
						</div>
					)}
				</div>

				{/* 獲得状態切り替えボタン */}
				<div className="shrink-0 pt-1">
					<button
						type="button"
						onClick={(e) => {
							e.stopPropagation();
							onToggleCheck(fish.id);
						}}
						className={`${CARD_STYLES.checkButton.base} ${isChecked
								? CARD_STYLES.checkButton.checked
								: CARD_STYLES.checkButton.unchecked
							}`}
						title={isChecked ? '未釣獲にする' : '釣獲済みにする'}
						aria-label={`${fish.ja}の獲得状態の切り替え（現在: ${isChecked ? '釣獲済み' : '未釣獲'
							}）`}
						aria-pressed={isChecked}
					>
						<Check
							className={
								isChecked
									? CARD_STYLES.checkButton.iconChecked
									: CARD_STYLES.checkButton.iconUnchecked
							}
						/>
					</button>
				</div>
			</div>
		</div>
	);
};