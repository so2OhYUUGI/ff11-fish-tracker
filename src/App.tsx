/**
 * ============================================================================
 * [FilePath] src/App.tsx
 * [Role] アプリケーションのルートコンポーネント（パスベースルーティング版）
 * 
 * [調整内容]
 * - MainLayout 導入に伴う Layout Route 構造の適用
 * - 未登録時の LandingPage と MainLayout 配下ルートの重複定義を解消
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

  // 初回読み込みフラグ
  const hasAutoSelectedSharedRef = useRef(false);

  // 画面上で選択中のキャラクターID
  const [selectedCharacterId, setSelectedCharacterId] = useState<string | null>(null);

  // 共有データが存在する場合、インメモリキャラとして一覧末尾に追加
  const displayCharacters = useMemo<DisplayCharacterProgress[]>(() => {
    if (!sharedProgress) return userData.characters;

    const sharedChar: DisplayCharacterProgress = {
      id: 'shared-guest-character',
      name: sharedProgress.characterName,
      checkedFishIds: sharedProgress.checkedFishIds,
      createdAt: sharedProgress.createdAt,
      updatedAt: sharedProgress.createdAt,
      isShared: true,
    };

    return [...userData.characters, sharedChar];
  }, [userData.characters, sharedProgress]);

  // 共有データの初回自動選択および解除時のステートクリーンアップ
  useEffect(() => {
    if (sharedProgress) {
      if (!hasAutoSelectedSharedRef.current) {
        setSelectedCharacterId('shared-guest-character');
        hasAutoSelectedSharedRef.current = true;
      }
    } else {
      hasAutoSelectedSharedRef.current = false;
      setSelectedCharacterId((prev) => (prev === 'shared-guest-character' ? null : prev));
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

  // 閲覧可能判定（登録済み、または共有データが存在する場合）
  const canViewContainer = isRegistered || !!sharedProgress;

  const handleRequestRegistration = (msg: string) => {
    setRegistrationMessage(msg);
  };

  const handleCreateCharacterAndClose = (name: string) => {
    addCharacter(name);
    setRegistrationMessage(null);
  };

  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/fishtracker/fish" replace />} />
        <Route path="/fishtracker" element={<Navigate to="/fishtracker/fish" replace />} />

        {/* 未登録かつ共有データ無しの場合のみ、メインルートで LandingPage（共通レイアウトなし）を表示 */}
        {!canViewContainer && (
          <Route
            path="/fishtracker/:type"
            element={<LandingPage onCreateCharacter={addCharacter} />}
          />
        )}

        {/* 共通レイアウト適用ルートグループ */}
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
          {/* 登録済み／共有データありの場合のみメインルートを FishTrackerContainer で描画 */}
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

          {/* 詳細ルート（未登録時でもダイレクトアクセス可能） */}
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

      {/* 閲覧中ユーザーが回遊・アクションしようとした際の登録モーダル */}
      <OnboardingModal
        isOpen={(!isRegistered || !activeCharacter) && registrationMessage !== null}
        onClose={() => setRegistrationMessage(null)}
        onCreateCharacter={handleCreateCharacterAndClose}
        message={registrationMessage}
      />

      {/* 設定モーダル */}
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