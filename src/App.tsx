/**
 * ============================================================================
 * [FilePath] src/App.tsx
 * [Role] アプリケーションのルートコンポーネント（パスベースルーティング版）
 * 
 * [調整内容]
 * - useState 初期化関数内での ref ミューテーションを廃止し、useEffect に自動選択およびクリーンアップを一本化
 * - sharedProgress 解除時に滞留する selectedCharacterId のリセット処理を追加
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
import { FishTrackerContainer } from '@/features/fishtracker/FishTrackerContainer';
import type { DisplayCharacterProgress } from '@/components/layout/Header';

function AppRoutes() {
  const userDataProps = useUserData();
  const { userData, activeCharacter, isRegistered, addCharacter, setActiveCharacter: setLocalActiveCharacter } = userDataProps;

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
    // 1. 選択中のキャラIDが存在すれば優先
    if (selectedCharacterId) {
      const found = displayCharacters.find((c) => c.id === selectedCharacterId);
      if (found) return found;
    }

    // 2. 登録ユーザーのデフォルト選択（useUserData の activeCharacter）
    if (activeCharacter) {
      return displayCharacters.find((c) => c.id === activeCharacter.id) || activeCharacter;
    }

    // 3. フォールバック（一覧の先頭キャラ）
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

        {/* メインルート：未登録かつ共有データ無しの場合のみオンボーディング（LandingPage）を表示 */}
        <Route
          path="/fishtracker/:type"
          element={
            !canViewContainer ? (
              <LandingPage onCreateCharacter={addCharacter} />
            ) : (
              <FishTrackerContainer
                {...userDataProps}
                displayCharacters={displayCharacters}
                activeCharacter={currentActiveCharacter}
                setActiveCharacter={handleSelectCharacter}
                onOpenSettings={() => setIsSettingsOpen(true)}
                onOpenMasterEditor={() => setIsEditorOpen(true)}
                onRequestRegistration={handleRequestRegistration}
              />
            )
          }
        />

        {/* 詳細ページ（シェアリンク等）：未登録状態であっても閲覧を許可 */}
        <Route
          path="/fishtracker/:type/:slug"
          element={
            <FishTrackerContainer
              {...userDataProps}
              displayCharacters={displayCharacters}
              activeCharacter={currentActiveCharacter}
              setActiveCharacter={handleSelectCharacter}
              onOpenSettings={() => setIsSettingsOpen(true)}
              onOpenMasterEditor={() => setIsEditorOpen(true)}
              onRequestRegistration={handleRequestRegistration}
            />
          }
        />

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