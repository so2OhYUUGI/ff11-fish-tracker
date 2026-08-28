/**
 * ============================================================================
 * [FilePath] src/components/common/OnboardingModal.tsx
 * [Role] 未登録ユーザーが制限機能にアクセスした際に表示するオンボーディングモーダル
 * ============================================================================
 */

import React, { useEffect } from 'react';
import { X } from 'lucide-react';
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
	// Escキー入力でモーダルを閉じる対応
	useEffect(() => {
		if (!isOpen) return;

		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === 'Escape') {
				onClose();
			}
		};

		window.addEventListener('keydown', handleKeyDown);
		return () => window.removeEventListener('keydown', handleKeyDown);
	}, [isOpen, onClose]);

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
					<X className={LAYOUT_TOKENS.header.icon.md} />
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