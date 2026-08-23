/**
 * ============================================================================
 * [FilePath] src/utils/share.ts
 * [Role] 共有・クリップボード操作ユーティリティ
 * ============================================================================
 */

import { toast } from 'sonner';

export type ShareData = {
	title: string;
	text?: string;
	url?: string;
};

/**
 * Web Share API またはクリップボードへのコピーを実行する
 */
export const shareContent = async (data: ShareData) => {
	const shareUrl = data.url || window.location.href;

	// モバイル等で Web Share API が利用可能な場合
	if (navigator.share) {
		try {
			await navigator.share({
				title: data.title,
				text: data.text,
				url: shareUrl,
			});
			return;
		} catch (error) {
			// ユーザーが共有ダイアログを閉じた場合は何も処理しない
			if ((error as Error).name === 'AbortError') return;
		}
	}

	// Web Share API 非対応環境（PCブラウザ等）の場合はクリップボードへコピー
	try {
		await navigator.clipboard.writeText(shareUrl);
		toast.success('URLをクリップボードにコピーしました');
	} catch (error) {
		toast.error('URLのコピーに失敗しました');
	}
};

/**
 * X (旧Twitter) 投稿画面を開く用のURLを生成する
 */
export const createXShareUrl = (text: string, url: string) => {
	const params = new URLSearchParams({
		text: text,
		url: url,
	});
	return `https://x.com/intent/post?${params.toString()}`;
};