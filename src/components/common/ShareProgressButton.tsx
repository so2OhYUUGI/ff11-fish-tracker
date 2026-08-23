/**
 * ============================================================================
 * [FilePath] src/components/ShareProgressButton.tsx
 * [Role] 釣獲進捗のSNS共有ボタンコンポーネント
 * ============================================================================
 */

import React from 'react';
import { Share2 } from 'lucide-react';
import { shareContent } from '@/utils/share';
import type { CharacterProgress } from '@/types/fishtracker';
import { COMMON_TOKENS } from '@/styles/tokens/commonTokens';

type ShareProgressButtonProps = {
	activeCharacter: CharacterProgress;
	totalFishCount: number;
};

export const ShareProgressButton: React.FC<ShareProgressButtonProps> = ({
	activeCharacter,
	totalFishCount,
}) => {
	const checkedCount = activeCharacter.checkedFishIds.length;
	const percentage = Math.round((checkedCount / totalFishCount) * 100) || 0;

	const handleShare = () => {
		const text = `【FF11 釣獲記録】\nキャラクター: ${activeCharacter.name}\n釣獲達成率: ${checkedCount}/${totalFishCount}種 (${percentage}%)\n`;
		const url = window.location.origin + '/fishtracker/fish';

		shareContent({
			title: 'FF11 釣獲管理チェッカー',
			text: text,
			url: url,
		});
	};

	return (
		<button
			type="button"
			onClick={handleShare}
			className={COMMON_TOKENS.button.shareProgress}
			title="釣獲進捗を共有"
		>
			<Share2 className="w-4 h-4" />
			<span>進捗を共有</span>
		</button>
	);
};