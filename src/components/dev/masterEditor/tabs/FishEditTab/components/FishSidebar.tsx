/**
 * ============================================================================
 * [FilePath] src/components/dev/masterEditor/tabs/fishEdit/components/FishSidebar.tsx
 * [Role] 魚マスター一覧表示およびインクリメンタル検索用サイドバーコンポーネント
 * [Specifications]
 *   - 検索ワードによる魚名（日本語/英語）およびIDのフィルタ結果を表示
 *   - 生息ゾーン件数のバッジ表示
 * [Notes]
 *   - 不必要な再レンダリングを防ぐため React.memo でラップしています。
 * ============================================================================
 */

import React from 'react';
import type { EditableFish } from '../types';
import { EDITOR_STYLES } from '@/styles/components/editorStyles';

type FishSidebarProps = {
	filteredFishList: EditableFish[];
	selectedFishId?: number;
	searchQuery: string;
	onSearchChange: (q: string) => void;
	onSelectFish: (fish: EditableFish) => void;
};

export const FishSidebar: React.FC<FishSidebarProps> = React.memo(
	({ filteredFishList, selectedFishId, searchQuery, onSearchChange, onSelectFish }) => {
		return (
			<div className= { EDITOR_STYLES.fishEdit.sidebar } >
			<div className={ EDITOR_STYLES.fishEdit.searchHeader }>
				<input
            type="text"
		value = { searchQuery }
		onChange = {(e) => onSearchChange(e.target.value)}
placeholder = "名前 / ID で検索..."
className = { EDITOR_STYLES.fishEdit.searchInput }
	/>
	</div>
	< div className = { EDITOR_STYLES.fishEdit.listContainer } >
	{
		filteredFishList.map((fish) => {
			const zoneCount = fish.zoneIds?.length || 0;
			const isSelected = selectedFishId === fish.id;

			return (
				<div
                key= { fish.id }
			onClick = {() => onSelectFish(fish)
		}
                className = {`${EDITOR_STYLES.fishEdit.listItemBase} ${isSelected
					? EDITOR_STYLES.fishEdit.listItemActive
					: EDITOR_STYLES.fishEdit.listItemInactive
				}`}
		>
		<span>
		[{ fish.id }] { fish.ja }
</span>
	< span
className = {`${EDITOR_STYLES.fishEdit.badgeBase} ${zoneCount > 0
		? EDITOR_STYLES.fishEdit.badgeActive
		: EDITOR_STYLES.fishEdit.badgeInactive
	}`}
                >
	{ zoneCount }件
		</span>
		</div>
            );
          })}
{
	filteredFishList.length === 0 && (
		<div className={ EDITOR_STYLES.fishEdit.emptyList }>
			該当する魚が見つかりません
			</div>
          )
}
</div>
	</div>
    );
  }
);

FishSidebar.displayName = 'FishSidebar';