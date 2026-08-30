import type { TrustMaster } from '@/types/trusttracker';

export type EditableTrust = TrustMaster;

export type TrustEditTabProps = {
	trustList: TrustMaster[];
	onTrustChange: (updated: TrustMaster) => void;
	onTrustListChange: (updatedList: TrustMaster[]) => void;
};