/**
 * ============================================================================
 * [FilePath] src/components/share/ProgressShareModal.tsx
 * [Role]     釣獲進捗全体のSNS共有・画像プレビュー専用モーダルコンポーネント
 * 
 * [概要]
 * - 現在選択されているキャラクターの釣獲進捗を画像およびURLに変換して表示
 * - X（旧Twitter）投稿インテント、画像ダウンロード、クリップボードへの共有URLコピー機能を提供
 * - 単品詳細共有（ShareDetailButton）とは独立した進捗全体共有専用のUI
 * 
 * [依存関係・関連ファイル]
 * - スタイル   : src/styles/tokens/commonTokens.ts
 * - ユーティリティ: src/utils/shareEncoding.ts, src/utils/shareImageGenerator.ts
 * - アイコン   : lucide-react (X, Download, Copy, Share2, Check)
 * 
 * [編集・改修時の注意事項（AI/エンジニア共通指示）]
 * 1. 【データ独立性】 共有URLには encodeSharedProgress で変換したパラメータのみを含め、既存LocalStorageに影響を与えないこと
 * 2. 【アクセシビリティ】 モーダル背景クリック時・ESCキー押下時の閉じ処理、ボタンの type="button" 表記を徹底すること
 * ============================================================================
 */

import React, { useState, useEffect, useCallback } from 'react';
import { X, Download, Copy, Share2, Check, ExternalLink } from 'lucide-react';
import { encodeSharedProgress } from '@/utils/shareEncoding';
import { generateProgressImage } from '@/utils/shareImageGenerator';

interface ProgressShareModalProps {
	isOpen: boolean;
	onClose: () => void;
	characterName: string;
	checkedFishIds: number[];
	totalFishCount: number;
}

export const ProgressShareModal: React.FC<ProgressShareModalProps> = ({
	isOpen,
	onClose,
	characterName,
	checkedFishIds,
	totalFishCount,
}) => {
	const [imageUrl, setImageUrl] = useState<string | null>(null);
	const [imageBlob, setImageBlob] = useState<Blob | null>(null);
	const [isGenerating, setIsGenerating] = useState<boolean>(false);
	const [isCopied, setIsCopied] = useState<boolean>(false);

	// 1. 共有パラメータおよびURLの構築
	const sharedData = {
		characterName: characterName || 'Unknown Angler',
		checkedFishIds,
		createdAt: Date.now(),
	};

	const encodedString = encodeSharedProgress(sharedData);
	const shareUrl = typeof window !== 'undefined'
		? `${window.location.origin}${window.location.pathname}?share=${encodedString}`
		: '';

	const checkedCount = checkedFishIds.length;
	const percentage = totalFishCount > 0 ? Math.round((checkedCount / totalFishCount) * 100) : 0;

	// 2. 共有画像の動的生成
	const handleGenerateImage = useCallback(async () => {
		setIsGenerating(true);
		try {
			const blob = await generateProgressImage({
				characterName: sharedData.characterName,
				checkedCount,
				totalCount: totalFishCount,
				createdAt: sharedData.createdAt,
			});

			if (blob) {
				setImageBlob(blob);
				const url = URL.createObjectURL(blob);
				setImageUrl(url);
			}
		} catch (error) {
			console.error('Failed to generate progress image:', error);
		} finally {
			setIsGenerating(false);
		}
	}, [sharedData.characterName, checkedCount, totalFishCount, sharedData.createdAt]);

	useEffect(() => {
		if (isOpen) {
			handleGenerateImage();
		} else {
			if (imageUrl) {
				URL.revokeObjectURL(imageUrl);
				setImageUrl(null);
				setImageBlob(null);
			}
		}
	}, [isOpen]);

	if (!isOpen) return null;

	// 3. アクションハンドラー
	const handleCopyUrl = async () => {
		try {
			await navigator.clipboard.writeText(shareUrl);
			setIsCopied(true);
			setTimeout(() => setIsCopied(false), 2000);
		} catch {
			// フォールバック処理
			const textArea = document.createElement('textarea');
			textArea.value = shareUrl;
			document.body.appendChild(textArea);
			textArea.select();
			document.execCommand('copy');
			document.body.removeChild(textArea);
			setIsCopied(true);
			setTimeout(() => setIsCopied(false), 2000);
		}
	};

	const handleDownloadImage = () => {
		if (!imageUrl) return;
		const link = document.createElement('a');
		link.href = imageUrl;
		link.download = `ff11_fish_progress_${sharedData.characterName}.png`;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};

	const postText = `【FF11 釣獲進捗】\nキャラ: ${sharedData.characterName}\n釣獲数: ${checkedCount} / ${totalFishCount} 種類 (${percentage}%)\n\n#FF11 #FF11釣魚進捗\n`;
	const xPostUrl = `https://x.com/intent/tweet?text=${encodeURIComponent(postText)}&url=${encodeURIComponent(shareUrl)}`;

	const handleNativeShare = async () => {
		if (!navigator.share) return;
		try {
			const shareDataParams: ShareData = {
				title: 'FF11 釣魚進捗',
				text: postText,
				url: shareUrl,
			};

			if (imageBlob && navigator.canShare && navigator.canShare({ files: [new File([imageBlob], 'progress.png', { type: 'image/png' })] })) {
				const file = new File([imageBlob], `progress_${sharedData.characterName}.png`, { type: 'image/png' });
				await navigator.share({
					...shareDataParams,
					files: [file],
				});
			} else {
				await navigator.share(shareDataParams);
			}
		} catch (error) {
			if ((error as Error).name !== 'AbortError') {
				console.error('Native share failed:', error);
			}
		}
	};

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
			role="dialog"
			aria-modal="true"
			onClick={onClose}
		>
			<div
				className="relative w-full max-w-xl rounded-xl bg-slate-900 border border-slate-700 shadow-2xl p-6 text-slate-100 max-h-[90vh] overflow-y-auto"
				onClick={(e) => e.stopPropagation()}
			>
				{/* ヘッダー */}
				<div className="flex items-center justify-between pb-4 border-b border-slate-800">
					<div className="flex items-center gap-2">
						<Share2 className="w-5 h-5 text-cyan-400" />
						<h2 className="text-lg font-bold text-slate-100">進捗をSNSで共有</h2>
					</div>
					<button
						type="button"
						onClick={onClose}
						className="p-1 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
						aria-label="閉じる"
					>
						<X className="w-5 h-5" />
					</button>
				</div>

				{/* メインコンテンツ */}
				<div className="mt-4 space-y-5">
					{/* 画像プレビュー */}
					<div className="space-y-2">
						<label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">共有カード画像</label>
						<div className="relative aspect-[1200/630] w-full rounded-lg bg-slate-950 border border-slate-800 overflow-hidden flex items-center justify-center">
							{isGenerating ? (
								<div className="text-sm text-slate-400 flex items-center gap-2">
									<div className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
									画像を生成中...
								</div>
							) : imageUrl ? (
								<img src={imageUrl} alt="進捗カードプレビュー" className="w-full h-full object-contain" />
							) : (
								<div className="text-sm text-slate-500">画像の生成に失敗しました</div>
							)}
						</div>
					</div>

					{/* 共有URL */}
					<div className="space-y-2">
						<label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">共有URL</label>
						<div className="flex gap-2">
							<input
								type="text"
								readOnly
								value={shareUrl}
								className="flex-1 px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-300 focus:outline-none select-all"
							/>
							<button
								type="button"
								onClick={handleCopyUrl}
								className="px-3 py-2 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors flex items-center gap-1.5 shrink-0"
							>
								{isCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
								{isCopied ? 'コピー完了' : 'コピー'}
							</button>
						</div>
					</div>

					{/* ボタンエリア */}
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
						{/* X投稿ボタン */}
						<a
							href={xPostUrl}
							target="_blank"
							rel="noopener noreferrer"
							className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-sm transition-colors shadow-lg shadow-cyan-950/50"
						>
							<ExternalLink className="w-4 h-4" />
							X (Twitter) でポスト
						</a>

						{/* 画像保存ボタン */}
						<button
							type="button"
							onClick={handleDownloadImage}
							disabled={!imageUrl}
							className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 font-semibold text-sm transition-colors border border-slate-700"
						>
							<Download className="w-4 h-4" />
							画像を保存
						</button>
					</div>

					{/* モバイル標準共有 */}
					{typeof navigator !== 'undefined' && 'share' in navigator && (
						<button
							type="button"
							onClick={handleNativeShare}
							className="w-full flex items-center justify-center gap-2 px-4 py-2 text-xs text-slate-400 hover:text-slate-200 transition-colors"
						>
							<Share2 className="w-3.5 h-3.5" />
							その他のアプリで共有...
						</button>
					)}
				</div>
			</div>
		</div>
	);
};