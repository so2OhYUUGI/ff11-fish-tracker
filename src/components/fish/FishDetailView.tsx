/**
 * ============================================================================
 * [FilePath] src/components/fish/FishDetailView.tsx
 * [Role] 魚詳細情報表示コンポーネント
 * 
 * [概要]
 * - ヘッダー（魚名・チェック状態）を固定し、コンテンツ部分全体を独立スクロール表示
 * - 基本情報（スキル上限、サイズ区分、水質区分、各種関連属性フラグ）のステータス表示
 * - 生息エリアタグや餌タグクリックによる他詳細画面（`AreaDetailView` / `BaitDetailView`）への相互遷移サポート
 * ============================================================================
 */

import React from 'react';
import { ArrowLeft, CheckSquare, Square, X } from 'lucide-react';
import type { FishMaster, ZoneMaster, BaitMaster } from '@/types/fish';
import {
	FISH_LOCATIONS,
	FISH_BAIT_RELATIONS,
	FISH_ROD_RELATIONS,
	BAITS,
	RODS,
} from '@/data';
import { DETAIL_STYLES } from '@/styles/detailStyles';
import { CARD_STYLES } from '@/styles/cardStyles';

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

// サイズ表記ラベル・スタイル取得ヘルパー
const getSizeBadgeInfo = (sizeType: FishMaster['sizeType']) => {
	switch (sizeType) {
		case 'large':
			return { label: '大型魚', style: CARD_STYLES.badgeLarge };
		case 'small':
			return { label: '小型魚', style: CARD_STYLES.badgeSmall };
		default:
			return { label: 'サイズ不明', style: CARD_STYLES.badgeSizeUnknown };
	}
};

// 水質・区分ラベル・スタイル取得ヘルパー
const getWaterBadgeInfo = (waterType: FishMaster['waterType']) => {
	switch (waterType) {
		case 'freshwater':
			return { label: '淡水', style: CARD_STYLES.badgeFreshwater };
		case 'saltwater':
			return { label: '海水', style: CARD_STYLES.badgeSaltwater };
		case 'gedou':
			return { label: '外道', style: CARD_STYLES.badgeGedou };
		default:
			return { label: '区分不明', style: CARD_STYLES.badgeWaterUnknown };
	}
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

	// 2. 餌情報の抽出（該当するもののみ列挙）
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

	const sizeInfo = getSizeBadgeInfo(fish.sizeType);
	const waterInfo = getWaterBadgeInfo(fish.waterType);

	return (
		<div className="flex flex-col h-full min-h-0 overflow-hidden">
			{/* 1. 固定ヘッダー領域（幅縮小時・縦表示時の潰れ・押し出しを防止） */}
			<div className="flex-shrink-0 z-10 bg-slate-900 shadow-md border-b border-slate-800 p-3 flex items-center justify-between gap-2 min-w-0">
				{/* 左側：戻るボタン ＋ タイトル */}
				<div className="flex items-center gap-2 min-w-0 flex-1">
					{canGoBack && onBack && (
						<button
							type="button"
							onClick={onBack}
							className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded border border-slate-700 shrink-0 transition-colors"
							title="前の画面へ戻る"
						>
							<ArrowLeft className="w-4 h-4 shrink-0" />
							<span>戻る</span>
						</button>
					)}
					<div className="min-w-0 flex-1">
						<h2 className="text-base font-bold text-slate-100 truncate leading-tight">
							{fish.ja}
						</h2>
						<p className="text-xs text-slate-400 font-mono truncate">
							{fish.en}
						</p>
					</div>
				</div>

				{/* 右側：チェックボタン ＋ 閉じるボタン */}
				<div className="flex items-center gap-1.5 shrink-0">
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
						<span className={`${CARD_STYLES.badgeBase} ${CARD_STYLES.badgeDefault}`}>
							上限スキル: {fish.maxSkill}
						</span>
						<span className={`${CARD_STYLES.badgeBase} ${sizeInfo.style}`}>
							{sizeInfo.label}
						</span>
						<span className={`${CARD_STYLES.badgeBase} ${waterInfo.style}`}>
							{waterInfo.label}
						</span>
						{fish.harakiri && (
							<span className={`${CARD_STYLES.badgeBase} ${CARD_STYLES.badgeHarakiri}`}>
								ハラキリ対象
							</span>
						)}
						{fish.ebisu && (
							<span className={`${CARD_STYLES.badgeBase} ${CARD_STYLES.badgeEbisu}`}>
								恵比寿関連
							</span>
						)}
						{fish.taikobou && (
							<span className={`${CARD_STYLES.badgeBase} ${CARD_STYLES.badgeTaikobou}`}>
								太公望関連
							</span>
						)}
					</div>
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

				{/* 説明・特記事項 */}
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