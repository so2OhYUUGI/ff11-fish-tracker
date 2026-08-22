/**
 * ============================================================================
 * [FilePath] src/components/dev/masterEditor/tabs/fishEdit/types.ts
 * [Role] 魚マスター編集タブに関連する型定義および選択肢定数
 * [Specifications]
 *   - EditableFish 型の定義（FishMasterにzoneIds拡張）
 *   - サイズ区分（SIZE_OPTIONS）および水質区分（WATER_OPTIONS）の定数定義
 * [Notes]
 *   - @/types/fish の各種型に依存しています。
 * ============================================================================
 */

import type {
	FishMaster,
	ZoneMaster,
	RegionMaster,
	FishBaitRelation,
	FishRodRelation,
	SizeType,
	WaterType,
} from '@/types/fish';

export type EditableFish = FishMaster & {
	zoneIds?: number[];
};

export type FishEditTabProps = {
	fishList?: EditableFish[];
	zoneList?: ZoneMaster[];
	regionList?: RegionMaster[];
	fishBaitRelations?: FishBaitRelation[];
	fishRodRelations?: FishRodRelation[];
	onFishChange: (updatedFish: EditableFish) => void;
	onBaitRelationChange?: (updatedRelations: FishBaitRelation[]) => void;
	onRodRelationChange?: (updatedRelations: FishRodRelation[]) => void;
};

export const SIZE_OPTIONS: { value: SizeType; label: string }[] = [
	{ value: 'large', label: '大型魚' },
	{ value: 'small', label: '小型魚' },
	{ value: 'unknown', label: '不明' },
];

export const WATER_OPTIONS: { value: WaterType; label: string }[] = [
	{ value: 'freshwater', label: '淡水' },
	{ value: 'saltwater', label: '海水' },
	{ value: 'gedou', label: '外道' },
	{ value: 'unknown', label: '不明' },
];