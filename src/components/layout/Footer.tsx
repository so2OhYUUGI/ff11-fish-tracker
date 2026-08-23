/**
 * ============================================================================
 * [FilePath] src/components/layout/Footer.tsx
 * [Role] アプリケーション共通フッターコンポーネント
 * 
 * [概要]
 * - 著作権表示および権利表記（スクウェア・エニックス等のライセンス注記）
 * - LAYOUT_TOKENS および COMMON_TOKENS を参照した統一スタイルの適用
 * 
 * [編集・改修時の注意事項]
 * 1. 【権利表記の維持】
 *    ファイナルファンタジーXI関連のツールであるため、必要な権利表記テキストを改変・削除しないよう注意してください。
 * 2. 【レイアウト構造】
 *    ページの最下部に配置される前提のため、呼び出し側（App.tsx等）のレイアウト構造に合わせて表示を確認してください。
 * ============================================================================
 */

import React from 'react';
import { COMMON_TOKENS } from '@/styles/tokens/commonTokens';
import { LAYOUT_TOKENS } from '@/styles/tokens/layoutTokens';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 mt-auto py-6">
      <div className={LAYOUT_TOKENS.header.inner}>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-center sm:text-left">
          <div>
            <p className={`font-medium mb-1 ${COMMON_TOKENS.color.textMain}`}>
              FF11 釣魚チェッカー (FF11 Fishing Tracker)
            </p>
            <p className={COMMON_TOKENS.color.textMuted}>
              記載されている会社名・製品名・システム名などは、各社の商標、または登録商標です。
            </p>
          </div>
          <div className={`${COMMON_TOKENS.color.textMuted} whitespace-nowrap`}>
            &copy; SQUARE ENIX CO., LTD. All Rights Reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};