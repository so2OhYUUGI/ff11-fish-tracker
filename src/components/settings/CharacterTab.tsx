import React, { useState } from 'react';
import { UserPlus, Edit2, Trash2, Check, X, User } from 'lucide-react';
import type { CharacterProgress } from '@/types/fish';

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
		<div className="space-y-4">
			<div className="flex items-center justify-between">
				<div>
					<h3 className="text-sm font-semibold text-slate-200">キャラクター一覧</h3>
					<p className="text-xs text-slate-400">操作対象のキャラクター切り替え・編集が行えます。</p>
				</div>
				{!isAdding && (
					<button
						onClick={() => setIsAdding(true)}
						className="text-xs flex items-center gap-1 bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 border border-blue-500/30 px-2.5 py-1.5 rounded-lg font-medium transition-colors"
					>
						<UserPlus className="w-3.5 h-3.5" />
						新規追加
					</button>
				)}
			</div>

			{isAdding && (
				<form onSubmit={handleAddCharacter} className="flex gap-2 p-3 bg-slate-900/60 rounded-lg border border-slate-700">
					<input
						type="text"
						value={newCharName}
						onChange={(e) => setNewCharName(e.target.value)}
						placeholder="キャラクター名"
						autoFocus
						className="flex-1 px-3 py-1.5 text-sm bg-slate-800 border border-slate-600 rounded text-white focus:outline-none focus:border-blue-500"
					/>
					<button
						type="submit"
						disabled={!newCharName.trim()}
						className="px-3 py-1.5 text-xs bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 text-white rounded font-medium transition-colors"
					>
						追加
					</button>
					<button
						type="button"
						onClick={() => {
							setIsAdding(false);
							setNewCharName('');
						}}
						className="px-2 py-1.5 text-xs text-slate-400 hover:text-white"
					>
						キャンセル
					</button>
				</form>
			)}

			<div className="space-y-2 max-h-64 overflow-y-auto pr-1">
				{characters.map((char) => {
					const isActive = char.id === activeCharacterId;
					const isEditing = editingId === char.id;

					return (
						<div
							key={char.id}
							className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${isActive
									? 'bg-blue-950/40 border-blue-600/60'
									: 'bg-slate-900/40 border-slate-700/60 hover:border-slate-600'
								}`}
						>
							{isEditing ? (
								<div className="flex items-center gap-2 flex-1 mr-2">
									<input
										type="text"
										value={editingName}
										onChange={(e) => setEditingName(e.target.value)}
										autoFocus
										onKeyDown={(e) => {
											if (e.key === 'Enter') handleSaveRename(char.id);
											if (e.key === 'Escape') setEditingId(null);
										}}
										className="flex-1 px-2 py-1 text-sm bg-slate-800 border border-blue-500 rounded text-white focus:outline-none"
									/>
									<button
										onClick={() => handleSaveRename(char.id)}
										className="p-1 text-emerald-400 hover:bg-slate-800 rounded"
									>
										<Check className="w-4 h-4" />
									</button>
									<button
										onClick={() => setEditingId(null)}
										className="p-1 text-slate-400 hover:bg-slate-800 rounded"
									>
										<X className="w-4 h-4" />
									</button>
								</div>
							) : (
								<>
									<div className="flex items-center gap-2.5 min-w-0 flex-1">
										<User className={`w-4 h-4 shrink-0 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
										<button
											onClick={() => onSelectCharacter(char.id)}
											className={`text-sm font-medium truncate text-left hover:underline ${isActive ? 'text-blue-300' : 'text-slate-200'
												}`}
										>
											{char.name}
										</button>
										{isActive && (
											<span className="shrink-0 text-[10px] px-2 py-0.5 bg-blue-600/30 text-blue-300 border border-blue-500/40 rounded-full font-medium">
												選択中
											</span>
										)}
									</div>

									<div className="flex items-center gap-1 shrink-0 ml-2">
										<button
											onClick={() => startEditing(char)}
											className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors"
											title="名前を変更"
										>
											<Edit2 className="w-3.5 h-3.5" />
										</button>
										<button
											onClick={() => onDeleteCharacter(char.id)}
											disabled={characters.length <= 1}
											className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 disabled:opacity-30 disabled:hover:text-slate-400 rounded transition-colors"
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