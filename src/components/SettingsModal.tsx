/**
 * ============================================================================
 * [FilePath] src/components/SettingsModal.tsx
 * [Role] アプリケーションの環境設定・データ管理（インポート/エクスポート）モーダル
 * ============================================================================
 */

import React, { useRef, useState } from 'react';
import { X, Download, Upload, AlertCircle, CheckCircle2 } from 'lucide-react';

type SettingsModalProps = {
	isOpen: boolean;
	onClose: () => void;
	onExport: () => void;
	onImport: (file: File) => Promise<boolean>;
};

export const SettingsModal: React.FC<SettingsModalProps> = ({
	isOpen,
	onClose,
	onExport,
	onImport,
}) => {
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

	if (!isOpen) return null;

	const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		try {
			await onImport(file);
			setStatusMessage({ type: 'success', text: 'データを正常に復元しました。' });
			if (fileInputRef.current) fileInputRef.current.value = '';
		} catch (err) {
			setStatusMessage({
				type: 'error',
				text: err instanceof Error ? err.message : 'インポートに失敗しました。',
			});
		}
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
			<div className="bg-slate-800 border border-slate-700 rounded-xl shadow-2xl w-full max-w-md overflow-hidden text-white">

				{/* モーダルヘッダー */}
				<div className="flex items-center justify-between px-6 py-4 border-b border-slate-700">
					<h2 className="text-lg font-bold">環境設定・データ管理</h2>
					<button
						onClick={onClose}
						className="p-1 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
					>
						<X className="w-5 h-5" />
					</button>
				</div>

				{/* モーダルコンテンツ */}
				<div className="p-6 space-y-6">

					{/* 通知メッセージ */}
					{statusMessage && (
						<div
							className={`p-3 rounded-lg text-sm flex items-center gap-2 ${statusMessage.type === 'success'
									? 'bg-emerald-950/80 border border-emerald-600 text-emerald-200'
									: 'bg-rose-950/80 border border-rose-600 text-rose-200'
								}`}
						>
							{statusMessage.type === 'success' ? (
								<CheckCircle2 className="w-4 h-4 shrink-0" />
							) : (
								<AlertCircle className="w-4 h-4 shrink-0" />
							)}
							<span>{statusMessage.text}</span>
						</div>
					)}

					{/* バックアップ（エクスポート） */}
					<div className="space-y-2">
						<h3 className="text-sm font-semibold text-slate-300">データのエクスポート（保存）</h3>
						<p className="text-xs text-slate-400">
							現在のチェック状況やキャラクター情報を JSON ファイルとして保存します。
						</p>
						<button
							onClick={onExport}
							className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-medium py-2 px-4 rounded-lg text-sm transition-colors"
						>
							<Download className="w-4 h-4" />
							バックアップを保存する
						</button>
					</div>

					<hr className="border-slate-700" />

					{/* 復元（インポート） */}
					<div className="space-y-2">
						<h3 className="text-sm font-semibold text-slate-300">データのインポート（復元）</h3>
						<p className="text-xs text-slate-400">
							保存した JSON ファイルを選択してデータを復元します。（現在のデータは上書きされます）
						</p>
						<input
							type="file"
							ref={fileInputRef}
							accept=".json"
							onChange={handleFileChange}
							className="hidden"
						/>
						<button
							onClick={() => fileInputRef.current?.click()}
							className="w-full flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-600 border border-slate-600 text-white font-medium py-2 px-4 rounded-lg text-sm transition-colors"
						>
							<Upload className="w-4 h-4" />
							バックアップファイルを選択
						</button>
					</div>
				</div>

				{/* 閉じるボタン */}
				<div className="px-6 py-3 bg-slate-800/50 border-t border-slate-700 text-right">
					<button
						onClick={onClose}
						className="px-4 py-1.5 bg-slate-700 hover:bg-slate-600 text-white text-sm rounded-lg font-medium transition-colors"
					>
						閉じる
					</button>
				</div>

			</div>
		</div>
	);
};