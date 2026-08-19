import { useState, useMemo } from 'react';
import { toast, Toaster } from 'sonner';
import { useUserData } from '@/hooks/useUserData';
import { FISHES, ZONES } from '@/data/';
import { Header } from '@/components/Header';
import { FilterBar, type StatusFilter } from '@/components/FilterBar';
import { FishListView } from '@/components/fish/FishListView';
import { AdBanner } from '@/components/AdBanner';
import { Footer } from '@/components/Footer';
import { MasterDataEditorModal } from '@/components/dev/MasterDataEditorModal';
import type { ViewMode } from '@/types/fish';

export default function App() {
  const {
    userData,
    activeCharacter,
    setActiveCharacter,
    addCharacter,
    deleteCharacter,
    toggleFishCheck,
  } = useUserData();

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

  const filteredFishes = useMemo(() => {
    return FISHES.filter((fish) => {
      const isChecked = activeCharacter.checkedFishIds.includes(fish.id);
      if (statusFilter === 'checked' && !isChecked) return false;
      if (statusFilter === 'unchecked' && isChecked) return false;

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchJa = fish.ja.toLowerCase().includes(query);
        const matchEn = fish.en.toLowerCase().includes(query);
        if (!matchJa && !matchEn) return false;
      }

      return true;
    });
  }, [activeCharacter.checkedFishIds, statusFilter, searchQuery]);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      <Toaster position="bottom-right" theme="dark" />

      {/* 最上部に固定するヘッダー */}
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

      {/* 広告：通常フローのためスクロールで消える */}
      <AdBanner slotId="top-banner" />

      {/* ヘッダーの直下に吸着するフィルターバー（Headerの高さ分 top を調整） */}
      <div className="sticky top-[75px] z-30 bg-slate-900/95 backdrop-blur border-b border-slate-800 shadow-md">
        <FilterBar
          activeCharacter={activeCharacter}
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
        <FishListView
          fishes={filteredFishes}
          zones={ZONES}
          checkedFishIds={activeCharacter.checkedFishIds}
          viewMode={viewMode}
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