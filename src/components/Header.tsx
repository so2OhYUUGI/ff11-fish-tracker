/**
 * ============================================================================
 * [FilePath] src/components/Header.tsx
 * [Role] アプリケーションの固定ヘッダー・キャラクター切り替え・設定/開発用ツール導線コンポーネント
 * ============================================================================
 */

import React from 'react';
import { Fish, Database, Settings } from 'lucide-react';
import type { CharacterProgress } from '@/types/fish';
import { isDev } from '@/utils/env';

type HeaderProps = {
	characters: CharacterProgress[];
	activeCharacter: CharacterProgress;
	onSelectCharacter: (id: string) => void;
	onOpenSettings: () => void; // 設定画面を開くハンドラー
	onOpenMasterEditor?: () => void;
};

export const Header: React.FC<HeaderProps> = ({
	characters,
	activeCharacter,
	onSelectCharacter,
	onOpenSettings,
	onOpenMasterEditor,
}) => {
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

					{/* キャラクター選択 ＋ 設定 / 開発用ボタン */}
					<div className="flex flex-wrap items-center gap-3">
						{/* キャラクター切り替え */}
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

						{/* 環境設定ボタン */}
						<button
							onClick={onOpenSettings}
							className="p-1.5 text-slate-300 hover:text-white bg-slate-700 hover:bg-slate-600 border border-slate-600 rounded-lg transition-colors flex items-center gap-1.5 text-xs px-2.5 py-1.5 font-medium"
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