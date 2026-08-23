/**
 * ============================================================================
 * [FilePath] src/utils/share.ts
 * [Role]     Web Share API および クリップボードコピー処理の共通ユーティリティ
 * ============================================================================
 */

type ShareData = {
	title: string;
	text: string;
	url: string;
};

/**
 * 共有処理を実行する（Web Share API -> クリップボードコピー）
 */
export const shareContent = async (data: ShareData): Promise<void> => {
	// 1. Web Share API に対応している場合（スマホ・対応ブラウザ）
	if (navigator.share) {
		try {
			await navigator.share(data);
			return;
		} catch (error) {
			if ((error as Error).name === 'AbortError') {
				return;
			}
		}
	}

	// 2. クリップボードへテキストをコピー（フォールバック）
	const textToCopy = `${data.text}\n${data.url}`;
	const success = await copyToClipboard(textToCopy);

	if (success) {
		alert('共有リンクとテキストをクリップボードにコピーしました。');
	} else {
		alert('コピーに失敗しました。お使いのブラウザの権限設定を確認してください。');
	}
};

/**
 * HTTP環境や古いブラウザにも対応したクリップボードコピー処理
 */
const copyToClipboard = async (text: string): Promise<boolean> => {
	if (navigator.clipboard && window.isSecureContext) {
		try {
			await navigator.clipboard.writeText(text);
			return true;
		} catch {
			// フォールバックへ移行
		}
	}

	try {
		const textArea = document.createElement('textarea');
		textArea.value = text;
		textArea.style.position = 'fixed';
		textArea.style.left = '-999999px';
		textArea.style.top = '-999999px';
		document.body.appendChild(textArea);

		textArea.focus();
		textArea.select();

		const successful = document.execCommand('copy');
		document.body.removeChild(textArea);
		return successful;
	} catch {
		return false;
	}
};