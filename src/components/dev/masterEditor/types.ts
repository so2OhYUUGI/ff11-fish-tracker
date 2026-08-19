import type { FishMaster, ZoneMaster } from '@/types/fish';

export type EditTab = 'fish' | 'zone';

export type EditableFish = FishMaster & {
	zoneIds: number[];
};

export type EntityItem = {
	id: number | string;
	label: string;
	subLabel?: string;
};