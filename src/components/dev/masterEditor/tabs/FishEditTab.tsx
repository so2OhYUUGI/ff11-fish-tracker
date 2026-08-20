/**
 * ============================================================================
 * [FilePath] src/components/dev/masterEditor/tabs/FishEditTab.tsx
 * [Role] 魚マスターデータの編集タブコンポーネント
 * 
 * [概要]
 * - BAITS および RODS の生データを直接参照し、全種類の餌と竿を描画
 * - 中間データ（`FishBaitRelation`, `FishRodRelation`）を介してリレーション編集を制御
 * ============================================================================
 */

import React, { useState } from 'react';
import type { ZoneMaster, RegionMaster, FishBaitRelation, FishRodRelation } from '@/types/fish';
import { BAITS } from '@/data/baits';
import { RODS } from '@/data/rods';
import { RelationEditor } from '../RelationEditor';
import type { EditableFish, EntityItem } from '../types';

type Props = {
	fishList?: EditableFish[];
	zoneList?: ZoneMaster[];
	regionList?: RegionMaster[];
	fishBaitRelations?: FishBaitRelation[];
	fishRodRelations?: FishRodRelation[];
	onFishChange: (updatedFish: EditableFish) => void;
	onBaitRelationChange?: (updatedRelations: FishBaitRelation[]) => void;
	onRodRelationChange?: (updatedRelations: FishRodRelation[]) => void;
};

export const FishEditTab: React.FC<Props> = ({
	fishList = [],
	zoneList = [],
	regionList = [],
	fishBaitRelations = [],
	fishRodRelations = [],
	onFishChange,
	onBaitRelationChange,
	onRodRelationChange,
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

	// 竿属性フラグのトグル（FishRodRelation の更新）
	const handleRodAttrToggle = (
		rodId: number,
		field: 'isImpossible' | 'canRodBreak' | 'canLineBreak' | 'isTooSmall'
	) => {
		if (!selectedFish || !onRodRelationChange) return;

		const targetRelIndex = fishRodRelations.findIndex(
			(rel) => rel.fishId === selectedFish.id && rel.rodId === rodId
		);

		let updatedRelations = [...fishRodRelations];

		if (targetRelIndex >= 0) {
			const existingRel = updatedRelations[targetRelIndex];
			const updatedValue = !existingRel[field];
			const updatedRel = { ...existingRel, [field]: updatedValue };

			// すべてのフラグが false（または undefined）になった場合はリレーション自体を削除する
			const hasAnyFlag =
				updatedRel.isImpossible ||
				updatedRel.canRodBreak ||
				updatedRel.canLineBreak ||
				updatedRel.isTooSmall ||
				Boolean(updatedRel.notes);

			if (hasAnyFlag) {
				updatedRelations[targetRelIndex] = updatedRel;
			} else {
				updatedRelations = updatedRelations.filter((_, idx) => idx !== targetRelIndex);
			}
		} else {
			// リレーションが存在しない場合は新規作成
			const newRel: FishRodRelation = {
				id: `${selectedFish.id}-${rodId}`,
				fishId: selectedFish.id,
				rodId,
				[field]: true,
			};
			updatedRelations.push(newRel);
		}

		onRodRelationChange(updatedRelations);
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

	// 選択中の魚に対応する竿リレーションの参照ヘルパー関数
	const getRodRelation = (rodId: number): FishRodRelation | undefined => {
		if (!selectedFish) return undefined;
		return fishRodRelations.find(
			(rel) => rel.fishId === selectedFish.id && rel.rodId === rodId
		);
	};

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
				{(fishList || []).map((fish) => {
					const zoneCount = fish.zoneIds?.length || 0;

					return (
						<div
							key={fish.id}
							onClick={() => setSelectedFish(fish)}
							style={{
								padding: '8px',
								cursor: 'pointer',
								fontSize: '13px',
								backgroundColor: selectedFish?.id === fish.id ? '#e2e8f0' : 'transparent',
								borderBottom: '1px solid #eee',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'space-between',
							}}
						>
							<span>[{fish.id}] {fish.ja}</span>
							<span
								style={{
									fontSize: '11px',
									color: zoneCount > 0 ? '#2b6cb0' : '#a0aec0',
									fontWeight: zoneCount > 0 ? 'bold' : 'normal',
									backgroundColor: zoneCount > 0 ? '#ebf8ff' : '#edf2f7',
									padding: '2px 6px',
									borderRadius: '10px',
								}}
							>
								{zoneCount}件
							</span>
						</div>
					);
				})}
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

						{/* 生データ RODS から直接表示する竿一覧（FishRodRelation 中間データ経由） */}
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
									{RODS.map((rod) => {
										const rodRel = getRodRelation(rod.id);
										return (
											<tr key={rod.id} style={{ borderBottom: '1px solid #edf2f7' }}>
												<td style={{ padding: '6px' }}>
													{rod.ja} <span style={{ color: '#718096', fontSize: '10px' }}>({rod.en})</span>
												</td>
												<td style={{ padding: '6px', textAlign: 'center' }}>
													<input
														type="checkbox"
														checked={Boolean(rodRel?.isImpossible)}
														onChange={() => handleRodAttrToggle(rod.id, 'isImpossible')}
													/>
												</td>
												<td style={{ padding: '6px', textAlign: 'center' }}>
													<input
														type="checkbox"
														checked={Boolean(rodRel?.canRodBreak)}
														onChange={() => handleRodAttrToggle(rod.id, 'canRodBreak')}
													/>
												</td>
												<td style={{ padding: '6px', textAlign: 'center' }}>
													<input
														type="checkbox"
														checked={Boolean(rodRel?.canLineBreak)}
														onChange={() => handleRodAttrToggle(rod.id, 'canLineBreak')}
													/>
												</td>
												<td style={{ padding: '6px', textAlign: 'center' }}>
													<input
														type="checkbox"
														checked={Boolean(rodRel?.isTooSmall)}
														onChange={() => handleRodAttrToggle(rod.id, 'isTooSmall')}
													/>
												</td>
											</tr>
										);
									})}
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