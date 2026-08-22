/**
 * ============================================================================
 * [FilePath] src/components/dev/masterEditor/RelationEditor.tsx
 * [Role] 汎用マスターデータリレーション編集コンポーネント
 * 
 * [概要]
 * - 魚・エリア・餌などの1対1、1対多リレーション編集用コンポーネント
 * - インラインスタイルを徹底的に排除し EDITOR_STYLES.relation へ集約
 * ============================================================================
 */

import React, { useState } from 'react';
import type { EntityItem } from './types';
import { EDITOR_STYLES } from '@/styles/components/editorStyles';

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

	const isSearchActive = Boolean(search.trim());

	return (
		<div className={EDITOR_STYLES.relation.container}>
			{/* ヘッダー領域 */}
			<div className={EDITOR_STYLES.relation.header}>
				<span className={EDITOR_STYLES.relation.title}>
					{title}
					{props.mode === 'multiple' && ` (${props.selectedTargetIds.length}件選択中)`}
				</span>

				<div className={EDITOR_STYLES.relation.controls}>
					{/* 状態フィルターボタン (検索窓が空の時のみ切り替え有効) */}
					<div className={EDITOR_STYLES.relation.filterGroup}>
						{[
							{ key: 'all', label: 'すべて' },
							{ key: 'selected', label: '選択済み' },
							{ key: 'unselected', label: '未選択' },
						].map((btn) => {
							const isActive = filterMode === btn.key && !isSearchActive;
							return (
								<button
									key={btn.key}
									type="button"
									disabled={isSearchActive}
									onClick={() => setFilterMode(btn.key as FilterMode)}
									className={`${EDITOR_STYLES.relation.filterBtnBase} ${isActive
											? EDITOR_STYLES.relation.filterBtnActive
											: EDITOR_STYLES.relation.filterBtnInactive
										}`}
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
						className={EDITOR_STYLES.relation.searchInput}
					/>
				</div>
			</div>

			{/* リスト表示エリア */}
			<div className={EDITOR_STYLES.relation.listContainer}>
				{props.mode === 'single' && (
					<>
						<label className={EDITOR_STYLES.relation.unsetLabel}>
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
								className={EDITOR_STYLES.relation.itemLabel}
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
								className={EDITOR_STYLES.relation.itemLabel}
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
					<div className={EDITOR_STYLES.relation.emptyText}>
						該当する項目がありません
					</div>
				)}
			</div>
		</div>
	);
};