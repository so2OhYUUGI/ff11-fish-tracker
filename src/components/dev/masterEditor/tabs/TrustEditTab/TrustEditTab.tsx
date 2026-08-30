/**
 * ============================================================================
 * [FilePath] src/components/dev/masterEditor/tabs/TrustEditTab/TrustEditTab.tsx
 * [Role] フェイスマスター編集用 メインタブコンポーネント（ソート機能追加）
 * ============================================================================
 */

import React, { useState, useMemo, useCallback } from 'react';
import type { TrustMaster } from '@/types/trusttracker';
import { EDITOR_STYLES } from '@/styles/components/editorStyles';
import type { EditableTrust, TrustEditTabProps } from './types';
import { TrustSidebar } from './components/TrustSidebar';
import { TrustBasicFields } from './components/TrustBasicFields';

export type { EditableTrust };

export type TrustSortKey = 'id' | 'icon_id' | 'ja' | 'en';
export type SortOrder = 'asc' | 'desc';

export const TrustEditTab: React.FC<TrustEditTabProps> = ({
	trustList = [],
	onTrustChange,
	onTrustListChange,
}) => {
	const [selectedTrustId, setSelectedTrustId] = useState<number | null>(null);
	const [searchQuery, setSearchQuery] = useState<string>('');
	const [sortKey, setSortKey] = useState<TrustSortKey>('id');
	const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

	const selectedTrust = useMemo(() => {
		if (selectedTrustId === null) return null;
		return trustList.find((t) => t.id === selectedTrustId) ?? null;
	}, [trustList, selectedTrustId]);

	const sortTrusts = useCallback(
		(list: TrustMaster[], key: TrustSortKey, order: SortOrder) => {
			return [...list].sort((a, b) => {
				let comparison = 0;
				if (key === 'id') {
					comparison = a.id - b.id;
				} else if (key === 'icon_id') {
					comparison = (a.icon_id ?? 0) - (b.icon_id ?? 0);
				} else if (key === 'ja') {
					comparison = (a.ja || '').localeCompare(b.ja || '', 'ja');
				} else if (key === 'en') {
					comparison = (a.en || '').localeCompare(b.en || '', 'en');
				}
				return order === 'asc' ? comparison : -comparison;
			});
		},
		[]
	);

	const handleSortChange = useCallback(
		(key: TrustSortKey) => {
			const nextOrder = sortKey === key && sortOrder === 'asc' ? 'desc' : 'asc';
			setSortKey(key);
			setSortOrder(nextOrder);

			const sorted = sortTrusts(trustList, key, nextOrder);
			onTrustListChange(sorted);
		},
		[sortKey, sortOrder, trustList, sortTrusts, onTrustListChange]
	);

	const filteredTrustList = useMemo(() => {
		if (!searchQuery.trim()) return trustList;
		const query = searchQuery.toLowerCase().trim();
		return trustList.filter((trust) => {
			const matchJa = trust.ja?.toLowerCase().includes(query) ?? false;
			const matchEn = trust.en?.toLowerCase().includes(query) ?? false;
			const matchId = trust.id ? String(trust.id).includes(query) : false;
			const matchJob = trust.job?.toLowerCase().includes(query) ?? false;
			return matchJa || matchEn || matchId || matchJob;
		});
	}, [trustList, searchQuery]);

	const handleFieldChange = useCallback(
		<K extends keyof TrustMaster>(field: K, value: TrustMaster[K]) => {
			if (!selectedTrust) return;
			const updated = { ...selectedTrust, [field]: value };
			onTrustChange(updated);
		},
		[selectedTrust, onTrustChange]
	);

	return (
		<div className={EDITOR_STYLES.fishEdit.container}>
			<TrustSidebar
				filteredTrustList={filteredTrustList}
				selectedTrustId={selectedTrust?.id}
				searchQuery={searchQuery}
				onSearchChange={setSearchQuery}
				onSelectTrust={(trust) => setSelectedTrustId(trust.id)}
				sortKey={sortKey}
				sortOrder={sortOrder}
				onSortChange={handleSortChange}
			/>

			<div className={EDITOR_STYLES.fishEdit.formPanel}>
				{selectedTrust ? (
					<div className={EDITOR_STYLES.fishEdit.formGrid}>
						<h3 className={EDITOR_STYLES.fishEdit.title}>
							フェイスID: {selectedTrust.id} ({selectedTrust.ja}) の編集
						</h3>

						<TrustBasicFields
							trust={selectedTrust}
							onFieldChange={handleFieldChange}
						/>
					</div>
				) : (
					<p className={EDITOR_STYLES.fishEdit.emptyFormText}>
						左側のリストからフェイスを選択してください。
					</p>
				)}
			</div>
		</div>
	);
};