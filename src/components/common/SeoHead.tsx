/**
 * ============================================================================
 * [FilePath] src/components/common/SeoHead.tsx
 * [Role] ページタイトルおよび OGP / Meta タグの動的生成コンポーネント
 * ============================================================================
 */

import React from 'react';
import { Helmet } from 'react-helmet-async';

// 本番ドメインを直接指定（または環境変数から取得）
const SITE_DOMAIN = import.meta.env.VITE_SITE_URL || 'http://localhost:5173';

type SeoHeadProps = {
	title: string;
	description: string;
	path?: string;
	ogImage?: string;
};

export const SeoHead: React.FC<SeoHeadProps> = ({
	title,
	description,
	path = '',
	ogImage = '/ogp-default.png',
}) => {
	const siteName = 'FF11 Fish Tracker';
	const fullTitle = `${title} | ${siteName}`;

	// 常に完全な絶対URL（https://...）を生成
	const pageUrl = `${SITE_DOMAIN}${path}`;
	const imageUrl = ogImage.startsWith('http') ? ogImage : `${SITE_DOMAIN}${ogImage}`;

	return (
		<Helmet>
			{/* 基本 SEO */}
			<title>{fullTitle}</title>
			<meta name="description" content={description} />
			<link rel="canonical" href={pageUrl} />

			{/* OGP (SNS表示用) */}
			<meta property="og:title" content={fullTitle} />
			<meta property="og:description" content={description} />
			<meta property="og:url" content={pageUrl} />
			<meta property="og:type" content="website" />
			<meta property="og:image" content={imageUrl} />

			{/* Twitter Card (大きなバナー表示) */}
			<meta name="twitter:card" content="summary_large_image" />
			<meta name="twitter:title" content={fullTitle} />
			<meta name="twitter:description" content={description} />
			<meta name="twitter:image" content={imageUrl} />
		</Helmet>
	);
};