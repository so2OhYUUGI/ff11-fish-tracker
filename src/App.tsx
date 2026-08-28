/**
 * ============================================================================
 * [FilePath] src/App.tsx
 * [Role] アプリケーションのルートコンポーネント（パスベースルーティング版）
 * 
 * [概要]
 * - アプリケーション全体のグローバル状態管理とモーダル・ダイアログ制御
 * - 共有URLパラメータ（share）からのゲストキャラクター進捗復元とURLクリーンアップ処理
 * - 切り出した AppRouter によるルーティング・閲覧権限制御の委譲
 * ============================================================================
 */

import { useState, useMemo, useEffect, useRef } from 'react';
import {
  BrowserRouter,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

import { useUserData } from '@/hooks/useUserData';
import { useSharedProgress } from '@/hooks/useSharedProgress';
import { OnboardingModal } from '@/components/common/OnboardingModal';
import { SettingsModal } from '@/components/settings/SettingsModal';
import { MasterDataEditorModal } from '@/components/dev/MasterDataEditorModal';
import type { DisplayCharacterProgress } from '@/components/layout/Header';
import { DynamicOgpMeta } from '@/components/share/DynamicOgpMeta';
import { AppRouter } from '@/routes/AppRouter';
import { SHARED_GUEST_CHARACTER_ID } from '@/constants/character';

// 未登録かつ共有データもない場合に表示するフォールバック用のゲストキャラクター
const FALLBACK_GUEST_CHARACTER: DisplayCharacterProgress = {
  id: SHARED_GUEST_CHARACTER_ID,
  name: 'ゲスト',
  checkedFishIds: [],
  createdAt: Date.now(),
  updatedAt: Date.now(),
  isShared: true,
};

function AppContent() {
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

  // sharedProgress が存在する場合のみオブジェクトを生成
  const currentSharedCharacter = useMemo<DisplayCharacterProgress | null>(() => {
    if (!sharedProgress) return null;
    return {
      id: SHARED_GUEST_CHARACTER_ID,
      name: sharedProgress.characterName,
      checkedFishIds: sharedProgress.checkedFishIds,
      createdAt: sharedProgress.createdAt,
      updatedAt: sharedProgress.createdAt,
      isShared: true,
    };
  }, [sharedProgress]);

  // useEffect で安全に ref をキャッシュ更新
  useEffect(() => {
    if (currentSharedCharacter) {
      lastSharedCharRef.current = currentSharedCharacter;
    }
  }, [currentSharedCharacter]);

  // 表示用共有キャラ（現在の共有データ、またはキャッシュされた過去の共有データ）
  const activeSharedCharacter = currentSharedCharacter || lastSharedCharRef.current;

  // 表示用キャラクター一覧（キャラ未登録かつ共有データもない場合は FALLBACK_GUEST_CHARACTER を挿入）
  const displayCharacters = useMemo<DisplayCharacterProgress[]>(() => {
    if (activeSharedCharacter) {
      return [...userData.characters, activeSharedCharacter];
    }
    if (userData.characters.length === 0) {
      return [FALLBACK_GUEST_CHARACTER];
    }
    return userData.characters;
  }, [userData.characters, activeSharedCharacter]);

  // 共有データの初回自動選択、表示モードの自動切替、およびURLクエリパラメータのクリーンアップ処理
  useEffect(() => {
    if (sharedProgress && !hasAutoSelectedSharedRef.current) {
      setLocalActiveCharacter(SHARED_GUEST_CHARACTER_ID);

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

  // 現在表示選択中のキャラ（常に有効な DisplayCharacterProgress を返却）
  const currentActiveCharacter = useMemo<DisplayCharacterProgress>(() => {
    if (userData.activeCharacterId) {
      const found = displayCharacters.find((c) => c.id === userData.activeCharacterId);
      if (found) return found;
    }

    if (activeCharacter) {
      const found = displayCharacters.find((c) => c.id === activeCharacter.id);
      if (found) return found;
    }

    // いずれにも該当しない場合はリストの先頭（FALLBACK_GUEST_CHARACTER を含む）を確実に返す
    return displayCharacters[0];
  }, [userData.activeCharacterId, displayCharacters, activeCharacter]);

  // キャラクター選択変更ハンドラー
  const handleSelectCharacter = (characterId: string) => {
    setLocalActiveCharacter(characterId);
  };

  /**
   * 一覧ページの閲覧権限判定
   * 1. ユーザーが登録済みである (isRegistered === true)
   * 2. または、共有データが存在する (sharedProgress 存在、または共有キャラがアクティブ)
   */
  const canViewContainer =
    isRegistered ||
    !!sharedProgress ||
    (userData.activeCharacterId === SHARED_GUEST_CHARACTER_ID && !!lastSharedCharRef.current);

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

      <AppRouter
        displayCharacters={displayCharacters}
        currentActiveCharacter={currentActiveCharacter}
        canViewContainer={canViewContainer}
        isRegistered={isRegistered}
        viewMode={viewMode}
        setViewMode={setViewMode}
        toggleFishCheck={toggleFishCheck}
        handleSelectCharacter={handleSelectCharacter}
        addCharacter={addCharacter}
        handleRequestRegistration={handleRequestRegistration}
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
        <AppContent />
      </BrowserRouter>
    </HelmetProvider>
  );
}