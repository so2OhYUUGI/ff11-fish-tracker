/**
 * ============================================================================
 * [FilePath] src/features/fishtracker/fish/FishDetailView.tsx
 * [Role] 魚詳細情報表示コンポーネント
 * 
 * [概要]
 * - ヘッダー（魚名・チェック状態）を固定し、コンテンツ部分全体を独立スクロール表示
 * - 基本情報（スキル上限、サイズ区分、水質区分、各種関連属性フラグ）のステータス表示
 * - ハラキリ対象（アイテム・称号の有無）時の獲得可能アイテムおよび称号の表示
 * - 生息エリアタグや餌タグクリックによる他詳細画面（`AreaDetailView` / `BaitDetailView`）への相互遷移サポート
 * - 釣竿相性一覧、特記事項（`notes`）、説明文（`description`）の表示
 * ============================================================================
 */

import React from 'react';
import { ArrowLeft, CheckSquare, Info, Square, X, Fish } from 'lucide-react';
import type { FishMaster, ZoneMaster, BaitMaster } from '@/types/fish';
import {
	FISH_LOCATIONS,
	FISH_BAIT_RELATIONS,
	FISH_ROD_RELATIONS,
	BAITS,
	RODS,
} from '@/data';
import { DETAIL_STYLES } from '@/styles/components/detailStyles';
import { FISH_STYLES, BADGE_BASE_STYLE } from '@/styles/features/fishStyles';
import {
	SizeBadge,
	WaterBadge,
	FlagBadge,
} from '@/features/fishtracker/common/FishBadges';

type FishDetailViewProps = {
	fish: FishMaster;
	zones: ZoneMaster[];
	isChecked: boolean;
	onToggleCheck: (fishId: number) => void;
	onClose: () => void;
	onBack?: () => void;
	canGoBack?: boolean;
	onClickAreaDetail?: (area: ZoneMaster) => void;
	onClickBaitDetail?: (bait: BaitMaster) => void;
};

export const FishDetailView: React.FC<FishDetailViewProps> = ({
	fish,
	zones,
	isChecked,
	onToggleCheck,
	onClose,
	onBack,
	canGoBack = false,
	onClickAreaDetail,
	onClickBaitDetail,
}) => {
	// 1. エリア情報の抽出
	const targetZoneIds = FISH_LOCATIONS
		.filter((loc) => loc.fishId === fish.id)
		.map((loc) => loc.zoneId);
	const targetZones = zones.filter((zone) => targetZoneIds.includes(zone.id));

	// 2. 餌情報の抽出
	const targetBaitIds = FISH_BAIT_RELATIONS
		.filter((rel) => rel.fishId === fish.id)
		.map((rel) => rel.baitId);
	const targetBaits = BAITS.filter((bait) => targetBaitIds.includes(bait.id));

	// 3. 竿情報の参照用ヘルパー関数
	const getRodRelation = (rodId: number) => {
		return FISH_ROD_RELATIONS.find(
			(rel) => rel.fishId === fish.id && rel.rodId === rodId
		);
	};

	const hasHarakiriItems = Boolean(fish.harakiriItems && fish.harakiriItems.length > 0);
	const hasHarakiriTitle = Boolean(fish.harakiriTitle);
	const isHarakiriTarget = hasHarakiriItems || hasHarakiriTitle;

	return (
		<div className="flex flex-col h-full min-h-0 overflow-hidden">
			{/* 1. 固定ヘッダー領域 */}
			<div className={DETAIL_STYLES.stickyHeader}>
				<div className={DETAIL_STYLES.stickyHeaderLeft}>
					{canGoBack && onBack && (
						<button
							type="button"
							onClick={onBack}
							className={DETAIL_STYLES.headerBackButton}
							title="前の画面へ戻る"
						>
							<ArrowLeft className="w-4 h-4 shrink-0" />
							<span>戻る</span>
						</button>
					)}
					<div className={DETAIL_STYLES.stickyHeaderLeft}>
						<Fish className="w-5 h-5 text-cyan-400 shrink-0" />
						<div className={DETAIL_STYLES.stickyHeaderTitleGroup}>
							<h2 className="text-base font-bold text-slate-100 truncate leading-tight">
								{fish.ja}
							</h2>
							<p className="text-xs text-slate-400 font-mono truncate">
								{fish.en}
							</p>
						</div>
					</div>
				</div>

				<div className={DETAIL_STYLES.stickyHeaderRight}>
					<button
						type="button"
						onClick={() => onToggleCheck(fish.id)}
						className={`${DETAIL_STYLES.checkButtonBase} ${isChecked
							? DETAIL_STYLES.checkButtonChecked
							: DETAIL_STYLES.checkButtonUnchecked
							} shrink-0`}
					>
						{isChecked ? (
							<>
								<CheckSquare className="w-4 h-4 text-emerald-400 shrink-0" />
								<span className="hidden sm:inline">釣獲済み</span>
							</>
						) : (
							<>
								<Square className="w-4 h-4 text-slate-400 shrink-0" />
								<span className="hidden sm:inline">未釣獲</span>
							</>
						)}
					</button>

					<button
						type="button"
						onClick={onClose}
						title="詳細を閉じる"
						className="p-1.5 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition-colors shrink-0"
					>
						<X className="w-5 h-5" />
					</button>
				</div>
			</div>

			{/* 2. 一括スクロール可能なコンテンツ領域 */}
			<div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-6">
				{/* 基本情報ステータス */}
				<div>
					<h3 className={DETAIL_STYLES.sectionTitle}>基本ステータス</h3>
					<div className="flex flex-wrap items-center gap-2">
						<span className={`${BADGE_BASE_STYLE} ${FISH_STYLES.badgeSkill}`}>
							上限スキル: {fish.maxSkill}
						</span>
						<SizeBadge sizeType={fish.sizeType} />
						<WaterBadge waterType={fish.waterType} />
						{isHarakiriTarget && <FlagBadge type="harakiri" />}
						{fish.ebisu && <FlagBadge type="ebisu" />}
						{fish.taikobou && <FlagBadge type="taikobou" />}
					</div>
				</div>

				{/* ハラキリ情報 */}
				<div>
					<h3 className={DETAIL_STYLES.sectionTitle}>ハラキリ</h3>
					{isHarakiriTarget ? (
						<div className="space-y-2">
							{hasHarakiriItems && (
								<div className="flex flex-wrap items-center gap-2">
									<span className="text-xs text-slate-400">入手アイテム:</span>
									{fish.harakiriItems!.map((item, index) => (
										<span
											key={index}
											className="px-2.5 py-1 rounded bg-slate-800 text-slate-200 border border-slate-700 text-xs font-medium"
										>
											{item}
										</span>
									))}
								</div>
							)}
							{hasHarakiriTitle && (
								<div className="flex items-center gap-2 text-xs">
									<span className="text-slate-400">獲得称号:</span>
									<span className="px-2.5 py-1 rounded bg-amber-950/40 text-amber-300 border border-amber-800/60 font-medium">
										{fish.harakiriTitle}
									</span>
								</div>
							)}
						</div>
					) : (
						<p className={DETAIL_STYLES.emptyText}>ハラキリ非対象</p>
					)}
				</div>

				{/* 生息エリア・釣り場 */}
				<div>
					<h3 className={DETAIL_STYLES.sectionTitle}>
						生息エリア ({targetZones.length} 箇所)
					</h3>
					{targetZones.length > 0 ? (
						<div className={DETAIL_STYLES.tagList}>
							{targetZones.map((zone) => (
								<button
									key={zone.id}
									type="button"
									onClick={() => onClickAreaDetail?.(zone)}
									className={`${DETAIL_STYLES.tagItem} hover:border-cyan-500 hover:text-cyan-300 transition-colors cursor-pointer`}
								>
									{zone.ja}
								</button>
							))}
						</div>
					) : (
						<p className={DETAIL_STYLES.emptyText}>生息エリア情報がありません</p>
					)}
				</div>

				{/* 釣れる餌一覧 */}
				<div>
					<h3 className={DETAIL_STYLES.sectionTitle}>
						釣れる餌 ({targetBaits.length} 種類)
					</h3>
					{targetBaits.length > 0 ? (
						<div className={DETAIL_STYLES.tagList}>
							{targetBaits.map((bait) => (
								<button
									key={bait.id}
									type="button"
									onClick={() => onClickBaitDetail?.(bait)}
									className={`${DETAIL_STYLES.tagItem} hover:border-cyan-500 hover:text-cyan-300 transition-colors cursor-pointer`}
								>
									{bait.ja}
								</button>
							))}
						</div>
					) : (
						<p className={DETAIL_STYLES.emptyText}>釣れる餌の情報がありません</p>
					)}
				</div>

				{/* 釣竿ごとの反応・相性一覧 */}
				<div>
					<h3 className={DETAIL_STYLES.sectionTitle}>
						釣竿との相性・反応 (全 {RODS.length} 種類)
					</h3>
					<div className="border border-slate-700 rounded-lg overflow-hidden">
						<table className="w-full text-xs text-left text-slate-300">
							<thead className="bg-slate-800 text-slate-400 border-b border-slate-700">
								<tr>
									<th className="p-2">竿名</th>
									<th className="p-2 text-center w-20">釣り可能</th>
									<th className="p-2 text-center w-20">竿折れ</th>
									<th className="p-2 text-center w-20">糸切れ</th>
									<th className="p-2 text-left">備考</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-slate-700/50">
								{RODS.map((rod) => {
									const rel = getRodRelation(rod.id);
									const catchability = rel?.catchability || 'unknown';
									const rodBreak = rel?.rodBreak || 'unknown';
									const lineBreak = rel?.lineBreak || 'unknown';
									const notes = rel?.notes || '';

									return (
										<tr key={rod.id} className="hover:bg-slate-800/40">
											<td className="p-2 font-medium text-slate-200">
												{rod.ja}
												<span className="text-slate-500 text-[10px] ml-1">
													({rod.en})
												</span>
											</td>
											<td className="p-2 text-center">
												{catchability === 'possible' ? (
													<span className="text-emerald-400 font-bold">可能</span>
												) : catchability === 'impossible' ? (
													<span className="text-red-400 font-bold">不可</span>
												) : (
													<span className="text-slate-500">不明</span>
												)}
											</td>
											<td className="p-2 text-center">
												{rodBreak === 'yes' ? (
													<span className="text-amber-400 font-bold">あり</span>
												) : rodBreak === 'no' ? (
													<span className="text-sky-400">なし</span>
												) : (
													<span className="text-slate-500">不明</span>
												)}
											</td>
											<td className="p-2 text-center">
												{lineBreak === 'yes' ? (
													<span className="text-amber-400 font-bold">あり</span>
												) : lineBreak === 'no' ? (
													<span className="text-sky-400">なし</span>
												) : (
													<span className="text-slate-500">不明</span>
												)}
											</td>
											<td className="p-2 text-slate-400">
												{notes || '-'}
											</td>
										</tr>
									);
								})}
							</tbody>
						</table>
					</div>
				</div>

				{/* 特記事項 */}
				{fish.notes && (
					<div>
						<h3 className={DETAIL_STYLES.sectionTitle}>特記事項</h3>
						<div className={DETAIL_STYLES.notesBlock}>
							<Info className={DETAIL_STYLES.notesIcon} />
							<span className={DETAIL_STYLES.notesText}>{fish.notes}</span>
						</div>
					</div>
				)}

				{/* 説明文 */}
				{fish.description && (
					<div className={DETAIL_STYLES.descriptionBox}>
						{fish.description.split('\\n').map((line, index) => (
							<React.Fragment key={index}>
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