/**
 * ============================================================================
 * [FilePath] src/components/layout/Header.tsx
 * [Role]     アプリケーションの固定ヘッダー・キャラクター切り替え・設定/開発用ツール・進捗共有導線コンポーネント
 * 
 * [概要]
 * - 閲覧者自身のキャラクターおよび、URL共有経由で表示される一時的な「共有キャラ」の切替UIを提供
 * - 進捗共有ボタン（ShareProgressButton）を配置し、SNSシェアモーダルへ直結
 * ============================================================================
 */

import React, { useState, useRef, useEffect } from 'react';
import { Fish, Database, Settings, ChevronDown, Check, User, Share2 } from 'lucide-react';
import type { CharacterProgress } from '@/types/fishtracker';
import { isDev } from '@/utils/env';
import { COMMON_TOKENS } from '@/styles/tokens/commonTokens';
import { LAYOUT_TOKENS } from '@/styles/tokens/layoutTokens';
import { ShareProgressButton } from '@/components/common/ShareProgressButton';

export interface DisplayCharacterProgress extends CharacterProgress {
	isShared?: boolean;
}

type HeaderProps = {
	characters: DisplayCharacterProgress[];
	activeCharacter: DisplayCharacterProgress;
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

					{/* --- 【パターンA】画面が広い時（sm / 640px以上） --- */}
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
								className={`${LAYOUT_TOKENS.control.select} ${activeCharacter?.isShared ? 'border-cyan-500 text-cyan-300 bg-slate-900' : ''}`}
							>
								{characters.map((char) => (
									<option key={char.id} value={char.id}>
										{char.name} {char.isShared ? '(共有)' : ''}
									</option>
								))}
							</select>
						</div>

						{/* 進捗共有ボタン */}
						<ShareProgressButton
							activeCharacter={activeCharacter}
						/>

						{/* 環境設定ボタン */}
						<button
							type="button"
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
								type="button"
								onClick={onOpenMasterEditor}
								className={LAYOUT_TOKENS.control.devButton}
								title="開発用マスターデータエディタを開く"
							>
								<Database className="w-3.5 h-3.5 text-red-400" />
								マスター編集
							</button>
						)}
					</div>

					{/* --- 【パターンB】画面が狭い時（sm未満 / 640px未満） --- */}
					<div className="relative flex sm:hidden" ref={menuRef}>
						<button
							type="button"
							onClick={() => setIsOpen(!isOpen)}
							className={`${LAYOUT_TOKENS.header.collapsedMenuButton} ${activeCharacter?.isShared ? 'border-cyan-500/80 bg-slate-900' : ''}`}
							aria-expanded={isOpen}
							aria-haspopup="true"
						>
							{activeCharacter?.isShared ? (
								<Share2 className="w-4 h-4 text-cyan-400 shrink-0" />
							) : (
								<User className="w-4 h-4 text-slate-400 shrink-0" />
							)}
							<span className={LAYOUT_TOKENS.header.collapsedButtonText}>
								{activeCharacter?.name ?? 'キャラ未選択'}
								{activeCharacter?.isShared ? ' (共有)' : ''}
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
												type="button"
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
												<div className="flex items-center gap-1.5 truncate">
													{char.isShared && <Share2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />}
													<span className="truncate">{char.name}</span>
													{char.isShared && (
														<span className="text-[10px] px-1 py-0.2 bg-cyan-950 text-cyan-400 border border-cyan-800 rounded">
															共有
														</span>
													)}
												</div>
												{isSelected && <Check className="w-3.5 h-3.5 text-blue-400 shrink-0" />}
											</button>
										);
									})}
								</div>

								{/* システム・共有セクション */}
								<div className="py-1 border-t border-slate-800">
									<div className={LAYOUT_TOKENS.header.sectionHeader}>
										アクション
									</div>

									{/* モバイルメニュー内 進捗共有 */}
									<div className="px-3 py-1.5">
										<ShareProgressButton
											activeCharacter={activeCharacter}
											className="w-full justify-center"
										/>
									</div>

									<div className={LAYOUT_TOKENS.header.sectionHeader}>
										システム
									</div>

									{/* 環境設定ボタン */}
									<button
										type="button"
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
											type="button"
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