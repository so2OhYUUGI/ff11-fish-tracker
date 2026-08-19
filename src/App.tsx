import { useState, useMemo } from 'react';
import { toast, Toaster } from 'sonner';
import { useUserData } from '@/hooks/useUserData';
import { FISHES, ZONES } from '@/data/';
import { Header } from '@/components/Header';
import { FilterBar, type StatusFilter } from '@/components/FilterBar';
import { FishCard } from '@/components/FishCard';
import { FishListItem } from '@/components/FishListItem';
import { AdBanner } from '@/components/AdBanner';
import { MasterDataEditor } from '@/components/dev/MasterDataEditor';
import { isDev } from '@/utils/env';
import type { ViewMode } from '@/types/fish';
import { Heart, X } from 'lucide-react';

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

  // チェック切り替えハンドラー（Undo機能付き）
  const handleToggleCheck = (fishId: number) => {
    const isCurrentlyChecked = activeCharacter.checkedFishIds.includes(fishId);
    const targetFish = FISHES.find((f) => f.id === fishId);

    // ステータスをトグル
    toggleFishCheck(fishId);

    // チェックを「外した」時のみ Undo トーストを表示
    if (isCurrentlyChecked && targetFish) {
      toast(`「${targetFish.ja}」のチェックを外しました`, {
        action: {
          label: '元に戻す',
          onClick: () => toggleFishCheck(fishId), // 再度トグルして元に戻す
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
      {/* トースト通知コンポーネント（ダークモード対応） */}
      <Toaster position="bottom-right" theme="dark" />

      <Header
        characters={userData.characters}
        activeCharacter={activeCharacter}
        onSelectCharacter={setActiveCharacter}
        onAddCharacter={addCharacter}
        onDeleteCharacter={deleteCharacter}
        totalFishCount={FISHES.length}
        onOpenMasterEditor={() => setIsEditorOpen(true)}
      />

      <AdBanner slotId="top-banner" />

      <FilterBar
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {filteredFishes.length > 0 ? (
          viewMode === 'card' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredFishes.map((fish) => (
                <FishCard
                  key={fish.id}
                  fish={fish}
                  zones={ZONES}
                  isChecked={activeCharacter.checkedFishIds.includes(fish.id)}
                  onToggleCheck={handleToggleCheck}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {filteredFishes.map((fish) => (
                <FishListItem
                  key={fish.id}
                  fish={fish}
                  zones={ZONES}
                  isChecked={activeCharacter.checkedFishIds.includes(fish.id)}
                  onToggleCheck={handleToggleCheck}
                />
              ))}
            </div>
          )
        ) : (
          <div className="text-center py-12 bg-slate-800/30 rounded-xl border border-slate-800">
            <p className="text-slate-400 text-sm">該当する魚が見つかりませんでした。</p>
          </div>
        )}
      </main>

      <AdBanner slotId="bottom-banner" />

      <footer className="bg-slate-950 border-t border-slate-800 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p>© FINAL FANTASY XI ALL RIGHTS RESERVED.</p>
            <p className="mt-1">FF11 釣魚チェッカー (ff11-fish-tracker)</p>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://amzn.to/example"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-amber-400 flex items-center gap-1 transition-colors"
            >
              <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
              <span>開発者を支援する (Amazon)</span>
            </a>
          </div>
        </div>
      </footer>

      {/* 開発環境でのみ動作するマスターデータ編集モーダル */}
      {isDev && isEditorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-slate-800 rounded-xl border border-slate-700 max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
            <div className="p-4 bg-slate-900 border-b border-slate-700 flex justify-between items-center">
              <h2 className="font-bold text-red-400 flex items-center gap-2">
                🛠️ 開発用マスターデータエディタ
              </h2>
              <button
                onClick={() => setIsEditorOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-1 text-xs"
              >
                <X className="w-4 h-4" />
                <span>閉じる</span>
              </button>
            </div>
            <div className="p-4 overflow-y-auto flex-1 text-slate-900">
              <MasterDataEditor />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}