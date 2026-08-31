/**
 * ============================================================================
 * [FilePath] src/components/common/ShareProgressButton.tsx
 * [Role]     釣獲進捗のSNS共有ボタンおよび ProgressShareModal 連携コンポーネント
 * ============================================================================
 */

import React, { useState } from 'react';
import { Share } from 'lucide-react';
import { toast } from 'sonner';
import type { CharacterProgress } from '@/types/';
import { COMMON_TOKENS } from '@/styles/tokens/commonTokens';
import { ProgressShareModal } from '@/components/share/ProgressShareModal';

export interface ShareCharacterProgress extends CharacterProgress {
	isShared?: boolean;
}

type ShareProgressButtonProps = {
	activeCharacter: ShareCharacterProgress;
	className?: string;
};

export const ShareProgressButton: React.FC<ShareProgressButtonProps> = ({
	activeCharacter,
	className = '',
}) => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const isShared = !!activeCharacter?.isShared;

	const handleClick = () => {
		if (isShared) {
			toast.info('共有キャラクターの進捗は共有できません');
			return;
		}
		setIsModalOpen(true);
	};

	return (
		<>
			<button
				type="button"
				onClick={handleClick}
				className={`${COMMON_TOKENS.button.shareIcon} ${isShared ? COMMON_TOKENS.button.disabledShare : ''
					} ${className}`}
				title={isShared ? '共有キャラクターの進捗は共有できません' : '釣獲進捗を共有'}
				aria-label="釣獲進捗を共有"
			>
				<Share className={`w-5 h-5 ${COMMON_TOKENS.entity.fish.text}`} />
			</button>

			{!isShared && (
				<ProgressShareModal
					isOpen={isModalOpen}
					onClose={() => setIsModalOpen(false)}
					characterName={activeCharacter?.name ?? 'Unknown'}
					checkedFishIds={activeCharacter?.checkedFishIds ?? []}
				/>
			)}
		</>
	);
};