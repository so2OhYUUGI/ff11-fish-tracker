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
import type { MainTab } from '@/types/fishtracker';

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
    viewMode,
    setViewMode,
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

  // 一覧リストからの選択処理をレイアウトに応じて分岐
  // - 1カラム（モバイル）：一覧に戻るため push
  // - 2カラム（PC）：新しい詳細で置き換えるため replace
  const handleSelectFromList = (item: NavItem) => {
    if (isMobileLayout) {
      navStack.push(item);
    } else {
      navStack.replace(item);
    }
  };

  // 画面モードごとの「戻る」有効化判定
  // - 1カラム（モバイル）: 1つ以上のスタックがあれば有効（一覧に戻る）
  // - 2カラム（PC）: 2つ以上のスタック（詳細からさらに詳細を開いた時）があれば有効（前の詳細に戻る）
  const canGoBackEffective = isMobileLayout
    ? navStack.stack.length > 0
    : navStack.stack.length > 1;

  const effectiveNavStack = {
    ...navStack,
    selectFromList: handleSelectFromList,
    canGoBack: canGoBackEffective,
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      <Toaster position="bottom-right" theme="dark" />

      <div className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur border-b border-slate-800 shadow-md">
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

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
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