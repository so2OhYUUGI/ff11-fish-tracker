/**
 * ============================================================================
 * [FilePath] src/components/dev/masterEditor/RelationEditor.tsx
 * [Role] 汎用マスターデータリレーション編集コンポーネント
 * ============================================================================
 */

import React, { useState } from 'react';
import type { EntityItem } from './types';

type SingleRelationProps = {
	mode: 'single';
	selectedTargetId?: number | string;
	onSelect: (targetId: number | string | undefined) => void;
};

type MultipleRelationProps = {
	mode: 'multiple';
	selectedTargetIds: (number | string)[];
	onToggle: (targetId: number | string) => void;
};

type RelationEditorProps = {
	title: string;
	targets: EntityItem[];
	placeholder?: string;
} & (SingleRelationProps | MultipleRelationProps);

export const RelationEditor: React.FC<RelationEditorProps> = (props) => {
	const { title, targets, placeholder = '検索...' } = props;
	const [search, setSearch] = useState('');

	const filteredTargets = targets.filter(
		(item) =>
			item.label.toLowerCase().includes(search.toLowerCase()) ||
			(item.subLabel && item.subLabel.toLowerCase().includes(search.toLowerCase())) ||
			String(item.id).includes(search)
	);

	return (
		<div style= {{ display: 'flex', flexDirection: 'column', gap: '6px' }
}>
	<div style={ { display: 'flex', justifyContent: 'space-between', alignItems: 'center' } }>
		<span style={ { fontWeight: 'bold', fontSize: '13px' } }>
			{ title }
{ props.mode === 'multiple' && ` (${props.selectedTargetIds.length}件選択中)` }
</span>
	< input
type = "text"
placeholder = { placeholder }
value = { search }
onChange = {(e) => setSearch(e.target.value)}
style = {{ padding: '2px 6px', fontSize: '12px', width: '160px' }}
        />
	</div>

	< div
style = {{
	height: '160px',
		overflowY: 'auto',
			border: '1px solid #ccc',
				padding: '8px',
					background: '#f9f9f9',
						display: 'grid',
							gridTemplateColumns: 'repeat(2, 1fr)',
								gap: '4px 10px',
        }}
      >
{
	props.mode === 'single' && (
		<>
		<label
              style={
	{
		fontSize: '12px',
			display: 'flex',
				alignItems: 'center',
					gap: '4px',
						cursor: 'pointer',
							color: '#888',
								gridColumn: 'span 2',
              }
}
            >
	<input
                type="radio"
name = "single-relation"
checked = { props.selectedTargetId === undefined }
onChange = {() => props.onSelect(undefined)}
              />
              （未設定）
</label>
{
	filteredTargets.map((item) => (
		<label
                key= { item.id }
                style = {{
		fontSize: '12px',
		display: 'flex',
		alignItems: 'center',
		gap: '4px',
		cursor: 'pointer',
	}}
              >
	<input
                  type="radio"
name = "single-relation"
checked = { props.selectedTargetId === item.id }
onChange = {() => props.onSelect(item.id)}
                />
[{ item.id }] { item.label }
</label>
            ))}
</>
        )}

{
	props.mode === 'multiple' &&
	filteredTargets.map((item) => {
		const isChecked = props.selectedTargetIds.includes(item.id);
		return (
			<label
                key= { item.id }
		style = {{
			fontSize: '12px',
				display: 'flex',
					alignItems: 'center',
						gap: '4px',
							cursor: 'pointer',
                }
	}
              >
		<input
                  type="checkbox"
                  checked = { isChecked }
                  onChange = {() => props.onToggle(item.id)}
                />
[{ item.id }] { item.label }
</label>
            );
          })}
</div>
	</div>
  );
};