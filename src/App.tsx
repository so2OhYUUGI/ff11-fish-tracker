/**
 * ============================================================================
 * [FilePath] src/App.tsx
 * [Role] アプリケーションのルートコンポーネント（パスベースルーティング版）
 * 
 * [調整内容]
 * - 共有キャラ選択時に詳細ページへ遷移しても選択コンテキストが解除されないよう、ステート維持ロジックを補正
 * ============================================================================
 */

import { useState, useMemo, useEffect, useRef } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
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

  // URL共有データの取得
  const { sharedProgress } = useSharedProgress();

  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [registrationMessage, setRegistrationMessage] = useState<string | null>(null);

  // 初回読み込み・自動選択制御フラグ
  const hasAutoSelectedSharedRef = useRef(false);

  // 画面上で選択中のキャラクターID
  const [selectedCharacterId, setSelectedCharacterId] = useState<string | null>(null);

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
    const activeShared = sharedProgress ? lastSharedCharRef.current : null;
    const targetShared = activeShared || (selectedCharacterId === 'shared-guest-character' ? lastSharedCharRef.current : null);

    if (!targetShared) return userData.characters;
    return [...userData.characters, targetShared];
  }, [userData.characters, sharedProgress, selectedCharacterId]);

  // 共有データの初回自動選択処理
  useEffect(() => {
    if (sharedProgress && !hasAutoSelectedSharedRef.current) {
      setSelectedCharacterId('shared-guest-character');
      hasAutoSelectedSharedRef.current = true;
    }
  }, [sharedProgress]);

  // 現在表示選択中のキャラ
  const currentActiveCharacter = useMemo<DisplayCharacterProgress | undefined>(() => {
    if (selectedCharacterId) {
      const found = displayCharacters.find((c) => c.id === selectedCharacterId);
      if (found) return found;
    }

    if (activeCharacter) {
      return displayCharacters.find((c) => c.id === activeCharacter.id) || activeCharacter;
    }

    return displayCharacters[0];
  }, [selectedCharacterId, displayCharacters, activeCharacter]);

  // キャラクター選択変更ハンドラー
  const handleSelectCharacter = (characterId: string) => {
    setSelectedCharacterId(characterId);
    if (userData.characters.some((c) => c.id === characterId)) {
      setLocalActiveCharacter(characterId);
    }
  };

  // 閲覧可能判定（登録済み、共有データが存在する、または共有キャラ選択中）
  const canViewContainer = isRegistered || !!sharedProgress || selectedCharacterId === 'shared-guest-character';

  const handleRequestRegistration = (msg: string) => {
    setRegistrationMessage(msg);
  };

  const handleCreateCharacterAndClose = (name: string) => {
    addCharacter(name);
    setRegistrationMessage(null);
  };

  return (
    <>
      <DynamicOgpMeta />
      <Routes>
        <Route path="/" element={<Navigate to="/fishtracker/fish" replace />} />
        <Route path="/fishtracker" element={<Navigate to="/fishtracker/fish" replace />} />

        {!canViewContainer && (
          <Route
            path="/fishtracker/:type"
            element={<LandingPage onCreateCharacter={addCharacter} />}
          />
        )}

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