/**
 * ============================================================================
 * [FilePath] src/components/dev/masterEditor/tabs/FishEditTab.tsx
 * [Role] 魚マスターデータの編集タブコンポーネント
 * 
 * [概要]
 * - BAITS および RODS の生データを直接参照し、全種類の餌と竿を描画
 * - 中間データ（`FishBaitRelation`, `FishRodRelation`）を介してリレーション編集を制御
 * - 限界スキルレベル (maxSkill) の数値入力領域に対応
 * - サイズ区分 (sizeType)、水質区分 (waterType) のセグメントコントロール（小型・等幅トグルボタン）編集に対応
 * - 左パネルの魚一覧に検索フィルター窓を追加（日本語・英語・ID検索対応）
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

// サイズ区分の定義
const SIZE_OPTIONS: { value: NonNullable<EditableFish['sizeType']>; label: string }[] = [
	{ value: 'large', label: '大型魚' },
	{ value: 'small', label: '小型魚' },
	{ value: 'unknown', label: '不明' },
];

// 水質区分の定義
const WATER_OPTIONS: { value: NonNullable<EditableFish['waterType']>; label: string }[] = [
	{ value: 'freshwater', label: '淡水' },
	{ value: 'saltwater', label: '海水' },
	{ value: 'gedou', label: '外道' },
	{ value: 'unknown', label: '不明' },
];

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
	const [searchQuery, setSearchQuery] = useState<string>('');

	// 検索条件による魚一覧の絞り込み
	const filteredFishList = fishList.filter((fish) => {
		if (!searchQuery.trim()) return true;
		const query = searchQuery.toLowerCase().trim();
		const matchJa = fish.ja ? fish.ja.toLowerCase().includes(query) : false;
		const matchEn = fish.en ? fish.en.toLowerCase().includes(query) : false;
		const matchId = fish.id ? String(fish.id).includes(query) : false;
		return matchJa || matchEn || matchId;
	});

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

	// 竿属性（catchability, rodBreak, lineBreak）のループ切り替え
	const handleRodStatusToggle = (
		rodId: number,
		field: 'catchability' | 'rodBreak' | 'lineBreak'
	) => {
		if (!selectedFish || !onRodRelationChange) return;

		const targetRelIndex = fishRodRelations.findIndex(
			(rel) => rel.fishId === selectedFish.id && rel.rodId === rodId
		);

		let updatedRelations = [...fishRodRelations];
		const existingRel = targetRelIndex >= 0 ? updatedRelations[targetRelIndex] : null;

		// ループ順序の定義
		const catchabilityOrder: NonNullable<FishRodRelation['catchability']>[] = ['unknown', 'possible', 'impossible'];
		const breakOrder: NonNullable<FishRodRelation['rodBreak']>[] = ['unknown', 'no', 'yes'];

		let nextValue: string;
		if (field === 'catchability') {
			const currentValue = existingRel?.catchability || 'unknown';
			const nextIdx = (catchabilityOrder.indexOf(currentValue) + 1) % catchabilityOrder.length;
			nextValue = catchabilityOrder[nextIdx];
		} else {
			const currentValue = existingRel?.[field] || 'unknown';
			const nextIdx = (breakOrder.indexOf(currentValue) + 1) % breakOrder.length;
			nextValue = breakOrder[nextIdx];
		}

		const updatedRel: FishRodRelation = {
			id: existingRel?.id || `${selectedFish.id}-${rodId}`,
			fishId: selectedFish.id,
			rodId,
			catchability: existingRel?.catchability || 'unknown',
			rodBreak: existingRel?.rodBreak || 'unknown',
			lineBreak: existingRel?.lineBreak || 'unknown',
			notes: existingRel?.notes || '',
			[field]: nextValue,
		};

		// すべてが初期状態（unknown または 空白）か判定
		const isDefaultState =
			(!updatedRel.catchability || updatedRel.catchability === 'unknown') &&
			(!updatedRel.rodBreak || updatedRel.rodBreak === 'unknown') &&
			(!updatedRel.lineBreak || updatedRel.lineBreak === 'unknown') &&
			!updatedRel.notes;

		if (targetRelIndex >= 0) {
			if (isDefaultState) {
				updatedRelations = updatedRelations.filter((_, idx) => idx !== targetRelIndex);
			} else {
				updatedRelations[targetRelIndex] = updatedRel;
			}
		} else if (!isDefaultState) {
			updatedRelations.push(updatedRel);
		}

		onRodRelationChange(updatedRelations);
	};

	// 竿の備考変更処理
	const handleRodNotesChange = (rodId: number, notesValue: string) => {
		if (!selectedFish || !onRodRelationChange) return;

		const targetRelIndex = fishRodRelations.findIndex(
			(rel) => rel.fishId === selectedFish.id && rel.rodId === rodId
		);

		let updatedRelations = [...fishRodRelations];
		const existingRel = targetRelIndex >= 0 ? updatedRelations[targetRelIndex] : null;

		const updatedRel: FishRodRelation = {
			id: existingRel?.id || `${selectedFish.id}-${rodId}`,
			fishId: selectedFish.id,
			rodId,
			catchability: existingRel?.catchability || 'unknown',
			rodBreak: existingRel?.rodBreak || 'unknown',
			lineBreak: existingRel?.lineBreak || 'unknown',
			notes: notesValue,
		};

		// すべてが初期状態（unknown または 空白）か判定
		const isDefaultState =
			(!updatedRel.catchability || updatedRel.catchability === 'unknown') &&
			(!updatedRel.rodBreak || updatedRel.rodBreak === 'unknown') &&
			(!updatedRel.lineBreak || updatedRel.lineBreak === 'unknown') &&
			!updatedRel.notes;

		if (targetRelIndex >= 0) {
			if (isDefaultState) {
				updatedRelations = updatedRelations.filter((_, idx) => idx !== targetRelIndex);
			} else {
				updatedRelations[targetRelIndex] = updatedRel;
			}
		} else if (!isDefaultState) {
			updatedRelations.push(updatedRel);
		}

		onRodRelationChange(updatedRelations);
	};

	// ゾーンエンティティの生成（一元化処理と型安全性を確保）
	const regionMap = new Map((regionList || []).map((r) => [r.id, r.ja]));

	const zoneEntityItems: EntityItem[] = (zoneList || []).map((z) => {
		const regionName = z.regionId !== undefined && z.regionId !== null && regionMap.has(z.regionId)
			? regionMap.get(z.regionId)
			: 'その他';

		return {
			id: z.id,
			label: z.ja,
			subLabel: `[${regionName}] ${z.en}`,
		};
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

	// ボタンレンダリング用ヘルパー
	const renderStatusButton = (
		label: string,
		colorStyle: { bg: string; text: string; border: string },
		onClick: () => void
	) => (
		<button
			type="button"
			onClick={onClick}
			style={{
				padding: '3px 8px',
				fontSize: '11px',
				borderRadius: '4px',
				cursor: 'pointer',
				fontWeight: 'bold',
				border: `1px solid ${colorStyle.border}`,
				backgroundColor: colorStyle.bg,
				color: colorStyle.text,
				minWidth: '60px',
			}}
		>
			{label}
		</button>
	);

	return (
		<div style={{ display: 'flex', gap: '15px', height: '100%', width: '100%' }}>
			{/* 左パネル: 魚一覧 */}
			<div
				style={{
					width: '260px',
					display: 'flex',
					flexDirection: 'column',
					border: '1px solid #ccc',
					background: '#fff',
					flexShrink: 0,
				}}
			>
				{/* 検索窓ヘッダー */}
				<div style={{ padding: '8px', borderBottom: '1px solid #ccc', backgroundColor: '#f7fafc' }}>
					<input
						type="text"
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						placeholder="名前 / ID で検索..."
						style={{
							width: '100%',
							padding: '5px 8px',
							fontSize: '12px',
							border: '1px solid #cbd5e0',
							borderRadius: '4px',
							boxSizing: 'border-box',
						}}
					/>
				</div>

				{/* 魚リスト表示エリア */}
				<div style={{ flex: 1, overflowY: 'auto' }}>
					{filteredFishList.map((fish) => {
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
					{filteredFishList.length === 0 && (
						<div style={{ padding: '12px', fontSize: '12px', color: '#a0aec0', textAlign: 'center' }}>
							該当する魚が見つかりません
						</div>
					)}
				</div>
			</div>

			{/* 右パネル: 選択中の魚の編集フォーム */}
			<div style={{ flex: 1, background: '#fff', padding: '15px', border: '1px solid #ccc', overflowY: 'auto' }}>
				{selectedFish ? (
					<div style={{ display: 'grid', gap: '15px', fontSize: '13px' }}>
						<h3 style={{ margin: '0 0 5px 0' }}> 魚ID: {selectedFish.id} の編集 </h3>

						<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 120px', gap: '10px' }}>
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
							<label>
								限界スキル:
								<input
									type="number"
									min="0"
									value={selectedFish.maxSkill ?? ''}
									onChange={(e) => {
										const val = e.target.value === '' ? 0 : Number(e.target.value);
										handleFieldChange('maxSkill', val);
									}}
									style={{ width: '100%', padding: '4px', marginTop: '2px', boxSizing: 'border-box' }}
								/>
							</label>
						</div>

						{/* サイズ区分・水質区分 (段分け配置・小型等幅ボタン) */}
						<div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
							{/* 上段: サイズ区分 */}
							<div>
								<div style={{ fontWeight: 'bold', marginBottom: '4px', color: '#4a5568', fontSize: '12px' }}>サイズ区分</div>
								<div style={{ display: 'flex', gap: '6px' }}>
									{SIZE_OPTIONS.map((item) => {
										const isSelected = (selectedFish.sizeType || 'unknown') === item.value;
										return (
											<button
												key={item.value}
												type="button"
												onClick={() => handleFieldChange('sizeType', item.value)}
												style={{
													width: '80px',
													padding: '4px 0',
													fontSize: '11px',
													borderRadius: '4px',
													cursor: 'pointer',
													textAlign: 'center',
													border: isSelected ? '1px solid #3182ce' : '1px solid #cbd5e0',
													backgroundColor: isSelected ? '#ebf8ff' : '#f7fafc',
													color: isSelected ? '#2b6cb0' : '#4a5568',
													fontWeight: isSelected ? 'bold' : 'normal',
													transition: 'all 0.15s ease-in-out',
												}}
											>
												{item.label}
											</button>
										);
									})}
								</div>
							</div>

							{/* 下段: 水質区分 */}
							<div>
								<div style={{ fontWeight: 'bold', marginBottom: '4px', color: '#4a5568', fontSize: '12px' }}>水質区分</div>
								<div style={{ display: 'flex', gap: '6px' }}>
									{WATER_OPTIONS.map((item) => {
										const isSelected = (selectedFish.waterType || 'unknown') === item.value;
										return (
											<button
												key={item.value}
												type="button"
												onClick={() => handleFieldChange('waterType', item.value)}
												style={{
													width: '80px',
													padding: '4px 0',
													fontSize: '11px',
													borderRadius: '4px',
													cursor: 'pointer',
													textAlign: 'center',
													border: isSelected ? '1px solid #3182ce' : '1px solid #cbd5e0',
													backgroundColor: isSelected ? '#ebf8ff' : '#f7fafc',
													color: isSelected ? '#2b6cb0' : '#4a5568',
													fontWeight: isSelected ? 'bold' : 'normal',
													transition: 'all 0.15s ease-in-out',
												}}
											>
												{item.label}
											</button>
										);
									})}
								</div>
							</div>
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
										<th style={{ padding: '6px', textAlign: 'center', width: '80px' }}>釣り可能</th>
										<th style={{ padding: '6px', textAlign: 'center', width: '80px' }}>竿折れ</th>
										<th style={{ padding: '6px', textAlign: 'center', width: '80px' }}>糸切れ</th>
										<th style={{ padding: '6px', textAlign: 'left' }}>備考</th>
									</tr>
								</thead>
								<tbody>
									{RODS.map((rod) => {
										const rodRel = getRodRelation(rod.id);

										const catchability = rodRel?.catchability || 'unknown';
										const rodBreak = rodRel?.rodBreak || 'unknown';
										const lineBreak = rodRel?.lineBreak || 'unknown';
										const notes = rodRel?.notes || '';

										// 釣り可能スタイリング
										const catchStyle =
											catchability === 'possible'
												? { bg: '#c6f6d5', text: '#22543d', border: '#38a169', label: '可能' }
												: catchability === 'impossible'
													? { bg: '#fed7d7', text: '#742a2a', border: '#e53e3e', label: '不可' }
													: { bg: '#edf2f7', text: '#718096', border: '#cbd5e0', label: '不明' };

										// 竿折れスタイリング
										const rodBreakStyle =
											rodBreak === 'yes'
												? { bg: '#fed7d7', text: '#742a2a', border: '#e53e3e', label: 'あり' }
												: rodBreak === 'no'
													? { bg: '#ebf8ff', text: '#2b6cb0', border: '#3182ce', label: 'なし' }
													: { bg: '#edf2f7', text: '#718096', border: '#cbd5e0', label: '不明' };

										// 糸切れスタイリング
										const lineBreakStyle =
											lineBreak === 'yes'
												? { bg: '#fed7d7', text: '#742a2a', border: '#e53e3e', label: 'あり' }
												: lineBreak === 'no'
													? { bg: '#ebf8ff', text: '#2b6cb0', border: '#3182ce', label: 'なし' }
													: { bg: '#edf2f7', text: '#718096', border: '#cbd5e0', label: '不明' };

										return (
											<tr key={rod.id} style={{ borderBottom: '1px solid #edf2f7' }}>
												<td style={{ padding: '6px' }}>
													{rod.ja} <span style={{ color: '#718096', fontSize: '10px' }}>({rod.en})</span>
												</td>
												<td style={{ padding: '6px', textAlign: 'center' }}>
													{renderStatusButton(catchStyle.label, catchStyle, () =>
														handleRodStatusToggle(rod.id, 'catchability')
													)}
												</td>
												<td style={{ padding: '6px', textAlign: 'center' }}>
													{renderStatusButton(rodBreakStyle.label, rodBreakStyle, () =>
														handleRodStatusToggle(rod.id, 'rodBreak')
													)}
												</td>
												<td style={{ padding: '6px', textAlign: 'center' }}>
													{renderStatusButton(lineBreakStyle.label, lineBreakStyle, () =>
														handleRodStatusToggle(rod.id, 'lineBreak')
													)}
												</td>
												<td style={{ padding: '6px' }}>
													<input
														type="text"
														value={notes}
														placeholder="備考を入力"
														onChange={(e) => handleRodNotesChange(rod.id, e.target.value)}
														style={{
															width: '100%',
															padding: '3px 6px',
															fontSize: '11px',
															border: '1px solid #cbd5e0',
															borderRadius: '4px',
															boxSizing: 'border-box',
														}}
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