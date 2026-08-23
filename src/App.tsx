/**
 * ============================================================================
 * [FilePath] src/App.tsx
 * [Role] アプリケーションのルートコンポーネント（パスベースルーティング版）
 * ============================================================================
 */

import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useParams,
  useNavigate,
  useSearchParams,
} from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { toast, Toaster } from 'sonner';

import { useUserData } from '@/hooks/useUserData';
import { useNavigationStack, type NavItem } from '@/hooks/useNavigationStack';
import { FISHES, ZONES, BAITS } from '@/data/';
import { toSlug, findBySlug } from '@/utils/slug';

import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { LandingPage } from '@/components/LandingPage';
import { OnboardingModal } from '@/components/common/OnboardingModal';
import { AdBanner } from '@/components/common/AdBanner';
import { SeoHead } from '@/components/common/SeoHead';
import { SettingsModal } from '@/components/settings/SettingsModal';
import { MasterDataEditorModal } from '@/components/dev/MasterDataEditorModal';
import { FilterBar, type StatusFilter } from '@/features/fishtracker/FilterBar';
import { FishTrackerContent } from '@/features/fishtracker/FishTrackerContent';
import { LAYOUT_TOKENS } from './styles/tokens/layoutTokens';
import type { MainTab, ViewMode, CharacterProgress } from '@/types/fishtracker';

const useIsMobileLayout = () => {
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 1024;
    }
    return false;
  });

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  return isMobile;
};

type FishTrackerContainerProps = {
  userData: ReturnType<typeof useUserData>['userData'];
  activeCharacter: CharacterProgress | undefined;
  isRegistered: boolean;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  setActiveCharacter: (characterId: string) => void;
  toggleFishCheck: (fishId: number) => void;
  onOpenSettings: () => void;
  onOpenMasterEditor: () => void;
  onRequestRegistration: (message: string) => void;
};

function FishTrackerContainer({
  userData,
  activeCharacter,
  isRegistered,
  viewMode,
  setViewMode,
  setActiveCharacter,
  toggleFishCheck,
  onOpenSettings,
  onOpenMasterEditor,
  onRequestRegistration,
}: FishTrackerContainerProps) {
  const navigate = useNavigate();
  const { type, slug } = useParams<{ type?: string; slug?: string }>();
  const [searchParams, setSearchParams] = useSearchParams();

  const navStack = useNavigationStack(type, slug);
  const isMobileLayout = useIsMobileLayout();

  const validTabs: MainTab[] = ['fish', 'bait', 'area'];
  const mainTab = validTabs.includes(type as MainTab) ? (type as MainTab) : 'fish';

  const statusFilter = (searchParams.get('status') as StatusFilter) || 'all';
  const searchQuery = searchParams.get('q') || '';

  const handleMainTabChange = (tab: MainTab) => {
    if (!isRegistered || !activeCharacter) {
      onRequestRegistration('キャラクターを登録すると機能を利用できます');
      return;
    }
    navStack.clear();
    navigate(`/fishtracker/${tab}`);
  };

  const handleStatusFilterChange = (status: StatusFilter) => {
    setSearchParams((prev) => {
      prev.set('status', status);
      return prev;
    });
  };

  const handleSearchQueryChange = (query: string) => {
    setSearchParams((prev) => {
      if (query) {
        prev.set('q', query);
      } else {
        prev.delete('q');
      }
      return prev;
    });
  };

  const currentFish = type === 'fish' ? findBySlug(FISHES, slug) : undefined;
  const currentArea = type === 'area' ? findBySlug(ZONES, slug) : undefined;
  const currentBait = type === 'bait' ? findBySlug(BAITS, slug) : undefined;

  const handleSelectFromList = useCallback(
    (item: NavItem) => {
      if (!isRegistered || !activeCharacter) {
        onRequestRegistration('キャラクターを登録すると詳細の回遊や記録が行えます');
        return;
      }

      const itemSlug = toSlug(item.item.en);
      const targetPath = `/fishtracker/${item.type}/${itemSlug}`;

      if (isMobileLayout) {
        navStack.push(item);
      } else {
        navStack.replace(item);
      }
      navigate(targetPath);
    },
    [isMobileLayout, navStack, navigate, isRegistered, activeCharacter, onRequestRegistration]
  );

  const handlePop = useCallback(() => {
    if (navStack.stack.length > 1) {
      const previousItem = navStack.stack[navStack.stack.length - 2];
      const itemSlug = toSlug(previousItem.item.en);
      navStack.pop();
      navigate(`/fishtracker/${previousItem.type}/${itemSlug}`);
    } else {
      navStack.clear();
      navigate(`/fishtracker/${mainTab}`);
    }
  }, [navStack, navigate, mainTab]);

  const canGoBackEffective = isMobileLayout
    ? navStack.stack.length > 0
    : navStack.stack.length > 1;

  const { push: navPush, replace: navReplace, clear: navClear } = navStack;

  const effectiveNavStack = useMemo(
    () => ({
      ...navStack,
      push: (item: NavItem) => {
        if (!isRegistered || !activeCharacter) {
          onRequestRegistration('キャラクターを登録すると詳細の回遊や記録が行えます');
          return;
        }
        navPush(item);
        const itemSlug = toSlug(item.item.en);
        navigate(`/fishtracker/${item.type}/${itemSlug}`);
      },
      replace: (item: NavItem) => {
        if (!isRegistered || !activeCharacter) {
          onRequestRegistration('キャラクターを登録すると詳細の回遊や記録が行えます');
          return;
        }
        navReplace(item);
        const itemSlug = toSlug(item.item.en);
        navigate(`/fishtracker/${item.type}/${itemSlug}`);
      },
      pop: handlePop,
      clear: () => {
        navClear();
        navigate(`/fishtracker/${mainTab}`);
      },
      selectFromList: handleSelectFromList,
      canGoBack: canGoBackEffective,
    }),
    [
      navStack,
      navPush,
      navReplace,
      navClear,
      navigate,
      handlePop,
      handleSelectFromList,
      mainTab,
      canGoBackEffective,
      isRegistered,
      activeCharacter,
      onRequestRegistration,
    ]
  );

  const handleToggleCheck = (fishId: number) => {
    if (!isRegistered || !activeCharacter) {
      onRequestRegistration('キャラクターを登録すると釣獲状況を記録できます');
      return;
    }

    const isCurrentlyChecked = activeCharacter.checkedFishIds.includes(fishId);
    const targetFish = FISHES.find((f) => f.id === fishId);

    toggleFishCheck(fishId);

    if (isCurrentlyChecked && targetFish) {
      toast(`「${targetFish.ja}」のチェックを外しました`, {
        action: {
          label: '元に戻す',
          onClick: () => toggleFishCheck(fishId),
        },
        duration: 4000,
      });
    }
  };

  let pageTitle = 'FF11 釣獲管理チェッカー';
  let pageDescription = 'FF11（ファイナルファンタジー11）の釣りデータベース＆釣獲管理ツール。';

  if (currentFish) {
    pageTitle = `${currentFish.ja} (${currentFish.en}) の釣り方・生息地`;
    pageDescription = `${currentFish.ja}が釣れるエリア、使用する餌、スキル上限などの詳細データ一覧です。`;
  } else if (currentArea) {
    pageTitle = `${currentArea.ja} (${currentArea.en}) で釣れる魚一覧`;
    pageDescription = `${currentArea.ja}で釣れる魚の生息情報やスキル上限のまとめです。`;
  } else if (currentBait) {
    pageTitle = `${currentBait.ja} (${currentBait.en}) で釣れる魚一覧`;
    pageDescription = `${currentBait.ja}を使って釣ることができる魚一覧データです。`;
  }

  const effectiveActiveCharacter: CharacterProgress = activeCharacter || {
    id: 'guest',
    name: 'ゲスト',
    checkedFishIds: [],
    createdAt: 0,
    updatedAt: 0,
  };

  return (
    <div className={LAYOUT_TOKENS.page.appWrapper}>
      <SeoHead
        title={pageTitle}
        description={pageDescription}
        path={window.location.pathname}
      />

      <Toaster position="bottom-right" theme="dark" />

      <div className={LAYOUT_TOKENS.header.stickyWrapper}>
        <Header
          characters={userData.characters}
          activeCharacter={effectiveActiveCharacter}
          onSelectCharacter={setActiveCharacter}
          onOpenSettings={onOpenSettings}
          onOpenMasterEditor={onOpenMasterEditor}
        />
        <FilterBar
          mainTab={mainTab}
          activeCharacter={effectiveActiveCharacter}
          onMainTabChange={handleMainTabChange}
          statusFilter={statusFilter}
          onStatusFilterChange={handleStatusFilterChange}
          searchQuery={searchQuery}
          onSearchQueryChange={handleSearchQueryChange}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          totalFishCount={FISHES.length}
        />
      </div>

      <AdBanner slotId="top-banner" />

      <main className={LAYOUT_TOKENS.page.mainContainer}>
        <FishTrackerContent
          mainTab={mainTab}
          statusFilter={statusFilter}
          searchQuery={searchQuery}
          viewMode={viewMode}
          activeCharacter={effectiveActiveCharacter}
          onToggleCheck={handleToggleCheck}
          navStack={effectiveNavStack}
        />
      </main>

      <AdBanner slotId="bottom-banner" />

      <Footer />
    </div>
  );
}

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