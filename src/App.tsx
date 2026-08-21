/**
 * ============================================================================
 * [FilePath] src/App.tsx
 * [Role] アプリケーションのルートコンポーネント（レイアウト構築・状態統合・ルーティング）
 * 
 * [概要]
 * - ユーザーデータのロード・アクティブキャラクター判定およびランディングページの切り替え
 * - グローバルな表示モード・フィルター・検索クエリ管理
 * - 画面遷移スタック（`useNavigationStack`）の保持・管理による循環詳細表示のサポート
 * ============================================================================
 */

import { useState } from 'react';
import { toast, Toaster } from 'sonner';
import { useUserData } from '@/hooks/useUserData';
import { useNavigationStack } from '@/hooks/useNavigationStack';
import { FISHES } from '@/data/';
import { Header } from '@/components/Header';
import { SettingsModal } from '@/components/settings/SettingsModal';
import { FilterBar, type StatusFilter } from '@/components/FilterBar';
import { MainContentRouter } from '@/components/MainContentRouter';
import { AdBanner } from '@/components/AdBanner';
import { Footer } from '@/components/Footer';
import { LandingPage } from '@/components/LandingPage';
import { MasterDataEditorModal } from '@/components/dev/MasterDataEditorModal';
import type { ViewMode, MainTab } from '@/types/fish';

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

  // 詳細画面の巡回・ドリルダウン用ナビゲーションスタック
  const navStack = useNavigationStack();

  const [mainTab, setMainTab] = useState<MainTab>('fish');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('card');
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // キャラクターが登録されていない場合はランディングページを表示
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

  // メインタブ切り替え時は詳細スタックをクリアする
  const handleMainTabChange = (tab: MainTab) => {
    setMainTab(tab);
    navStack.clear();
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      <Toaster position="bottom-right" theme="dark" />

      {/* 固定ヘッダー & 吸着フィルターバーの統合ラッパー */}
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

      {/* 広告 banner */}
      <AdBanner slotId="top-banner" />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <MainContentRouter
          mainTab={mainTab}
          statusFilter={statusFilter}
          searchQuery={searchQuery}
          viewMode={viewMode}
          activeCharacter={activeCharacter}
          onToggleCheck={handleToggleCheck}
          navStack={navStack}
        />
      </main>

      <AdBanner slotId="bottom-banner" />

      <Footer />

      {/* モーダル群 */}
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