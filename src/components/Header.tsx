import React, { useState } from 'react';
import { Plus, Trash2, Fish, Database } from 'lucide-react';
import type { CharacterProgress } from '@/types/fish';
import { isDev } from '@/utils/env';

type HeaderProps = {
	characters: CharacterProgress[];
	activeCharacter: CharacterProgress;
	onSelectCharacter: (id: string) => void;
	onAddCharacter: (name: string) => void;
	onDeleteCharacter: (id: string) => void;
	totalFishCount: number;
	onOpenMasterEditor?: () => void; // 編集画面を開くためのハンドラーを追加
};

export const Header: React.FC<HeaderProps> = ({
	characters,
	activeCharacter,
	onSelectCharacter,
	onAddCharacter,
	onDeleteCharacter,
	totalFishCount,
	onOpenMasterEditor,
}) => {
	const [isAdding, setIsAdding] = useState(false);
	const [newCharName, setNewCharName] = useState('');

	const checkedCount = activeCharacter.checkedFishIds.length;
	const progressPercent = totalFishCount > 0
		? Math.round((checkedCount / totalFishCount) * 100)
		: 0;

	const handleAddSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (newCharName.trim()) {
			onAddCharacter(newCharName.trim());
			setNewCharName('');
			setIsAdding(false);
		}
	};

	return (
		<header className="bg-slate-800 text-white shadow-md border-b border-slate-700">
			<div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
				<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

					{/* タイトル */}
					<div className="flex items-center gap-3">
						<div className="p-2 bg-blue-600 rounded-lg">
							<Fish className="w-6 h-6 text-white" />
						</div>
						<div>
							<h1 className="text-xl font-bold tracking-tight">FF11 釣魚チェッカー</h1>
							<p className="text-xs text-slate-400">FF11 Fishing Tracker</p>
						</div>
					</div>

					{/* キャラクター切り替え＆管理 ＋ 開発用ボタン */}
					<div className="flex flex-wrap items-center gap-3">
						<div className="flex items-center gap-2">
							<label htmlFor="char-select" className="text-sm font-medium text-slate-300">
								キャラ:
							</label>
							<select
								id="char-select"
								value={activeCharacter.id}
								onChange={(e) => onSelectCharacter(e.target.value)}
								className="bg-slate-700 border border-slate-600 text-white text-sm rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
							>
								{characters.map((char) => (
									<option key={char.id} value={char.id}>
										{char.name}
									</option>
								))}
							</select>
						</div>

						{/* キャラ追加ボタン / フォーム */}
						{isAdding ? (
							<form onSubmit={handleAddSubmit} className="flex items-center gap-1">
								<input
									type="text"
									placeholder="キャラ名"
									value={newCharName}
									onChange={(e) => setNewCharName(e.target.value)}
									className="bg-slate-700 border border-slate-600 text-white text-sm rounded-lg px-2 py-1.5 w-28 focus:outline-none focus:ring-1 focus:ring-blue-500"
									autoFocus
								/>
								<button
									type="submit"
									className="bg-blue-600 hover:bg-blue-500 text-white text-xs px-2.5 py-1.5 rounded-lg font-medium"
								>
									追加
								</button>
								<button
									type="button"
									onClick={() => setIsAdding(false)}
									className="bg-slate-600 hover:bg-slate-500 text-white text-xs px-2 py-1.5 rounded-lg"
								>
									キャンセル
								</button>
							</form>
						) : (
							<button
								onClick={() => setIsAdding(true)}
								className="flex items-center gap-1 bg-slate-700 hover:bg-slate-600 border border-slate-600 text-xs px-2.5 py-1.5 rounded-lg font-medium transition-colors"
							>
								<Plus className="w-3.5 h-3.5" />
								追加
							</button>
						)}

						{/* キャラ削除ボタン（2キャラ以上のときのみ表示） */}
						{characters.length > 1 && (
							<button
								onClick={() => {
									if (confirm(`「${activeCharacter.name}」を削除しますか？`)) {
										onDeleteCharacter(activeCharacter.id);
									}
								}}
								className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-700 rounded-lg transition-colors"
								title="選択中のキャラクターを削除"
							>
								<Trash2 className="w-4 h-4" />
							</button>
						)}

						{/* 開発環境でのみ表示するマスター編集ボタン */}
						{isDev && (
							<button
								onClick={onOpenMasterEditor}
								className="flex items-center gap-1 bg-red-900/50 hover:bg-red-800/60 border border-red-700 text-red-200 text-xs px-2.5 py-1.5 rounded-lg font-medium transition-colors"
								title="開発用マスターデータエディタを開く"
							>
								<Database className="w-3.5 h-3.5 text-red-400" />
								マスター編集
							</button>
						)}
					</div>
				</div>

				{/* 進捗バー領域 */}
				<div className="mt-4 pt-3 border-t border-slate-700/60 flex flex-col sm:flex-row sm:items-center gap-2">
					<div className="flex justify-between items-center text-xs font-semibold text-slate-300 w-full sm:w-auto sm:min-w-[140px]">
						<span>達成率: {progressPercent}%</span>
						<span className="text-slate-400 font-normal">({checkedCount} / {totalFishCount} 種)</span>
					</div>
					<div className="w-full bg-slate-700 rounded-full h-2.5 overflow-hidden">
						<div
							className="bg-blue-500 h-2.5 rounded-full transition-all duration-300 ease-out"
							style={{ width: `${progressPercent}%` }}
						/>
					</div>
				</div>

			</div>
		</header>
	);
};