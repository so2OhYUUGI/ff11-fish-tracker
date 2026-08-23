/**
 * ============================================================================
 * [FilePath] src/components/layout/Header.tsx
 * [Role] アプリケーションの固定ヘッダー・キャラクター切り替え・設定/開発用ツール導線コンポーネント
 * ============================================================================
 */

import React, { useState, useRef, useEffect } from 'react';
import { Fish, Database, Settings, ChevronDown, Check, User } from 'lucide-react';
import type { CharacterProgress } from '@/types/fishtracker';
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
	const [isOpen, setIsOpen] = useState(false);
	const menuRef = useRef<HTMLDivElement>(null);

	// メニュー外クリックで閉じる処理
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
				setIsOpen(false);
			}
		};
		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	return (
		<header className={LAYOUT_TOKENS.header.container}>
			<div className={LAYOUT_TOKENS.header.inner}>
				<div className="flex items-center justify-between gap-4">

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

					{/* --- 【パターンA】画面が広い時（sm / 640px以上）: 従来の個別表示 --- */}
					<div className="hidden sm:flex flex-wrap items-center gap-3">
						{/* キャラクター切り替え */}
						<div className="flex items-center gap-2">
							<label htmlFor="char-select" className={COMMON_TOKENS.text.label}>
								キャラ:
							</label>
							<select
								id="char-select"
								value={activeCharacter?.id ?? ''}
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

					{/* --- 【パターンB】画面が狭い時（sm未満 / 640px未満）: ワンボタンに収束 --- */}
					<div className="relative flex sm:hidden" ref={menuRef}>
						<button
							onClick={() => setIsOpen(!isOpen)}
							className={LAYOUT_TOKENS.header.collapsedMenuButton}
							aria-expanded={isOpen}
							aria-haspopup="true"
						>
							<User className="w-4 h-4 text-slate-400 shrink-0" />
							<span className={LAYOUT_TOKENS.header.collapsedButtonText}>
								{activeCharacter?.name ?? 'キャラ未選択'}
							</span>
							<ChevronDown className={LAYOUT_TOKENS.header.collapsedChevron(isOpen)} />
						</button>

						{/* ドロップダウンメニュー */}
						{isOpen && (
							<div className={LAYOUT_TOKENS.header.dropdownContainer}>

								{/* キャラクター選択セクション */}
								<div className="py-1">
									<div className={LAYOUT_TOKENS.header.sectionHeader}>
										キャラクター切替
									</div>
									{characters.map((char) => {
										const isSelected = char.id === activeCharacter?.id;
										return (
											<button
												key={char.id}
												onClick={() => {
													onSelectCharacter(char.id);
													setIsOpen(false);
												}}
												className={
													isSelected
														? LAYOUT_TOKENS.header.dropdownItemActive
														: LAYOUT_TOKENS.header.dropdownItemInactive
												}
											>
												<span className="truncate">{char.name}</span>
												{isSelected && <Check className="w-3.5 h-3.5 text-blue-400 shrink-0" />}
											</button>
										);
									})}
								</div>

								{/* システム・設定セクション */}
								<div className="py-1">
									<div className={LAYOUT_TOKENS.header.sectionHeader}>
										システム
									</div>

									{/* 環境設定ボタン */}
									<button
										onClick={() => {
											setIsOpen(false);
											onOpenSettings();
										}}
										className={LAYOUT_TOKENS.header.dropdownActionItem}
									>
										<Settings className="w-4 h-4 text-slate-400" />
										環境設定・データ管理
									</button>

									{/* 開発環境用マスター編集ボタン */}
									{isDev && (
										<button
											onClick={() => {
												setIsOpen(false);
												onOpenMasterEditor?.();
											}}
											className={LAYOUT_TOKENS.header.dropdownActionItem}
										>
											<Database className="w-4 h-4 text-red-400" />
											マスターデータ編集
										</button>
									)}
								</div>

							</div>
						)}
					</div>

				</div>
			</div>
		</header>
	);
};