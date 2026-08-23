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
	ogImage?: string; // OGP用画像のパス指定を追加
};

export const SeoHead: React.FC<SeoHeadProps> = ({
	title,
	description,
	path = '',
	ogImage = '/ogp-default.png', // デフォルト画像（public/ogp-default.png）
}) => {
	const siteName = 'FF11 Fish Tracker';
	const fullTitle = `${title} | ${siteName}`;

	// 開発時・本番環境に合わせてドメインを設定
	const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
	const pageUrl = `${baseUrl}${path}`;

	// 絶対パスの画像URLを作成
	const imageUrl = ogImage.startsWith('http') ? ogImage : `${baseUrl}${ogImage}`;

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