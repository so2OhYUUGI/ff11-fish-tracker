/**
 * ============================================================================
 * [FilePath] src/components/dev/masterEditor/tabs/fishEdit/components/FishBasicFields.tsx
 * [Role] 魚の基本パラメータ（名称・スキル限界・サイズ区分・水質区分）編集フォーム
 * [Specifications]
 *   - 名称（日/英）、限界スキルの数値入力
 *   - サイズ区分・水質区分のセグメントボタン選択機能
 * [Notes]
 *   - 不必要な再レンダリングを防ぐため React.memo でラップしています。
 * ============================================================================
 */

import React from 'react';
import type { EditableFish } from '../types';
import { SIZE_OPTIONS, WATER_OPTIONS } from '../types';
import { EDITOR_STYLES } from '@/styles/components/editorStyles';

type FishBasicFieldsProps = {
	fish: EditableFish;
	onFieldChange: <K extends keyof EditableFish>(field: K, value: EditableFish[K]) => void;
};

export const FishBasicFields: React.FC<FishBasicFieldsProps> = React.memo(({ fish, onFieldChange }) => (
	<>
	<div className= { EDITOR_STYLES.fishEdit.basicFieldsRow } >
	<label>
	日本語名:
	<input
          type="text"
          value = { fish.ja }
          onChange = {(e) => onFieldChange('ja', e.target.value)}
className = { EDITOR_STYLES.fishEdit.inputField }
	/>
	</label>
	<label>
英語名:
<input
          type="text"
value = { fish.en }
onChange = {(e) => onFieldChange('en', e.target.value)}
className = { EDITOR_STYLES.fishEdit.inputField }
	/>
	</label>
	<label>
限界スキル:
<input
          type="number"
min = "0"
value = { fish.maxSkill ?? '' }
onChange = {(e) => {
	const val = e.target.value === '' ? 0 : Number(e.target.value);
	onFieldChange('maxSkill', val);
}}
className = { EDITOR_STYLES.fishEdit.inputField }
	/>
	</label>
	</div>

	< div className = { EDITOR_STYLES.fishEdit.segmentGroup } >
		<div>
		<div className={ EDITOR_STYLES.fishEdit.segmentLabel }> サイズ区分 </div>
			< div className = { EDITOR_STYLES.fishEdit.segmentButtonsRow } >
			{
				SIZE_OPTIONS.map((item) => {
					const isSelected = (fish.sizeType || 'unknown') === item.value;
					return (
						<button
                key= { item.value }
					type = "button"
					onClick = {() => onFieldChange('sizeType', item.value)
				}
                className = {`${EDITOR_STYLES.fishEdit.segmentBtnBase} ${isSelected ? EDITOR_STYLES.fishEdit.segmentBtnActive : EDITOR_STYLES.fishEdit.segmentBtnInactive
						}`}
				>
				{ item.label }
				</button>
            );
          })}
</div>
	</div>

	< div >
	<div className={ EDITOR_STYLES.fishEdit.segmentLabel }> 水質区分 </div>
		< div className = { EDITOR_STYLES.fishEdit.segmentButtonsRow } >
		{
			WATER_OPTIONS.map((item) => {
				const isSelected = (fish.waterType || 'unknown') === item.value;
				return (
					<button
                key= { item.value }
				type = "button"
				onClick = {() => onFieldChange('waterType', item.value)
			}
                className = {`${EDITOR_STYLES.fishEdit.segmentBtnBase} ${isSelected ? EDITOR_STYLES.fishEdit.segmentBtnActive : EDITOR_STYLES.fishEdit.segmentBtnInactive
					}`}
			>
			{ item.label }
			</button>
            );
          })}
</div>
	</div>
	</div>
	</>
));

FishBasicFields.displayName = 'FishBasicFields';