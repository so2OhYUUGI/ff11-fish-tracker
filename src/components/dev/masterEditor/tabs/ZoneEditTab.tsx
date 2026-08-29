/**
 * ============================================================================
 * [FilePath] src/components/dev/masterEditor/tabs/ZoneEditTab.tsx
 * [Role] リージョン別ゾーン（エリア）設定タブ
 * ============================================================================
 */

import React, { useState } from 'react';
import type { ZoneMaster, RegionMaster } from '@/types/fishtracker';
import { RelationEditor } from '../RelationEditor';
import type { EntityItem } from '../types';
import { EDITOR_STYLES } from '@/styles/components/editorStyles';

type Props = {
	zoneList?: ZoneMaster[];
	regionList?: RegionMaster[];
	onZoneChange: (updatedZone: ZoneMaster) => void;
};

export const ZoneEditTab: React.FC<Props> = ({
	zoneList = [],
	regionList = [],
	onZoneChange,
}) => {
	const [selectedRegionId, setSelectedRegionId] = useState<number | string | null>(null);

	// 選択 ID が null の場合は先頭のリージョン ID を派生して使用する（useEffect 不要）
	const activeRegionId = selectedRegionId ?? regionList[0]?.id ?? null;

	const selectedRegion = regionList.find((r) => r.id === activeRegionId);

	// 選択中リージョンに所属しているゾーンIDの配列
	const currentBelongingZoneIds = zoneList
		.filter((z) => z.regionId === activeRegionId)
		.map((z) => z.id);

	// ゾーンのトグル処理（チェック時: 選択中regionIdを設定 / 解除時: regionIdを未設定にする）
	const handleZoneToggle = (zoneId: number | string) => {
		if (activeRegionId === null) return;

		const targetZone = zoneList.find((z) => z.id === zoneId);
		if (!targetZone) return;

		const isBelonging = targetZone.regionId === activeRegionId;

		const updatedZone: ZoneMaster = {
			...targetZone,
			regionId: isBelonging ? undefined : Number(activeRegionId),
		};

		onZoneChange(updatedZone);
	};

	// ゾーンリストを RelationEditor 用のエンティティデータに変換
	const zoneEntityItems: EntityItem[] = zoneList.map((z) => {
		// 他のリージョンに所属している場合はサブテキストに表示
		const otherRegion = regionList.find((r) => r.id === z.regionId);
		const subLabel = z.regionId && z.regionId !== activeRegionId
			? `(現在: ${otherRegion?.ja || z.regionId})`
			: z.en;

		return {
			id: z.id,
			label: z.ja,
			subLabel,
		};
	});

	const styles = EDITOR_STYLES.fishEdit;

	return (
		<div className="flex gap-3.5 h-full w-full">
			{/* 左パネル: リージョン選択リスト */}
			<div className={styles.sidebar}>
				<div className="p-2 font-bold border-b border-slate-300 bg-slate-50 text-xs">
					リージョン一覧
				</div>
				<div className={styles.listContainer}>
					{regionList.map((region) => {
						// 該当リージョンに紐づくエリア数をカウント
						const count = zoneList.filter((z) => z.regionId === region.id).length;
						const isSelected = activeRegionId === region.id;

						return (
							<div
								key={region.id}
								onClick={() => setSelectedRegionId(region.id)}
								className={`${styles.listItemBase} ${isSelected ? styles.listItemActive : styles.listItemInactive
									}`}
							>
								<span>[{region.id}] {region.ja}</span>
								<span
									className={`${styles.badgeBase} ${count > 0 ? styles.badgeActive : styles.badgeInactive
										}`}
								>
									{count}件
								</span>
							</div>
						);
					})}
				</div>
			</div>

			{/* 右パネル: 選択中リージョンに紐づくエリア（ゾーン）チェック設定 */}
			<div className={styles.formPanel}>
				{selectedRegion ? (
					<div className="grid gap-3.5 text-xs">
						<h3 className={styles.title}>
							[{selectedRegion.id}] {selectedRegion.ja} ({selectedRegion.en}) に所属するエリア
						</h3>

						<RelationEditor
							mode="multiple"
							title="所属ゾーン（エリア）を選択"
							targets={zoneEntityItems}
							selectedTargetIds={currentBelongingZoneIds}
							onToggle={handleZoneToggle}
						/>
					</div>
				) : (
					<p className={styles.emptyFormText}>
						左側のリストからリージョンを選択してください。
					</p>
				)}
			</div>
		</div>
	);
};