/**
 * ============================================================================
 * [FilePath] src/components/common/Badge.tsx
 * [Role]     汎用バッジ表示コンポーネント
 * 
 * [概要]
 * - ドメインロジックを持たない純粋な見た目表現専用のコンポーネント
 * - `BADGE_BASE_STYLE` を基本構造とし、外部からのクラス追加や子要素の埋め込みに対応
 * ============================================================================
 */

import React from 'react';
import { BADGE_BASE_STYLE } from '@/styles/components/badgeStyles';

type Props = {
	children: React.ReactNode;
	className?: string;
};

export const Badge: React.FC<Props> = ({ children, className = '' }) => {
	return (
		<span className={`${BADGE_BASE_STYLE} ${className}`}>
			{children}
		</span>
	);
};