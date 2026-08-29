/**
 * ============================================================================
 * [FilePath] src/features/fishtracker/fish/FishDetailView.tsx
 * [Role] 魚詳細情報表示コンポーネント
 * 
 * [概要]
 * - 共通ヘッダーコンポーネント（`DetailHeader`）を利用してヘッダー部分を統一
 * - ヘッダー（魚名・チェック状態・共有）を固定し、コンテンツ部分全体を独立スクロール表示
 * - 基本情報（スキル上限、サイズ区分、水質区分、各種関連属性フラグ）のステータス表示
 * - ハラキリ対象（アイテム・称号の有無）時の獲得可能アイテムおよび称号の表示
 * - 生息エリアタグや餌タグクリックによる他詳細画面（`AreaDetailView` / `BaitDetailView`）への相互遷移サポート
 * - 釣竿相性一覧、特記事項（`notes`）、説明文（`description`）の表示
 * - 全スタイルの参照を `DETAIL_STYLES` / `DETAIL_TABLE_STYLES` および `COMMON_TOKENS` へ完全移行
 * ============================================================================
 */

import React, { useMemo, useCallback } from 'react';
import { CheckSquare, Info, Square, Fish } from 'lucide-react';
import type { FishMaster, ZoneMaster, BaitMaster } from '@/types/fishtracker';
import {
	FISH_LOCATIONS,
	FISH_BAIT_RELATIONS,
	FISH_ROD_RELATIONS,
	BAITS,
	RODS,
} from '@/data';
import { DETAIL_STYLES, DETAIL_TABLE_STYLES } from '@/styles/components/detailStyles';
import { COMMON_TOKENS } from '@/styles/tokens/commonTokens';
import { DetailHeader } from '@/features/fishtracker/common/DetailHeader';
import {
	SizeBadge,
	WaterBadge,
	FlagBadge,
	SkillBadge,
	HarakiriItemBadge,
	HarakiriTitleBadge,
	RodStatusText,
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

export const FishDetailView = ({
	fish,
	zones,
	isChecked,
	onToggleCheck,
	onClose,
	onBack,
	canGoBack = false,
	onClickAreaDetail,
	onClickBaitDetail,
}: FishDetailViewProps) => {
	// 1. エリア情報の抽出（メモ化）
	const targetZones = useMemo(() => {
		const targetZoneIds = new Set(
			FISH_LOCATIONS
				.filter((loc) => loc.fishId === fish.id)
				.map((loc) => loc.zoneId)
		);
		return zones.filter((zone) => targetZoneIds.has(zone.id));
	}, [fish.id, zones]);

	// 2. 餌情報の抽出（メモ化）
	const targetBaits = useMemo(() => {
		const targetBaitIds = new Set(
			FISH_BAIT_RELATIONS
				.filter((rel) => rel.fishId === fish.id)
				.map((rel) => rel.baitId)
		);
		return BAITS.filter((bait) => targetBaitIds.has(bait.id));
	}, [fish.id]);

	// 3. 改行コード（\n および \\n）で分割した説明文行リスト
	const descriptionLines = useMemo(() => {
		if (!fish.description) return [];
		return fish.description.split(/\r?\n|\\n/);
	}, [fish.description]);

	// 4. 竿相性情報のルックアップ Map（高速化メモ化）
	const rodRelationMap = useMemo(() => {
		const map = new Map<number, (typeof FISH_ROD_RELATIONS)[number]>();
		FISH_ROD_RELATIONS.forEach((rel) => {
			if (rel.fishId === fish.id) {
				map.set(rel.rodId, rel);
			}
		});
		return map;
	}, [fish.id]);

	const handleToggleCheck = useCallback(() => {
		onToggleCheck(fish.id);
	}, [fish.id, onToggleCheck]);

	const hasHarakiriItems = Boolean(fish.harakiriItems && fish.harakiriItems.length > 0);
	const hasHarakiriTitle = Boolean(fish.harakiriTitle);
	const isHarakiriTarget = hasHarakiriItems || hasHarakiriTitle;

	// ヘッダーに配置する固有アクション（チェックボタン）
	const headerActions = (
		<button
			type="button"
			onClick={handleToggleCheck}
			className={`${DETAIL_STYLES.checkButtonBase} ${isChecked
				? DETAIL_STYLES.checkButtonChecked
				: DETAIL_STYLES.checkButtonUnchecked
				} shrink-0`}
			aria-label={`${fish.ja}を${isChecked ? '未釣獲' : '釣獲済み'}に変更`}
			aria-pressed={isChecked}
		>
			{isChecked ? (
				<>
					<CheckSquare className={DETAIL_STYLES.checkIconChecked} />
					<span className={DETAIL_STYLES.checkButtonText}>釣獲済み</span>
				</>
			) : (
				<>
					<Square className={DETAIL_STYLES.checkIconUnchecked} />
					<span className={DETAIL_STYLES.checkButtonText}>未釣獲</span>
				</>
			)}
		</button>
	);

	return (
		<div className={DETAIL_STYLES.panelBase}>
			{/* 1. 共通固定ヘッダー */}
			<DetailHeader
				titleJa={fish.ja}
				titleEn={fish.en}
				categoryName="魚"
				icon={<Fish className={`w-5 h-5 shrink-0 ${COMMON_TOKENS.entity.fish.text}`} />}
				canGoBack={canGoBack}
				onBack={onBack}
				onClose={onClose}
				actions={headerActions}
			/>

			{/* 2. 一括スクロール可能なコンテンツ領域 */}
			<div className={DETAIL_STYLES.scrollContent}>
				{/* 基本情報ステータス */}
				<div>
					<h3 className={DETAIL_STYLES.sectionTitle}>基本ステータス</h3>
					<div className={DETAIL_STYLES.badgeGroup}>
						<SkillBadge maxSkill={fish.maxSkill} />
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
						<div className={DETAIL_STYLES.harakiriGroup}>
							{hasHarakiriItems && (
								<div className={DETAIL_STYLES.harakiriItemRow}>
									<span className={DETAIL_STYLES.harakiriLabel}>入手アイテム:</span>
									{fish.harakiriItems?.map((item) => (
										<HarakiriItemBadge key={item} itemName={item} />
									))}
								</div>
							)}
							{hasHarakiriTitle && fish.harakiriTitle && (
								<div className={DETAIL_STYLES.harakiriTitleRow}>
									<span className={DETAIL_STYLES.harakiriLabel}>獲得称号:</span>
									<HarakiriTitleBadge titleName={fish.harakiriTitle} />
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
							{targetZones.map((zone) => {
								if (onClickAreaDetail) {
									return (
										<button
											key={zone.id}
											type="button"
											onClick={() => onClickAreaDetail(zone)}
											aria-label={`${zone.ja}のエリア詳細を表示`}
											className={`${DETAIL_STYLES.tagItem} ${DETAIL_STYLES.tagItemInteractive}`}
										>
											{zone.ja}
										</button>
									);
								}
								return (
									<span key={zone.id} className={DETAIL_STYLES.tagItem}>
										{zone.ja}
									</span>
								);
							})}
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
							{targetBaits.map((bait) => {
								if (onClickBaitDetail) {
									return (
										<button
											key={bait.id}
											type="button"
											onClick={() => onClickBaitDetail(bait)}
											aria-label={`${bait.ja}の餌詳細を表示`}
											className={`${DETAIL_STYLES.tagItem} ${DETAIL_STYLES.tagItemInteractive}`}
										>
											{bait.ja}
										</button>
									);
								}
								return (
									<span key={bait.id} className={DETAIL_STYLES.tagItem}>
										{bait.ja}
									</span>
								);
							})}
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
					<div className={DETAIL_TABLE_STYLES.wrapper}>
						<table className={DETAIL_TABLE_STYLES.table}>
							<thead className={DETAIL_TABLE_STYLES.thead}>
								<tr>
									<th className={DETAIL_TABLE_STYLES.th}>竿名</th>
									<th className={DETAIL_TABLE_STYLES.thCenter}>釣り可能</th>
									<th className={DETAIL_TABLE_STYLES.thCenter}>竿折れ</th>
									<th className={DETAIL_TABLE_STYLES.thCenter}>糸切れ</th>
									<th className={DETAIL_TABLE_STYLES.th}>備考</th>
								</tr>
							</thead>
							<tbody className={DETAIL_TABLE_STYLES.tbody}>
								{RODS.map((rod) => {
									const rel = rodRelationMap.get(rod.id);
									const catchability = rel?.catchability || 'unknown';
									const rodBreak = rel?.rodBreak || 'unknown';
									const lineBreak = rel?.lineBreak || 'unknown';
									const notes = rel?.notes || '';

									return (
										<tr key={rod.id} className={DETAIL_TABLE_STYLES.tr}>
											<td className={DETAIL_TABLE_STYLES.tdName}>
												{rod.ja}
												<span className={DETAIL_TABLE_STYLES.subText}>
													({rod.en})
												</span>
											</td>
											<td className={DETAIL_TABLE_STYLES.tdCenter}>
												{catchability === 'possible' ? (
													<RodStatusText type="possible" label="可能" />
												) : catchability === 'impossible' ? (
													<RodStatusText type="impossible" label="不可" />
												) : (
													<RodStatusText type="unknown" label="不明" />
												)}
											</td>
											<td className={DETAIL_TABLE_STYLES.tdCenter}>
												{rodBreak === 'yes' ? (
													<RodStatusText type="yes" label="あり" />
												) : rodBreak === 'no' ? (
													<RodStatusText type="no" label="なし" />
												) : (
													<RodStatusText type="unknown" label="不明" />
												)}
											</td>
											<td className={DETAIL_TABLE_STYLES.tdCenter}>
												{lineBreak === 'yes' ? (
													<RodStatusText type="yes" label="あり" />
												) : lineBreak === 'no' ? (
													<RodStatusText type="no" label="なし" />
												) : (
													<RodStatusText type="unknown" label="不明" />
												)}
											</td>
											<td className={DETAIL_TABLE_STYLES.tdNotes}>
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
				{descriptionLines.length > 0 && (
					<div className={DETAIL_STYLES.descriptionBox}>
						{descriptionLines.map((line, index) => (
							<React.Fragment key={`${index}-${line.slice(0, 10)}`}>
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