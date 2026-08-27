/**
 * ============================================================================
 * [FilePath] src/features/fishtracker/FishTrackerContent.tsx
 * [Role] メイン領域の表示切替・フィルタリング・ルーティングコンポーネント
 * 
 * [調整内容]
 * - checkedSet 生成時の防御的フォールバック追加による堅牢性向上
 * - 余分な isShared の伝達を削除し、コンポーネント間のインターフェースを単純化
 * ============================================================================
 */

import React, { useMemo } from 'react';
import { FISHES, ZONES, BAITS } from '@/data/';
import { FishView } from './fish/FishView';
import { BaitView } from './bait/BaitView';
import { AreaView } from './area/AreaView';
import type { MainTab, ViewMode, CharacterProgress } from '@/types/fishtracker';
import type { StatusFilter } from '@/features/fishtracker/FilterBar';
import type { useNavigationStack } from '@/hooks/useNavigationStack';
import type { DisplayCharacterProgress } from '@/components/layout/Header';

type FishTrackerContentProps = {
  mainTab: MainTab;
  statusFilter: StatusFilter;
  searchQuery: string;
  viewMode: ViewMode;
  activeCharacter: DisplayCharacterProgress | CharacterProgress;
  onToggleCheck: (fishId: number) => void;
  navStack: ReturnType<typeof useNavigationStack>;
};

export const FishTrackerContent: React.FC<FishTrackerContentProps> = ({
  mainTab,
  statusFilter,
  searchQuery,
  viewMode,
  activeCharacter,
  onToggleCheck,
  navStack,
}) => {
  // 安全な checkedFishIds の抽出と Set 化
  const checkedFishIds = useMemo(() => {
    return Array.isArray(activeCharacter?.checkedFishIds) ? activeCharacter.checkedFishIds : [];
  }, [activeCharacter?.checkedFishIds]);

  const checkedSet = useMemo(() => {
    return new Set(checkedFishIds);
  }, [checkedFishIds]);

  // 検索クエリの正規化
  const normalizedQuery = useMemo(() => {
    return searchQuery ? searchQuery.trim().toLowerCase() : '';
  }, [searchQuery]);

  // 魚リストのフィルタリング
  const filteredFishes = useMemo(() => {
    return FISHES.filter((fish) => {
      const isChecked = checkedSet.has(fish.id);

      if (statusFilter === 'checked' && !isChecked) return false;
      if (statusFilter === 'unchecked' && isChecked) return false;

      if (normalizedQuery) {
        const matchJa = fish.ja.toLowerCase().includes(normalizedQuery);
        const matchEn = fish.en.toLowerCase().includes(normalizedQuery);
        if (!matchJa && !matchEn) return false;
      }

      return true;
    });
  }, [checkedSet, statusFilter, normalizedQuery]);

  // 餌リストのフィルタリング
  const filteredBaits = useMemo(() => {
    if (!normalizedQuery) return BAITS;
    return BAITS.filter(
      (bait) =>
        bait.ja.toLowerCase().includes(normalizedQuery) ||
        bait.en.toLowerCase().includes(normalizedQuery)
    );
  }, [normalizedQuery]);

  // エリアリストのフィルタリング
  const filteredAreas = useMemo(() => {
    if (!normalizedQuery) return ZONES;
    return ZONES.filter(
      (zone) =>
        zone.ja.toLowerCase().includes(normalizedQuery) ||
        zone.en.toLowerCase().includes(normalizedQuery)
    );
  }, [normalizedQuery]);

  return (
    <>
      {mainTab === 'fish' && (
        <FishView
          fishes={filteredFishes}
          zones={ZONES}
          checkedFishIds={checkedFishIds}
          viewMode={viewMode}
          onToggleCheck={onToggleCheck}
          navStack={navStack}
        />
      )}
      {mainTab === 'bait' && (
        <BaitView
          baits={filteredBaits}
          allFishes={FISHES}
          checkedFishIds={checkedFishIds}
          viewMode={viewMode}
          onToggleCheck={onToggleCheck}
          navStack={navStack}
        />
      )}
      {mainTab === 'area' && (
        <AreaView
          areas={filteredAreas}
          allFishes={FISHES}
          checkedFishIds={checkedFishIds}
          viewMode={viewMode}
          onToggleCheck={onToggleCheck}
          navStack={navStack}
        />
      )}
    </>
  );
};