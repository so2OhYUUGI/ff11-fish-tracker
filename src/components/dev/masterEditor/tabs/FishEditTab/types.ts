/**
 * ============================================================================
 * [FilePath] src/components/dev/masterEditor/tabs/fishEdit/types.ts
 * [Role]     魚マスター編集タブに関連する型定義および選択肢定数
 * 
 * [概要]
 * - EditableFish 型の定義（FishMasterにzoneIdsおよびsubLocationIds拡張）
 * - サイズ区分（SIZE_OPTIONS）および水質区分（WATER_OPTIONS）の定数定義
 * 
 * [依存関係・関連ファイル]
 * - 型定義   : src/types/fishtracker.ts
 * - 親・関連 : src/components/dev/masterEditor/tabs/FishEditTab.tsx
 * 
 * [編集・改修時の注意事項（AI/エンジニア共通指示）]
 * 1. 【型の互換性】         EditableFish は FishMaster を継承し、編集専用プロパティ（zoneIds, subLocationIds）のみ拡張すること
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
} from '@/types/fishtracker';

export type EditableFish = FishMaster & {
	zoneIds?: number[];
	subLocationIds?: number[]; // 特定サブロケーションID配列（空・未指定時はゾーン全域）
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