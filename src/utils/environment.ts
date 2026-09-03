/**
 * ============================================================================
 * [FilePath] src/utils/environment.ts
 * [Role] ブラウザ環境およびデバイス環境の判定ユーティリティ
 * ============================================================================
 */

/**
 * X(Twitter)、LINE、Instagram、Facebook等のアプリ内ブラウザ（In-App Browser）かどうかを判定
 */
export const checkInAppBrowser = (): boolean => {
	if (typeof window === 'undefined') return false;
	const ua = window.navigator.userAgent.toLowerCase();
	return (
		ua.includes('twitter') ||
		ua.includes('line') ||
		ua.includes('instagram') ||
		ua.includes('fban') ||
		ua.includes('fbav')
	);
};

/**
 * 外部ブラウザを起動（またはURLをクリップボードにコピー）する
 * @returns {Promise<'launched' | 'copied' | 'failed'>} 実行結果
 */
export const openInExternalBrowser = async (): Promise<'launched' | 'copied' | 'failed'> => {
	if (typeof window === 'undefined') return 'failed';

	const currentUrl = window.location.href;
	const ua = window.navigator.userAgent.toLowerCase();

	// 1. Android Intent による Chrome 強制起動
	if (/android/i.test(ua)) {
		const intentUrl = `intent://${window.location.host}${window.location.pathname}${window.location.search}${window.location.hash}#Intent;scheme=https;package=com.android.chrome;end;`;
		window.location.href = intentUrl;
		return 'launched';
	}

	// 2. LINE アプリの場合（パラメータ付与による外部ブラウザ起動）
	if (/line/i.test(ua)) {
		const url = new URL(currentUrl);
		url.searchParams.set('openExternalBrowser', '1');
		window.location.href = url.toString();
		return 'launched';
	}

	// 3. iOS (Safari) / その他 (自動起動できない場合のフォールバック: コピー)
	if (navigator.clipboard) {
		try {
			await navigator.clipboard.writeText(currentUrl);
			return 'copied';
		} catch {
			return 'failed';
		}
	}

	return 'failed';
};