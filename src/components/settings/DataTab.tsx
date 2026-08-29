/**
 * ============================================================================
 * [FilePath] src/components/settings/DataTab.tsx
 * [Role] データインポート・エクスポート管理タブコンポーネント
 * 
 * [概要]
 * - UserDataContext からエクスポート/インポート処理を直接参照
 * ============================================================================
 */

import React, { useRef, useState } from 'react';
import { Download, Upload, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useUserDataContext } from '@/contexts/UserDataContext';
import { SETTINGS_STYLES } from '@/styles/components/settingsStyles';

export const DataTab: React.FC = () => {
	const { exportData, importData } = useUserDataContext();
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

	const styles = SETTINGS_STYLES.dataTab;

	const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		try {
			await importData(file);
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
		<div className={styles.container}>
			{statusMessage && (
				<div
					className={`${styles.statusMessageBase} ${statusMessage.type === 'success'
						? styles.statusSuccess
						: styles.statusError
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
			<div className={styles.section}>
				<h3 className={styles.title}>データのエクスポート（保存）</h3>
				<p className={styles.description}>
					現在のチェック状況や全キャラクターの情報を JSON ファイルとしてバックアップします。
				</p>
				<button
					onClick={exportData}
					className={styles.exportButton}
				>
					<Download className="w-4 h-4" />
					バックアップファイルをダウンロード
				</button>
			</div>

			<hr className={styles.divider} />

			{/* インポート */}
			<div className={styles.section}>
				<h3 className={styles.title}>データのインポート（復元）</h3>
				<p className={styles.description}>
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
					className={styles.importButton}
				>
					<Upload className="w-4 h-4" />
					バックアップファイルを選択
				</button>
			</div>
		</div>
	);
};