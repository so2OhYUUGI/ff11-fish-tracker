/**
 * ============================================================================
 * [FilePath] src/App.tsx
 * [Role] アプリケーションのルートコンポーネント（レイアウト構築・状態統合・ルーティング）
 * 
 * [概要]
 * - 全体のレイアウト（Header / AdBanner / FilterBar / Main / Footer）の構築
 * - アクティブキャラクターのチェック状態管理 (`useUserData` フックの利用)
 * - メイン表示タブ (`mainTab`), フィルタ条件 (`statusFilter`), 検索ワード (`searchQuery`), 
 *   表示形式 (`viewMode`) などのアプリケーション全体状態の保持
 * - マスターデータ編集モーダル (`MasterDataEditorModal`) および設定モーダル (`SettingsModal`) の表示制御
 * - チェック操作時のトースト通知 (`sonner`) の制御
 * 
 * [編集・改修時の注意事項]
 * 1. 【ヘッダーとフィルターバーの固定構造】
 *    Header と FilterBar を単一の sticky コンテナ (top-0) 内に配置することで、
 *    画面幅による高さ変化（タブレット縦表示等）が発生しても余白が生じないように設計しています。
 * 2. 【トースト通知】
 *    チェック解除時の Undo (元に戻す) 操作は `toggleFishCheck` を再実行することで実現しています。
 * 3. 【開発用ツールの分離】
 *    `MasterDataEditorModal` は開発環境/本番環境制御を行っている内部コンポーネントを内包しています。
 * ============================================================================
 */

import { useState } from 'react';
import { toast, Toaster } from 'sonner';
import { useUserData } from '@/hooks/useUserData';
import { FISHES } from '@/data/';
import { Header } from '@/components/Header';
import { SettingsModal } from '@/components/settings/SettingsModal';
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
    renameCharacter,
    deleteCharacter,
    toggleFishCheck,
    exportData,
    importData,
  } = useUserData();

  const [mainTab, setMainTab] = useState<MainTab>('fish');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('card');
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

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

      {/* 固定ヘッダー & 吸着フィルターバーの統合ラッパー */}
      <div className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur border-b border-slate-800 shadow-md">
        <Header
          characters={userData.characters}
          activeCharacter={activeCharacter}
          onSelectCharacter={setActiveCharacter}
          onAddCharacter={addCharacter}
          onDeleteCharacter={deleteCharacter}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenMasterEditor={() => setIsEditorOpen(true)}
        />
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

      {/* 広告 */}
      <AdBanner slotId="top-banner" />

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

      {/* 環境設定モーダル */}
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

      {/* マスターデータ編集モーダル */}
      <MasterDataEditorModal
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
      />
    </div>
  );
}