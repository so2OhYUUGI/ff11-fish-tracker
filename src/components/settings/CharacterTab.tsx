import React, { useState } from 'react';
import { UserPlus, Edit2, Trash2, Check, X, User } from 'lucide-react';
import type { CharacterProgress } from '@/types/fish';
import { SETTINGS_STYLES } from '@/styles/components/settingsStyles';

type CharacterTabProps = {
	characters: CharacterProgress[];
	activeCharacterId: string;
	onSelectCharacter: (id: string) => void;
	onAddCharacter: (name: string) => void;
	onRenameCharacter: (id: string, newName: string) => void;
	onDeleteCharacter: (id: string) => void;
};

export const CharacterTab: React.FC<CharacterTabProps> = ({
	characters,
	activeCharacterId,
	onSelectCharacter,
	onAddCharacter,
	onRenameCharacter,
	onDeleteCharacter,
}) => {
	const [editingId, setEditingId] = useState<string | null>(null);
	const [editingName, setEditingName] = useState('');
	const [newCharName, setNewCharName] = useState('');
	const [isAdding, setIsAdding] = useState(false);

	const styles = SETTINGS_STYLES.characterTab;

	const handleAddCharacter = (e: React.FormEvent) => {
		e.preventDefault();
		if (!newCharName.trim()) return;
		onAddCharacter(newCharName.trim());
		setNewCharName('');
		setIsAdding(false);
	};

	const startEditing = (char: CharacterProgress) => {
		setEditingId(char.id);
		setEditingName(char.name);
	};

	const handleSaveRename = (id: string) => {
		if (editingName.trim()) {
			onRenameCharacter(id, editingName.trim());
		}
		setEditingId(null);
	};

	return (
		<div className={styles.container}>
			<div className={styles.header}>
				<div>
					<h3 className={styles.title}>キャラクター一覧</h3>
					<p className={styles.subtitle}>操作対象のキャラクター切り替え・編集が行えます。</p>
				</div>
				{!isAdding && (
					<button
						onClick={() => setIsAdding(true)}
						className={styles.addButton}
					>
						<UserPlus className="w-3.5 h-3.5" />
						新規追加
					</button>
				)}
			</div>

			{isAdding && (
				<form onSubmit={handleAddCharacter} className={styles.addForm}>
					<input
						type="text"
						value={newCharName}
						onChange={(e) => setNewCharName(e.target.value)}
						placeholder="キャラクター名"
						autoFocus
						className={styles.addInput}
					/>
					<button
						type="submit"
						disabled={!newCharName.trim()}
						className={styles.submitButton}
					>
						追加
					</button>
					<button
						type="button"
						onClick={() => {
							setIsAdding(false);
							setNewCharName('');
						}}
						className={styles.cancelButton}
					>
						キャンセル
					</button>
				</form>
			)}

			<div className={styles.listContainer}>
				{characters.map((char) => {
					const isActive = char.id === activeCharacterId;
					const isEditing = editingId === char.id;

					return (
						<div
							key={char.id}
							className={`${styles.itemBase} ${isActive ? styles.itemActive : styles.itemInactive
								}`}
						>
							{isEditing ? (
								<div className={styles.editWrapper}>
									<input
										type="text"
										value={editingName}
										onChange={(e) => setEditingName(e.target.value)}
										autoFocus
										onKeyDown={(e) => {
											if (e.key === 'Enter') handleSaveRename(char.id);
											if (e.key === 'Escape') setEditingId(null);
										}}
										className={styles.editInput}
									/>
									<button
										onClick={() => handleSaveRename(char.id)}
										className={styles.saveIconButton}
									>
										<Check className="w-4 h-4" />
									</button>
									<button
										onClick={() => setEditingId(null)}
										className={styles.cancelIconButton}
									>
										<X className="w-4 h-4" />
									</button>
								</div>
							) : (
								<>
									<div className={styles.charInfoWrapper}>
										<User
											className={`w-4 h-4 shrink-0 ${isActive ? styles.iconActive : styles.iconInactive
												}`}
										/>
										<button
											onClick={() => onSelectCharacter(char.id)}
											className={`${styles.nameButtonBase} ${isActive ? styles.nameButtonActive : styles.nameButtonInactive
												}`}
										>
											{char.name}
										</button>
										{isActive && (
											<span className={styles.activeBadge}>
												選択中
											</span>
										)}
									</div>

									<div className={styles.actionWrapper}>
										<button
											onClick={() => startEditing(char)}
											className={styles.editActionButton}
											title="名前を変更"
										>
											<Edit2 className="w-3.5 h-3.5" />
										</button>
										<button
											onClick={() => onDeleteCharacter(char.id)}
											disabled={characters.length <= 1}
											className={styles.deleteActionButton}
											title={characters.length <= 1 ? '最後の1キャラは削除できません' : '削除'}
										>
											<Trash2 className="w-3.5 h-3.5" />
										</button>
									</div>
								</>
							)}
						</div>
					);
				})}
			</div>
		</div>
	);
};