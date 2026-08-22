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
import { COMMON_TOKENS } from '@/styles/tokens/commonTokens';
import { LAYOUT_TOKENS } from '@/styles/tokens/layoutTokens';

type HeaderProps = {
	characters: CharacterProgress[];
	activeCharacter: CharacterProgress;
	onSelectCharacter: (id: string) => void;
	onOpenSettings: () => void;
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
		<header className={LAYOUT_TOKENS.header.container}>
			<div className={LAYOUT_TOKENS.header.inner}>
				<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

					{/* タイトル */}
					<div className="flex items-center gap-3">
						<div className={LAYOUT_TOKENS.header.iconBg}>
							<Fish className={`w-6 h-6 ${COMMON_TOKENS.color.textMain}`} />
						</div>
						<div>
							<h1 className="text-xl font-bold tracking-tight">FF11 釣魚チェッカー</h1>
							<p className={COMMON_TOKENS.text.subText}>FF11 Fishing Tracker</p>
						</div>
					</div>

					{/* キャラクター選択 ＋ 設定 / 開発用ボタン */}
					<div className="flex flex-wrap items-center gap-3">
						{/* キャラクター切り替え */}
						<div className="flex items-center gap-2">
							<label htmlFor="char-select" className={COMMON_TOKENS.text.label}>
								キャラ:
							</label>
							<select
								id="char-select"
								value={activeCharacter.id}
								onChange={(e) => onSelectCharacter(e.target.value)}
								className={LAYOUT_TOKENS.control.select}
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
							className={LAYOUT_TOKENS.control.button}
							title="環境設定・データ管理"
						>
							<Settings className="w-4 h-4" />
							設定
						</button>

						{/* 開発環境用マスター編集ボタン */}
						{isDev && (
							<button
								onClick={onOpenMasterEditor}
								className={LAYOUT_TOKENS.control.devButton}
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