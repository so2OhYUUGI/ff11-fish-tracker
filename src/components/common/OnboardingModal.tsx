/**
 * ============================================================================
 * [FilePath] src/components/common/OnboardingModal.tsx
 * [Role] 未登録ユーザーが制限機能にアクセスした際に表示するオンボーディングモーダル
 * ============================================================================
 */

import React from 'react';
import { CharacterCreateContent } from './CharacterCreateContent';
import { COMMON_TOKENS } from '@/styles/tokens/commonTokens';
import { LAYOUT_TOKENS } from '@/styles/tokens/layoutTokens';

interface OnboardingModalProps {
	isOpen: boolean;
	onClose: () => void;
	onCreateCharacter: (name: string) => void;
	message?: string | null;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
	isOpen,
	onClose,
	onCreateCharacter,
	message,
}) => {
	if (!isOpen) return null;

	return (
		<div className={LAYOUT_TOKENS.modal.overlay} onClick={onClose}>
			<div
				className={`${LAYOUT_TOKENS.modal.contentWrapper} ${COMMON_TOKENS.state.default}`}
				onClick={(e) => e.stopPropagation()}
			>
				{/* 右上の閉じるボタン */}
				<button
					type="button"
					onClick={onClose}
					className={LAYOUT_TOKENS.modal.closeButton}
					aria-label="閉じる"
				>
					✕
				</button>

				{/* 共通のコンテンツコンポーネントを配置 */}
				<CharacterCreateContent
					onCreateCharacter={onCreateCharacter}
					message={message}
					onClose={onClose}
				/>
			</div>
		</div>
	);
};