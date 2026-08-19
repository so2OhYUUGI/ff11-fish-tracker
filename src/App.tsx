import { useState, useMemo } from 'react';
import { useUserData } from '@/hooks/useUserData';
import { MOCK_FISHES, MOCK_ZONES } from '@/data/mockData';
import { Header } from '@/components/Header';
import { FilterBar, type StatusFilter } from '@/components/FilterBar';
import { FishCard } from '@/components/FishCard';
import { AdBanner } from '@/components/AdBanner';
import { Heart } from 'lucide-react';

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

  // フィルター・検索条件に基づいた魚リストの作成
  const filteredFishes = useMemo(() => {
    return MOCK_FISHES.filter((fish) => {
      // 1. ステータスフィルター
      const isChecked = activeCharacter.checkedFishIds.includes(fish.id);
      if (statusFilter === 'checked' && !isChecked) return false;
      if (statusFilter === 'unchecked' && isChecked) return false;

      // 2. 検索クエリフィルター（日本語名・英語名）
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
      {/* ヘッダー */}
      <Header
        characters={userData.characters}
        activeCharacter={activeCharacter}
        onSelectCharacter={setActiveCharacter}
        onAddCharacter={addCharacter}
        onDeleteCharacter={deleteCharacter}
        totalFishCount={MOCK_FISHES.length}
      />

      {/* 上部広告エリア */}
      <AdBanner slotId="top-banner" />

      {/* コントロール・フィルターバー */}
      <FilterBar
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
      />

      {/* メインコンテンツ（魚リスト） */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {filteredFishes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredFishes.map((fish) => (
              <FishCard
                key={fish.id}
                fish={fish}
                zones={MOCK_ZONES}
                isChecked={activeCharacter.checkedFishIds.includes(fish.id)}
                onToggleCheck={toggleFishCheck}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-slate-800/30 rounded-xl border border-slate-800">
            <p className="text-slate-400 text-sm">該当する魚が見つかりませんでした。</p>
          </div>
        )}
      </main>

      {/* 下部広告エリア */}
      <AdBanner slotId="bottom-banner" />

      {/* フッター（マネタイズ・権利表記） */}
      <footer className="bg-slate-950 border-t border-slate-800 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p>© FINAL FANTASY XI ALL RIGHTS RESERVED.</p>
            <p className="mt-1">FF11 釣魚チェッカー (ff11-fish-tracker)</p>
          </div>

          {/* アフィリエイト / ドネーション導線 */}
          <div className="flex items-center gap-4">
            <a
              href="https://amzn.to/example" // 自身のAmazonアフィリエイトID等を設定
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
    </div>
  );
}