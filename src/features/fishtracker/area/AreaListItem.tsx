/**
 * ============================================================================
 * [FilePath] src/features/fishtracker/area/AreaListItem.tsx
 * [Role] エリアデータのリスト表示コンポーネント
 * 
 * [概要]
 * - エリアの基本情報（和名、英名、簡略説明文）のリスト形式（高密度レイアウト）表示
 * - エリア名称の日本語・英語表記を縦並びへ統一
 * - 親（AreaView）から受け取った `fishCount`（釣れる魚の件数）をバッジ描画
 * - 魚が0件の場合の視覚的表現（減衰スタイル）の適用
 * - 選択中（アクティブ）状態に応じたスタイリング切り替え
 * - アクセシビリティ（キーボード操作対応）の強化
 * - 全スタイルの参照を `LIST_STYLES` へ完全移行
 * ============================================================================
 */

import React, { useMemo } from 'react';
import { Fish } from 'lucide-react';
import type { ZoneMaster } from '@/types/fishtracker';
import { LIST_STYLES } from '@/styles/components/listStyles';

type Props = {
  area: ZoneMaster;
  fishCount?: number;
  isSelected?: boolean;
  onClickDetail: (area: ZoneMaster) => void;
};

export const AreaListItem: React.FC<Props> = ({
  area,
  fishCount = 0,
  isSelected,
  onClickDetail,
}) => {
  const hasFish = fishCount > 0;

  // 説明文の改行エスケープ（\n または \\n をスペース1つに置換）
  const formattedDescription = useMemo(() => {
    if (!area.description) return null;
    return area.description.replace(/\r?\n|\\n/g, ' ');
  }, [area.description]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClickDetail(area);
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onClickDetail(area)}
      onKeyDown={handleKeyDown}
      className={`${LIST_STYLES.base} ${isSelected ? LIST_STYLES.selected : LIST_STYLES.default
        } ${LIST_STYLES.itemRow} ${!hasFish ? LIST_STYLES.dimmed : ''}`}
    >
      <div className="flex-1 min-w-0">
        <div className={LIST_STYLES.titleGroup}>
          <span
            className={`truncate ${LIST_STYLES.titleJa} ${isSelected
                ? LIST_STYLES.titleJaSelectedArea
                : LIST_STYLES.titleJaDefault
              }`}
          >
            {area.ja}
          </span>
          <span className={`truncate ${LIST_STYLES.titleEn}`}>
            {area.en}
          </span>
        </div>

        {formattedDescription && (
          <div className={LIST_STYLES.descriptionSub}>
            {formattedDescription}
          </div>
        )}
      </div>

      {/* 釣れる魚の総数インジケーター（0件時は色を減衰） */}
      <div
        className={
          hasFish ? LIST_STYLES.indicatorActive : LIST_STYLES.indicatorEmpty
        }
      >
        <Fish
          className={
            hasFish
              ? LIST_STYLES.indicatorIconActive
              : LIST_STYLES.indicatorIconEmpty
          }
        />
        <span className="font-medium">{fishCount}</span>
      </div>
    </div>
  );
};