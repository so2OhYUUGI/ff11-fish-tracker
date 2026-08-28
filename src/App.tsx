/**
 * ============================================================================
 * [FilePath] src/App.tsx
 * [Role] アプリケーションのルートコンポーネント（パスベースルーティング版）
 * 
 * [概要]
 * - パスベースルーティングの定義およびダイアログ・モーダル状態の管理
 * - 共有URLパラメータ（share）からのゲストキャラクター進捗復元とURLクリーンアップ処理
 * - 共有リンクアクセス時は閲覧利便性の向上のため自動でリスト表示（list）へ変更
 * - 登録済み / 未登録ユーザーに応じた閲覧権限の判定と表示切替
 *   - 一覧表示 (/fishtracker/:type): 未登録かつ共有データなしの場合は LandingPage を表示
 *   - 詳細表示 (/fishtracker/:type/:slug): 未登録ユーザーであっても閲覧可能
 * ============================================================================
 */

import { useState, useMemo, useEffect, useRef } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

import { useUserData } from '@/hooks/useUserData';
import { useSharedProgress } from '@/hooks/useSharedProgress';
import { LandingPage } from '@/components/LandingPage';
import { OnboardingModal } from '@/components/common/OnboardingModal';
import { SettingsModal } from '@/components/settings/SettingsModal';
import { MasterDataEditorModal } from '@/components/dev/MasterDataEditorModal';
import { MainLayout } from '@/components/layout/MainLayout';
import { FishTrackerContainer } from '@/features/fishtracker/FishTrackerContainer';
import type { DisplayCharacterProgress } from '@/components/layout/Header';
import { DynamicOgpMeta } from '@/components/share/DynamicOgpMeta';

function AppRoutes() {
  const userDataProps = useUserData();
  const {
    userData,
    activeCharacter,
    isRegistered,
    viewMode,
    setViewMode,
    addCharacter,
    setActiveCharacter: setLocalActiveCharacter,
    toggleFishCheck,
  } = userDataProps;

  const location = useLocation();
  const navigate = useNavigate();

  // URL共有データの取得
  const { sharedProgress } = useSharedProgress();

  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [registrationMessage, setRegistrationMessage] = useState<string | null>(null);

  // 初回読み込み・自動選択制御フラグ
  const hasAutoSelectedSharedRef = useRef(false);

  // 共有キャラクターデータのキャッシュ（URLパラメータ変化時も表示コンテキストを維持）
  const lastSharedCharRef = useRef<DisplayCharacterProgress | null>(null);

  if (sharedProgress) {
    lastSharedCharRef.current = {
      id: 'shared-guest-character',
      name: sharedProgress.characterName,
      checkedFishIds: sharedProgress.checkedFishIds,
      createdAt: sharedProgress.createdAt,
      updatedAt: sharedProgress.createdAt,
      isShared: true,
    };
  }

  // 共有データが存在する場合、または選択中の場合はインメモリキャラとして一覧末尾に追加
  const displayCharacters = useMemo<DisplayCharacterProgress[]>(() => {
    if (!lastSharedCharRef.current) return userData.characters;
    return [...userData.characters, lastSharedCharRef.current];
  }, [userData.characters, sharedProgress]);

  // 共有データの初回自動選択、表示モードの自動切替、およびURLクエリパラメータのクリーンアップ処理
  useEffect(() => {
    if (sharedProgress && !hasAutoSelectedSharedRef.current) {
      setLocalActiveCharacter('shared-guest-character');

      // 共有データ閲覧時は情報密度の高いリスト表示に変更
      setViewMode('list');

      hasAutoSelectedSharedRef.current = true;

      // URLからクエリ（share/ハッシュ等）を削除してアドレスバーをクリーン化
      const searchParams = new URLSearchParams(location.search);
      if (searchParams.has('share')) {
        searchParams.delete('share');
        const newSearch = searchParams.toString();
        const newPath = location.pathname + (newSearch ? `?${newSearch}` : '');
        navigate(newPath, { replace: true });
      }
    }
  }, [sharedProgress, location.pathname, location.search, navigate, setLocalActiveCharacter, setViewMode]);

  // 現在表示選択中のキャラ（useUserData 側の activeCharacterId 一元管理に統一）
  const currentActiveCharacter = useMemo<DisplayCharacterProgress | undefined>(() => {
    if (userData.activeCharacterId) {
      const found = displayCharacters.find((c) => c.id === userData.activeCharacterId);
      if (found) return found;
    }

    if (activeCharacter) {
      return displayCharacters.find((c) => c.id === activeCharacter.id) || activeCharacter;
    }

    return displayCharacters[0];
  }, [userData.activeCharacterId, displayCharacters, activeCharacter]);

  // キャラクター選択変更ハンドラー
  const handleSelectCharacter = (characterId: string) => {
    setLocalActiveCharacter(characterId);
  };

  // 共有キャラクターがキャッシュされているかどうかの判定
  const hasSharedGuestCharacter = lastSharedCharRef.current !== null;

  // 一覧ページの閲覧権限判定（登録済み、共有データ保持、または共有キャラ選択中）
  const canViewContainer =
    isRegistered ||
    !!sharedProgress ||
    hasSharedGuestCharacter;

  const handleRequestRegistration = (msg: string) => {
    setRegistrationMessage(msg);
  };

  const handleCreateCharacterAndClose = (name: string) => {
    const newChar = addCharacter(name);
    if (newChar?.id) {
      setLocalActiveCharacter(newChar.id);
    }
    setRegistrationMessage(null);
  };

  return (
    <>
      <DynamicOgpMeta />
      <Routes>
        <Route path="/" element={<Navigate to="/fishtracker/fish" replace />} />
        <Route path="/fishtracker" element={<Navigate to="/fishtracker/fish" replace />} />

        {/* 1. 一覧表示（slug なし）: 権限がない場合は LandingPage を表示 */}
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
          {/* 一覧表示（slug なし）: 権限がある場合のみ表示 */}
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

          {/* 詳細表示（slug あり）: 共有/直接リンクアクセスのため無条件で許可 */}
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

      <OnboardingModal
        isOpen={(!isRegistered || !activeCharacter) && registrationMessage !== null}
        onClose={() => setRegistrationMessage(null)}
        onCreateCharacter={handleCreateCharacterAndClose}
        message={registrationMessage}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        characters={userData.characters}
        activeCharacterId={activeCharacter?.id || ''}
        onSelectCharacter={handleSelectCharacter}
        onAddCharacter={addCharacter}
        onRenameCharacter={userDataProps.renameCharacter}
        onDeleteCharacter={userDataProps.deleteCharacter}
        onExport={userDataProps.exportData}
        onImport={userDataProps.importData}
      />

      <MasterDataEditorModal
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
      />
    </>
  );
}

export default function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </HelmetProvider>
  );
}