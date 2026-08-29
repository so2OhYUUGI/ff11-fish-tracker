/**
 * ============================================================================
 * [FilePath] src/components/layout/Footer.tsx
 * [Role] アプリケーション共通フッターコンポーネント
 * 
 * [概要]
 * - 著作権表示および権利表記（スクウェア・エニックス等のライセンス注記）
 * - アプリケーションのバージョン情報（Ver, Commit Hash, Build Number）の自動表示
 * - 現在のパス（モード）に応じてタイトル表記を動的に切替
 * - LAYOUT_TOKENS および CSS テーマ変数による統一スタイルの適用
 * 
 * [編集・改修時の注意事項]
 * 1. 【権利表記の維持】
 *    ファイナルファンタジーXI関連のツールであるため、必要な権利表記テキストを改変・削除しないよう注意してください。
 * 2. 【レイアウト構造】
 *    ページの最下部に配置される前提のため、呼び出し側（App.tsx等）のレイアウト構造に合わせて表示を確認してください。
 * ============================================================================
 */

import React from 'react';
import { useLocation } from 'react-router-dom';
import { LAYOUT_TOKENS } from '@/styles/tokens/layoutTokens';

export const Footer: React.FC = () => {
  const location = useLocation();
  const isTrustMode = location.pathname.startsWith('/trusttracker');
  const { footer } = LAYOUT_TOKENS;

  return (
    <footer className={footer.container}>
      <div className={footer.inner}>
        <div className={footer.rowWrapper}>
          <div>
            <div className={footer.titleGroup}>
              <p className={footer.titleText}>
                {isTrustMode ? 'FF11 フェイスチェッカー' : 'FF11 釣魚チェッカー'}
                {' '}
                <span className="font-normal text-slate-300">
                  ({isTrustMode ? 'FF11 Trust Tracker' : 'FF11 Fishing Tracker'})
                </span>
              </p>
              <span className={footer.badge}>
                v{__APP_VERSION__} ({__COMMIT_HASH__}) #{__BUILD_NUMBER__}
              </span>
            </div>
            <p className={footer.disclaimerText}>
              記載されている会社名・製品名・システム名などは、各社の商標、または登録商標です。
            </p>
          </div>
          <div className={footer.copyright}>
            &copy; SQUARE ENIX CO., LTD. All Rights Reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};