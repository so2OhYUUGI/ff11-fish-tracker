/**
 * ============================================================================
 * [FilePath] src/components/dev/masterEditor/tabs/FishEditTab/FishEditTab.tsx
 * [Role]     魚マスターデータの編集タブメインコンポーネント
 * 
 * [概要]
 * - 画面レイアウト構築（サイドバー ＋ メイン編集フォーム）
 * - 各種サブコンポーネント、RelationEditor の統合
 * - エリアおよび特定航路（サブロケーション）を同列でトグル選択するUIの提供
 * - 「全域（subLocationIdsが空）」および「特定ルート限定」の相互切り替えロジック
 * - ハラキリ（アイテム・称号）、備考の編集管理
 * 
 * [依存関係・関連ファイル]
 * - スタイル : src/styles/components/editorStyles.ts
 * - 型定義   : src/types/fishtracker.ts, ./types.ts
 * - データ   : src/data/baits.ts, src/data/subLocations.ts
 * - 親・関連 : src/components/dev/MasterDataEditorModal.tsx
 * 
 * [編集・改修時の注意事項（AI/エンジニア共通指示）]
 * 1. 【レイアウト/構造上の制約】 フォームパネルの縦幅を超過しないようスクロール領域を維持すること
 * 2. 【スタイルの集約】        直接Tailwindを書かず、EDITOR_STYLESを使用すること
 * 3. 【ロジック・例外処理】    「全域」トグル時は対象ゾーンのサブロケーションIDを解除し、ゾーン自体が削除された場合は配下のサブロケーションIDも一括削除すること
 * 4. 【アクセシビリティ・作法】 button には type="button" を明記すること
 * ============================================================================
 */

import React, { useState, useMemo, useCallback } from 'react';
import { BAITS } from '@/data/baits';
import { SUB_LOCATIONS } from '@/data/subLocations';
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
	const [selectedFishId, setSelectedFishId] = useState<number | null>(null);
	const [searchQuery, setSearchQuery] = useState<string>('');

	// 選択中の魚オブジェクトは fishList と selectedFishId から派生させる
	const selectedFish = useMemo(() => {
		if (selectedFishId === null) return null;
		return fishList.find((f) => f.id === selectedFishId) ?? null;
	}, [fishList, selectedFishId]);

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

	// ゾーンおよびサブロケーション（特定航路）統合トグルハンドラー
	const handleZoneOrSubLocationToggle = useCallback(
		(targetId: number | string) => {
			if (!selectedFish) return;

			const currentZoneIds = selectedFish.zoneIds || [];
			const currentSubIds = selectedFish.subLocationIds || [];

			if (typeof targetId === 'string' && targetId.startsWith('sub-')) {
				// --- 特定サブロケーション（特定ルート）のトグル処理 ---
				const subId = Number(targetId.replace('sub-', ''));
				const subLoc = SUB_LOCATIONS.find((s) => s.id === subId);
				if (!subLoc) return;

				const zoneId = subLoc.zoneId;

				// 親ゾーンが未選択の場合は自動追加
				const updatedZoneIds = currentZoneIds.includes(zoneId)
					? currentZoneIds
					: [...currentZoneIds, zoneId];

				const isRemoving = currentSubIds.includes(subId);
				const updatedSubIds = isRemoving
					? currentSubIds.filter((id) => id !== subId)
					: [...currentSubIds, subId];

				const updated = {
					...selectedFish,
					zoneIds: updatedZoneIds,
					subLocationIds: updatedSubIds.length > 0 ? updatedSubIds : undefined,
				};
				onFishChange(updated);
			} else {
				// --- 通常ゾーン / サブロケーション存在ゾーンの「全域」トグル処理 ---
				const zoneId = Number(targetId);
				const zoneSubLocations = SUB_LOCATIONS.filter((s) => s.zoneId === zoneId);
				const zoneSubIds = zoneSubLocations.map((s) => s.id);
				const hasSubLocations = zoneSubLocations.length > 0;

				const isZoneSelected = currentZoneIds.includes(zoneId);
				const hasActiveSubIds = currentSubIds.some((id) => zoneSubIds.includes(id));

				let updatedZoneIds = [...currentZoneIds];
				let updatedSubIds = [...currentSubIds];

				if (hasSubLocations) {
					// サブロケーションが存在するゾーンの場合
					if (isZoneSelected && !hasActiveSubIds) {
						// 現在「全域」選択中 -> ゾーン選択解除
						updatedZoneIds = updatedZoneIds.filter((id) => id !== zoneId);
					} else {
						// 現在「非選択」または「特定ルート限定」 -> 「全域」に設定（対象ゾーン配下の個別サブロケ選択を解除）
						if (!isZoneSelected) updatedZoneIds.push(zoneId);
						updatedSubIds = updatedSubIds.filter((id) => !zoneSubIds.includes(id));
					}
				} else {
					// サブロケーションが存在しない通常ゾーンの場合
					if (isZoneSelected) {
						updatedZoneIds = updatedZoneIds.filter((id) => id !== zoneId);
					} else {
						updatedZoneIds.push(zoneId);
					}
				}

				const updated = {
					...selectedFish,
					zoneIds: updatedZoneIds,
					subLocationIds: updatedSubIds.length > 0 ? updatedSubIds : undefined,
				};
				onFishChange(updated);
			}
		},
		[selectedFish, onFishChange]
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

	// ゾーンおよびサブロケーションを同列に統合した EntityItem 一覧の作成
	const zoneEntityItems: EntityItem[] = useMemo(() => {
		const regionMap = new Map((regionList || []).map((r) => [r.id, r.ja]));
		const items: EntityItem[] = [];

		(zoneList || []).forEach((z) => {
			const regionName =
				z.regionId !== undefined && z.regionId !== null && regionMap.has(z.regionId)
					? regionMap.get(z.regionId)
					: 'その他';

			const subLocations = SUB_LOCATIONS.filter((sub) => sub.zoneId === z.id);

			if (subLocations.length > 0) {
				// サブロケーションが存在するゾーンの場合：動的に「全域」項目を挿入
				items.push({
					id: z.id,
					label: `${z.ja} - 全域`,
					subLabel: `[${regionName}] ${z.en} (All Area)`,
				});

				subLocations.forEach((sub) => {
					items.push({
						id: `sub-${sub.id}`,
						label: `${z.ja} - ${sub.ja}`,
						subLabel: `[${regionName} / 航路] ${sub.en}`,
					});
				});
			} else {
				// サブロケーションが存在しない通常ゾーン
				items.push({
					id: z.id,
					label: z.ja,
					subLabel: `[${regionName}] ${z.en}`,
				});
			}
		});

		return items;
	}, [zoneList, regionList]);

	// 現在選択されているゾーンIDおよびサブロケーションIDのターゲットID一覧（"sub-{id}" 形式含む）
	const selectedZoneAndSubTargetIds = useMemo(() => {
		if (!selectedFish) return [];
		const selectedIds: (number | string)[] = [];
		const fishZoneIds = selectedFish.zoneIds || [];
		const fishSubIds = selectedFish.subLocationIds || [];

		(zoneList || []).forEach((z) => {
			if (!fishZoneIds.includes(z.id)) return;

			const zoneSubLocations = SUB_LOCATIONS.filter((sub) => sub.zoneId === z.id);

			if (zoneSubLocations.length > 0) {
				const activeSubIdsInZone = fishSubIds.filter((subId) =>
					zoneSubLocations.some((s) => s.id === subId)
				);

				if (activeSubIdsInZone.length > 0) {
					// 特定ルート限定の場合
					activeSubIdsInZone.forEach((subId) => {
						selectedIds.push(`sub-${subId}`);
					});
				} else {
					// ルール未指定（空）のため「全域」選択状態
					selectedIds.push(z.id);
				}
			} else {
				// サブロケーションを持たないゾーン
				selectedIds.push(z.id);
			}
		});

		return selectedIds;
	}, [selectedFish, zoneList]);

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
				onSelectFish={(fish) => setSelectedFishId(fish.id)}
			/>

			<div className={EDITOR_STYLES.fishEdit.formPanel}>
				{selectedFish ? (
					<div className={EDITOR_STYLES.fishEdit.formGrid}>
						<h3 className={EDITOR_STYLES.fishEdit.title}> 魚ID: {selectedFish.id} の編集 </h3>

						<FishBasicFields fish={selectedFish} onFieldChange={handleFieldChange} />

						<RelationEditor
							mode="multiple"
							title="釣れるエリア（ゾーン・特定航路）"
							targets={zoneEntityItems}
							selectedTargetIds={selectedZoneAndSubTargetIds}
							onToggle={handleZoneOrSubLocationToggle}
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