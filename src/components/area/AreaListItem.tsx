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
 * 
 * [編集・改修時の注意事項]
 * 1. 【スタイルの参照】
 *    Tailwind CSS クラスは `@/styles/listStyles` の `LIST_STYLES` を定数参照しています。
 * 2. 【アイコンカラー】
 *    魚アイコン（Fish）は対象が存在する場合は text-cyan-400、0件時は text-slate-500 を使用します。
 * ============================================================================
 */

import React from 'react';
import { Fish } from 'lucide-react';
import type { ZoneMaster, FishMaster } from '@/types/fish';
import { FISH_LOCATIONS, FISHES } from '@/data';
import { LIST_STYLES } from '@/styles/listStyles';

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
      } flex items-center justify-between gap-3 cursor-pointer py-2 px-3 ${
        !hasFish ? 'opacity-70' : ''
      }`}
    >
      <div className="flex-1 min-w-0">
        <div className="flex flex-col min-w-0">
          <span
            className={`truncate ${LIST_STYLES.titleJa} ${
              isSelected ? 'text-cyan-300' : LIST_STYLES.titleJaDefault
            }`}
          >
            {area.ja}
          </span>
          <span className="truncate text-xs text-slate-400 font-mono font-normal">
            {area.en}
          </span>
        </div>

        {area.description && (
          <div className={`${LIST_STYLES.subText} truncate mt-0.5`}>
            {area.description.replace(/\\n/g, ' ')}
          </div>
        )}
      </div>

      {/* 釣れる魚の総数インジケーター（0件時は色を減衰） */}
      <div
        className={`shrink-0 flex items-center gap-1 text-xs px-2 py-1 border rounded ${
          hasFish
            ? 'bg-slate-800/80 border-slate-700/60 text-slate-300'
            : 'bg-slate-900/40 border-slate-800/80 text-slate-500'
        }`}
      >
        <Fish className={`w-3.5 h-3.5 ${hasFish ? 'text-cyan-400' : 'text-slate-500'}`} />
        <span className="font-medium">{totalFishes}</span>
      </div>
    </div>
  );
};