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
 * - キーボード操作時のアクセシビリティ対応（aria-selected属性追加、クラス連結の修正）
 * ============================================================================
 */

import React, { useMemo, useCallback } from 'react';
import { Fish } from 'lucide-react';
import type { ZoneMaster, FishMaster } from '@/types/fishtracker';
import { FISH_LOCATIONS, FISHES } from '@/data';
import { CARD_STYLES } from '@/styles/components/cardStyles';

type AreaCardProps = {
  area: ZoneMaster;
  fishes?: FishMaster[];
  isSelected?: boolean;
  onClickDetail: (area: ZoneMaster) => void;
};

export const AreaCard: React.FC<AreaCardProps> = ({
  area,
  fishes = FISHES,
  isSelected = false,
  onClickDetail,
}) => {
  // 該当エリア (area.id) で釣れる魚の一覧を算出（重複排除・メモ化）
  const matchedFishes = useMemo(() => {
    const uniqueFishIds = new Set(
      FISH_LOCATIONS
        .filter((loc) => loc.zoneId === area.id)
        .map((loc) => loc.fishId)
    );
    return fishes.filter((fish) => uniqueFishIds.has(fish.id));
  }, [area.id, fishes]);

  const totalFishes = matchedFishes.length;
  const hasFish = totalFishes > 0;

  // カード表示用：最大2件を表示、溢れた分は +N 表示
  const maxDisplayCount = 2;
  const displayFishes = useMemo(
    () => matchedFishes.slice(0, maxDisplayCount),
    [matchedFishes]
  );
  const remainingCount = totalFishes - maxDisplayCount;

  // 改行コード（\n および \\n）で分割した説明文行リスト
  const descriptionLines = useMemo(() => {
    if (!area.description) return [];
    return area.description.split(/\r?\n|\\n/);
  }, [area.description]);

  const handleClick = useCallback(() => {
    onClickDetail(area);
  }, [area, onClickDetail]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        e.stopPropagation();
        onClickDetail(area);
      }
    },
    [area, onClickDetail]
  );

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      aria-label={`${area.ja}の詳細を表示`}
      aria-selected={isSelected}
      className={`${CARD_STYLES.base} ${isSelected ? CARD_STYLES.selected : CARD_STYLES.default
        } ${!hasFish ? 'opacity-70' : ''}`}
    >
      <div className={CARD_STYLES.cardWrapper}>
        <div>
          {/* 日本語名と英語名 */}
          <div className={CARD_STYLES.titleGroup}>
            <h3
              className={`truncate ${CARD_STYLES.titleJa} ${isSelected
                  ? CARD_STYLES.titleJaSelectedArea
                  : CARD_STYLES.titleJaDefault
                }`}
            >
              {area.ja}
            </h3>
            <span className={CARD_STYLES.titleEnSub}>{area.en}</span>
          </div>

          {descriptionLines.length > 0 && (
            <div className={CARD_STYLES.descriptionBox}>
              {descriptionLines.map((line: string, index: number) => (
                <p key={`${index}-${line.slice(0, 10)}`}>{line}</p>
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