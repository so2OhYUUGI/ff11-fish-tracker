/**
 * ============================================================================
 * [FilePath] src/components/area/AreaCard.tsx
 * [Role] エリアデータのカード表示コンポーネント
 * 
 * [概要]
 * - エリアの基本情報（和名、英名、説明文など）をカード形式で表示
 * - エリア名称の日本語と英語を明示的に改行して視認性と統一感を確保
 * - 該当エリアで釣れる魚の抽出および上限数制限付きタグ表示（上位表示＋残り件数バッジ）
 * - 魚が0件の場合の視覚的表現（減衰スタイル）の適用
 * - 選択中（アクティブ）状態に応じたスタイリング切り替え
 * 
 * [編集・改修時の注意事項]
 * 1. 【スタイルの参照】
 *    Tailwind CSS クラスは `@/styles/cardStyles` の `CARD_STYLES` を定数参照しています。
 * 2. 【アイコンカラー】
 *    魚アイコン（Fish）は対象が存在する場合は text-cyan-400、0件時は text-slate-500 を使用します。
 * ============================================================================
 */

import React from 'react';
import { Fish } from 'lucide-react';
import type { ZoneMaster, FishMaster } from '@/types/fish';
import { FISH_LOCATIONS, FISHES } from '@/data';
import { CARD_STYLES } from '@/styles/cardStyles';

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

  return (
    <div
      onClick={() => onClickDetail(area)}
      className={`${CARD_STYLES.base} ${
        isSelected ? CARD_STYLES.selected : CARD_STYLES.default
      } cursor-pointer p-4 flex flex-col justify-between ${
        !hasFish ? 'opacity-70' : ''
      }`}
    >
      <div>
        {/* 日本語名と英語名を明確に縦並び（改行）へ変更 */}
        <div className="flex flex-col min-w-0 mb-2">
          <h3
            className={`truncate ${CARD_STYLES.titleJa} ${
              isSelected ? 'text-cyan-300' : CARD_STYLES.titleJaDefault
            }`}
          >
            {area.ja}
          </h3>
          <span className="truncate text-xs text-slate-400 font-mono font-normal mt-0.5">
            {area.en}
          </span>
        </div>

        {area.description && (
          <div className={`${CARD_STYLES.boxBlock} mt-2 text-slate-300`}>
            {area.description.split('\\n').map((line: string, index: number) => (
              <p key={index}>{line}</p>
            ))}
          </div>
        )}

        {/* 釣れる魚の表示領域 */}
        <div className="mt-3 text-xs flex items-center gap-1.5 flex-wrap">
          <div className="flex items-center gap-1 text-slate-400 shrink-0 font-medium">
            <Fish
              className={`w-3.5 h-3.5 ${
                hasFish ? 'text-cyan-400' : 'text-slate-500'
              }`}
            />
            <span>釣れる魚 ({totalFishes}):</span>
          </div>

          {hasFish ? (
            <div className="flex items-center gap-1 flex-wrap min-w-0">
              {displayFishes.map((fish) => (
                <span
                  key={fish.id}
                  className="px-1.5 py-0.5 bg-slate-800 text-slate-300 border border-slate-700/60 rounded text-[11px] truncate max-w-[120px]"
                  title={fish.ja}
                >
                  {fish.ja}
                </span>
              ))}
              {remainingCount > 0 && (
                <span
                  className="px-1.5 py-0.5 bg-cyan-950/80 text-cyan-300 border border-cyan-800/60 rounded text-[11px] font-semibold"
                  title={`他 ${remainingCount} 種類`}
                >
                  +{remainingCount}
                </span>
              )}
            </div>
          ) : (
            <span className="text-slate-500 italic">情報なし</span>
          )}
        </div>
      </div>
    </div>
  );
};