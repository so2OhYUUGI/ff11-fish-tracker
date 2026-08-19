import React, { useState } from 'react';
import type { ZoneMaster } from '@/types/fish';
import { RelationEditor } from '../RelationEditor';
import type { EditableFish, EntityItem } from '../types';

type Props = {
	fishList: EditableFish[];
	zoneList: ZoneMaster[];
	onFishChange: (updatedFish: EditableFish) => void;
};

export const FishEditTab: React.FC<Props> = ({ fishList, zoneList, onFishChange }) => {
	const [selectedFish, setSelectedFish] = useState<EditableFish | null>(null);

	const handleFieldChange = (field: keyof EditableFish, value: any) => {
		if (!selectedFish) return;
		const updated = { ...selectedFish, [field]: value };
		setSelectedFish(updated);
		onFishChange(updated);
	};

	const handleZoneToggle = (zoneId: number | string) => {
		if (!selectedFish) return;
		const currentZoneIds = selectedFish.zoneIds || [];
		const targetId = Number(zoneId);
		const updatedZoneIds = currentZoneIds.includes(targetId)
			? currentZoneIds.filter((id) => id !== targetId)
			: [...currentZoneIds, targetId];
		handleFieldChange('zoneIds', updatedZoneIds);
	};

	const zoneEntityItems: EntityItem[] = zoneList.map((z) => ({
		id: z.id,
		label: z.ja,
		subLabel: z.en,
	}));

	return (
		<>
		<div
        style= {{
		width: '260px',
			overflowY: 'auto',
				border: '1px solid #ccc',
					background: '#fff',
						flexShrink: 0,
        }
}
      >
{
	fishList.map((fish) => (
		<div
            key= { fish.id }
            onClick = {() => setSelectedFish(fish)}
style = {{
	padding: '8px',
		cursor: 'pointer',
			fontSize: '13px',
				backgroundColor: selectedFish?.id === fish.id ? '#e2e8f0' : 'transparent',
					borderBottom: '1px solid #eee',
            }}
          >
	[{ fish.id }] { fish.ja } ({ fish.maxSkill })
		</div>
        ))}
</div>

	< div style = {{ flex: 1, background: '#fff', padding: '15px', border: '1px solid #ccc', overflowY: 'auto' }}>
	{
		selectedFish?(
          <div style = {{ display: 'grid', gap: '10px', fontSize: '13px' }} >
		<h3 style={ { margin: '0 0 5px 0' } }> 魚ID: { selectedFish.id } の編集 </h3>
			<label>
日本語名:
<input
                type="text"
value = { selectedFish.ja }
onChange = {(e) => handleFieldChange('ja', e.target.value)}
style = {{ width: '100%', padding: '4px', marginTop: '2px' }}
              />
	</label>
	<label>
英語名:
<input
                type="text"
value = { selectedFish.en }
onChange = {(e) => handleFieldChange('en', e.target.value)}
style = {{ width: '100%', padding: '4px', marginTop: '2px' }}
              />
	</label>

	< RelationEditor
mode = "multiple"
title = "釣れるエリア（ゾーン）"
targets = { zoneEntityItems }
selectedTargetIds = { selectedFish.zoneIds || [] }
onToggle = { handleZoneToggle }
	/>

	<label>
	備考:
<textarea
                value={ selectedFish.notes || '' }
onChange = {(e) => handleFieldChange('notes', e.target.value)}
style = {{ width: '100%', height: '40px', padding: '4px', marginTop: '2px' }}
              />
	</label>
	</div>
        ) : (
	<p style= {{ color: '#666', margin: 0 }}> 左側のリストから魚を選択してください。</p>
        )}
</div>
	</>
  );
};