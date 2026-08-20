/**
 * ============================================================================
 * [FilePath] src/components/dev/masterEditor/tabs/FishEditTab.tsx
 * [Role] 魚マスターデータの編集タブコンポーネント
 * 
 * [概要]
 * - BAITS および RODS の生データを直接参照し、全種類の餌と竿を描画
 * - 中間データ（`FishBaitRelation`）を介して「釣れる餌」のリレーション編集を制御
 * ============================================================================
 */

import React, { useState } from 'react';
import type { ZoneMaster, RegionMaster, FishBaitRelation } from '@/types/fish';
import { BAITS } from '@/data/baits';
import { RODS } from '@/data/rods';
import { RelationEditor } from '../RelationEditor';
import type { EditableFish, EntityItem } from '../types';

type Props = {
	fishList?: EditableFish[];
	zoneList?: ZoneMaster[];
	regionList?: RegionMaster[];
	fishBaitRelations?: FishBaitRelation[];
	onFishChange: (updatedFish: EditableFish) => void;
	onBaitRelationChange?: (updatedRelations: FishBaitRelation[]) => void;
};

export const FishEditTab: React.FC<Props> = ({
	fishList = [],
	zoneList = [],
	regionList = [],
	fishBaitRelations = [],
	onFishChange,
	onBaitRelationChange,
}) => {
	const [selectedFish, setSelectedFish] = useState<EditableFish | null>(null);

	const handleFieldChange = (field: keyof EditableFish, value: any) => {
		if (!selectedFish) return;
		const updated = { ...selectedFish, [field]: value };
		setSelectedFish(updated);
		onFishChange(updated);
	};

	// エリア（ゾーン）のトグル
	const handleZoneToggle = (zoneId: number | string) => {
		if (!selectedFish) return;
		const currentZoneIds = selectedFish.zoneIds || [];
		const targetId = Number(zoneId);
		const updatedZoneIds = currentZoneIds.includes(targetId)
			? currentZoneIds.filter((id) => id !== targetId)
			: [...currentZoneIds, targetId];
		handleFieldChange('zoneIds', updatedZoneIds);
	};

	// 釣れる餌のトグル（中間データ FishBaitRelation の追加 / 削除）
	const handleBaitToggle = (baitId: number | string) => {
		if (!selectedFish || !onBaitRelationChange) return;
		const targetBaitId = Number(baitId);

		const exists = fishBaitRelations.some(
			(rel) => rel.fishId === selectedFish.id && rel.baitId === targetBaitId
		);

		let updatedRelations: FishBaitRelation[];
		if (exists) {
			updatedRelations = fishBaitRelations.filter(
				(rel) => !(rel.fishId === selectedFish.id && rel.baitId === targetBaitId)
			);
		} else {
			updatedRelations = [
				...fishBaitRelations,
				{
					id: `${selectedFish.id}-${targetBaitId}`,
					fishId: selectedFish.id,
					baitId: targetBaitId,
				},
			];
		}

		onBaitRelationChange(updatedRelations);
	};

	// 竿の各種属性トグル
	const handleRodAttrToggle = (
		field: 'impossibleRodIds' | 'brokenRodIds' | 'brokenLineRodIds' | 'tooSmallRodIds',
		rodId: number
	) => {
		if (!selectedFish) return;
		const currentList = selectedFish[field] || [];
		const updatedList = currentList.includes(rodId)
			? currentList.filter((id) => id !== rodId)
			: [...currentList, rodId];
		handleFieldChange(field, updatedList);
	};

	// ゾーンエンティティの生成
	const zoneEntityItems: EntityItem[] = [];
	(regionList || []).forEach((region) => {
		const belongingZones = (zoneList || []).filter((z) => z.regionId === region.id);
		belongingZones.forEach((z) => {
			zoneEntityItems.push({
				id: z.id,
				label: z.ja,
				subLabel: `[${region.ja}] ${z.en}`,
			});
		});
	});

	(zoneList || [])
		.filter((z) => !z.regionId || !(regionList || []).some((r) => r.id === z.regionId))
		.forEach((z) => {
			zoneEntityItems.push({
				id: z.id,
				label: z.ja,
				subLabel: `[その他] ${z.en}`,
			});
		});

	// BAITS生データをエンティティ化
	const baitEntityItems: EntityItem[] = BAITS.map((b) => ({
		id: b.id,
		label: b.ja,
		subLabel: `[ID:${b.id}] ${b.en}`,
	}));

	// 選択中の魚に対応する餌ID一覧を取得
	const selectedBaitIds = selectedFish
		? fishBaitRelations
			.filter((rel) => rel.fishId === selectedFish.id)
			.map((rel) => rel.baitId)
		: [];

	return (
		<div style={{ display: 'flex', gap: '15px', height: '100%', width: '100%' }}>
			{/* 左パネル: 魚一覧 */}
			<div
				style={{
					width: '260px',
					overflowY: 'auto',
					border: '1px solid #ccc',
					background: '#fff',
					flexShrink: 0,
				}}
			>
				{(fishList || []).map((fish) => (
					<div
						key={fish.id}
						onClick={() => setSelectedFish(fish)}
						style={{
							padding: '8px',
							cursor: 'pointer',
							fontSize: '13px',
							backgroundColor: selectedFish?.id === fish.id ? '#e2e8f0' : 'transparent',
							borderBottom: '1px solid #eee',
						}}
					>
						[{fish.id}] {fish.ja} ({fish.maxSkill})
					</div>
				))}
			</div>

			{/* 右パネル: 選択中の魚の編集フォーム */}
			<div style={{ flex: 1, background: '#fff', padding: '15px', border: '1px solid #ccc', overflowY: 'auto' }}>
				{selectedFish ? (
					<div style={{ display: 'grid', gap: '15px', fontSize: '13px' }}>
						<h3 style={{ margin: '0 0 5px 0' }}> 魚ID: {selectedFish.id} の編集 </h3>

						<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
							<label>
								日本語名:
								<input
									type="text"
									value={selectedFish.ja}
									onChange={(e) => handleFieldChange('ja', e.target.value)}
									style={{ width: '100%', padding: '4px', marginTop: '2px', boxSizing: 'border-box' }}
								/>
							</label>
							<label>
								英語名:
								<input
									type="text"
									value={selectedFish.en}
									onChange={(e) => handleFieldChange('en', e.target.value)}
									style={{ width: '100%', padding: '4px', marginTop: '2px', boxSizing: 'border-box' }}
								/>
							</label>
						</div>

						{/* エリア選択 */}
						<RelationEditor
							mode="multiple"
							title="釣れるエリア（ゾーン）"
							targets={zoneEntityItems}
							selectedTargetIds={selectedFish.zoneIds || []}
							onToggle={handleZoneToggle}
						/>

						{/* 中間データ (FishBaitRelation) 経由で変更する餌一覧 */}
						<RelationEditor
							mode="multiple"
							title={`釣れる餌 (全 ${BAITS.length} 種類)`}
							targets={baitEntityItems}
							selectedTargetIds={selectedBaitIds}
							onToggle={handleBaitToggle}
						/>

						{/* 生データ RODS から直接表示する竿一覧 */}
						<div>
							<div style={{ fontWeight: 'bold', marginBottom: '6px' }}>
								竿の相性・反応設定 (全 {RODS.length} 種類)
							</div>
							<table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
								<thead>
									<tr style={{ background: '#f7fafc', borderBottom: '2px solid #e2e8f0' }}>
										<th style={{ padding: '6px', textAlign: 'left' }}>竿名</th>
										<th style={{ padding: '6px', textAlign: 'center', width: '60px' }}>不可</th>
										<th style={{ padding: '6px', textAlign: 'center', width: '60px' }}>竿折れ</th>
										<th style={{ padding: '6px', textAlign: 'center', width: '60px' }}>糸切れ</th>
										<th style={{ padding: '6px', textAlign: 'center', width: '60px' }}>小さすぎ</th>
									</tr>
								</thead>
								<tbody>
									{RODS.map((rod) => (
										<tr key={rod.id} style={{ borderBottom: '1px solid #edf2f7' }}>
											<td style={{ padding: '6px' }}>
												{rod.ja} <span style={{ color: '#718096', fontSize: '10px' }}>({rod.en})</span>
											</td>
											<td style={{ padding: '6px', textAlign: 'center' }}>
												<input
													type="checkbox"
													checked={(selectedFish.impossibleRodIds || []).includes(rod.id)}
													onChange={() => handleRodAttrToggle('impossibleRodIds', rod.id)}
												/>
											</td>
											<td style={{ padding: '6px', textAlign: 'center' }}>
												<input
													type="checkbox"
													checked={(selectedFish.brokenRodIds || []).includes(rod.id)}
													onChange={() => handleRodAttrToggle('brokenRodIds', rod.id)}
												/>
											</td>
											<td style={{ padding: '6px', textAlign: 'center' }}>
												<input
													type="checkbox"
													checked={(selectedFish.brokenLineRodIds || []).includes(rod.id)}
													onChange={() => handleRodAttrToggle('brokenLineRodIds', rod.id)}
												/>
											</td>
											<td style={{ padding: '6px', textAlign: 'center' }}>
												<input
													type="checkbox"
													checked={(selectedFish.tooSmallRodIds || []).includes(rod.id)}
													onChange={() => handleRodAttrToggle('tooSmallRodIds', rod.id)}
												/>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>

						<label>
							備考:
							<textarea
								value={selectedFish.notes || ''}
								onChange={(e) => handleFieldChange('notes', e.target.value)}
								style={{ width: '100%', height: '50px', padding: '4px', marginTop: '2px', boxSizing: 'border-box' }}
							/>
						</label>
					</div>
				) : (
					<p style={{ color: '#666', margin: 0 }}>左側のリストから魚を選択してください。</p>
				)}
			</div>
		</div>
	);
};