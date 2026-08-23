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