/**
 * ============================================================================
 * [FilePath] src/components/fish/FishCard.tsx
 * [Role] 魚データ（個別）のカード表示コンポーネント
 * 
 * [概要]
 * - 魚の基本情報（和名、英名、説明文、スキル上限、サイズ区分、水質区分、属性バッジ）のカード形式表示
 * - 獲得/達成状態（チェック状態）のインジケーター描画およびトグル操作
 * - 生息エリア（FISH_LOCATIONS参照）・備考情報の表示領域保持
 * - 魚名称の日本語と英語を明示的に改行して視認性と統一感を確保
 * ============================================================================
 */

import React from 'react';
import { Check, Info, MapPin } from 'lucide-react';
import type { FishMaster, ZoneMaster } from '@/types/fish';
import { FISH_LOCATIONS } from '@/data';
import { CARD_STYLES } from '@/styles/components/cardStyles';
import { FISH_STYLES } from '@/styles/features/fishStyles';

type FishCardProps = {
	fish: FishMaster;
	zones: ZoneMaster[];
	isChecked: boolean;
	isSelected?: boolean;
	onToggleCheck: (id: number) => void;
	onClickDetail: (fish: FishMaster) => void;
};

// サイズ表記ラベル・スタイル取得ヘルパー
const getSizeBadgeInfo = (sizeType: FishMaster['sizeType']) => {
	switch (sizeType) {
		case 'large':
			return { label: '大型魚', style: FISH_STYLES.badgeLarge };
		case 'small':
			return { label: '小型魚', style: FISH_STYLES.badgeSmall };
		default:
			return { label: 'サイズ不明', style: FISH_STYLES.badgeSizeUnknown };
	}
};

// 水質・区分ラベル・スタイル取得ヘルパー
const getWaterBadgeInfo = (waterType: FishMaster['waterType']) => {
	switch (waterType) {
		case 'freshwater':
			return { label: '淡水', style: FISH_STYLES.badgeFreshwater };
		case 'saltwater':
			return { label: '海水', style: FISH_STYLES.badgeSaltwater };
		case 'gedou':
			return { label: '外道', style: FISH_STYLES.badgeGedou };
		default:
			return { label: '区分不明', style: FISH_STYLES.badgeWaterUnknown };
	}
};

export const FishCard: React.FC<FishCardProps> = ({
	fish,
	zones,
	isChecked,
	isSelected,
	onToggleCheck,
	onClickDetail,
}) => {
	const targetZoneIds = FISH_LOCATIONS
		.filter((loc) => loc.fishId === fish.id)
		.map((loc) => loc.zoneId);
	const matchedZones = zones.filter((zone) => targetZoneIds.includes(zone.id));
	const totalZones = matchedZones.length;

	const maxDisplayCount = 2;
	const displayZones = matchedZones.slice(0, maxDisplayCount);
	const remainingCount = totalZones - maxDisplayCount;

	const sizeInfo = getSizeBadgeInfo(fish.sizeType);
	const waterInfo = getWaterBadgeInfo(fish.waterType);

	const isHarakiriTarget = Boolean(
		(fish.harakiriItems && fish.harakiriItems.length > 0) || fish.harakiriTitle
	);

	return (
		<div
			onClick={() => onClickDetail(fish)}
			className={`${CARD_STYLES.base} ${isSelected ? CARD_STYLES.selected : CARD_STYLES.default
				}`}
		>
			<div className="flex items-start justify-between gap-3">
				<div className="flex-1 min-w-0">
					{/* 日本語名と英語名 */}
					<div className="flex flex-col min-w-0">
						<h3
							className={`truncate ${CARD_STYLES.titleJa} ${isSelected ? 'text-cyan-300' : CARD_STYLES.titleJaDefault
								}`}
						>
							{fish.ja}
						</h3>
						<span className={`truncate text-xs text-slate-400 font-normal mt-0.5 ${CARD_STYLES.titleEn}`}>
							{fish.en}
						</span>
					</div>

					{fish.description && (
						<div className={`mb-3 mt-2 ${CARD_STYLES.boxBlock}`}>
							{fish.description.split('\\n').map((line, index) => (
								<React.Fragment key={index}>
									{index > 0 && <br />}
									{line}
								</React.Fragment>
							))}
						</div>
					)}

					{/* タグ領域 */}
					<div className="flex flex-wrap items-center gap-1.5 mt-2">
						<span className={`${CARD_STYLES.badgeBase} ${CARD_STYLES.badgeDefault}`}>
							上限: {fish.maxSkill}
						</span>
						<span className={`${CARD_STYLES.badgeBase} ${sizeInfo.style}`}>
							{sizeInfo.label}
						</span>
						<span className={`${CARD_STYLES.badgeBase} ${waterInfo.style}`}>
							{waterInfo.label}
						</span>
						{isHarakiriTarget && (
							<span className={`${CARD_STYLES.badgeBase} ${FISH_STYLES.badgeHarakiri}`}>
								ハラキリ
							</span>
						)}
						{fish.ebisu && (
							<span className={`${CARD_STYLES.badgeBase} ${FISH_STYLES.badgeEbisu}`}>
								恵比寿
							</span>
						)}
						{fish.taikobou && (
							<span className={`${CARD_STYLES.badgeBase} ${FISH_STYLES.badgeTaikobou}`}>
								太公望
							</span>
						)}
					</div>

					{/* 生息エリア */}
					<div className="mt-3 text-xs flex items-center gap-1.5 flex-wrap">
						<div className="flex items-center gap-1 text-slate-400 shrink-0 font-medium">
							<MapPin className="w-3.5 h-3.5 text-slate-400" />
							<span>生息エリア ({totalZones}):</span>
						</div>

						{totalZones > 0 ? (
							<div className="flex items-center gap-1 flex-wrap min-w-0">
								{displayZones.map((zone) => (
									<span
										key={zone.id}
										className="px-1.5 py-0.5 bg-slate-800 text-slate-300 border border-slate-700/60 rounded text-[11px] truncate max-w-[120px]"
										title={zone.ja}
									>
										{zone.ja}
									</span>
								))}
								{remainingCount > 0 && (
									<span
										className="px-1.5 py-0.5 bg-cyan-950/80 text-cyan-300 border border-cyan-800/60 rounded text-[11px] font-semibold"
										title={`他 ${remainingCount} エリア`}
									>
										+{remainingCount}
									</span>
								)}
							</div>
						) : (
							<span className="text-slate-500 italic">情報なし</span>
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

				<div className="shrink-0 pt-1">
					<button
						type="button"
						onClick={(e) => {
							e.stopPropagation();
							onToggleCheck(fish.id);
						}}
						className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${isChecked
							? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/50'
							: 'bg-slate-700 text-slate-500 border border-slate-600 hover:border-slate-400'
							}`}
					>
						<Check
							className={`w-5 h-5 ${isChecked ? 'stroke-[3]' : 'stroke-[2]'}`}
						/>
					</button>
				</div>
			</div>
		</div>
	);
};