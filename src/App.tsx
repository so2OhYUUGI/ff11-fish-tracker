/**
 * ============================================================================
 * [FilePath] src/App.tsx
 * [Role] アプリケーションのルートコンポーネント（Context / パスベースルーティング版）
 * 
 * [概要]
 * - HelmetProvider, BrowserRouter, UserDataProvider による基盤層の構築
 * - 各種グローバルモーダル（Onboarding, Settings, MasterDataEditor）の配置と制御
 * - アプリケーション全体のルーティング（AppRouter）および動的OGP（DynamicOgpMeta）の呼び出し
 * 
 * [依存関係・関連ファイル]
 * - Context    : src/contexts/UserDataContext.tsx
 * - ルーティング: src/routes/AppRouter.tsx
 * - モーダル  : src/components/common/OnboardingModal.tsx, src/components/settings/SettingsModal.tsx, src/components/dev/MasterDataEditorModal.tsx
 * - メタ情報  : src/components/share/DynamicOgpMeta.tsx
 * 
 * [編集・改修時の注意事項（AI/エンジニア共通指示）]
 * 1. 【Context参照範囲】 useUserDataContext を参照するコンポーネント（AppContent）は、必ず UserDataProvider の配下に配置すること
 * 2. 【関心事の分離】 App.tsx 内で直接 Routes や Route を定義せず、ルーティング制御は AppRouter.tsx に委ねること
 * 3. 【モーダル状態】 グローバルダイアログの開閉状態（isSettingsOpen, isEditorOpen）は本ファイルで保持し、開閉ハンドラを AppRouter へ渡す構造を維持すること
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