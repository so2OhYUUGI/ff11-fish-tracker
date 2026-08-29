/**
 * ============================================================================
 * [FilePath] src/components/share/ProgressShareModal.tsx
 * [Role]     進捗共有モーダルコンテナ（Canvas画像生成・プレビュー・Xポスト・URLコピー）
 * 
 * [概要]
 * - HTML5 Canvasを使用した進捗画像の生成とダウンロード/共有機能の提供
 * - useEffect 内での同期的 setState 呼び出しによるカスケードレンダリングを防止
 * 
 * [依存関係・関連ファイル]
 * - スタイル : src/styles/tokens/commonTokens.ts, src/styles/tokens/layoutTokens.ts
 * - ユーティリティ : src/utils/shareEncoding.ts, src/utils/shareDataBuilder.ts
 * 
 * [編集・改修時の注意事項（AI/エンジニア共通指示）]
 * 1. 【ロジック・例外処理】 useEffect 直下での同期的 setState はカスケードレンダリングを引き起こすため、タイマー等による非同期化を行うこと
 * 2. 【アクセシビリティ・作法】 button タグには type="button" を明記すること
 * ============================================================================
 */

import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, Copy, Check, Download } from 'lucide-react';
import { toast } from 'sonner';
import { COMMON_TOKENS } from '@/styles/tokens/commonTokens';
import { LAYOUT_TOKENS } from '@/styles/tokens/layoutTokens';
import { encodeSharedProgress } from '@/utils/shareEncoding';
import { buildShareCardData } from '@/utils/shareDataBuilder';

type ProgressShareModalProps = {
	isOpen: boolean;
	onClose: () => void;
	characterName: string;
	checkedFishIds: number[];
};

export const ProgressShareModal: React.FC<ProgressShareModalProps> = ({
	isOpen,
	onClose,
	characterName,
	checkedFishIds = [],
}) => {
	const [dataUrl, setDataUrl] = useState<string | null>(null);
	const [isGenerating, setIsGenerating] = useState(false);
	const [copied, setCopied] = useState(false);
	const canvasRef = useRef<HTMLCanvasElement>(null);

	// マウント時にタイムスタンプを一度だけ保持
	const [createdAt] = useState(() => Date.now());

	// 共通ロジックからデータを取得
	const cardData = React.useMemo(
		() => buildShareCardData(characterName, checkedFishIds),
		[characterName, checkedFishIds]
	);

	const { checkedCount, totalCount, percentage, topFishList } = cardData;

	// Canvas画像生成処理
	useEffect(() => {
		if (!isOpen) return;

		let isCancelled = false;

		// 同期的 setState によるカスケードレンダリングを防止するため非同期で実行
		const timer = setTimeout(() => {
			if (isCancelled) return;

			setIsGenerating(true);
			const canvas = canvasRef.current;
			if (!canvas) {
				setIsGenerating(false);
				return;
			}

			const ctx = canvas.getContext('2d');
			if (!ctx) {
				setIsGenerating(false);
				return;
			}

			canvas.width = 1200;
			canvas.height = 630;

			// 背景描画（ダークテーマ）
			ctx.fillStyle = '#0f172a'; // slate-900
			ctx.fillRect(0, 0, canvas.width, canvas.height);

			// 枠線
			ctx.strokeStyle = '#38bdf8'; // sky-400
			ctx.lineWidth = 6;
			ctx.strokeRect(30, 30, canvas.width - 60, canvas.height - 60);

			// タイトル
			ctx.fillStyle = '#ffffff';
			ctx.font = 'bold 44px sans-serif';
			ctx.fillText('FF11 釣魚チェッカーレポート', 80, 110);

			// キャラクター名
			ctx.fillStyle = '#94a3b8'; // slate-400
			ctx.font = '48px sans-serif';
			ctx.fillText(`【${characterName}】`, 80, 190);

			// --- 左側ブロック：進捗サマリー ---
			ctx.fillStyle = '#38bdf8';
			ctx.font = 'bold 120px sans-serif';
			ctx.fillText(`${percentage}%`, 80, 340);

			ctx.fillStyle = '#e2e8f0';
			ctx.font = '32px sans-serif';
			ctx.fillText(`釣獲種数: ${checkedCount} / ${totalCount} 種`, 80, 420);

			// --- 右側ブロック：スキル上位3体（ハイライト） ---
			ctx.fillStyle = '#cbd5e1';
			ctx.font = 'bold 24px sans-serif';
			ctx.fillText('★ 主な釣獲ハイライト（スキル順）', 660, 160);

			if (topFishList.length > 0) {
				const medals = ['🥇', '🥈', '🥉'];
				topFishList.forEach((fish, index) => {
					const startY = 220 + index * 85;

					// メダル
					ctx.font = '28px sans-serif';
					ctx.fillText(medals[index], 660, startY);

					// 魚名 (日本語)
					ctx.fillStyle = '#ffffff';
					ctx.font = 'bold 28px sans-serif';
					ctx.fillText(fish.ja, 720, startY - 5);

					// スキル値
					ctx.fillStyle = '#94a3b8';
					ctx.font = '20px sans-serif';
					ctx.fillText(`上限スキル: ${fish.maxSkill}`, 720, startY + 30);
				});
			} else {
				ctx.fillStyle = '#64748b';
				ctx.font = '24px sans-serif';
				ctx.fillText('まだ記録がありません', 660, 230);
			}

			// フッター
			ctx.fillStyle = '#64748b';
			ctx.font = '22px sans-serif';
			ctx.fillText('FF11 釣魚チェッカー', 80, 550);

			setDataUrl(canvas.toDataURL('image/png'));
			setIsGenerating(false);
		}, 0);

		return () => {
			isCancelled = true;
			clearTimeout(timer);
		};
	}, [isOpen, characterName, checkedCount, totalCount, percentage, topFishList]);

	if (!isOpen || typeof document === 'undefined') return null;

	// エンコードしたデータをURLのクエリパラメータ（?share=...）として付与
	const encodedData = encodeSharedProgress({
		characterName,
		checkedFishIds,
		createdAt,
	});

	const baseUrl = window.location.origin ? `${window.location.origin}/fishtracker/fish` : '';
	const shareUrl = encodedData ? `${baseUrl}?share=${encodedData}` : baseUrl;

	// 最高難易度（1位）の魚だけをハッシュタグ化
	const topFish = topFishList[0];
	const fishHashtag = topFish ? ` #${topFish.ja.replace(/\s+/g, '')}` : '';
	const shareText = `【FF11 釣獲記録】\nキャラクター: ${characterName}\n達成率: ${percentage}% (${checkedCount}/${totalCount}種)${fishHashtag}\n#FF11 #FF11_FishTracker`;

	const handleXShare = () => {
		const intentUrl = `https://x.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;

		// タブレット・スマホ（画面幅 1024px 未満 または タッチ端末）の場合
		const isMobileOrTablet = window.innerWidth < 1024 || 'ontouchstart' in window;

		if (isMobileOrTablet) {
			// 同一タブで直接 X に遷移させる（空白タブが残らない）
			window.location.href = intentUrl;
		} else {
			// デスクトップ環境のみ小窓（ポップアップ）で開く
			const width = 600;
			const height = 400;
			const left = window.screen.width / 2 - width / 2;
			const top = window.screen.height / 2 - height / 2;

			window.open(
				intentUrl,
				'x-share-dialog',
				`width=${width},height=${height},top=${top},left=${left},scrollbars=yes,resizable=yes`
			);
		}
	};

	const handleCopyLink = async () => {
		try {
			await navigator.clipboard.writeText(shareUrl);
			setCopied(true);
			toast.success('共有リンクをコピーしました');
			setTimeout(() => setCopied(false), 2000);
		} catch {
			toast.error('リンクのコピーに失敗しました');
		}
	};

	const handleDownloadImage = () => {
		if (!dataUrl) return;
		const a = document.createElement('a');
		a.href = dataUrl;
		a.download = `FF11_Fish_Progress_${characterName}.png`;
		a.click();
		toast.success('進捗画像をダウンロードしました');
	};

	return createPortal(
		<div className={LAYOUT_TOKENS.modalShare.overlay}>
			<canvas ref={canvasRef} className="hidden" />

			<div className={LAYOUT_TOKENS.modalShare.contentWrapper}>
				{/* ヘッダー */}
				<div className={LAYOUT_TOKENS.modalShare.header}>
					<h2 className="text-lg font-bold text-white flex items-center gap-2">
						釣獲進捗の共有
					</h2>
					<button
						type="button"
						onClick={onClose}
						className={LAYOUT_TOKENS.modalShare.closeButton}
						aria-label="閉じる"
					>
						<X className="w-5 h-5" />
					</button>
				</div>

				{/* コンテンツボディ */}
				<div className={LAYOUT_TOKENS.modalShare.body}>
					<div className="flex flex-col items-center justify-center bg-slate-950 rounded-xl p-4 border border-slate-800">
						{isGenerating ? (
							<div className="h-48 flex items-center justify-center text-slate-400">
								画像を生成中...
							</div>
						) : dataUrl ? (
							<img
								src={dataUrl}
								alt="進捗プレビュー"
								className="max-h-64 rounded-lg shadow-md border border-slate-800 object-contain"
							/>
						) : null}
					</div>

					<div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
						<button
							type="button"
							onClick={handleXShare}
							className="flex items-center justify-center gap-2 px-4 py-2.5 bg-black hover:bg-neutral-800 border border-neutral-700 text-white font-semibold rounded-xl text-sm transition-colors"
						>
							<span className="font-bold text-base">𝕏</span>
							<span>でポスト</span>
						</button>

						<button
							type="button"
							onClick={handleDownloadImage}
							className="flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 font-medium rounded-xl text-sm transition-colors"
						>
							<Download className="w-4 h-4 text-cyan-400" />
							<span>画像を保存</span>
						</button>

						<button
							type="button"
							onClick={handleCopyLink}
							className="flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 font-medium rounded-xl text-sm transition-colors"
						>
							{copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-400" />}
							<span>{copied ? 'コピー完了' : 'リンクをコピー'}</span>
						</button>
					</div>
				</div>

				{/* フッター */}
				<div className={LAYOUT_TOKENS.modalShare.footer}>
					<button
						type="button"
						onClick={onClose}
						className={COMMON_TOKENS.actionText.cancelLink}
					>
						閉じる
					</button>
				</div>
			</div>
		</div>,
		document.body
	);
};