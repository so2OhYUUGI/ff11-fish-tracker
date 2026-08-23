/**
 * ============================================================================
 * [FilePath] src/App.tsx
 * [Role] アプリケーションのルートコンポーネント（パスベースルーティング版）
 * ============================================================================
 */

import { useState } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

import { useUserData } from '@/hooks/useUserData';
import { LandingPage } from '@/components/LandingPage';
import { OnboardingModal } from '@/components/common/OnboardingModal';
import { SettingsModal } from '@/components/settings/SettingsModal';
import { MasterDataEditorModal } from '@/components/dev/MasterDataEditorModal';
import { FishTrackerContainer } from '@/features/fishtracker/FishTrackerContainer';

export default function App() {
  const userDataProps = useUserData();
  const { userData, activeCharacter, isRegistered, addCharacter } = userDataProps;

  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [registrationMessage, setRegistrationMessage] = useState<string | null>(null);

  const handleRequestRegistration = (msg: string) => {
    setRegistrationMessage(msg);
  };

  const handleCreateCharacterAndClose = (name: string) => {
    addCharacter(name);
    setRegistrationMessage(null);
  };

  return (
    <HelmetProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/fishtracker/fish" replace />} />
          <Route path="/fishtracker" element={<Navigate to="/fishtracker/fish" replace />} />

          {/* 一覧ページ：未登録の場合はオンボーディング（LandingPage）を表示 */}
          <Route
            path="/fishtracker/:type"
            element={
              !isRegistered || !activeCharacter ? (
                <LandingPage onCreateCharacter={addCharacter} />
              ) : (
                <FishTrackerContainer
                  {...userDataProps}
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

        <SettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          characters={userData.characters}
          activeCharacterId={activeCharacter?.id || ''}
          onSelectCharacter={userDataProps.setActiveCharacter}
          onAddCharacter={userDataProps.addCharacter}
          onRenameCharacter={userDataProps.renameCharacter}
          onDeleteCharacter={userDataProps.deleteCharacter}
          onExport={userDataProps.exportData}
          onImport={userDataProps.importData}
        />

        <MasterDataEditorModal
          isOpen={isEditorOpen}
          onClose={() => setIsEditorOpen(false)}
        />
      </BrowserRouter>
    </HelmetProvider>
  );
}