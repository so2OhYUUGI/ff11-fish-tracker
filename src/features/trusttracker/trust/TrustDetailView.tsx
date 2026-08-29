/**
 * ============================================================================
 * [FilePath] src/features/trusttracker/trust/TrustDetailView.tsx
 * [Role] フェイス（個 could/選択中）の詳細情報表示コンポーネント
 * 
 * [概要]
 * - 選択されたフェイスの基本情報（名称、ジョブ、戦闘タイプ、入手情報）の詳細表示
 * - 修得ステータス（修得済み/未修得）の確認およびトグル操作
 * - 盟（アイテム）情報およびゲーム内呼び出しマクロ（/ma フェイス名 <me>）のテキストコピー機能
 * 
 * [依存関係・関連ファイル]
 * - 型定義  : src/types/trusttracker.ts (TrustMaster)
 * - スタイル: src/styles/components/listStyles.ts
 * ============================================================================
 */

import React, { useState, useCallback } from 'react';
import { Check, Copy, BookOpen, Shield, Award, Terminal, Sparkles } from 'lucide-react';
import type { TrustMaster } from '@/types/trusttracker';
import { BADGE_BASE_STYLE } from '@/styles/features/FishTrackerStyle';

type Props = {
	trust: TrustMaster | null;
	isChecked?: boolean;
	onToggleCheck?: (trustId: number) => void;
	onClose?: () => void;
};

export const TrustDetailView: React.FC<Props> = ({
	trust,
	isChecked = false,
	onToggleCheck,
}) => {
	const [copied, setCopied] = useState(false);

	// 呼び出しマクロ文の生成
	const macroText = trust ? `/ma ${trust.ja} <me>` : '';

	// マクロコピー処理
	const handleCopyMacro = useCallback(async () => {
		if (!macroText) return;
		try {
			await navigator.clipboard.writeText(macroText);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		} catch (err) {
			console.error('Failed to copy macro text: ', err);
		}
	}, [macroText]);

	// 未選択状態のフォールバック表示
	if (!trust) {
		return (
			<div className="h-full min-h-[300px] flex flex-col items-center justify-center p-6 text-center bg-slate-900/40 border border-slate-800/80 rounded-xl">
				<Sparkles className="w-12 h-12 text-slate-600 mb-3 animate-pulse" />
				<p className="text-slate-400 font-medium">フェイスを選択してください</p>
				<p className="text-xs text-slate-500 mt-1">
					一覧から選択すると、修得方法や呼び出しマクロ等の詳細情報を確認できます。
				</p>
			</div>
		);
	}

	return (
		<div className="h-full flex flex-col bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden shadow-xl backdrop-blur-md">
			{/* ヘッダーエリア */}
			<div className="p-5 border-b border-slate-800/80 bg-slate-950/40">
				<div className="flex items-start justify-between gap-4 mb-2">
					<div>
						<h2 className="text-2xl font-bold text-slate-100 tracking-wide">{trust.ja}</h2>
						<p className="text-sm text-slate-400 font-mono">{trust.en}</p>
					</div>

					{/* 修得ボタン */}
					{onToggleCheck && (
						<button
							type="button"
							onClick={() => onToggleCheck(trust.id)}
							className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all duration-200 shrink-0 ${isChecked
									? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/80 hover:bg-emerald-900/80'
									: 'bg-slate-800/80 text-slate-300 border border-slate-700/80 hover:bg-slate-700/80 hover:text-slate-100'
								}`}
						>
							<Check className={`w-4 h-4 ${isChecked ? 'text-emerald-400' : 'text-slate-500'}`} />
							<span>{isChecked ? '修得済み' : '未修得'}</span>
						</button>
					)}
				</div>

				{/* 属性バッジ群 */}
				<div className="flex flex-wrap gap-2 mt-3">
					<span className={`${BADGE_BASE_STYLE} bg-slate-800 text-slate-200 border-slate-700`}>
						<Shield className="w-3 h-3 text-amber-400" />
						{trust.job}
					</span>
					<span className={`${BADGE_BASE_STYLE} bg-slate-800 text-slate-200 border-slate-700`}>
						{trust.combatType}
					</span>
					{trust.isLimited && (
						<span className={`${BADGE_BASE_STYLE} bg-amber-950/80 text-amber-300 border-amber-800/80`}>
							期間限定
						</span>
					)}
				</div>
			</div>

			{/* 詳細情報ボディ */}
			<div className="p-5 space-y-5 overflow-y-auto flex-1 text-sm text-slate-300">
				{/* 修得方法 / 盟アイテム */}
				<div className="space-y-3">
					<div className="p-3.5 bg-slate-950/50 rounded-lg border border-slate-800/60 space-y-2">
						<div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider">
							<BookOpen className="w-3.5 h-3.5" />
							<span>修得条件・入手方法</span>
						</div>
						<p className="text-slate-200 leading-relaxed pl-5">{trust.acquireInfo}</p>
					</div>

					{trust.item?.ja && (
						<div className="p-3.5 bg-slate-950/50 rounded-lg border border-slate-800/60 space-y-1">
							<div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
								<Award className="w-3.5 h-3.5 text-slate-400" />
								<span>関連アイテム</span>
							</div>
							<p className="text-slate-200 font-medium pl-5">{trust.item.ja}</p>
						</div>
					)}
				</div>

				{/* 呼び出しマクロ */}
				<div className="p-3.5 bg-slate-950/60 rounded-lg border border-slate-800/80 space-y-2">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
							<Terminal className="w-3.5 h-3.5 text-amber-400" />
							<span>呼び出しマクロ</span>
						</div>
						<button
							type="button"
							onClick={handleCopyMacro}
							className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors"
						>
							<Copy className="w-3.5 h-3.5" />
							<span>{copied ? 'コピーしました' : 'コピー'}</span>
						</button>
					</div>
					<div className="bg-slate-900 p-2.5 rounded border border-slate-800 font-mono text-xs text-amber-200/90 select-all">
						{macroText}
					</div>
				</div>
			</div>
		</div>
	);
};