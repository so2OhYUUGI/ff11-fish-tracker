/**
 * ============================================================================
 * [FilePath] src/components/settings/SettingsModal.tsx
 * [Role] アプリケーションの環境設定・データ管理モーダル（固定サイズ版）
 * ============================================================================
 */

import React, { useState } from 'react';
import { X, User, Database } from 'lucide-react';
import type { CharacterProgress } from '@/types/fish';
import { CharacterTab } from './CharacterTab';
import { DataTab } from './DataTab';

type TabType = 'character' | 'data';

type SettingsModalProps = {
	isOpen: boolean;
	onClose: () => void;
	characters: CharacterProgress[];
	activeCharacterId: string;
	onSelectCharacter: (id: string) => void;
	onAddCharacter: (name: string) => void;
	onRenameCharacter: (id: string, newName: string) => void;
	onDeleteCharacter: (id: string) => void;
	onExport: () => void;
	onImport: (file: File) => Promise<boolean>;
};

export const SettingsModal: React.FC<SettingsModalProps> = ({
	isOpen,
	onClose,
	characters,
	activeCharacterId,
	onSelectCharacter,
	onAddCharacter,
	onRenameCharacter,
	onDeleteCharacter,
	onExport,
	onImport,
}) => {
	const [activeTab, setActiveTab] = useState<TabType>('character');

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
			{/* 修正点: h-[500px] で高さを固定、max-h-[85vh] で画面からはみ出るのを防止 */}
			<div className="bg-slate-800 border border-slate-700 rounded-xl shadow-2xl w-full max-w-lg h-[500px] max-h-[85vh] overflow-hidden text-white flex flex-col">

				{/* ヘッダー (高さ固定) */}
				<div className="flex items-center justify-between px-6 py-4 border-b border-slate-700 shrink-0">
					<h2 className="text-lg font-bold">環境設定・データ管理</h2>
					<button
						onClick={onClose}
						className="p-1 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
					>
						<X className="w-5 h-5" />
					</button>
				</div>

				{/* タブナビゲーション (高さ固定) */}
				<div className="flex border-b border-slate-700 bg-slate-900/40 px-6 shrink-0">
					<button
						onClick={() => setActiveTab('character')}
						className={`flex items-center gap-2 py-3 px-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'character'
								? 'border-blue-500 text-blue-400'
								: 'border-transparent text-slate-400 hover:text-slate-200'
							}`}
					>
						<User className="w-4 h-4" />
						キャラクター管理
					</button>
					<button
						onClick={() => setActiveTab('data')}
						className={`flex items-center gap-2 py-3 px-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'data'
								? 'border-blue-500 text-blue-400'
								: 'border-transparent text-slate-400 hover:text-slate-200'
							}`}
					>
						<Database className="w-4 h-4" />
						データ管理
					</button>
				</div>

				{/* タブコンテンツ (残り高さを全占有・内部のみスクロール) */}
				<div className="p-6 overflow-y-auto flex-1">
					{activeTab === 'character' && (
						<CharacterTab
							characters={characters}
							activeCharacterId={activeCharacterId}
							onSelectCharacter={onSelectCharacter}
							onAddCharacter={onAddCharacter}
							onRenameCharacter={onRenameCharacter}
							onDeleteCharacter={onDeleteCharacter}
						/>
					)}

					{activeTab === 'data' && (
						<DataTab
							onExport={onExport}
							onImport={onImport}
						/>
					)}
				</div>

				{/* フッター (高さ固定) */}
				<div className="px-6 py-3 bg-slate-800/50 border-t border-slate-700 text-right shrink-0">
					<button
						onClick={onClose}
						className="px-4 py-1.5 bg-slate-700 hover:bg-slate-600 text-white text-sm rounded-lg font-medium transition-colors"
					>
						閉じる
					</button>
				</div>

			</div>
		</div>
	);
};