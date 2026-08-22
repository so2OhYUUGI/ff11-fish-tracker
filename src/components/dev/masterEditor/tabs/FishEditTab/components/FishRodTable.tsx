/**
 * ============================================================================
 * [FilePath] src/components/dev/masterEditor/tabs/fishEdit/components/FishRodTable.tsx
 * [Role] 選択中の魚に対する各竿の相性・破損確率・備考を設定するテーブル
 * [Specifications]
 *   - 全竿マスター（RODS）の一覧表示
 *   - ボタンクリックによる状態切替（可能/不可/不明、あり/なし/不明）
 *   - 個別備考テキスト入力欄
 * [Notes]
 *   - @/data/rods に定義されたマスターデータを使用します。
 *   - 不必要な再レンダリングを防ぐため React.memo でラップしています。
 * ============================================================================
 */

import React from 'react';
import type { FishRodRelation } from '@/types/fish';
import { RODS } from '@/data/rods';
import { EDITOR_STYLES } from '@/styles/components/editorStyles';

type FishRodTableProps = {
	fishId: number;
	fishRodRelations: FishRodRelation[];
	onStatusToggle: (rodId: number, field: 'catchability' | 'rodBreak' | 'lineBreak') => void;
	onNotesChange: (rodId: number, notesValue: string) => void;
};

export const FishRodTable: React.FC<FishRodTableProps> = React.memo(
	({ fishId, fishRodRelations, onStatusToggle, onNotesChange }) => {
		const getRodRelation = (rodId: number) =>
			fishRodRelations.find((rel) => rel.fishId === fishId && rel.rodId === rodId);

		return (
			<div>
			<div className= { EDITOR_STYLES.fishEdit.rodSectionTitle } >
			竿の相性・反応設定(全 { RODS.length } 種類)
			</div>
			< table className = { EDITOR_STYLES.fishEdit.rodTable } >
				<thead>
				<tr>
				<th className={ EDITOR_STYLES.fishEdit.rodThName }> 竿名 </th>
					< th className = { EDITOR_STYLES.fishEdit.rodThStatus } > 釣り可能 </th>
						< th className = { EDITOR_STYLES.fishEdit.rodThStatus } > 竿折れ </th>
							< th className = { EDITOR_STYLES.fishEdit.rodThStatus } > 糸切れ </th>
								< th className = { EDITOR_STYLES.fishEdit.rodThNotes } > 備考 </th>
									</tr>
									</thead>
									<tbody>
		{
			RODS.map((rod) => {
				const rodRel = getRodRelation(rod.id);
				const catchability = rodRel?.catchability || 'unknown';
				const rodBreak = rodRel?.rodBreak || 'unknown';
				const lineBreak = rodRel?.lineBreak || 'unknown';
				const notes = rodRel?.notes || '';

				const catchClass =
					catchability === 'possible'
						? 'bg-emerald-100 text-emerald-800 border-emerald-500'
						: catchability === 'impossible'
							? 'bg-red-100 text-red-800 border-red-500'
							: 'bg-slate-100 text-slate-500 border-slate-300';

				const rodBreakClass =
					rodBreak === 'yes'
						? 'bg-red-100 text-red-800 border-red-500'
						: rodBreak === 'no'
							? 'bg-blue-100 text-blue-800 border-blue-500'
							: 'bg-slate-100 text-slate-500 border-slate-300';

				const lineBreakClass =
					lineBreak === 'yes'
						? 'bg-red-100 text-red-800 border-red-500'
						: lineBreak === 'no'
							? 'bg-blue-100 text-blue-800 border-blue-500'
							: 'bg-slate-100 text-slate-500 border-slate-300';

				return (
					<tr key= { rod.id } >
					<td className={ EDITOR_STYLES.fishEdit.rodTd }>
						{ rod.ja } < span className = { EDITOR_STYLES.fishEdit.rodSubText } > ({ rod.en }) </span>
							</td>
							< td className = { EDITOR_STYLES.fishEdit.rodTdCenter } >
								<button
                      type="button"
				onClick = {() => onStatusToggle(rod.id, 'catchability')}
className = {`${EDITOR_STYLES.fishEdit.rodStatusBtnBase} ${catchClass}`}
                    >
	{ catchability === 'possible' ? '可能' : catchability === 'impossible' ? '不可' : '不明'}
</button>
	</td>
	< td className = { EDITOR_STYLES.fishEdit.rodTdCenter } >
		<button
                      type="button"
onClick = {() => onStatusToggle(rod.id, 'rodBreak')}
className = {`${EDITOR_STYLES.fishEdit.rodStatusBtnBase} ${rodBreakClass}`}
                    >
	{ rodBreak === 'yes' ? 'あり' : rodBreak === 'no' ? 'なし' : '不明'}
</button>
	</td>
	< td className = { EDITOR_STYLES.fishEdit.rodTdCenter } >
		<button
                      type="button"
onClick = {() => onStatusToggle(rod.id, 'lineBreak')}
className = {`${EDITOR_STYLES.fishEdit.rodStatusBtnBase} ${lineBreakClass}`}
                    >
	{ lineBreak === 'yes' ? 'あり' : lineBreak === 'no' ? 'なし' : '不明'}
</button>
	</td>
	< td className = { EDITOR_STYLES.fishEdit.rodTd } >
		<input
                      type="text"
value = { notes }
placeholder = "備考を入力"
onChange = {(e) => onNotesChange(rod.id, e.target.value)}
className = { EDITOR_STYLES.fishEdit.rodNotesInput }
	/>
	</td>
	</tr>
              );
            })}
</tbody>
	</table>
	</div>
    );
  }
);

FishRodTable.displayName = 'FishRodTable';