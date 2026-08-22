/**
 * ============================================================================
 * [FilePath] src/features/fishtracker/area/AreaCard.tsx
 * [Role] エリアデータのカード表示コンポーネント
 * 
 * [概要]
 * - エリアの基本情報（和名、英名、説明文など）をカード形式で表示
 * - エリア名称の日本語と英語を明示的に改行して視認性と統一感を確保
 * - 該当エリアで釣れる魚の抽出および上限数制限付きタグ表示（上位表示＋残り件数バッジ）
 * - 魚が0件の場合の視覚的表現（減衰スタイル）の適用
 * - 選択中（アクティブ）状態に応じたスタイリング切り替え
 * - スタイル定義を CARD_STYLES に完全集約
 * - キーボード操作時のアクセシビリティ対応を追加
 * ============================================================================
 */

import React from 'react';
import { Fish } from 'lucide-react';
import type { ZoneMaster, FishMaster } from '@/types/fishtracker';
import { FISH_LOCATIONS, FISHES } from '@/data';
import { CARD_STYLES } from '@/styles/components/cardStyles';

type Props = {
  area: ZoneMaster;
  fishes?: FishMaster[]; // 外部から渡される場合はそれを使用し、未渡しの場合は FISHES を参照
  isSelected?: boolean;
  onClickDetail: (area: ZoneMaster) => void;
};

export const AreaCard: React.FC<Props> = ({
  area,
  fishes = FISHES,
  isSelected,
  onClickDetail,
}) => {
  // 該当エリア (area.id) で釣れる魚の ID 一覧を抽出
  const targetFishIds = FISH_LOCATIONS
    .filter((loc) => loc.zoneId === area.id)
    .map((loc) => loc.fishId);

  // 重複を除外して魚データと紐付け
  const uniqueFishIds = Array.from(new Set(targetFishIds));
  const matchedFishes = fishes.filter((fish) => uniqueFishIds.includes(fish.id));
  const totalFishes = matchedFishes.length;
  const hasFish = totalFishes > 0;

  // カード表示用：最大2件を表示、溢れた分は +N 表示
  const maxDisplayCount = 2;
  const displayFishes = matchedFishes.slice(0, maxDisplayCount);
  const remainingCount = totalFishes - maxDisplayCount;

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
      className={`${CARD_STYLES.base} ${isSelected ? CARD_STYLES.selected : CARD_STYLES.default
        } ${!hasFish ? 'opacity-70' : ''}`}
    >
      <div className={CARD_STYLES.cardWrapper}>
        <div>
          {/* 日本語名と英語名 */}
          <div className={CARD_STYLES.titleGroup}>
            <h3
              className={`truncate ${CARD_STYLES.titleJa} ${isSelected ? CARD_STYLES.titleJaSelectedArea : CARD_STYLES.titleJaDefault
                }`}
            >
              {area.ja}
            </h3>
            <span className={CARD_STYLES.titleEnSub}>
              {area.en}
            </span>
          </div>

          {area.description && (
            <div className={CARD_STYLES.descriptionBox}>
              {area.description.split('\\n').map((line: string, index: number) => (
                <p key={index}>{line}</p>
              ))}
            </div>
          )}

          {/* 釣れる魚の表示領域 */}
          <div className={CARD_STYLES.targetLabelGroup}>
            <div className={CARD_STYLES.targetLabel}>
              <Fish
                className={`w-3.5 h-3.5 shrink-0 ${hasFish ? 'text-cyan-400' : 'text-slate-500'
                  }`}
              />
              <span>釣れる魚 ({totalFishes}):</span>
            </div>

            {hasFish ? (
              <div className={CARD_STYLES.tagContainer}>
                {displayFishes.map((fish) => (
                  <span
                    key={fish.id}
                    className={CARD_STYLES.tagItem}
                    title={fish.ja}
                  >
                    {fish.ja}
                  </span>
                ))}
                {remainingCount > 0 && (
                  <span
                    className={CARD_STYLES.tagOverflow}
                    title={`他 ${remainingCount} 種類`}
                  >
                    +{remainingCount}
                  </span>
                )}
              </div>
            ) : (
              <span className={CARD_STYLES.tagEmpty}>情報なし</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};