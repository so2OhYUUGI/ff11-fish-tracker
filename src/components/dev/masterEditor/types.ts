/**
 * ============================================================================
 * [FilePath] src/components/dev/masterEditor/types.ts
 * [Role] マスターエディタ専用の型定義
 * 
 * [概要]
 * - マスターエディタ内で使用する編集用データ型およびタブ・エンティティ定義
 * ============================================================================
 */

import type { FishMaster } from '@/types/fish';

export type EditTab = 'fish' | 'zone';

export type EditableFish = FishMaster & {
	zoneIds?: number[];
};

export type EntityItem = {
	id: number | string;
	label: string;
	subLabel?: string;
};