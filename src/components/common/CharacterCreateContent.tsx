/**
 * ============================================================================
 * [FilePath] src/components/common/CharacterCreateContent.tsx
 * [Role] ランディングページおよびオンボーディングモーダルで共通利用するコンテンツ本体
 * ============================================================================
 */

import React, { useState, useMemo } from 'react';
import { Fish, CheckCircle2, Users, HardDrive } from 'lucide-react';
import { checkInAppBrowser } from '@/utils/environment';
import { COMMON_TOKENS } from '@/styles/tokens/commonTokens';

type CharacterCreateFormProps = {
	onSubmit: (name: string) => void;
	submitLabel?: string;
	autoFocus?: boolean;
};

const SAMPLE_CHARACTERS = ['シャントット', 'アヤメ', 'アルド', 'ライオン', 'プリッシュ'];

const CharacterCreateForm: React.FC<CharacterCreateFormProps> = ({
	onSubmit,
	submitLabel = 'チェッカーを始める',
	autoFocus = true,
}) => {
	const [charName, setCharName] = useState('');

	const sampleName = useMemo(() => {
		const randomIndex = Math.floor(Math.random() * SAMPLE_CHARACTERS.length);
		return SAMPLE_CHARACTERS[randomIndex];
	}, []);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (charName.trim()) {
			onSubmit(charName.trim());
		}
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			<div className="space-y-1.5">
				<label htmlFor="initial-char-name" className={COMMON_TOKENS.text.label}>
					キャラクター名を入力してください
				</label>
				<input
					id="initial-char-name"
					type="text"
					placeholder={`例: ${sampleName}`}
					value={charName}
					onChange={(e) => setCharName(e.target.value)}
					className={COMMON_TOKENS.form.input}
					autoFocus={autoFocus}
					required
				/>
			</div>

			<button
				type="submit"
				disabled={!charName.trim()}
				className={COMMON_TOKENS.form.primaryButton}
			>
				{submitLabel}
			</button>
		</form>
	);
};

type CharacterCreateContentProps = {
	onCreateCharacter: (name: string) => void;
	message?: string | null;
	onClose?: () => void;
};

export const CharacterCreateContent: React.FC<CharacterCreateContentProps> = ({
	onCreateCharacter,
	message,
	onClose,
}) => {
	const [copied, setCopied] = useState(false);
	const isInApp = useMemo(() => checkInAppBrowser(), []);

	const handleCopyUrl = async () => {
		if (typeof window === 'undefined') return;
		try {
			await navigator.clipboard.writeText(window.location.href);
			setCopied(true);
			setTimeout(() => setCopied(false), 3000);
		} catch (err) {
			console.error('URLのコピーに失敗しました', err);
		}
	};

	return (
		<div className="space-y-5">
			{/* ヘッダーアイコン & タイトル */}
			<div className="text-center space-y-2 pt-2">
				<div className={`inline-flex p-3 ${COMMON_TOKENS.color.primaryBg} rounded-2xl shadow-lg`}>
					<Fish className={`w-10 h-10 ${COMMON_TOKENS.color.textMain}`} />
				</div>
				<h2 className={COMMON_TOKENS.text.titleMain}>
					FF11 釣魚チェッカー
				</h2>
				<p className={COMMON_TOKENS.text.subText}>
					ファイナルファンタジーXI 釣果・ハラキリ管理ツール
				</p>
			</div>

			{/* アピールポイント（3大特徴） */}
			<div className={`space-y-2.5 text-xs p-3.5 rounded-xl ${COMMON_TOKENS.box.dark}`}>
				<div className="flex items-center gap-2.5">
					<CheckCircle2 className={`w-4 h-4 ${COMMON_TOKENS.color.primary} shrink-0`} />
					<span>釣果情報・ハラキリ対象・餌を簡単にチェック</span>
				</div>
				<div className="flex items-center gap-2.5">
					<Users className={`w-4 h-4 ${COMMON_TOKENS.color.primary} shrink-0`} />
					<span>複数キャラクターの個別進捗を管理可能</span>
				</div>
				<div className="flex items-center gap-2.5">
					<HardDrive className={`w-4 h-4 ${COMMON_TOKENS.color.primary} shrink-0`} />
					<span>データはブラウザに自動保存＆ファイル保存に対応</span>
				</div>
			</div>

			{/* 動的メッセージ */}
			{message && (
				<div className={COMMON_TOKENS.alert.warningBox}>
					<span className={COMMON_TOKENS.alert.warningIcon}>💡</span>
					<span className={COMMON_TOKENS.alert.warningText}>{message}</span>
				</div>
			)}

			{/* アプリ内ブラウザ警告 */}
			{isInApp && (
				<div className={COMMON_TOKENS.alert.infoPanel}>
					<p className={COMMON_TOKENS.alert.infoPanelTitle}>💡 標準ブラウザでのご利用をおすすめします</p>
					<p className={COMMON_TOKENS.alert.infoPanelText}>
						SNS等のアプリ内ブラウザで開いているため、ブラウザを閉じるとデータが消える可能性があります。
					</p>
					<button
						type="button"
						onClick={handleCopyUrl}
						className={COMMON_TOKENS.alert.actionButton}
					>
						{copied ? '✓ URLをコピーしました！' : 'URLをコピーして標準ブラウザで開く'}
					</button>
				</div>
			)}

			{/* キャラクター作成フォーム */}
			<CharacterCreateForm
				onSubmit={(name) => {
					onCreateCharacter(name);
					if (onClose) onClose();
				}}
				submitLabel="チェッカーを始める"
			/>

			{/* キャンセルボタン */}
			{onClose && (
				<div className="text-center pt-1">
					<button
						type="button"
						onClick={onClose}
						className={COMMON_TOKENS.actionText.cancelLink}
					>
						キャンセルして閲覧を続ける
					</button>
				</div>
			)}
		</div>
	);
};