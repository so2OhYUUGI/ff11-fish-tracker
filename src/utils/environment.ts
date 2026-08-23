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