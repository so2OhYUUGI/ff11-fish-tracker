/**
 * ============================================================================
 * [FilePath] src/routes/AppRouter.tsx
 * [Role]     アプリケーションのパスベースルーティング定義コンポーネント
 * 
 * [概要]
 * - URLパスに応じた表示コンポーネントの切替およびリダイレクトを制御する
 * - URLパスに基づいてグローバルテーマ（data-theme）をHTML要素へ反映する
 * - 未登録ユーザーに対しては `canViewContainer` フラグに基づき LandingPage を表示する
 * - 詳細画面（slug指定）アクセスの場合は共有リンク・直接アクセスに対応するため MainLayout 内で表示する
 * - 魚チェッカーと同等のサブタイプ構造（フェイス一覧/ウィッシュリスト/マクロ管理）に対応
 * 
 * [依存関係・関連ファイル]
 * - Context      : src/contexts/UserDataContext.tsx
 * - レイアウト  : src/components/layout/MainLayout.tsx
 * - ページ      : src/components/LandingPage.tsx
 * - 機能コンテナ: src/features/fishtracker/FishTrackerContainer.tsx
 *                src/features/trusttracker/TrustTrackerContainer.tsx
 * 
 * [編集・改修時の注意事項（AI/エンジニア共通指示）]
 * 1. 【レイアウト一貫性】 MainLayout を適用するルートは renderWithMainLayout ヘルパーを経由して共通化すること
 * 2. 【閲覧権限判定】 一覧画面（/fishtracker/:type, /trusttracker/:type）の描画判定には canViewContainer を使用し、未登録時は LandingPage へフォールバックさせること
 * 3. 【リダイレクト設計】 不正なパスやルートパスへのアクセスは `/fishtracker/fish` へ安全にリダイレクトさせること。`/trusttracker` 単体アクセスは `/trusttracker/trust` へリダイレクトすること
 * ============================================================================
 */

import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useUserDataContext } from '@/contexts/UserDataContext';
import { MainLayout } from '@/components/layout/MainLayout';
import { LandingPage } from '@/components/LandingPage';
import { FishTrackerContainer } from '@/features/fishtracker/FishTrackerContainer';
import { TrustTrackerContainer } from '@/features/trusttracker/TrustTrackerContainer';

// ルートプレフィックスとテーマ名の対応表（将来の機能拡張時にここへ追加）
const ROUTE_THEME_MAP: Record<string, string> = {
  '/trusttracker': 'trust',
  '/fishtracker': 'fish',
  // 例: '/magictracker': 'magic',
};

// デフォルトのテーマ（マッチしないパス・指定なし・不明なパス用）
const DEFAULT_THEME = 'fish';

type AppRouterProps = {
  setIsSettingsOpen: (open: boolean) => void;
  setIsEditorOpen: (open: boolean) => void;
};

export function AppRouter({
  setIsSettingsOpen,
  setIsEditorOpen,
}: AppRouterProps) {
  const { canViewContainer } = useUserDataContext();
  const location = useLocation();

  // パスに基づいてテーマ（data-theme）を <html> タグに反映
  useEffect(() => {
    const matchedPath = Object.keys(ROUTE_THEME_MAP).find((path) =>
      location.pathname.startsWith(path)
    );

    const theme = matchedPath ? ROUTE_THEME_MAP[matchedPath] : DEFAULT_THEME;

    document.documentElement.setAttribute('data-theme', theme);
  }, [location.pathname]);

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

      {/* ====================================================================
       * 1. 釣魚チェッカー (fishtracker)
       * ==================================================================== */}
      {/* 一覧表示（slug なし） */}
      <Route
        path="/fishtracker/:type"
        element={
          canViewContainer
            ? renderWithMainLayout(<FishTrackerContainer />)
            : <LandingPage />
        }
      />
      {/* 詳細表示（slug あり） */}
      <Route
        path="/fishtracker/:type/:slug"
        element={renderWithMainLayout(<FishTrackerContainer />)}
      />

      {/* ====================================================================
       * 2. フェイスチェッカー (trusttracker)
       *    サブタイプ: trust (フェイス一覧), wishlist (ウィッシュリスト), macro (マクロ管理)
       * ==================================================================== */}
      {/* リダイレクト (デフォルトサブタイプ: trust) */}
      <Route path="/trusttracker" element={<Navigate to="/trusttracker/trust" replace />} />

      {/* 一覧表示（slug なし） */}
      <Route
        path="/trusttracker/:type"
        element={
          canViewContainer
            ? renderWithMainLayout(<TrustTrackerContainer />)
            : <LandingPage />
        }
      />
      {/* 詳細表示（slug あり） */}
      <Route
        path="/trusttracker/:type/:slug"
        element={renderWithMainLayout(<TrustTrackerContainer />)}
      />

      {/* ワイルドカードリダイレクト */}
      <Route path="*" element={<Navigate to="/fishtracker/fish" replace />} />
    </Routes>
  );
}