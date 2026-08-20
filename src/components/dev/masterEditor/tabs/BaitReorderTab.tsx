/**
 * ============================================================================
 * [FilePath] src/components/dev/masterEditor/tabs/BaitReorderTab.tsx
 * [Role] 餌の並び順変更用ドラッグ＆ドロップタブ
 * ============================================================================
 */

import React from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import type { DropResult } from '@hello-pangea/dnd';
import type { BaitMaster } from '@/types/fish';

interface BaitReorderTabProps {
	baitList: BaitMaster[];
	onBaitListChange: (newList: BaitMaster[]) => void;
}

export const BaitReorderTab: React.FC<BaitReorderTabProps> = ({
	baitList,
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
		<div style={{ padding: '10px', width: '100%', overflowY: 'auto', backgroundColor: '#f7fafc', borderRadius: '4px' }}>
			<h3 style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#2d3748' }}>🪱 餌の並び順変更 (ドラッグ＆ドロップ)</h3>
			<DragDropContext onDragEnd={handleOnDragEnd}>
				<Droppable droppableId="baits">
					{(provided) => (
						<div
							{...provided.droppableProps}
							ref={provided.innerRef}
							style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}
						>
							{baitList.map((bait, index) => (
								<Draggable key={String(bait.id)} draggableId={String(bait.id)} index={index}>
									{(provided, snapshot) => (
										<div
											ref={provided.innerRef}
											{...provided.draggableProps}
											{...provided.dragHandleProps}
											style={{
												padding: '10px 14px',
												backgroundColor: snapshot.isDragging ? '#e2e8f0' : '#ffffff',
												border: '1px solid #cbd5e0',
												borderRadius: '4px',
												display: 'flex',
												alignItems: 'center',
												justifyContent: 'space-between',
												cursor: 'grab',
												userSelect: 'none',
												boxShadow: snapshot.isDragging ? '0 4px 8px rgba(0,0,0,0.1)' : 'none',
												...provided.draggableProps.style,
											}}
										>
											<div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
												<span style={{ color: '#a0aec0', fontSize: '12px', width: '30px', fontWeight: 'bold' }}>
													#{index + 1}
												</span>
												<span style={{ fontWeight: 'bold', fontSize: '13px', color: '#2d3748' }}>
													{bait.ja || bait.en}
												</span>
												<span style={{ fontSize: '11px', color: '#a0aec0' }}>
													(ID: {bait.id})
												</span>
											</div>
											<span style={{ color: '#a0aec0', fontSize: '12px' }}>⋮⋮ ドラッグで移動</span>
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