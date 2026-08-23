/**
 * ============================================================================
 * [FilePath] src/components/common/ShareDetailButton.tsx
 * [Role]     個別詳細ページ用共有ボタンコンポーネント
 * ============================================================================
 */

import React from 'react';
import { Share } from 'lucide-react';
import { shareContent } from '@/utils/share';

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
			className="p-2 rounded-lg bg-gray-800 text-gray-300 hover:text-white hover:bg-gray-700 transition-colors flex items-center justify-center shrink-0"
			title="このページを共有"
			aria-label="このページを共有"
		>
			<Share className="w-5 h-5 text-cyan-400" />
		</button>
	);
};