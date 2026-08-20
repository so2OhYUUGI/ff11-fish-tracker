/**
 * ============================================================================
 * [FilePath] src/components/fish/FishDetailView.tsx
 * [Role] 魚詳細情報表示コンポーネント
 * 
 * [概要]
 * - ヘッダー（魚名・チェック状態）を固定し、コンテンツ部分全体を独立スクロール表示
 * ============================================================================
 */

import React from 'react';
import { ArrowLeft, CheckSquare, Square, X } from 'lucide-react';
import type { FishMaster, ZoneMaster } from '@/types/fish';
import {
	FISH_LOCATIONS,
	FISH_BAIT_RELATIONS,
	FISH_ROD_RELATIONS,
	BAITS,
	RODS,
} from '@/data';
import { DETAIL_STYLES } from '@/styles/detailStyles';

type FishDetailViewProps = {
	fish: FishMaster;
	zones: ZoneMaster[];
	isChecked: boolean;
	onToggleCheck: (fishId: number) => void;
	onClose: () => void;
};

export const FishDetailView: React.FC<FishDetailViewProps> = ({
	fish,
	zones,
	isChecked,
	onToggleCheck,
	onClose,
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

	return (
		<div className="flex flex-col h-full min-h-0 overflow-hidden">
			{/* 1. 固定ヘッダー領域 */}
			<div className={`${DETAIL_STYLES.header} flex-shrink-0 z-10 bg-slate-900 shadow-md border-b border-slate-800`}>
				<div className={DETAIL_STYLES.headerLeft}>
					<button
						type="button"
						onClick={onClose}
						className={DETAIL_STYLES.backButton}
					>
						<ArrowLeft className="w-4 h-4" />
						<span>一覧へ戻る</span>
					</button>
					<div>
						<h2 className={DETAIL_STYLES.titleJa}>{fish.ja}</h2>
						<p className={DETAIL_STYLES.titleEn}>{fish.en}</p>
					</div>
				</div>

				<div className={DETAIL_STYLES.headerRight}>
					<button
						type="button"
						onClick={() => onToggleCheck(fish.id)}
						className={`${DETAIL_STYLES.checkButtonBase} ${isChecked
								? DETAIL_STYLES.checkButtonChecked
								: DETAIL_STYLES.checkButtonUnchecked
							}`}
					>
						{isChecked ? (
							<>
								<CheckSquare className="w-4 h-4 text-emerald-400" />
								<span>釣獲済み</span>
							</>
						) : (
							<>
								<Square className="w-4 h-4 text-slate-400" />
								<span>未釣獲</span>
							</>
						)}
					</button>

					<button
						type="button"
						onClick={onClose}
						title="詳細を閉じる"
						className={DETAIL_STYLES.closeButton}
					>
						<X className="w-5 h-5" />
					</button>
				</div>
			</div>

			{/* 2. 一括スクロール可能なコンテンツ領域 */}
			<div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-6">
				{/* 生息エリア・釣り場 */}
				<div>
					<h3 className={DETAIL_STYLES.sectionTitle}>
						生息エリア ({targetZones.length} 箇所)
					</h3>
					{targetZones.length > 0 ? (
						<div className={DETAIL_STYLES.tagList}>
							{targetZones.map((zone) => (
								<span key={zone.id} className={DETAIL_STYLES.tagItem}>
									{zone.ja}
								</span>
							))}
						</div>
					) : (
						<p className={DETAIL_STYLES.emptyText}>生息エリア情報がありません</p>
					)}
				</div>

				{/* 釣れる餌一覧（該当するもののみ列挙） */}
				<div>
					<h3 className={DETAIL_STYLES.sectionTitle}>
						釣れる餌 ({targetBaits.length} 種類)
					</h3>
					{targetBaits.length > 0 ? (
						<div className={DETAIL_STYLES.tagList}>
							{targetBaits.map((bait) => (
								<span key={bait.id} className={DETAIL_STYLES.tagItem}>
									{bait.ja}
								</span>
							))}
						</div>
					) : (
						<p className={DETAIL_STYLES.emptyText}>釣れる餌の情報がありません</p>
					)}
				</div>

				{/* 釣竿ごとの反応・相性一覧（全種類の竿を列挙） */}
				<div>
					<h3 className={DETAIL_STYLES.sectionTitle}>
						釣竿との相性・反応 (全 {RODS.length} 種類)
					</h3>
					<div className="border border-slate-700 rounded-lg overflow-hidden">
						<table className="w-full text-xs text-left text-slate-300">
							<thead className="bg-slate-800 text-slate-400 border-b border-slate-700">
								<tr>
									<th className="p-2">竿名</th>
									<th className="p-2 text-center w-16">釣獲</th>
									<th className="p-2 text-center w-16">竿折れ</th>
									<th className="p-2 text-center w-16">糸切れ</th>
									<th className="p-2 text-center w-20">小さすぎ</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-slate-700/50">
								{RODS.map((rod) => {
									const rel = getRodRelation(rod.id);
									const isImpossible = Boolean(rel?.isImpossible);
									const canRodBreak = Boolean(rel?.canRodBreak);
									const canLineBreak = Boolean(rel?.canLineBreak);
									const isTooSmall = Boolean(rel?.isTooSmall);

									return (
										<tr key={rod.id} className="hover:bg-slate-800/40">
											<td className="p-2 font-medium text-slate-200">
												{rod.ja}
												<span className="text-slate-500 text-[10px] ml-1">
													({rod.en})
												</span>
											</td>
											<td className="p-2 text-center">
												{isImpossible ? (
													<span className="text-red-400 font-bold">不可</span>
												) : (
													<span className="text-emerald-400">可能</span>
												)}
											</td>
											<td className="p-2 text-center">
												{canRodBreak ? (
													<span className="text-amber-400 font-bold">あり</span>
												) : (
													<span className="text-slate-500">なし</span>
												)}
											</td>
											<td className="p-2 text-center">
												{canLineBreak ? (
													<span className="text-amber-400 font-bold">あり</span>
												) : (
													<span className="text-slate-500">なし</span>
												)}
											</td>
											<td className="p-2 text-center">
												{isTooSmall ? (
													<span className="text-purple-400 font-bold">該当</span>
												) : (
													<span className="text-slate-500">なし</span>
												)}
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