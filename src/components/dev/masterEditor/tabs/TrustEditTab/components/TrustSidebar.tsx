/**
 * ============================================================================
 * [FilePath] src/components/dev/masterEditor/tabs/TrustEditTab/components/TrustSidebar.tsx
 * [Role] フェイスマスター編集用 サイドバー（検索・ソート・一覧選択）コンポーネント
 * ============================================================================
 */

import React from 'react';
import type { TrustMaster } from '@/types/trusttracker';
import { EDITOR_STYLES } from '@/styles/components/editorStyles';
import type { TrustSortKey, SortOrder } from '../TrustEditTab';

type TrustSidebarProps = {
	filteredTrustList: TrustMaster[];
	selectedTrustId: number | undefined;
	searchQuery: string;
	onSearchChange: (query: string) => void;
	onSelectTrust: (trust: TrustMaster) => void;
	sortKey: TrustSortKey;
	sortOrder: SortOrder;
	onSortChange: (key: TrustSortKey) => void;
};

const SORT_OPTIONS: { key: TrustSortKey; label: string }[] = [
	{ key: 'id', label: 'id' },
	{ key: 'icon_id', label: 'icon' },
	{ key: 'ja', label: 'jp' },
	{ key: 'en', label: 'en' },
];

export const TrustSidebar: React.FC<TrustSidebarProps> = ({
	filteredTrustList,
	selectedTrustId,
	searchQuery,
	onSearchChange,
	onSelectTrust,
	sortKey,
	sortOrder,
	onSortChange,
}) => {
	return (
		<div className={EDITOR_STYLES.fishEdit.sidebar}>
			{/* 検索・ソートヘッダー領域 */}
			<div className={EDITOR_STYLES.fishEdit.searchHeader}>
				<div className="relative flex items-center mb-1.5">
					<input
						type="text"
						placeholder="フェイス名・ID・ジョブで検索..."
						value={searchQuery}
						onChange={(e) => onSearchChange(e.target.value)}
						className={EDITOR_STYLES.fishEdit.searchInput}
					/>
				</div>

				{/* ソートボタン群（コンパクト横一列） */}
				<div className="flex items-center gap-1 pb-1.5">
					<span className="text-[10px] text-slate-400 font-bold shrink-0">Sort:</span>
					<div className="grid grid-cols-4 gap-1 w-full">
						{SORT_OPTIONS.map((opt) => {
							const isActive = sortKey === opt.key;
							return (
								<button
									key={opt.key}
									type="button"
									onClick={() => onSortChange(opt.key)}
									className={`px-1 py-0.5 text-[10px] font-mono rounded border transition-colors flex items-center justify-center leading-none ${isActive
											? 'bg-blue-600 text-white border-blue-600 font-bold'
											: 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
										}`}
								>
									{opt.label}
									{isActive && (sortOrder === 'asc' ? '▲' : '▼')}
								</button>
							);
						})}
					</div>
				</div>

				<div className="flex justify-between items-center text-[11px] text-slate-500 font-medium px-0.5 pt-1 border-t border-slate-100">
					<span>検索結果</span>
					<span className={`${EDITOR_STYLES.fishEdit.badgeBase} ${EDITOR_STYLES.fishEdit.badgeActive}`}>
						{filteredTrustList.length} 件
					</span>
				</div>
			</div>

			{/* リスト領域 */}
			<div className={EDITOR_STYLES.fishEdit.listContainer}>
				{filteredTrustList.map((trust) => {
					const isSelected = trust.id === selectedTrustId;
					return (
						<button
							key={trust.id}
							type="button"
							onClick={() => onSelectTrust(trust)}
							className={`w-full text-left p-2.5 border-b border-slate-100 transition-all cursor-pointer flex flex-col gap-1 ${isSelected
									? 'bg-blue-50/80 border-l-4 border-l-blue-600 font-medium'
									: 'bg-white hover:bg-slate-50 border-l-4 border-l-transparent'
								}`}
						>
							<div className="flex items-center justify-between gap-1">
								<span className="font-bold text-xs text-slate-800 truncate">
									<span className="text-slate-400 font-mono text-[11px] mr-1">
										#{trust.id}
									</span>
									{trust.ja}
								</span>

								{trust.job && (
									<span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-mono shrink-0">
										{trust.job}
									</span>
								)}
							</div>

							<div className="flex items-center justify-between text-[10px] text-slate-400">
								<span className="truncate font-mono">
									{trust.en}
								</span>

								<div className="flex items-center gap-1 shrink-0">
									<span className="text-[9px] text-slate-400 font-mono">
										Icon:{trust.icon_id}
									</span>
									{trust.isLimited && (
										<span className="px-1 rounded bg-amber-100 text-amber-700 font-bold text-[9px]">
											限定
										</span>
									)}
									{trust.combatType && (
										<span className="text-slate-500">
											{trust.combatType}
										</span>
									)}
								</div>
							</div>
						</button>
					);
				})}

				{filteredTrustList.length === 0 && (
					<div className={EDITOR_STYLES.relation.emptyText}>
						対象のフェイスが見つかりません
					</div>
				)}
			</div>
		</div>
	);
};