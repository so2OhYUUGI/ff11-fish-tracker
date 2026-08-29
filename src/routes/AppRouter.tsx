/**
 * ============================================================================
 * [FilePath] src/routes/AppRouter.tsx
 * [Role] アプリケーションのパスベースルーティング定義コンポーネント
 * 
 * [概要]
 * - URLパスに応じた表示コンポーネントの切替およびリダイレクトを制御する
 * - 未登録ユーザーに対しては `canViewContainer` フラグに基づき LandingPage を表示する
 * - 詳細画面（slug指定）アクセスの場合は共有リンク・直接アクセスに対応するため MainLayout 内で表示する
 * 
 * [依存関係・関連ファイル]
 * - Context      : src/contexts/UserDataContext.tsx
 * - レイアウト  : src/components/layout/MainLayout.tsx
 * - ページ      : src/components/LandingPage.tsx
 * - 機能コンテナ: src/features/fishtracker/FishTrackerContainer.tsx
 * 
 * [編集・改修時の注意事項（AI/エンジニア共通指示）]
 * 1. 【レイアウト一貫性】 MainLayout を適用するルートは renderWithMainLayout ヘルパーを経由して共通化すること
 * 2. 【閲覧権限判定】 一覧画面（/fishtracker/:type）の描画判定には canViewContainer を使用し、未登録時は LandingPage へフォールバックさせること
 * 3. 【リダイレクト設計】 不正なパスやルートパスへのアクセスは `/fishtracker/fish` へ安全にリダイレクトさせること
 * ============================================================================
 */

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useUserDataContext } from '@/contexts/UserDataContext';
import { MainLayout } from '@/components/layout/MainLayout';
import { LandingPage } from '@/components/LandingPage';
import { FishTrackerContainer } from '@/features/fishtracker/FishTrackerContainer';

type AppRouterProps = {
	setIsSettingsOpen: (open: boolean) => void;
	setIsEditorOpen: (open: boolean) => void;
};

export function AppRouter({
	setIsSettingsOpen,
	setIsEditorOpen,
}: AppRouterProps) {
	const { canViewContainer } = useUserDataContext();

	// MainLayout 適用用の共通レンダーヘルパー関数
	const renderWithMainLayout = (children: React.ReactNode) => (
		<MainLayout
			onOpenSettings={() => setIsSettingsOpen(true)}
			onOpenMasterEditor={() => setIsEditorOpen(true)}
		>
			{children}
		</MainLayout>
	);

	return (
		<Routes>
			{/* リダイレクトルート */}
			<Route path="/" element={<Navigate to="/fishtracker/fish" replace />} />
			<Route path="/fishtracker" element={<Navigate to="/fishtracker/fish" replace />} />

			{/* 1. 一覧表示（slug なし）: 閲覧権限の有無で表示・レイアウトを分離 */}
			<Route
				path="/fishtracker/:type"
				element={
					canViewContainer
						? renderWithMainLayout(<FishTrackerContainer />)
						: <LandingPage />
				}
			/>

			{/* 2. 詳細表示（slug あり）: 共有・直接リンクアクセスのため常に MainLayout 内で表示 */}
			<Route
				path="/fishtracker/:type/:slug"
				element={renderWithMainLayout(<FishTrackerContainer />)}
			/>

			{/* ワイルドカードリダイレクト */}
			<Route path="*" element={<Navigate to="/fishtracker/fish" replace />} />
		</Routes>
	);
}