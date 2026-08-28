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

	const isSharedActive = !!activeCharacter?.isShared;
	const { icon } = LAYOUT_TOKENS.header;

	return (
		<header className={LAYOUT_TOKENS.header.container}>
			<div className={LAYOUT_TOKENS.header.inner}>
				<div className={LAYOUT_TOKENS.header.rowWrapper}>

					{/* タイトル */}
					<div className={LAYOUT_TOKENS.header.titleWrapper}>
						<div className={LAYOUT_TOKENS.header.iconBg}>
							<Fish className={`${icon.lg} ${COMMON_TOKENS.color.textMain}`} />
						</div>
						<div>
							<h1 className={LAYOUT_TOKENS.header.titleText}>FF11 釣魚チェッカー</h1>
							<p className={COMMON_TOKENS.text.subText}>FF11 Fishing Tracker</p>
						</div>
					</div>

					{/* --- 【パターンA】画面が広い時（sm / 640px以上） --- */}
					<div className={LAYOUT_TOKENS.header.desktopNav}>
						{/* キャラクター切り替え */}
						<div className={LAYOUT_TOKENS.header.selectGroup}>
							<label htmlFor="char-select" className={COMMON_TOKENS.text.label}>
								キャラ:
							</label>
							<select
								id="char-select"
								value={activeCharacter?.id ?? ''}
								onChange={(e) => onSelectCharacter(e.target.value)}
								className={LAYOUT_TOKENS.control.select(isSharedActive)}
							>
								{characters.map((char) => (
									<option key={char.id} value={char.id} className={LAYOUT_TOKENS.header.selectOption}>
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
							<Settings className={icon.md} />
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
								<Database className={`${icon.sm} ${icon.dev}`} />
								マスター編集
							</button>
						)}
					</div>

					{/* --- 【パターンB】画面が狭い時（sm未満 / 640px未満） --- */}
					<div className={LAYOUT_TOKENS.header.mobileNav} ref={menuRef}>
						<button
							type="button"
							onClick={() => setIsOpen(!isOpen)}
							className={LAYOUT_TOKENS.header.collapsedMenuButton(isSharedActive)}
							aria-expanded={isOpen}
							aria-haspopup="true"
						>
							{isSharedActive ? (
								<Share2 className={`${icon.md} ${icon.shared}`} />
							) : (
								<User className={`${icon.md} ${icon.muted}`} />
							)}
							<span className={LAYOUT_TOKENS.header.collapsedButtonText}>
								{activeCharacter?.name ?? 'キャラ未選択'}
								{isSharedActive ? ' (共有)' : ''}
							</span>
							<ChevronDown className={LAYOUT_TOKENS.header.collapsedChevron(isOpen)} />
						</button>

						{/* ドロップダウンメニュー */}
						{isOpen && (
							<div className={LAYOUT_TOKENS.header.dropdownContainer}>

								{/* キャラクター選択セクション */}
								<div className={LAYOUT_TOKENS.header.dropdownSection}>
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
														? LAYOUT_TOKENS.header.dropdownItemActive(char.isShared)
														: LAYOUT_TOKENS.header.dropdownItemInactive
												}
											>
												<div className={LAYOUT_TOKENS.header.dropdownItemContent}>
													{char.isShared && <Share2 className={`${icon.sm} ${icon.shared}`} />}
													<span className="truncate">{char.name}</span>
													{char.isShared && (
														<span className={LAYOUT_TOKENS.header.sharedBadge}>
															共有
														</span>
													)}
												</div>
												{isSelected && (
													<Check className={`${icon.sm} ${icon.active(char.isShared)}`} />
												)}
											</button>
										);
									})}
								</div>

								{/* システム・共有セクション */}
								<div className={LAYOUT_TOKENS.header.dropdownDividerSection}>
									<div className={LAYOUT_TOKENS.header.sectionHeader}>
										アクション
									</div>

									{/* モバイルメニュー内 進捗共有 */}
									<div className={LAYOUT_TOKENS.header.dropdownShareButtonWrapper}>
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
										<Settings className={`${icon.md} ${icon.muted}`} />
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
											<Database className={`${icon.md} ${icon.dev}`} />
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