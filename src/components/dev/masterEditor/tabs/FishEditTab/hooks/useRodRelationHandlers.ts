/**
 * ============================================================================
 * [FilePath] src/components/dev/masterEditor/tabs/fishEdit/hooks/useRodRelationHandlers.ts
 * [Role] 魚と竿の関係性（相性・各種判定・備考）の更新処理を担うカスタムフック
 * [Specifications]
 *   - handleRodStatusToggle: catchability / rodBreak / lineBreak のステート切替
 *   - handleRodNotesChange: 備考のテキスト入力更新
 *   - 初期・未設定状態（デフォルト値）の場合は配列から要素を除去してデータ量を軽量化
 * [Notes]
 *   - onRodRelationChange コールバックが未渡しの場合は処理をスキップします。
 * ============================================================================
 */

import { useCallback } from 'react';
import type { FishRodRelation } from '@/types/fishtracker';
import type { EditableFish } from '../types';

export function useRodRelationHandlers(
	selectedFish: EditableFish | null,
	fishRodRelations: FishRodRelation[],
	onRodRelationChange?: (updatedRelations: FishRodRelation[]) => void
) {
	const handleRodStatusToggle = useCallback(
		(rodId: number, field: 'catchability' | 'rodBreak' | 'lineBreak') => {
			if (!selectedFish || !onRodRelationChange) return;

			const targetRelIndex = fishRodRelations.findIndex(
				(rel) => rel.fishId === selectedFish.id && rel.rodId === rodId
			);

			let updatedRelations = [...fishRodRelations];
			const existingRel = targetRelIndex >= 0 ? updatedRelations[targetRelIndex] : null;

			const catchabilityOrder: NonNullable<FishRodRelation['catchability']>[] = ['unknown', 'possible', 'impossible'];
			const breakOrder: NonNullable<FishRodRelation['rodBreak']>[] = ['unknown', 'no', 'yes'];

			let nextValue: any;
			if (field === 'catchability') {
				const currentValue = existingRel?.catchability || 'unknown';
				const currentIdx = catchabilityOrder.indexOf(currentValue);
				const safeIdx = currentIdx >= 0 ? currentIdx : 0;
				nextValue = catchabilityOrder[(safeIdx + 1) % catchabilityOrder.length];
			} else {
				const currentValue = existingRel?.[field] || 'unknown';
				const currentIdx = breakOrder.indexOf(currentValue);
				const safeIdx = currentIdx >= 0 ? currentIdx : 0;
				nextValue = breakOrder[(safeIdx + 1) % breakOrder.length];
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
		},
		[selectedFish, fishRodRelations, onRodRelationChange]
	);

	const handleRodNotesChange = useCallback(
		(rodId: number, notesValue: string) => {
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
		},
		[selectedFish, fishRodRelations, onRodRelationChange]
	);

	return { handleRodStatusToggle, handleRodNotesChange };
}