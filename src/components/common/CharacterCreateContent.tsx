/**
 * ============================================================================
 * [FilePath] src/components/common/CharacterCreateContent.tsx
 * [Role] ランディングページおよびオンボーディングモーダルで共通利用するコンテンツ本体
 * 
 * [概要]
 * - FF11 釣魚チェッカーの概要・特徴紹介と初期キャラクター作成フォームを描画する
 * - アプリ内ブラウザの検知と標準ブラウザ利用促進の注意喚起を行う
 * 
 * [依存関係・関連ファイル]
 * - ユーティリティ: src/utils/environment.ts
 * - スタイル    : src/styles/tokens/commonTokens.ts
 * 
 * [編集・改修時の注意事項（AI/エンジニア共通指示）]
 * 1. 【入力制御】 空白のみの名前登録を防止するため trimmed チェックおよび isSubmitting による二重送信防止ロジックを維持すること
 * 2. 【環境判定】 アプリ内ブラウザ判定（checkInAppBrowser）の実行結果は useMemo で保持し、不要な再計算を回避すること
 * 3. 【アクセシビリティ】 フォーム要素の label htmlFor と input id の紐付けを維持すること
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
	const [isSubmitting, setIsSubmitting] = useState(false);

	// useStateの初期化関数を使用して初回レンダリング時にのみ実行する
	const [sampleName] = useState(() => {
		const randomIndex = Math.floor(Math.random() * SAMPLE_CHARACTERS.length);
		return SAMPLE_CHARACTERS[randomIndex];
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		const trimmed = charName.trim();
		if (trimmed && !isSubmitting) {
			setIsSubmitting(true);
			onSubmit(trimmed);
		}
	};

	return (
		<form onSubmit={handleSubmit} className={COMMON_TOKENS.layout.stackStandard}>
			<div className={COMMON_TOKENS.layout.stackCompact}>
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
					maxLength={30}
					required
				/>
			</div>

			<button
				type="submit"
				disabled={!charName.trim() || isSubmitting}
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
		<div className={COMMON_TOKENS.layout.stackLoose}>
			{/* ヘッダーアイコン & タイトル */}
			<div className={COMMON_TOKENS.layout.headerGroup}>
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
			<div className={`${COMMON_TOKENS.layout.featureGroup} ${COMMON_TOKENS.box.dark}`}>
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