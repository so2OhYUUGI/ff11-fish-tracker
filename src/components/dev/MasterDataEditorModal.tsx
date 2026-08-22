/**
 * ============================================================================
 * [FilePath] src/components/dev/MasterDataEditorModal.tsx
 * [Role] 開発用マスターデータエディタモーダルコンポーネント
 * 
 * [概要]
 * - 開発環境（isDev）かつモーダル開（isOpen）時のみ描画される開発用エディタ
 * - モーダルの枠組みやヘッダー・閉じるボタンのスタイルを EDITOR_STYLES に集約
 * ============================================================================
 */

import { MasterDataEditor } from '@/components/dev/masterEditor';
import { isDev } from '@/utils/env';
import { X } from 'lucide-react';
import { EDITOR_STYLES } from '@/styles/components/editorStyles';

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export const MasterDataEditorModal = ({ isOpen, onClose }: Props) => {
  if (!isDev || !isOpen) return null;

  return (
    <div className={EDITOR_STYLES.overlay}>
      <div className={EDITOR_STYLES.modalContainer}>
        {/* ヘッダー領域 */}
        <div className={EDITOR_STYLES.header}>
          <h2 className={EDITOR_STYLES.headerTitle}>
            🛠️ 開発用マスターデータエディタ
          </h2>
          <button
            type="button"
            onClick={onClose}
            className={EDITOR_STYLES.closeButton}
          >
            <X className="w-4 h-4" />
            <span>閉じる</span>
          </button>
        </div>

        {/* エディタコンテンツ領域 */}
        <div className={EDITOR_STYLES.contentContainer}>
          <MasterDataEditor />
        </div>
      </div>
    </div>
  );
};