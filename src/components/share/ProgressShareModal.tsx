/**
 * ============================================================================
 * [FilePath] src/components/share/ProgressShareModal.tsx
 * [Role]     進捗共有モーダルコンテナ（Canvas画像生成・プレビュー・Xポスト・URLコピー）
 * ============================================================================
 */

import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, Copy, Check, Download } from 'lucide-react';
import { toast } from 'sonner';
import { COMMON_TOKENS } from '@/styles/tokens/commonTokens';
import { LAYOUT_TOKENS } from '@/styles/tokens/layoutTokens';
import { FISHES } from '@/data/';
import type { FishMaster } from '@/types/fishtracker';

type ProgressShareModalProps = {
	isOpen: boolean;
	onClose: () => void;
	characterName: string;
	checkedFishIds: number[];
	totalFishCount?: number;
};

export const ProgressShareModal: React.FC<ProgressShareModalProps> = ({
	isOpen,
	onClose,
	characterName,
	checkedFishIds = [],
	totalFishCount,
}) => {
	const [dataUrl, setDataUrl] = useState<string | null>(null);
	const [isGenerating, setIsGenerating] = useState(false);
	const [copied, setCopied] = useState(false);
	const canvasRef = useRef<HTMLCanvasElement>(null);

	const checkedCount = Array.isArray(checkedFishIds) ? checkedFishIds.length : 0;
	const validTotal =
		typeof totalFishCount === 'number' && totalFishCount > 0
			? totalFishCount
			: FISHES.length;

	const percentage = validTotal > 0 ? Math.round((checkedCount / validTotal) * 100) : 0;

	// 釣った魚の中でスキル上位3体を抽出
	const topFishList: FishMaster[] = React.useMemo(() => {
		if (!checkedFishIds || checkedFishIds.length === 0) return [];
		const checkedSet = new Set(checkedFishIds);
		const matchedFishes = FISHES.filter((f) => checkedSet.has(f.id));
		return matchedFishes.sort((a, b) => b.maxSkill - a.maxSkill).slice(0, 3);
	}, [checkedFishIds]);

	// Canvas画像生成処理
	useEffect(() => {
		if (!isOpen) return;

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
		ctx.fillText(`釣獲種数: ${checkedCount} / ${validTotal} 種`, 80, 420);

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
	}, [isOpen, characterName, checkedCount, validTotal, percentage, topFishList]);

	if (!isOpen || typeof document === 'undefined') return null;

	const shareUrl = window.location.origin ? `${window.location.origin}/fishtracker/fish` : '';

	// 最高難易度（1位）の魚だけをハッシュタグ化
	const topFish = topFishList[0];
	const fishHashtag = topFish ? ` #${topFish.ja.replace(/\s+/g, '')}` : '';
	const shareText = `【FF11 釣獲記録】\nキャラクター: ${characterName}\n達成率: ${percentage}% (${checkedCount}/${validTotal}種)${fishHashtag}\n#FF11 #FF11_FishTracker`;

	const handleXShare = () => {
		const intentUrl = `https://x.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
		window.open(intentUrl, '_blank', 'noopener,noreferrer,width=600,height=400');
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
		<div className={LAYOUT_TOKENS.modal.overlay}>
			<canvas ref={canvasRef} className="hidden" />

			<div className={LAYOUT_TOKENS.modal.contentWrapper}>
				{/* ヘッダー */}
				<div className={LAYOUT_TOKENS.modal.header}>
					<h2 className="text-lg font-bold text-white flex items-center gap-2">
						釣獲進捗の共有
					</h2>
					<button
						type="button"
						onClick={onClose}
						className={LAYOUT_TOKENS.modal.closeButton}
						aria-label="閉じる"
					>
						<X className="w-5 h-5" />
					</button>
				</div>

				{/* コンテンツボディ */}
				<div className={LAYOUT_TOKENS.modal.body}>
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
				<div className={LAYOUT_TOKENS.modal.footer}>
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