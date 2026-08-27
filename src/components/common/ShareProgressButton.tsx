/**
 * ============================================================================
 * [FilePath] src/components/common/ShareProgressButton.tsx
 * [Role]     釣獲進捗のSNS共有ボタンおよび ProgressShareModal 連携コンポーネント
 * ============================================================================
 */

import React, { useState } from 'react';
import { Share } from 'lucide-react';
import type { CharacterProgress } from '@/types/fishtracker';
import { COMMON_TOKENS } from '@/styles/tokens/commonTokens';
import { ProgressShareModal } from '@/components/share/ProgressShareModal';

type ShareProgressButtonProps = {
	activeCharacter: CharacterProgress;
	totalFishCount?: number;
	className?: string;
};

export const ShareProgressButton: React.FC<ShareProgressButtonProps> = ({
	activeCharacter,
	totalFishCount,
	className = '',
}) => {
	const [isModalOpen, setIsModalOpen] = useState(false);

	return (
		<>
			<button
				type="button"
				onClick={() => setIsModalOpen(true)}
				className={`${COMMON_TOKENS.button.shareProgress} ${className}`}
				title="釣獲進捗を共有"
			>
				<Share className={`w-4 h-4 ${COMMON_TOKENS.entity.fish.text}`} />
				<span>進捗を共有</span>
			</button>

			<ProgressShareModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				characterName={activeCharacter?.name ?? 'Unknown'}
				checkedFishIds={activeCharacter?.checkedFishIds ?? []}
				totalFishCount={totalFishCount}
			/>
		</>
	);
};