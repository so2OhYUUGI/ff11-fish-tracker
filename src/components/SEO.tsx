/**
 * ============================================================================
 * [FilePath] src/components/SEO.tsx
 * [Role]     ページごとのSEOメタデータ（Title, Description, OGP等）を動的に制御する共通コンポーネント
 * 
 * [概要]
 * - react-helmet-async を使用して <head> 内の title や meta タグを動的に書き換える。
 * - ページタイトル、説明文、OGPタグ（SNS表示用）、canonical URLを一元管理する。
 * 
 * [依存関係・関連ファイル]
 * - ライブラリ : react-helmet-async
 * - 型定義   : なし
 * - 親・関連 : 各表示ビュー (FishTrackerContent, FishDetailView, AreaDetailView, BaitDetailView 等)
 * 
 * [編集・改修時の注意事項（AI/エンジニア共通指示）]
 * 1. 【デフォルト値の保持】 props が省略された場合は適切なデフォルト値（アプリ共通設定）にフォールバックすること。
 * 2. 【OGPとの整合性】 title および description の変更時は og:title, og:description にも同期して反映すること。
 * ============================================================================
 */
import React from 'react'
import { Helmet } from 'react-helmet-async'

interface SEOProps {
	title?: string
	description?: string
	canonicalUrl?: string
	ogType?: 'website' | 'article'
}

const DEFAULT_TITLE = 'FF11 釣魚チェッカー | ff11-fish-tracker'
const DEFAULT_DESCRIPTION = 'ファイナルファンタジー11（FF11）の釣魚進捗管理ツール。魚、エリア、エサごとの検索・詳細情報照会および進捗チェックが可能。'

export const SEO: React.FC<SEOProps> = ({
	title,
	description = DEFAULT_DESCRIPTION,
	canonicalUrl,
	ogType = 'website',
}) => {
	const pageTitle = title ? `${title} | FF11 釣魚チェッカー` : DEFAULT_TITLE

	return (
		<Helmet>
			{/* 基本メタデータ */}
			<title>{pageTitle}</title>
			<meta name="description" content={description} />

			{/* Canonical URL */}
			{canonicalUrl && <link rel="canonical" href={canonicalUrl} />}

			{/* OGP (Open Graph Protocol) */}
			<meta property="og:title" content={pageTitle} />
			<meta property="og:description" content={description} />
			<meta property="og:type" content={ogType} />

			{/* Twitter Card */}
			<meta name="twitter:card" content="summary" />
			<meta name="twitter:title" content={pageTitle} />
			<meta name="twitter:description" content={description} />
		</Helmet>
	)
}