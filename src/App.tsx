/**
 * ============================================================================
 * [FilePath] src/App.tsx
 * [Role] アプリケーションのルートコンポーネント
 * ============================================================================
 */

import { useState, useEffect } from 'react';
import { toast, Toaster } from 'sonner';
import { useUserData } from '@/hooks/useUserData';
import { useNavigationStack, type NavItem } from '@/hooks/useNavigationStack';
import { FISHES } from '@/data/';
import { Header } from '@/components/Header';
import { SettingsModal } from '@/components/settings/SettingsModal';
import { FilterBar, type StatusFilter } from '@/features/fishtracker/FilterBar';
import { FishTrackerContent } from '@/features/fishtracker/FishTrackerContent';
import { AdBanner } from '@/components/AdBanner';
import { Footer } from '@/components/Footer';
import { LandingPage } from '@/components/LandingPage';
import { MasterDataEditorModal } from '@/components/dev/MasterDataEditorModal';
import { LAYOUT_TOKENS } from '@/styles/tokens/layoutTokens';
import type { ViewMode, MainTab } from '@/types/fish';

const useIsMobileLayout = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  return isMobile;
};

export default function App() {
  const {
    userData,
    activeCharacter,
    setActiveCharacter,
    addCharacter,
    renameCharacter,
    deleteCharacter,
    toggleFishCheck,
    exportData,
    importData,
  } = useUserData();

  const navStack = useNavigationStack();
  const isMobileLayout = useIsMobileLayout();

  const [mainTab, setMainTab] = useState<MainTab>('fish');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('card');
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  if (userData.characters.length === 0 || !activeCharacter) {
    return <LandingPage onCreateCharacter={addCharacter} />;
  }

  const handleToggleCheck = (fishId: number) => {
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

  const handleMainTabChange = (tab: MainTab) => {
    setMainTab(tab);
    navStack.clear();
  };

  const handleSelectFromList = (item: NavItem) => {
    if (isMobileLayout) {
      navStack.push(item);
    } else {
      navStack.replace(item);
    }
  };

  const canGoBackEffective = isMobileLayout
    ? navStack.stack.length > 0
    : navStack.stack.length > 1;

  const effectiveNavStack = {
    ...navStack,
    selectFromList: handleSelectFromList,
    canGoBack: canGoBackEffective,
  };

  return (
    <div className={LAYOUT_TOKENS.page.appWrapper}>
      <Toaster position="bottom-right" theme="dark" />

      <div className={LAYOUT_TOKENS.header.stickyWrapper}>
        <Header
          characters={userData.characters}
          activeCharacter={activeCharacter}
          onSelectCharacter={setActiveCharacter}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenMasterEditor={() => setIsEditorOpen(true)}
        />
        <FilterBar
          mainTab={mainTab}
          activeCharacter={activeCharacter}
          onMainTabChange={handleMainTabChange}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          searchQuery={searchQuery}
          onSearchQueryChange={setSearchQuery}
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
          activeCharacter={activeCharacter}
          onToggleCheck={handleToggleCheck}
          navStack={effectiveNavStack}
        />
      </main>

      <AdBanner slotId="bottom-banner" />

      <Footer />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        characters={userData.characters}
        activeCharacterId={activeCharacter.id}
        onSelectCharacter={setActiveCharacter}
        onAddCharacter={addCharacter}
        onRenameCharacter={renameCharacter}
        onDeleteCharacter={deleteCharacter}
        onExport={exportData}
        onImport={importData}
      />

      <MasterDataEditorModal
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
      />
    </div>
  );
}