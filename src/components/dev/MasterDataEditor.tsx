import React, { useState } from 'react';
import { isDev } from '@/utils/env';
import { FISHES, ZONES, FISH_LOCATIONS } from '@/data/';
import type { FishMaster, FishLocation } from '@/types/fish';

type EditableFish = FishMaster & {
	zoneIds: number[];
};

export const MasterDataEditor: React.FC = () => {
	if (!isDev) return null;

	const [fishList, setFishList] = useState<EditableFish[]>(() =>
		FISHES.map((fish) => ({
			...fish,
			zoneIds: FISH_LOCATIONS.filter((loc) => loc.fishId === fish.id).map(
				(loc) => loc.zoneId
			),
		}))
	);

	const [selectedFish, setSelectedFish] = useState<EditableFish | null>(null);
	const [zoneSearch, setZoneSearch] = useState('');

	const handleFieldChange = (field: keyof EditableFish, value: any) => {
		if (!selectedFish) return;

		const updated = { ...selectedFish, [field]: value };
		setSelectedFish(updated);

		setFishList((prev) =>
			prev.map((item) => (item.id === updated.id ? updated : item))
		);
	};

	const handleZoneToggle = (zoneId: number) => {
		if (!selectedFish) return;

		const currentZoneIds = selectedFish.zoneIds || [];
		const isIncluded = currentZoneIds.includes(zoneId);

		const updatedZoneIds = isIncluded
			? currentZoneIds.filter((id) => id !== zoneId)
			: [...currentZoneIds, zoneId];

		handleFieldChange('zoneIds', updatedZoneIds);
	};

	const handleDirectSave = async () => {
		try {
			const response = await fetch('/api/save-fish-data', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					fishList,
					zoneList: ZONES,
				}),
			});

			if (response.ok) {
				alert('fishes.ts / fishLocations.ts / zones.ts へ直接保存しました！');
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
			zones: ZONES,
		};

		const dataStr =
			'data:text/json;charset=utf-8,' +
			encodeURIComponent(JSON.stringify(exportData, null, 2));
		const downloadAnchor = document.createElement('a');
		downloadAnchor.setAttribute('href', dataStr);
		downloadAnchor.setAttribute('download', 'updatedFishData.json');
		document.body.appendChild(downloadAnchor);
		downloadAnchor.click();
		downloadAnchor.remove();
	};

	const filteredZones = ZONES.filter(
		(zone) =>
			zone.ja.includes(zoneSearch) ||
			zone.en.toLowerCase().includes(zoneSearch.toLowerCase()) ||
			String(zone.id).includes(zoneSearch)
	);

	return (
		<div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '10px' }}>
			{/* アクションボタンバー */}
			<div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', flexShrink: 0 }}>
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
						backgroundColor: '#2b6cb0',
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

			{/* 左右分割メイン領域 */}
			<div style={{ display: 'flex', gap: '15px', flex: 1, minHeight: 0 }}>
				{/* 左側：魚リスト */}
				<div
					style={{
						width: '260px',
						overflowY: 'auto',
						border: '1px solid #ccc',
						background: '#fff',
						flexShrink: 0,
					}}
				>
					{fishList.map((fish) => (
						<div
							key={fish.id}
							onClick={() => setSelectedFish(fish)}
							style={{
								padding: '8px',
								cursor: 'pointer',
								fontSize: '13px',
								backgroundColor:
									selectedFish?.id === fish.id ? '#e2e8f0' : 'transparent',
								borderBottom: '1px solid #eee',
							}}
						>
							[{fish.id}] {fish.ja} ({fish.maxSkill})
						</div>
					))}
				</div>

				{/* 右側：編集フォーム */}
				<div
					style={{
						flex: 1,
						background: '#fff',
						padding: '15px',
						border: '1px solid #ccc',
						overflowY: 'auto',
					}}
				>
					{selectedFish ? (
						<div style={{ display: 'grid', gap: '10px', fontSize: '13px' }}>
							<h3 style={{ margin: '0 0 5px 0' }}>ID: {selectedFish.id} の編集</h3>

							<label>
								日本語名:
								<input
									type="text"
									value={selectedFish.ja}
									onChange={(e) => handleFieldChange('ja', e.target.value)}
									style={{ width: '100%', padding: '4px', marginTop: '2px' }}
								/>
							</label>

							<label>
								英語名:
								<input
									type="text"
									value={selectedFish.en}
									onChange={(e) => handleFieldChange('en', e.target.value)}
									style={{ width: '100%', padding: '4px', marginTop: '2px' }}
								/>
							</label>

							<label>
								上限スキル:
								<input
									type="number"
									value={selectedFish.maxSkill}
									onChange={(e) =>
										handleFieldChange('maxSkill', Number(e.target.value))
									}
									style={{ width: '100%', padding: '4px', marginTop: '2px' }}
								/>
							</label>

							<label>
								サイズ:
								<select
									value={selectedFish.sizeType}
									onChange={(e) =>
										handleFieldChange(
											'sizeType',
											e.target.value as 'small' | 'large'
										)
									}
									style={{ width: '100%', padding: '4px', marginTop: '2px' }}
								>
									<option value="small">小型</option>
									<option value="large">大型</option>
								</select>
							</label>

							<div style={{ display: 'flex', gap: '15px', marginTop: '5px' }}>
								<label style={{ cursor: 'pointer' }}>
									<input
										type="checkbox"
										checked={selectedFish.harakiri}
										onChange={(e) =>
											handleFieldChange('harakiri', e.target.checked)
										}
									/>{' '}
									ハラキリ対象
								</label>
								<label style={{ cursor: 'pointer' }}>
									<input
										type="checkbox"
										checked={selectedFish.ebisu}
										onChange={(e) =>
											handleFieldChange('ebisu', e.target.checked)
										}
									/>{' '}
									恵比寿対象
								</label>
							</div>

							{/* 釣れるエリア（リスト形式スクロール） */}
							<div>
								<div
									style={{
										display: 'flex',
										justify: 'space-between',
										alignItems: 'center',
										marginBottom: '4px',
									}}
								>
									<span style={{ fontWeight: 'bold' }}>
										釣れるエリア ({selectedFish.zoneIds?.length || 0}件選択中):
									</span>
									<input
										type="text"
										placeholder="エリア名・IDで絞り込み..."
										value={zoneSearch}
										onChange={(e) => setZoneSearch(e.target.value)}
										style={{ padding: '2px 6px', fontSize: '12px' }}
									/>
								</div>

								<div
									style={{
										height: '140px',
										overflowY: 'auto',
										border: '1px solid #ccc',
										padding: '8px',
										background: '#f9f9f9',
										display: 'grid',
										gridTemplateColumns: 'repeat(2, 1fr)',
										gap: '4px 10px',
									}}
								>
									{filteredZones.map((zone) => {
										const isChecked =
											selectedFish.zoneIds?.includes(zone.id) || false;
										return (
											<label
												key={zone.id}
												style={{
													fontSize: '12px',
													display: 'flex',
													alignItems: 'center',
													gap: '4px',
													cursor: 'pointer',
												}}
											>
												<input
													type="checkbox"
													checked={isChecked}
													onChange={() => handleZoneToggle(zone.id)}
												/>
												[{zone.id}] {zone.ja}
											</label>
										);
									})}
								</div>
							</div>

							<label>
								備考:
								<textarea
									value={selectedFish.notes || ''}
									onChange={(e) => handleFieldChange('notes', e.target.value)}
									style={{ width: '100%', height: '40px', padding: '4px', marginTop: '2px' }}
								/>
							</label>
						</div>
					) : (
						<p style={{ color: '#666', margin: 0 }}>
							左側のリストから編集する魚を選択してください。
						</p>
					)}
				</div>
			</div>
		</div>
	);
};