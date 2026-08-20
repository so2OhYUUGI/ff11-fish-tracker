/**
 * ============================================================================
 * [FilePath] src/components/Header.tsx
 * [Role] アプリケーションの固定ヘッダー・キャラクター切り替え/管理・開発用ツール導線コンポーネント
 * ============================================================================
 */

import React, { useState } from 'react';
import { Plus, Trash2, Fish, Database, Settings } from 'lucide-react';
import type { CharacterProgress } from '@/types/fish';
import { isDev } from '@/utils/env';

type HeaderProps = {
	characters: CharacterProgress[];
	activeCharacter: CharacterProgress;
	onSelectCharacter: (id: string) => void;
	onAddCharacter: (name: string) => void;
	onDeleteCharacter: (id: string) => void;
	onOpenSettings: () => void; // 設定画面を開くハンドラー
	onOpenMasterEditor?: () => void;
};

export const Header: React.FC<HeaderProps> = ({
	characters,
	activeCharacter,
	onSelectCharacter,
	onAddCharacter,
	onDeleteCharacter,
	onOpenSettings,
	onOpenMasterEditor,
}) => {
	const [isAdding, setIsAdding] = useState(false);
	const [newCharName, setNewCharName] = useState('');

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

					{/* キャラクター切り替え＆管理 ＋ 設定 / 開発用ボタン */}
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

						{/* キャラ削除ボタン */}
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

						{/* 環境設定ボタン */}
						<button
							onClick={onOpenSettings}
							className="p-1.5 text-slate-300 hover:text-white bg-slate-700 hover:bg-slate-600 border border-slate-600 rounded-lg transition-colors flex items-center gap-1 text-xs px-2.5 py-1.5 font-medium"
							title="環境設定・データ管理"
						>
							<Settings className="w-4 h-4" />
							設定
						</button>

						{/* 開発環境用マスター編集ボタン */}
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
			</div>
		</header>
	);
};