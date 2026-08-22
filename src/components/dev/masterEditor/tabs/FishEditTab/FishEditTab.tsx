/**
 * ============================================================================
 * [FilePath] src/components/dev/masterEditor/tabs/FishEditTab.tsx
 * [Role] 魚マスターデータの編集タブメインコンポーネント
 * [Specifications]
 *   - 画面レイアウト構築（サイドバー ＋ メイン編集フォーム）
 *   - 各種サブコンポーネントおよび RelationEditor の統合
 *   - ハラキリ（アイテム・称号）、備考の編集管理
 * [Notes]
 *   - サブコンポーネントやロジックは同階層のフォルダ（fishEdit/）に分割・整理されています。
 * ============================================================================
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { BAITS } from '@/data/baits';
import { RelationEditor } from '../../RelationEditor';
import type { EntityItem } from '../../types';
import { EDITOR_STYLES } from '@/styles/components/editorStyles';

import type { EditableFish, FishEditTabProps } from './types';
import { useRodRelationHandlers } from './hooks/useRodRelationHandlers';
import { FishSidebar } from './components/FishSidebar';
import { FishBasicFields } from './components/FishBasicFields';
import { FishRodTable } from './components/FishRodTable';

export type { EditableFish };

export const FishEditTab: React.FC<FishEditTabProps> = ({
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

	useEffect(() => {
		if (selectedFish) {
			const currentInList = fishList.find((f) => f.id === selectedFish.id);
			if (currentInList) {
				setSelectedFish(currentInList);
			}
		}
	}, [fishList]);

	// カスタムフックから竿操作ロジックを取得
	const { handleRodStatusToggle, handleRodNotesChange } = useRodRelationHandlers(
		selectedFish,
		fishRodRelations,
		onRodRelationChange
	);

	// 検索フィルタリング
	const filteredFishList = useMemo(() => {
		if (!searchQuery.trim()) return fishList;
		const query = searchQuery.toLowerCase().trim();
		return fishList.filter((fish) => {
			const matchJa = fish.ja?.toLowerCase().includes(query) ?? false;
			const matchEn = fish.en?.toLowerCase().includes(query) ?? false;
			const matchId = fish.id ? String(fish.id).includes(query) : false;
			return matchJa || matchEn || matchId;
		});
	}, [fishList, searchQuery]);

	// フィールド更新ハンドラー
	const handleFieldChange = useCallback(
		<K extends keyof EditableFish>(field: K, value: EditableFish[K]) => {
			if (!selectedFish) return;
			const updated = { ...selectedFish, [field]: value };
			setSelectedFish(updated);
			onFishChange(updated);
		},
		[selectedFish, onFishChange]
	);

	// ハラキリ用アイテムの変換
	const handleHarakiriItemsChange = useCallback(
		(textValue: string) => {
			if (!selectedFish) return;
			const items = textValue
				.split(',')
				.map((item) => item.trim())
				.filter((item) => item !== '');
			handleFieldChange('harakiriItems', items.length > 0 ? items : undefined);
		},
		[selectedFish, handleFieldChange]
	);

	// ゾーン選択トグル
	const handleZoneToggle = useCallback(
		(zoneId: number | string) => {
			if (!selectedFish) return;
			const currentZoneIds = selectedFish.zoneIds || [];
			const targetId = Number(zoneId);
			const updatedZoneIds = currentZoneIds.includes(targetId)
				? currentZoneIds.filter((id) => id !== targetId)
				: [...currentZoneIds, targetId];
			handleFieldChange('zoneIds', updatedZoneIds);
		},
		[selectedFish, handleFieldChange]
	);

	// 餌選択トグル
	const handleBaitToggle = useCallback(
		(baitId: number | string) => {
			if (!selectedFish || !onBaitRelationChange) return;
			const targetBaitId = Number(baitId);

			const exists = fishBaitRelations.some(
				(rel) => rel.fishId === selectedFish.id && rel.baitId === targetBaitId
			);

			const updatedRelations = exists
				? fishBaitRelations.filter(
					(rel) => !(rel.fishId === selectedFish.id && rel.baitId === targetBaitId)
				)
				: [
					...fishBaitRelations,
					{
						id: `${selectedFish.id}-${targetBaitId}`,
						fishId: selectedFish.id,
						baitId: targetBaitId,
					},
				];

			onBaitRelationChange(updatedRelations);
		},
		[selectedFish, fishBaitRelations, onBaitRelationChange]
	);

	// エンティティ生成のメモ化
	const zoneEntityItems: EntityItem[] = useMemo(() => {
		const regionMap = new Map((regionList || []).map((r) => [r.id, r.ja]));
		return (zoneList || []).map((z) => {
			const regionName =
				z.regionId !== undefined && z.regionId !== null && regionMap.has(z.regionId)
					? regionMap.get(z.regionId)
					: 'その他';
			return {
				id: z.id,
				label: z.ja,
				subLabel: `[${regionName}] ${z.en}`,
			};
		});
	}, [zoneList, regionList]);

	const baitEntityItems: EntityItem[] = useMemo(
		() =>
			BAITS.map((b) => ({
				id: b.id,
				label: b.ja,
				subLabel: `[ID:${b.id}] ${b.en}`,
			})),
		[]
	);

	const selectedBaitIds = useMemo(
		() =>
			selectedFish
				? fishBaitRelations
					.filter((rel) => rel.fishId === selectedFish.id)
					.map((rel) => rel.baitId)
				: [],
		[selectedFish, fishBaitRelations]
	);

	return (
		<div className={EDITOR_STYLES.fishEdit.container}>
			<FishSidebar
				filteredFishList={filteredFishList}
				selectedFishId={selectedFish?.id}
				searchQuery={searchQuery}
				onSearchChange={setSearchQuery}
				onSelectFish={setSelectedFish}
			/>

			<div className={EDITOR_STYLES.fishEdit.formPanel}>
				{selectedFish ? (
					<div className={EDITOR_STYLES.fishEdit.formGrid}>
						<h3 className={EDITOR_STYLES.fishEdit.title}> 魚ID: {selectedFish.id} の編集 </h3>

						<FishBasicFields fish={selectedFish} onFieldChange={handleFieldChange} />

						<RelationEditor
							mode="multiple"
							title="釣れるエリア（ゾーン）"
							targets={zoneEntityItems}
							selectedTargetIds={selectedFish.zoneIds || []}
							onToggle={handleZoneToggle}
						/>

						<RelationEditor
							mode="multiple"
							title={`釣れる餌 (全 ${BAITS.length} 種類)`}
							targets={baitEntityItems}
							selectedTargetIds={selectedBaitIds}
							onToggle={handleBaitToggle}
						/>

						<FishRodTable
							fishId={selectedFish.id}
							fishRodRelations={fishRodRelations}
							onStatusToggle={handleRodStatusToggle}
							onNotesChange={handleRodNotesChange}
						/>

						<div className={EDITOR_STYLES.fishEdit.harakiriContainer}>
							<label>
								ハラキリ得られるアイテム (カンマ区切り):
								<input
									type="text"
									placeholder="例: 光のクリスタル, 黒ハガネ"
									value={selectedFish.harakiriItems ? selectedFish.harakiriItems.join(', ') : ''}
									onChange={(e) => handleHarakiriItemsChange(e.target.value)}
									className={EDITOR_STYLES.fishEdit.inputField}
								/>
							</label>
							<label>
								ハラキリ得られる称号:
								<input
									type="text"
									placeholder="例: 伝説の太公望"
									value={selectedFish.harakiriTitle || ''}
									onChange={(e) => handleFieldChange('harakiriTitle', e.target.value || undefined)}
									className={EDITOR_STYLES.fishEdit.inputField}
								/>
							</label>
						</div>

						<label>
							備考:
							<textarea
								value={selectedFish.notes || ''}
								onChange={(e) => handleFieldChange('notes', e.target.value)}
								className={EDITOR_STYLES.fishEdit.textareaField}
							/>
						</label>
					</div>
				) : (
					<p className={EDITOR_STYLES.fishEdit.emptyFormText}>左側のリストから魚を選択してください。</p>
				)}
			</div>
		</div>
	);
};