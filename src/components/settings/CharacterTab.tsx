/**
 * ============================================================================
 * [FilePath] src/components/settings/CharacterTab.tsx
 * [Role] キャラクター一覧・切替・編集タブコンポーネント
 * 
 * [概要]
 * - UserDataContext からキャラクター情報および各種操作関数を直接参照
 * ============================================================================
 */

import React, { useState } from 'react';
import { UserPlus, Edit2, Trash2, Check, X, User } from 'lucide-react';
import { useUserDataContext } from '@/contexts/UserDataContext';
import type { CharacterProgress } from '@/types/';
import { SETTINGS_STYLES } from '@/styles/components/settingsStyles';

export const CharacterTab: React.FC = () => {
	const {
		userData,
		activeCharacterId,
		setActiveCharacter,
		addCharacter,
		renameCharacter,
		deleteCharacter,
	} = useUserDataContext();

	const [editingId, setEditingId] = useState<string | null>(null);
	const [editingName, setEditingName] = useState('');
	const [newCharName, setNewCharName] = useState('');
	const [isAdding, setIsAdding] = useState(false);

	const styles = SETTINGS_STYLES.characterTab;

	const handleAddCharacter = (e: React.FormEvent) => {
		e.preventDefault();
		if (!newCharName.trim()) return;
		addCharacter(newCharName.trim());
		setNewCharName('');
		setIsAdding(false);
	};

	const startEditing = (char: CharacterProgress) => {
		setEditingId(char.id);
		setEditingName(char.name);
	};

	const handleSaveRename = (id: string) => {
		if (editingName.trim()) {
			renameCharacter(id, editingName.trim());
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
				{userData.characters.map((char) => {
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
											onClick={() => setActiveCharacter(char.id)}
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
											onClick={() => deleteCharacter(char.id)}
											disabled={userData.characters.length <= 1}
											className={styles.deleteActionButton}
											title={userData.characters.length <= 1 ? '最後の1キャラは削除できません' : '削除'}
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