/**
 * ============================================================================
 * [FilePath] src/utils/shareDataBuilder.ts
 * [Role] 共有カードデータ構築
 * ============================================================================
 */

import { FISHES } from '../data';
import type { FishMaster } from '../types/fishtracker';

export interface ShareCardData {
	characterName: string;
	checkedCount: number;
	totalCount: number;
	percentage: number;
	topFishList: FishMaster[];
}

export function buildShareCardData(characterName: string, checkedFishIds: number[] = []): ShareCardData {
	const checkedCount = Array.isArray(checkedFishIds) ? checkedFishIds.length : 0;
	const totalCount = FISHES.length;
	const percentage = totalCount > 0 ? Math.round((checkedCount / totalCount) * 100) : 0;

	const checkedSet = new Set(checkedFishIds);
	const matchedFishes = FISHES.filter((f) => checkedSet.has(f.id));
	const topFishList = matchedFishes.sort((a, b) => b.maxSkill - a.maxSkill).slice(0, 3);

	return {
		characterName: characterName || 'Unknown Angler',
		checkedCount,
		totalCount,
		percentage,
		topFishList,
	};
}