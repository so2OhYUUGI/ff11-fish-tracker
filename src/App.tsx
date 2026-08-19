import { useState } from 'react';
import { toast, Toaster } from 'sonner';
import { useUserData } from '@/hooks/useUserData';
import { FISHES } from '@/data/';
import { Header } from '@/components/Header';
import { FilterBar, type StatusFilter } from '@/components/FilterBar';
import { MainContentRouter } from '@/components/MainContentRouter';
import { AdBanner } from '@/components/AdBanner';
import { Footer } from '@/components/Footer';
import { MasterDataEditorModal } from '@/components/dev/MasterDataEditorModal';
import type { ViewMode, MainTab } from '@/types/fish';

export default function App() {
  const {
    userData,
    activeCharacter,
    setActiveCharacter,
    addCharacter,
    deleteCharacter,
    toggleFishCheck,
  } = useUserData();

  const [mainTab, setMainTab] = useState<MainTab>('fish');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('card');
  const [isEditorOpen, setIsEditorOpen] = useState(false);

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

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      <Toaster position="bottom-right" theme="dark" />

      {/* 固定ヘッダー */}
      <div className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur border-b border-slate-800">
        <Header
          characters={userData.characters}
          activeCharacter={activeCharacter}
          onSelectCharacter={setActiveCharacter}
          onAddCharacter={addCharacter}
          onDeleteCharacter={deleteCharacter}
          onOpenMasterEditor={() => setIsEditorOpen(true)}
        />
      </div>

      {/* 広告 */}
      <AdBanner slotId="top-banner" />

      {/* 吸着フィルターバー */}
      <div className="sticky top-[75px] z-30 bg-slate-900/95 backdrop-blur border-b border-slate-800 shadow-md">
        <FilterBar
          mainTab={mainTab}
          activeCharacter={activeCharacter}
          onMainTabChange={setMainTab}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          searchQuery={searchQuery}
          onSearchQueryChange={setSearchQuery}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          totalFishCount={FISHES.length}
        />
      </div>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <MainContentRouter
          mainTab={mainTab}
          statusFilter={statusFilter}
          searchQuery={searchQuery}
          viewMode={viewMode}
          activeCharacter={activeCharacter}
          onToggleCheck={handleToggleCheck}
        />
      </main>

      <AdBanner slotId="bottom-banner" />

      <Footer />

      <MasterDataEditorModal
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
      />
    </div>
  );
}