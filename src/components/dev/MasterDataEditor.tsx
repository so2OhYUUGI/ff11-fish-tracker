import React, { useState } from 'react';
import { isDev } from '@/utils/env';
import { FISHES, ZONES } from '@/data/';
import type { FishMaster } from '@/types/fish';

export const MasterDataEditor: React.FC = () => {
	// 開発環境以外ではコンポーネント自体をレンダリングしない
	if (!isDev) return null;

	const [fishList, setFishList] = useState<FishMaster[]>(FISHES);
	const [selectedFish, setSelectedFish] = useState<FishMaster | null>(null);

	// フィールドの直接更新処理
	const handleFieldChange = (field: keyof FishMaster, value: any) => {
		if (!selectedFish) return;

		const updated = { ...selectedFish, [field]: value };
		setSelectedFish(updated);

		setFishList((prev) =>
			prev.map((item) => (item.id === updated.id ? updated : item))
		);
	};

	// 直接 fishData.ts へ上書き保存する処理
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
				alert('src/data/fishData.ts へ直接保存しました！');
			} else {
				alert('保存に失敗しました。');
			}
		} catch (error) {
			console.error(error);
			alert('エラーが発生しました。');
		}
	};

	// 編集結果をJSONとしてダウンロード
	const handleExport = () => {
		const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(fishList, null, 2));
		const downloadAnchor = document.createElement('a');
		downloadAnchor.setAttribute("href", dataStr);
		downloadAnchor.setAttribute("download", "updatedFishData.json");
		document.body.appendChild(downloadAnchor);
		downloadAnchor.click();
		downloadAnchor.remove();
	};

	return (
		<div style={{ padding: '20px', border: '2px solid #e53e3e', borderRadius: '8px', margin: '20px 0', backgroundColor: '#fff5f5' }}>
			<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
				<h2 style={{ color: '#c53030', margin: 0 }}>🛠️ 開発用マスターデータエディタ</h2>
				<div style={{ display: 'flex', gap: '10px' }}>
					{/* 上書き保存ボタン */}
					<button onClick={handleDirectSave} style={{ padding: '8px 16px', backgroundColor: '#c53030', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
						fishData.ts に上書き保存
					</button>
					<button onClick={handleExport} style={{ padding: '8px 16px', backgroundColor: '#2b6cb0', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
						JSONをダウンロード
					</button>
				</div>
			</div>

			<div style={{ display: 'flex', gap: '20px', marginTop: '15px' }}>
				{/* 左側：魚リスト */}
				<div style={{ width: '300px', maxHeight: '500px', overflowY: 'auto', border: '1px solid #ccc', background: '#fff' }}>
					{fishList.map((fish) => (
						<div
							key={fish.id}
							onClick={() => setSelectedFish(fish)}
							style={{
								padding: '8px',
								cursor: 'pointer',
								backgroundColor: selectedFish?.id === fish.id ? '#e2e8f0' : 'transparent',
								borderBottom: '1px solid #eee',
							}}
						>
							[{fish.id}] {fish.ja} ({fish.maxSkill})
						</div>
					))}
				</div>

				{/* 右側：編集フォーム */}
				<div style={{ flex: 1, background: '#fff', padding: '15px', border: '1px solid #ccc' }}>
					{selectedFish ? (
						<div style={{ display: 'grid', gap: '10px' }}>
							<h3>ID: {selectedFish.id} の編集</h3>

							<label>
								日本語名:
								<input
									type="text"
									value={selectedFish.ja}
									onChange={(e) => handleFieldChange('ja', e.target.value)}
									style={{ width: '100%', padding: '4px' }}
								/>
							</label>

							<label>
								英語名:
								<input
									type="text"
									value={selectedFish.en}
									onChange={(e) => handleFieldChange('en', e.target.value)}
									style={{ width: '100%', padding: '4px' }}
								/>
							</label>

							<label>
								上限スキル:
								<input
									type="number"
									value={selectedFish.maxSkill}
									onChange={(e) => handleFieldChange('maxSkill', Number(e.target.value))}
									style={{ width: '100%', padding: '4px' }}
								/>
							</label>

							<label>
								サイズ:
								<select
									value={selectedFish.sizeType}
									onChange={(e) => handleFieldChange('sizeType', e.target.value as 'small' | 'large')}
									style={{ width: '100%', padding: '4px' }}
								>
									<option value="small">小型</option>
									<option value="large">大型</option>
								</select>
							</label>

							<div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
								<label>
									<input
										type="checkbox"
										checked={selectedFish.harakiri}
										onChange={(e) => handleFieldChange('harakiri', e.target.checked)}
									/>
									ハラキリ対象
								</label>
								<label>
									<input
										type="checkbox"
										checked={selectedFish.ebisu}
										onChange={(e) => handleFieldChange('ebisu', e.target.checked)}
									/>
									恵比寿対象
								</label>
							</div>

							<label>
								備考:
								<textarea
									value={selectedFish.notes || ''}
									onChange={(e) => handleFieldChange('notes', e.target.value)}
									style={{ width: '100%', height: '60px', padding: '4px' }}
								/>
							</label>
						</div>
					) : (
						<p>左側のリストから編集する魚を選択してください。</p>
					)}
				</div>
			</div>
		</div>
	);
};