/**
 * ============================================================================
 * [FilePath] src/features/fishtracker/hooks/useTrackerSeo.ts
 * [Role] 選択されたルーティング（魚/エリア/餌の各種詳細・リスト）に応じたSEOメタデータの動的生成フック
 * 
 * [概要]
 * - URLパラメータ（type, slug）から該当エンティティを取得し、動的にページタイトルおよびディスクリプションを生成
 * 
 * [依存関係・関連ファイル]
 * - データ      : src/data/
 * - ユーティリティ: src/utils/slug.ts
 * 
 * [編集・改修時の注意事項（AI/エンジニア共通指示）]
 * 1. 【フォールバック】 slugに一致する要素が存在しない場合はデフォルトのタイトル・説明文を出力すること
 * ============================================================================
 */

import { FISHES, ZONES, BAITS } from '@/data/';
import { findBySlug } from '@/utils/slug';

export const useTrackerSeo = (type?: string, slug?: string) => {
	const currentFish = type === 'fish' ? findBySlug(FISHES, slug) : undefined;
	const currentArea = type === 'area' ? findBySlug(ZONES, slug) : undefined;
	const currentBait = type === 'bait' ? findBySlug(BAITS, slug) : undefined;

	let pageTitle = 'FF11 釣魚チェッカー';
	let pageDescription = 'FF11（ファイナルファンタジー11）の釣りデータベース＆釣獲管理ツール。';

	if (currentFish) {
		pageTitle = `${currentFish.ja} (${currentFish.en}) の釣り方・生息地`;
		pageDescription = `${currentFish.ja}が釣れるエリア、使用する餌、スキル上限などの詳細データ一覧です。`;
	} else if (currentArea) {
		pageTitle = `${currentArea.ja} (${currentArea.en}) で釣れる魚一覧`;
		pageDescription = `${currentArea.ja}で釣れる魚の生息情報やスキル上限のまとめです。`;
	} else if (currentBait) {
		pageTitle = `${currentBait.ja} (${currentBait.en}) で釣れる魚一覧`;
		pageDescription = `${currentBait.ja}を使って釣ることができる魚一覧データです。`;
	}

	return { pageTitle, pageDescription };
};