/**
 * ============================================================================
 * [FilePath] src/components/dev/masterEditor/tabs/BaitReorderTab.tsx
 * [Role] 餌の並び順変更用ドラッグ＆ドロップタブ
 * 
 * [概要]
 * - ドラッグ＆ドロップ操作による餌マスターの並び順編集タブ
 * - hello-pangea/dnd の位置スタイル補正を除き、Tailwindクラスへ完全移行
 * ============================================================================
 */

import React from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import type { DropResult } from '@hello-pangea/dnd';
import type { BaitMaster } from '@/types/fishtracker';
import { EDITOR_STYLES } from '@/styles/components/editorStyles';

interface BaitReorderTabProps {
	baitList?: BaitMaster[];
	onBaitListChange: (newList: BaitMaster[]) => void;
}

export const BaitReorderTab: React.FC<BaitReorderTabProps> = ({
	baitList = [],
	onBaitListChange,
}) => {
	const handleOnDragEnd = (result: DropResult) => {
		if (!result.destination) return;

		const items = Array.from(baitList);
		const [reorderedItem] = items.splice(result.source.index, 1);
		items.splice(result.destination.index, 0, reorderedItem);

		onBaitListChange(items);
	};

	return (
		<div className={EDITOR_STYLES.baitReorder.container}>
			<h3 className={EDITOR_STYLES.baitReorder.title}>
				🪱 餌の並び順変更 (ドラッグ＆ドロップ)
			</h3>
			<DragDropContext onDragEnd={handleOnDragEnd}>
				<Droppable droppableId="baits">
					{(provided) => (
						<div
							{...provided.droppableProps}
							ref={provided.innerRef}
							className={EDITOR_STYLES.baitReorder.list}
						>
							{baitList.map((bait, index) => (
								<Draggable key={String(bait.id)} draggableId={String(bait.id)} index={index}>
									{(provided, snapshot) => (
										<div
											ref={provided.innerRef}
											{...provided.draggableProps}
											{...provided.dragHandleProps}
											style={provided.draggableProps.style}
											className={`${EDITOR_STYLES.baitReorder.itemBase} ${snapshot.isDragging
													? EDITOR_STYLES.baitReorder.itemDragging
													: EDITOR_STYLES.baitReorder.itemNormal
												}`}
										>
											<div className={EDITOR_STYLES.baitReorder.itemMetaGroup}>
												<span className={EDITOR_STYLES.baitReorder.itemIndex}>
													#{index + 1}
												</span>
												<span className={EDITOR_STYLES.baitReorder.itemName}>
													{bait.ja || bait.en}
												</span>
												<span className={EDITOR_STYLES.baitReorder.itemId}>
													(ID: {bait.id})
												</span>
											</div>
											<span className={EDITOR_STYLES.baitReorder.dragHint}>
												⋮⋮ ドラッグで移動
											</span>
										</div>
									)}
								</Draggable>
							))}
							{provided.placeholder}
						</div>
					)}
				</Droppable>
			</DragDropContext>
		</div>
	);
};