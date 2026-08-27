/**
 * ============================================================================
 * [FilePath] src/components/share/DynamicOgpMeta.tsx
 * [Role]     
 * ============================================================================
 */

import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useSearchParams } from 'react-router-dom';
import { decodeSharedProgress } from '@/utils/shareEncoding';
import { buildShareCardData } from '@/utils/shareDataBuilder';

export const DynamicOgpMeta: React.FC = () => {
	const [searchParams] = useSearchParams();
	const shareParam = searchParams.get('share');

	let title = 'FF11 釣魚チェッカー';
	let description = 'FF11の釣獲進捗を記録・共有できるツールです。';
	let imageUrl = `${window.location.origin}/ogp-default.png`; // デフォルト画像

	if (shareParam) {
		const decoded = decodeSharedProgress(shareParam);
		if (decoded) {
			const cardData = buildShareCardData(decoded.characterName, decoded.checkedFishIds);
			const topFish = cardData.topFishList[0];
			const fishText = topFish ? ` #${topFish.ja.replace(/\s+/g, '')}` : '';

			title = `【FF11 釣獲記録】${cardData.characterName} (${cardData.percentage}%)`;
			description = `達成率: ${cardData.percentage}% (${cardData.checkedCount}/${cardData.totalCount}種)${fishText}`;

			// 動的OGPエンドポイントのURLを指定
			imageUrl = `${window.location.origin}/api/ogp?share=${shareParam}`;
		}
	}

	return (
		<Helmet>
			<title>{title}</title>
			<meta name="description" content={description} />

			{/* OGP Tags */}
			<meta property="og:title" content={title} />
			<meta property="og:description" content={description} />
			<meta property="og:image" content={imageUrl} />
			<meta property="og:type" content="website" />

			{/* Twitter Card Tags */}
			<meta name="twitter:card" content="summary_large_image" />
			<meta name="twitter:title" content={title} />
			<meta name="twitter:description" content={description} />
			<meta name="twitter:image" content={imageUrl} />
		</Helmet>
	);
};