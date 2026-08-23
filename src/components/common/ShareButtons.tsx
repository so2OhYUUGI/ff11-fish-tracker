/**
 * ============================================================================
 * [FilePath] src/components/common/ShareButtons.tsx
 * [Role] X（旧Twitter）直接ポストおよび URLコピー/OS標準シェア ボタンコンポーネント
 * ============================================================================
 */

import React from 'react';
import { toast } from 'sonner';

type ShareButtonsProps = {
	title: string;
	url?: string;
	hashtags?: string[];
	className?: string;
};

export const ShareButtons: React.FC<ShareButtonsProps> = ({
	title,
	url,
	hashtags = ['FF11', 'FF11_FishTracker'],
	className = '',
}) => {
	const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '');

	// X（旧Twitter）共有処理（Web Intent）
	const handleXShare = () => {
		const textParam = encodeURIComponent(title);
		const urlParam = encodeURIComponent(shareUrl);
		const hashtagsParam = encodeURIComponent(hashtags.join(','));

		const intentUrl = `https://x.com/intent/tweet?text=${textParam}&url=${urlParam}&hashtags=${hashtagsParam}`;

		// PC・スマホ問わず新しい小窓/タブで確実に開く
		window.open(intentUrl, '_blank', 'noopener,noreferrer,width=600,height=400');
	};

	// その他の共有（Web Share API または クリップボードコピー）
	const handleOtherShare = async () => {
		if (typeof navigator !== 'undefined' && navigator.share) {
			try {
				await navigator.share({
					title,
					url: shareUrl,
				});
				return;
			} catch (err) {
				if ((err as Error).name === 'AbortError') return;
			}
		}

		// Web Share 非対応またはフォールバック処理
		try {
			await navigator.clipboard.writeText(shareUrl);
			toast.success('URLをクリップボードにコピーしました');
		} catch {
			toast.error('URLのコピーに失敗しました');
		}
	};

	return (
		<div className={`flex items-center gap-2 ${className}`}>
			{/* 𝕏 直接ポストボタン */}
			<button
				type="button"
				onClick={handleXShare}
				className="flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-black hover:bg-neutral-800 border border-neutral-700 rounded transition-colors cursor-pointer"
				title="𝕏（旧Twitter）でポスト"
			>
				<span className="font-bold">𝕏</span>
				<span>でポスト</span>
			</button>

			{/* その他の共有 / URLコピーボタン */}
			<button
				type="button"
				onClick={handleOtherShare}
				className="flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-300 bg-neutral-800 hover:bg-neutral-700 border border-neutral-600 rounded transition-colors cursor-pointer"
				title="URLをコピー / その他の方法で共有"
			>
				<span>共有 / コピー</span>
			</button>
		</div>
	);
};