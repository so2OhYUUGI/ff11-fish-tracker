/**
 * ============================================================================
 * [FilePath] src/components/dev/masterEditor/MasterDataEditor.tsx
 * [Role] 開発用マスターデータ編集コンテナ（開発環境専用）
 * ============================================================================
 */

import React, { useState } from 'react';
import { isDev } from '@/utils/env';
import {
	FISHES,
	ZONES,
	FISH_LOCATIONS,
	REGIONS,
	FISH_BAIT_RELATIONS,
	FISH_ROD_RELATIONS,
} from '@/data/';
import type {
	FishLocation,
	ZoneMaster,
	FishBaitRelation,
	FishRodRelation,
} from '@/types/fish';
import { FishEditTab } from './tabs/FishEditTab';
import { ZoneEditTab } from './tabs/ZoneEditTab';
import type { EditTab, EditableFish } from './types';

export const MasterDataEditor: React.FC = () => {
	if (!isDev) return null;

	const [activeTab, setActiveTab] = useState<EditTab>('fish');

	const [fishList, setFishList] = useState<EditableFish[]>(() =>
		FISHES.map((fish) => ({
			...fish,
			zoneIds: FISH_LOCATIONS.filter((loc) => loc.fishId === fish.id).map((loc) => loc.zoneId),
		}))
	);

	const [zoneList, setZoneList] = useState<ZoneMaster[]>(() => ZONES);

	// 中間リレーションデータの State
	const [fishBaitRelations, setFishBaitRelations] = useState<FishBaitRelation[]>(
		() => FISH_BAIT_RELATIONS || []
	);
	const [fishRodRelations, setFishRodRelations] = useState<FishRodRelation[]>(
		() => FISH_ROD_RELATIONS || []
	);

	const handleFishChange = (updated: EditableFish) => {
		setFishList((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
	};

	const handleZoneChange = (updated: ZoneMaster) => {
		setZoneList((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
	};

	const handleDirectSave = async () => {
		try {
			const response = await fetch('/api/save-fish-data', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					fishList,
					zoneList,
					fishBaitRelations,
					fishRodRelations,
				}),
			});

			if (response.ok) {
				alert('マスターデータ（TSファイル）へ直接保存しました！');
			} else {
				alert('保存に失敗しました。');
			}
		} catch (error) {
			console.error(error);
			alert('エラーが発生しました。');
		}
	};

	const handleExport = () => {
		const exportFishes = fishList.map(({ zoneIds, ...fish }) => fish);
		const exportLocations: FishLocation[] = fishList.flatMap((fish) =>
			(fish.zoneIds || []).map((zoneId) => ({
				id: `${fish.id}-${zoneId}`,
				fishId: fish.id,
				zoneId,
			}))
		);

		const exportData = {
			fishes: exportFishes,
			fishLocations: exportLocations,
			zones: zoneList,
			fishBaitRelations,
			fishRodRelations,
		};

		const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportData, null, 2));
		const downloadAnchor = document.createElement('a');
		downloadAnchor.setAttribute('href', dataStr);
		downloadAnchor.setAttribute('download', 'updatedFishData.json');
		document.body.appendChild(downloadAnchor);
		downloadAnchor.click();
		downloadAnchor.remove();
	};

	return (
		<div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '10px' }}>
			<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
				<div style={{ display: 'flex', gap: '4px' }}>
					<button
						type="button"
						onClick={() => setActiveTab('fish')}
						style={{
							padding: '6px 12px',
							backgroundColor: activeTab === 'fish' ? '#2b6cb0' : '#edf2f7',
							color: activeTab === 'fish' ? '#fff' : '#2d3748',
							border: 'none',
							borderRadius: '4px',
							cursor: 'pointer',
							fontSize: '12px',
							fontWeight: 'bold',
						}}
					>
						🐟 魚データ編集
					</button>
					<button
						type="button"
						onClick={() => setActiveTab('zone')}
						style={{
							padding: '6px 12px',
							backgroundColor: activeTab === 'zone' ? '#2b6cb0' : '#edf2f7',
							color: activeTab === 'zone' ? '#fff' : '#2d3748',
							border: 'none',
							borderRadius: '4px',
							cursor: 'pointer',
							fontSize: '12px',
							fontWeight: 'bold',
						}}
					>
						🗺️ ゾーン（エリア）編集
					</button>
				</div>

				<div style={{ display: 'flex', gap: '8px' }}>
					<button
						type="button"
						onClick={handleDirectSave}
						style={{
							padding: '6px 12px',
							backgroundColor: '#c53030',
							color: '#fff',
							border: 'none',
							borderRadius: '4px',
							cursor: 'pointer',
							fontWeight: 'bold',
							fontSize: '12px',
						}}
					>
						TSファイルへ上書き保存
					</button>
					<button
						type="button"
						onClick={handleExport}
						style={{
							padding: '6px 12px',
							backgroundColor: '#4a5568',
							color: '#fff',
							border: 'none',
							borderRadius: '4px',
							cursor: 'pointer',
							fontSize: '12px',
						}}
					>
						JSONをダウンロード
					</button>
				</div>
			</div>

			<div style={{ display: 'flex', gap: '15px', flex: 1, minHeight: 0 }}>
				{activeTab === 'fish' && (
					<FishEditTab
						fishList={fishList}
						zoneList={zoneList}
						regionList={REGIONS}
						fishBaitRelations={fishBaitRelations}
						fishRodRelations={fishRodRelations}
						onFishChange={handleFishChange}
						onBaitRelationChange={setFishBaitRelations}
						onRodRelationChange={setFishRodRelations}
					/>
				)}
				{activeTab === 'zone' && (
					<ZoneEditTab zoneList={zoneList} regionList={REGIONS} onZoneChange={handleZoneChange} />
				)}
			</div>
		</div>
	);
};