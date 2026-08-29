/**
 * ============================================================================
 * [FilePath] src/App.tsx
 * [Role] アプリケーションのルートコンポーネント（Context / パスベースルーティング版）
 * 
 * [概要]
 * - HelmetProvider, BrowserRouter, UserDataProvider による基盤層の構築
 * - 各種グローバルモーダル（Onboarding, Settings, MasterDataEditor）の配置と制御
 * ============================================================================
 */

import { useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

import { UserDataProvider, useUserDataContext } from '@/contexts/UserDataContext';
import { OnboardingModal } from '@/components/common/OnboardingModal';
import { SettingsModal } from '@/components/settings/SettingsModal';
import { MasterDataEditorModal } from '@/components/dev/MasterDataEditorModal';
import { DynamicOgpMeta } from '@/components/share/DynamicOgpMeta';
import { AppRouter } from '@/routes/AppRouter';

function AppContent() {
  const {
    activeCharacter,
    isRegistered,
    registrationMessage,
    setRegistrationMessage,
    handleCreateCharacterAndClose,
  } = useUserDataContext();

  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <>
      <DynamicOgpMeta />

      <AppRouter
        setIsSettingsOpen={setIsSettingsOpen}
        setIsEditorOpen={setIsEditorOpen}
      />

      <OnboardingModal
        isOpen={(!isRegistered || !activeCharacter) && registrationMessage !== null}
        onClose={() => setRegistrationMessage(null)}
        onCreateCharacter={handleCreateCharacterAndClose}
        message={registrationMessage}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
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
        <UserDataProvider>
          <AppContent />
        </UserDataProvider>
      </BrowserRouter>
    </HelmetProvider>
  );
}