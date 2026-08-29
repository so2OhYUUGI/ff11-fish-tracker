/**
 * ============================================================================
 * [FilePath] src/routes/AppRouter.tsx
 * [Role] アプリケーションのルーティング定義コンポーネント
 * ============================================================================
 */

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

	return (
		<Routes>
			<Route path="/" element={<Navigate to="/fishtracker/fish" replace />} />
			<Route path="/fishtracker" element={<Navigate to="/fishtracker/fish" replace />} />

			{/* 1. 一覧表示（slug なし）: 閲覧権限がない場合は MainLayout の外側で LandingPage を表示 */}
			{!canViewContainer && (
				<Route
					path="/fishtracker/:type"
					element={<LandingPage />}
				/>
			)}

			{/* 2. メインレイアウト配下のルーティング */}
			<Route
				element={
					<MainLayout
						onOpenSettings={() => setIsSettingsOpen(true)}
						onOpenMasterEditor={() => setIsEditorOpen(true)}
					/>
				}
			>
				{/* 一覧表示（slug なし）: 閲覧権限がある場合のみ表示 */}
				{canViewContainer && (
					<Route
						path="/fishtracker/:type"
						element={<FishTrackerContainer />}
					/>
				)}

				{/* 詳細表示（slug あり）: 共有・直接リンクアクセスのため無条件で許可 */}
				<Route
					path="/fishtracker/:type/:slug"
					element={<FishTrackerContainer />}
				/>
			</Route>

			<Route path="*" element={<Navigate to="/fishtracker/fish" replace />} />
		</Routes>
	);
}