/**
 * ============================================================================
 * [FilePath] src/components/layout/Header.tsx
 * [Role]     アプリケーションの固定ヘッダー・キャラクター切り替え・チェッカー機能切り替え・設定/開発用ツール導線コンポーネント
 * 
 * [概要]
 * - 閲覧者自身のキャラクターおよび、URL共有経由で表示される一時的な「共有キャラ」の切替UIを提供
 * - モバイルサイズでもキャラセレクタを常時表示し、操作領域を1タップに最適化（"キャラ:"ラベルは小画面で非表示）
 * - 登録ユーザーにはハンバーガーメニュー内に「チェッカー切り替え」「環境設定」を統合
 * - 未登録ユーザーにはハンバーガーボタンを非表示にし、現在のページのURL情報を保持して各テーマ配下の登録ページへ移動する「登録してはじめる」CTAリンクを表示
 * - アプリ内ブラウザ環境（SNS等）の未登録ユーザーには標準ブラウザでの閲覧を促す「ブラウザで開く」ボタンを表示
 * - URLパスのセグメント解析により、新トラッカー追加時もコード変更なしで動的テーマ・動的ルーティングに対応
 * - UserDataContext から表示用キャラ一覧および選択中のキャラ情報を直接参照
 * - CSS変数による抽象化テーマ（釣魚 / フェイス）およびデザインシステムトークン（COMMON_TOKENS, LAYOUT_TOKENS）を適用
 * 
 * [依存関係・関連ファイル]
 * - Context      : src/contexts/UserDataContext.tsx
 * - ルーティング : react-router-dom (Link, useLocation)
 * - トークン    : src/styles/tokens/commonTokens.ts, src/styles/tokens/layoutTokens.ts
 * - ユーティリティ: src/utils/env.ts, src/utils/environment.ts
 * 
 * [編集・改修時の注意事項（AI/エンジニア共通指示）]
 * 1. 【アクセス操作】 モバイル/デスクトップ共通ドロップダウン開閉時は Escape キー押下およびメニュー外クリックによる自動クローズイベントを解除（クリーンアップ）すること
 * 2. 【共有状態視認性】 isSharedActive（共有キャラ選択中）の場合、UIのアクセントカラーやバッジで明確に判別できるようにすること
 * 3. 【スタイル統一】 個別のTailwindクラス定義を避け、デザインシステムトークン（LAYOUT_TOKENS / COMMON_TOKENS）を使用すること
 * 4. 【拡張性維持】 特定トラッカーのハードコード（isTrustMode 等）は避け、URLパスの第1セグメントからの動的判定（currentPrefix / registerPath）を維持すること
 * ============================================================================
 */

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Fish, Scroll, Database, Settings, Menu, X, Check, UserPlus, ExternalLink } from 'lucide-react';
import { useUserDataContext } from '@/contexts/UserDataContext';
import { isDev } from '@/utils/env';
import { checkInAppBrowser, openInExternalBrowser } from '@/utils/environment';
import { COMMON_TOKENS } from '@/styles/tokens/commonTokens';
import { LAYOUT_TOKENS } from '@/styles/tokens/layoutTokens';

type HeaderProps = {
	onOpenSettings: () => void;
	onOpenMasterEditor?: () => void;
};

export const Header: React.FC<HeaderProps> = ({
	onOpenSettings,
	onOpenMasterEditor,
}) => {
	const {
		displayCharacters,
		activeCharacter,
		setActiveCharacter,
		isRegistered,
	} = useUserDataContext();

	const [isOpen, setIsOpen] = useState(false);
	const [showCopyNotice, setShowCopyNotice] = useState(false);
	const menuRef = useRef<HTMLDivElement>(null);

	const location = useLocation();

	const isInApp = useMemo(() => checkInAppBrowser(), []);

	// パスの第1セグメントから現在のトラッカープレフィックスを動的取得 (例: "/fishtracker", "/trusttracker")
	const pathSegments = location.pathname.split('/').filter(Boolean);
	const currentPrefix = pathSegments.length > 0 ? `/${pathSegments[0]}` : '/fishtracker';

	// 将来機能が増えても動的に当該トラッカー配下の /register パスを生成
	const registerPath = `${currentPrefix}/register`;
	const isTrustMode = currentPrefix === '/trusttracker';

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
				setIsOpen(false);
			}
		};

		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'Escape') {
				setIsOpen(false);
			}
		};

		if (isOpen) {
			document.addEventListener('mousedown', handleClickOutside);
			window.addEventListener('keydown', handleKeyDown);
		}

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
			window.removeEventListener('keydown', handleKeyDown);
		};
	}, [isOpen]);

	const handleOpenBrowser = async () => {
		const result = await openInExternalBrowser();
		if (result === 'copied') {
			setShowCopyNotice(true);
			setTimeout(() => setShowCopyNotice(false), 3000);
		} else if (result === 'failed') {
			alert('URLの取得に失敗しました。アドレスバーのURLを直接コピーして標準ブラウザで開いてください。');
		}
	};

	const isSharedActive = !!activeCharacter?.isShared;
	const { icon } = LAYOUT_TOKENS.header;

	return (
		<header className={LAYOUT_TOKENS.header.container}>
			<div className={LAYOUT_TOKENS.header.inner}>
				<div className="flex items-center justify-between gap-2 sm:gap-4">

					{/* タイトル（左寄せ領域を確保） */}
					<div className={`${LAYOUT_TOKENS.header.titleWrapper} flex-1 min-w-0`}>
						<div className={LAYOUT_TOKENS.header.iconBg}>
							{isTrustMode ? (
								<Scroll className={`${icon.lg} ${COMMON_TOKENS.color.textMain}`} />
							) : (
								<Fish className={`${icon.lg} ${COMMON_TOKENS.color.textMain}`} />
							)}
						</div>
						<div className="min-w-0">
							<h1 className={`${LAYOUT_TOKENS.header.titleText} truncate`}>
								{isTrustMode ? 'FF11 フェイスチェッカー' : 'FF11 釣魚チェッカー'}
							</h1>
							<p className={`${COMMON_TOKENS.text.subText} truncate hidden xs:block`}>
								{isTrustMode ? 'FF11 Trust Tracker' : 'FF11 Fishing Tracker'}
							</p>
						</div>
					</div>

					{/* 右側アクションエリア */}
					<div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
						{isRegistered ? (
							<>
								{/* 常時表示キャラセレクタ（モバイル時はラベル非表示・幅自動制御） */}
								<div className="flex items-center gap-1.5 sm:gap-3">
									<div className={LAYOUT_TOKENS.header.selectGroup}>
										<label htmlFor="char-select" className={`${COMMON_TOKENS.text.label} hidden sm:inline`}>
											キャラ:
										</label>
										<select
											id="char-select"
											value={activeCharacter?.id ?? ''}
											onChange={(e) => setActiveCharacter(e.target.value)}
											className={`${LAYOUT_TOKENS.control.select(isSharedActive)} max-w-110px xs:max-w-[140px] sm:max-w-none truncate`}
										>
											{displayCharacters.map((char) => (
												<option key={char.id} value={char.id} className={LAYOUT_TOKENS.header.selectOption}>
													{char.name} {char.isShared ? '(共有)' : ''}
												</option>
											))}
										</select>
									</div>
								</div>

								{/* ハンバーガーメニューエリア */}
								<div className="relative" ref={menuRef}>
									<button
										type="button"
										onClick={() => setIsOpen(!isOpen)}
										className={LAYOUT_TOKENS.control.button}
										aria-label="メインメニュー"
										aria-expanded={isOpen}
										aria-haspopup="true"
									>
										{isOpen ? <X className={icon.md} /> : <Menu className={icon.md} />}
									</button>

									{isOpen && (
										<div className={LAYOUT_TOKENS.header.dropdownContainer}>

											{/* 1. チェッカー機能切り替え */}
											<div className={LAYOUT_TOKENS.header.dropdownSection}>
												<div className={LAYOUT_TOKENS.header.sectionHeader}>
													機能切り替え
												</div>
												<Link
													to="/fishtracker/fish"
													onClick={() => setIsOpen(false)}
													className={
														!isTrustMode
															? LAYOUT_TOKENS.header.dropdownItemActive(false)
															: LAYOUT_TOKENS.header.dropdownItemInactive
													}
												>
													<div className="flex items-center gap-2">
														<Fish className={icon.sm} />
														<span>釣魚チェッカー</span>
													</div>
													{!isTrustMode && <Check className={`${icon.sm} ${icon.active(false)}`} />}
												</Link>

												<Link
													to="/trusttracker"
													onClick={() => setIsOpen(false)}
													className={
														isTrustMode
															? LAYOUT_TOKENS.header.dropdownItemActive(false)
															: LAYOUT_TOKENS.header.dropdownItemInactive
													}
												>
													<div className="flex items-center gap-2">
														<Scroll className={icon.sm} />
														<span>フェイスチェッカー</span>
													</div>
													{isTrustMode && <Check className={`${icon.sm} ${icon.active(false)}`} />}
												</Link>
											</div>

											{/* 2. システム・設定 */}
											<div className={LAYOUT_TOKENS.header.dropdownDividerSection}>
												<div className={LAYOUT_TOKENS.header.sectionHeader}>
													システム
												</div>
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

												{isDev && onOpenMasterEditor && (
													<button
														type="button"
														onClick={() => {
															setIsOpen(false);
															onOpenMasterEditor();
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
							</>
						) : isInApp ? (
							<div className="relative">
								<button
									type="button"
									onClick={handleOpenBrowser}
									className={LAYOUT_TOKENS.control.button}
								>
									<ExternalLink className={icon.sm} />
									<span>ブラウザで開く</span>
								</button>
								{showCopyNotice && (
									<div className="absolute right-0 top-full mt-2 w-64 p-2 bg-gray-800 text-white text-xs rounded shadow-lg z-50 text-center">
										URLをコピーしました。SafariやChromeに貼り付けて開いてください。
									</div>
								)}
							</div>
						) : (
							<Link
								to={registerPath}
								state={{ from: `${location.pathname}${location.search}` }}
								className={LAYOUT_TOKENS.control.button}
							>
								<UserPlus className={icon.sm} />
								<span>登録してはじめる</span>
							</Link>
						)}
					</div>

				</div>
			</div>
		</header>
	);
};