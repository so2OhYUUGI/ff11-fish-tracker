/**
 * ============================================================================
 * [FilePath] src/components/common/ShareDetailButton.tsx
 * [Role]     個別詳細ページ用共有ボタンコンポーネント
 * ============================================================================
 */

import React from 'react';
import { Share } from 'lucide-react';
import { shareContent } from '@/utils/share';
import { COMMON_TOKENS } from '@/styles/tokens/commonTokens';

type ShareDetailButtonProps = {
	categoryName: string;
	nameJa: string;
	nameEn: string;
};

export const ShareDetailButton: React.FC<ShareDetailButtonProps> = ({
	categoryName,
	nameJa,
	nameEn,
}) => {
	const handleShare = () => {
		shareContent({
			title: `${nameJa} (${nameEn}) - FF11 釣獲管理チェッカー`,
			text: `【FF11】${categoryName}データ: ${nameJa} (${nameEn})`,
			url: window.location.href,
		});
	};

	return (
		<button
			type="button"
			onClick={handleShare}
			className={COMMON_TOKENS.button.shareIcon}
			title="このページを共有"
			aria-label="このページを共有"
		>
			<Share className={`w-5 h-5 ${COMMON_TOKENS.entity.fish.text}`} />
		</button>
	);
};