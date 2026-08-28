/**
 * ============================================================================
 * [FilePath] src/routes/AppRouter.tsx
 * [Role] アプリケーションのルーティング定義コンポーネント
 * 
 * [概要]
 * - パスベースルーティングの定義を集約
 * - MainLayout を軸とした Outlet パターンの構築
 * - 未登録時の LandingPage 全画面表示制御および閲覧権限制御
 * ============================================================================
 */

import { Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { LandingPage } from '@/components/LandingPage';
import { FishTrackerContainer } from '@/features/fishtracker/FishTrackerContainer';
import type { DisplayCharacterProgress } from '@/components/layout/Header';
import type { ViewMode } from '@/types/fishtracker';

type AppRouterProps = {
	displayCharacters: DisplayCharacterProgress[];
	currentActiveCharacter: DisplayCharacterProgress | undefined;
	canViewContainer: boolean;
	isRegistered: boolean;
	viewMode: ViewMode;
	setViewMode: (mode: ViewMode) => void;
	toggleFishCheck: (fishId: number) => void;
	handleSelectCharacter: (characterId: string) => void;
	addCharacter: (name: string) => DisplayCharacterProgress | null;
	handleRequestRegistration: (msg: string) => void;
	setIsSettingsOpen: (open: boolean) => void;
	setIsEditorOpen: (open: boolean) => void;
};

export function AppRouter({
	displayCharacters,
	currentActiveCharacter,
	canViewContainer,
	isRegistered,
	viewMode,
	setViewMode,
	toggleFishCheck,
	handleSelectCharacter,
	addCharacter,
	handleRequestRegistration,
	setIsSettingsOpen,
	setIsEditorOpen,
}: AppRouterProps) {
	return (
		<Routes>
			<Route path="/" element={<Navigate to="/fishtracker/fish" replace />} />
			<Route path="/fishtracker" element={<Navigate to="/fishtracker/fish" replace />} />

			{/* 1. 一覧表示（slug なし）: 閲覧権限がない場合は MainLayout の外側で LandingPage を表示 */}
			{!canViewContainer && (
				<Route
					path="/fishtracker/:type"
					element={<LandingPage onCreateCharacter={addCharacter} />}
				/>
			)}

			{/* 2. メインレイアウト配下のルーティング */}
			<Route
				element={
					<MainLayout
						characters={displayCharacters}
						activeCharacter={currentActiveCharacter}
						onSelectCharacter={handleSelectCharacter}
						onOpenSettings={() => setIsSettingsOpen(true)}
						onOpenMasterEditor={() => setIsEditorOpen(true)}
					/>
				}
			>
				{/* 一覧表示（slug なし）: 閲覧権限がある場合のみ表示 */}
				{canViewContainer && (
					<Route
						path="/fishtracker/:type"
						element={
							<FishTrackerContainer
								activeCharacter={currentActiveCharacter}
								isRegistered={isRegistered}
								viewMode={viewMode}
								setViewMode={setViewMode}
								toggleFishCheck={toggleFishCheck}
								onRequestRegistration={handleRequestRegistration}
							/>
						}
					/>
				)}

				{/* 詳細表示（slug あり）: 共有・直接リンクアクセスのため無条件で許可 */}
				<Route
					path="/fishtracker/:type/:slug"
					element={
						<FishTrackerContainer
							activeCharacter={currentActiveCharacter}
							isRegistered={isRegistered}
							viewMode={viewMode}
							setViewMode={setViewMode}
							toggleFishCheck={toggleFishCheck}
							onRequestRegistration={handleRequestRegistration}
						/>
					}
				/>
			</Route>

			<Route path="*" element={<Navigate to="/fishtracker/fish" replace />} />
		</Routes>
	);
}