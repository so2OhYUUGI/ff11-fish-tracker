/**
 * ============================================================================
 * [FilePath] src/components/area/AreaListItem.tsx
 * [Role] エリアデータのリスト表示コンポーネント
 * 
 * [概要]
 * - エリアの基本情報（和名、英名、簡略説明文）のリスト形式（高密度レイアウト）表示
 * - エリア名称の日本語・英語表記を縦並びへ統一
 * - 釣れる魚の総数バッジを追加し、一覧でのスキャン性と比較容易性を向上
 * - 魚が0件の場合の視覚的表現（減衰スタイル）の適用
 * - 選択中（アクティブ）状態に応じたスタイリング切り替え
 * - 全スタイルの参照を `LIST_STYLES` へ完全移行
 * ============================================================================
 */

import React from 'react';
import { Fish } from 'lucide-react';
import type { ZoneMaster, FishMaster } from '@/types/fish';
import { FISH_LOCATIONS, FISHES } from '@/data';
import { LIST_STYLES } from '@/styles/components/listStyles';

type Props = {
  area: ZoneMaster;
  fishes?: FishMaster[];
  isSelected?: boolean;
  onClickDetail: (area: ZoneMaster) => void;
};

export const AreaListItem: React.FC<Props> = ({
  area,
  fishes = FISHES,
  isSelected,
  onClickDetail,
}) => {
  const targetFishIds = FISH_LOCATIONS
    .filter((loc) => loc.zoneId === area.id)
    .map((loc) => loc.fishId);
  const uniqueFishIds = Array.from(new Set(targetFishIds));
  const totalFishes = fishes.filter((fish) => uniqueFishIds.includes(fish.id)).length;
  const hasFish = totalFishes > 0;

  return (
    <div
      onClick={() => onClickDetail(area)}
      className={`${LIST_STYLES.base} ${
        isSelected ? LIST_STYLES.selected : LIST_STYLES.default
      } ${LIST_STYLES.itemRow} ${!hasFish ? LIST_STYLES.dimmed : ''}`}
    >
      <div className="flex-1 min-w-0">
        <div className={LIST_STYLES.titleGroup}>
          <span
            className={`truncate ${LIST_STYLES.titleJa} ${
              isSelected ? LIST_STYLES.titleJaSelectedArea : LIST_STYLES.titleJaDefault
            }`}
          >
            {area.ja}
          </span>
          <span className={`truncate ${LIST_STYLES.titleEn}`}>
            {area.en}
          </span>
        </div>

        {area.description && (
          <div className={LIST_STYLES.descriptionSub}>
            {area.description.replace(/\\n/g, ' ')}
          </div>
        )}
      </div>

      {/* 釣れる魚の総数インジケーター（0件時は色を減衰） */}
      <div
        className={hasFish ? LIST_STYLES.indicatorActive : LIST_STYLES.indicatorEmpty}
      >
        <Fish
          className={
            hasFish ? LIST_STYLES.indicatorIconActive : LIST_STYLES.indicatorIconEmpty
          }
        />
        <span className="font-medium">{totalFishes}</span>
      </div>
    </div>
  );
};