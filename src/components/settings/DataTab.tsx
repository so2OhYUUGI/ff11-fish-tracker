import React, { useRef, useState } from 'react';
import { Download, Upload, AlertCircle, CheckCircle2 } from 'lucide-react';

type DataTabProps = {
	onExport: () => void;
	onImport: (file: File) => Promise<boolean>;
};

export const DataTab: React.FC<DataTabProps> = ({ onExport, onImport }) => {
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

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
		<div className="space-y-6">
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

			{/* エクスポート */}
			<div className="space-y-2">
				<h3 className="text-sm font-semibold text-slate-200">データのエクスポート（保存）</h3>
				<p className="text-xs text-slate-400">
					現在のチェック状況や全キャラクターの情報を JSON ファイルとしてバックアップします。
				</p>
				<button
					onClick={onExport}
					className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-medium py-2 px-4 rounded-lg text-sm transition-colors"
				>
					<Download className="w-4 h-4" />
					バックアップファイルをダウンロード
				</button>
			</div>

			<hr className="border-slate-700/60" />

			{/* インポート */}
			<div className="space-y-2">
				<h3 className="text-sm font-semibold text-slate-200">データのインポート（復元）</h3>
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
	);
};