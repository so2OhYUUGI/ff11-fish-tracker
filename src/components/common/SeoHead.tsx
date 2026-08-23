/**
 * ============================================================================
 * [FilePath] src/components/common/SeoHead.tsx
 * [Role] ページタイトルおよび OGP / Meta タグの動的生成コンポーネント
 * ============================================================================
 */

import React from 'react';
import { Helmet } from 'react-helmet-async';

type SeoHeadProps = {
	title: string;
	description: string;
	path?: string;
};

export const SeoHead: React.FC<SeoHeadProps> = ({
	title,
	description,
	path = '',
}) => {
	const siteName = 'FF11 Fish Tracker';
	const fullTitle = `${title} | ${siteName}`;

	// 開発時・本番環境に合わせてドメインを設定
	const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
	const pageUrl = `${baseUrl}${path}`;

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

			{/* Twitter Card */}
			<meta name="twitter:card" content="summary" />
			<meta name="twitter:title" content={fullTitle} />
			<meta name="twitter:description" content={description} />
		</Helmet>
	);
};