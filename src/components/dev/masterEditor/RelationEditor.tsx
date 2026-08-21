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

type FilterMode = 'all' | 'selected' | 'unselected';

export const RelationEditor: React.FC<RelationEditorProps> = (props) => {
	const { title, targets, placeholder = '検索...' } = props;
	const [search, setSearch] = useState('');
	const [filterMode, setFilterMode] = useState<FilterMode>('all');

	const filteredTargets = targets.filter((item) => {
		const query = search.trim().toLowerCase();

		// 選択状態の判定
		const isSelected =
			props.mode === 'single'
				? props.selectedTargetId === item.id
				: props.selectedTargetIds.includes(item.id);

		// 1. 検索窓にテキストが入力されている場合（キーワード一致を最優先）
		if (query) {
			const matchLabel = item.label.toLowerCase().includes(query);
			const matchSub = item.subLabel ? item.subLabel.toLowerCase().includes(query) : false;
			const matchId = String(item.id).includes(query);
			return matchLabel || matchSub || matchId;
		}

		// 2. 検索窓が空の場合（状態フィルターを適用）
		if (filterMode === 'selected') return isSelected;
		if (filterMode === 'unselected') return !isSelected;
		return true; // 'all'
	});

	return (
		<div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
			{/* ヘッダー領域 */}
			<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
				<span style={{ fontWeight: 'bold', fontSize: '13px' }}>
					{title}
					{props.mode === 'multiple' && ` (${props.selectedTargetIds.length}件選択中)`}
				</span>

				<div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
					{/* 状態フィルターボタン (検索窓が空の時のみ切り替え有効) */}
					<div style={{ display: 'flex', gap: '2px' }}>
						{[
							{ key: 'all', label: 'すべて' },
							{ key: 'selected', label: '選択済み' },
							{ key: 'unselected', label: '未選択' },
						].map((btn) => {
							const isActive = filterMode === btn.key && !search.trim();
							return (
								<button
									key={btn.key}
									type="button"
									disabled={Boolean(search.trim())}
									onClick={() => setFilterMode(btn.key as FilterMode)}
									style={{
										padding: '2px 6px',
										fontSize: '10px',
										borderRadius: '3px',
										border: isActive ? '1px solid #3182ce' : '1px solid #cbd5e0',
										backgroundColor: isActive ? '#ebf8ff' : '#f7fafc',
										color: isActive ? '#2b6cb0' : '#4a5568',
										fontWeight: isActive ? 'bold' : 'normal',
										cursor: search.trim() ? 'not-allowed' : 'pointer',
										opacity: search.trim() ? 0.5 : 1,
									}}
								>
									{btn.label}
								</button>
							);
						})}
					</div>

					{/* 検索窓 */}
					<input
						type="text"
						placeholder={placeholder}
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						style={{ padding: '2px 6px', fontSize: '12px', width: '140px' }}
					/>
				</div>
			</div>

			{/* リスト表示エリア */}
			<div
				style={{
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
				{props.mode === 'single' && (
					<>
						<label
							style={{
								fontSize: '12px',
								display: 'flex',
								alignItems: 'center',
								gap: '4px',
								cursor: 'pointer',
								color: '#888',
								gridColumn: 'span 2',
							}}
						>
							<input
								type="radio"
								name="single-relation"
								checked={props.selectedTargetId === undefined}
								onChange={() => props.onSelect(undefined)}
							/>
							（未設定）
						</label>
						{filteredTargets.map((item) => (
							<label
								key={item.id}
								style={{
									fontSize: '12px',
									display: 'flex',
									alignItems: 'center',
									gap: '4px',
									cursor: 'pointer',
								}}
							>
								<input
									type="radio"
									name="single-relation"
									checked={props.selectedTargetId === item.id}
									onChange={() => props.onSelect(item.id)}
								/>
								[{item.id}] {item.label}
							</label>
						))}
					</>
				)}

				{props.mode === 'multiple' &&
					filteredTargets.map((item) => {
						const isChecked = props.selectedTargetIds.includes(item.id);
						return (
							<label
								key={item.id}
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
									onChange={() => props.onToggle(item.id)}
								/>
								[{item.id}] {item.label}
							</label>
						);
					})}

				{filteredTargets.length === 0 && (
					<div
						style={{
							gridColumn: 'span 2',
							padding: '12px',
							textAlign: 'center',
							color: '#888',
							fontSize: '12px',
						}}
					>
						該当する項目がありません
					</div>
				)}
			</div>
		</div>
	);
};