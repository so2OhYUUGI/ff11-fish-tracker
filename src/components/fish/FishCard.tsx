/**
 * ============================================================================
 * [FilePath] src/components/fish/FishCard.tsx
 * [Role] 魚データ（個別）のカード表示コンポーネント
 * 
 * [概要]
 * - 魚の基本情報（和名、英名、説明文、スキル上限、サイズ区分、属性バッジ）のカード形式表示
 * - 獲得/達成状態（チェック状態）のインジケーター描画およびトグル操作
 * - 選択状態（アクティブ表示）に応じたハイライト表示
 * - 生息エリア（FISH_LOCATIONS参照）・備考情報の表示領域保持
 * ============================================================================
 */

import React from 'react';
import { Check, Info, MapPin } from 'lucide-react';
import type { FishMaster, ZoneMaster } from '@/types/fish';
import { FISH_LOCATIONS } from '@/data';
import { CARD_STYLES } from '@/styles/cardStyles';

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
	// FISH_LOCATIONS から対象魚のゾーンIDを抽出し、zonesから該当するエリアを取得
	const targetZoneIds = FISH_LOCATIONS
		.filter((loc) => loc.fishId === fish.id)
		.map((loc) => loc.zoneId);
	const matchedZones = zones.filter((zone) => targetZoneIds.includes(zone.id));
	const totalZones = matchedZones.length;

	// カード表示用：最大2件表示、以降は +N バッジ化
	const maxDisplayCount = 2;
	const displayZones = matchedZones.slice(0, maxDisplayCount);
	const remainingCount = totalZones - maxDisplayCount;

	return (
		<div
			onClick={() => onClickDetail(fish)}
			className={`${CARD_STYLES.base} ${isSelected ? CARD_STYLES.selected : CARD_STYLES.default
				}`}
		>
			<div className="flex items-start justify-between gap-3">
				<div className="flex-1 min-w-0">
					<div className="flex items-center gap-2 flex-wrap">
						<h3
							className={`${CARD_STYLES.titleJa} ${isSelected ? 'text-cyan-300' : CARD_STYLES.titleJaDefault
								}`}
						>
							{fish.ja}
						</h3>
						<span className={CARD_STYLES.titleEn}>({fish.en})</span>
					</div>

					{/* アイテム説明文 */}
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
						<span
							className={`${CARD_STYLES.badgeBase} ${fish.sizeType === 'large'
									? CARD_STYLES.badgeLarge
									: CARD_STYLES.badgeSmall
								}`}
						>
							{fish.sizeType === 'large' ? '大型魚' : '小型魚'}
						</span>
						{fish.harakiri && (
							<span className={`${CARD_STYLES.badgeBase} ${CARD_STYLES.badgeHarakiri}`}>
								ハラキリ
							</span>
						)}
						{fish.ebisu && (
							<span className={`${CARD_STYLES.badgeBase} ${CARD_STYLES.badgeEbisu}`}>
								恵比寿
							</span>
						)}
						{fish.taikobou && (
							<span className={`${CARD_STYLES.badgeBase} ${CARD_STYLES.badgeTaikobou}`}>
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

				{/* チェック状態インジケーター */}
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