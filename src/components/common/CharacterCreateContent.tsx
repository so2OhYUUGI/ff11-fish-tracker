/**
 * ============================================================================
 * [FilePath] src/components/common/CharacterCreateContent.tsx
 * [Role] ランディングページおよびオンボーディングモーダルで共通利用するコンテンツ本体
 * 
 * [概要]
 * - URLパス（fishtracker / trusttracker）に応じた動的なタイトル・アイコン・アピールポイントの描画
 * - 初期キャラクター作成フォームの描画
 * - アプリ内ブラウザの検知と標準ブラウザ利用促進の注意喚起・外部ブラウザ起動機能
 * 
 * [依存関係・関連ファイル]
 * - ユーティリティ: src/utils/environment.ts
 * - スタイル    : src/styles/tokens/commonTokens.ts
 * ============================================================================
 */

import React, { useState, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { Fish, Users, CheckCircle2, HardDrive, ExternalLink } from 'lucide-react';
import { checkInAppBrowser, openInExternalBrowser } from '@/utils/environment';
import { COMMON_TOKENS } from '@/styles/tokens/commonTokens';

type TrackerConfig = {
	title: string;
	subtitle: string;
	icon: React.ElementType;
	features: string[];
};

// パスプレフィックスに対応するチェッカーメタデータ
const TRACKER_CONFIG_MAP: Record<string, TrackerConfig> = {
	'/trusttracker': {
		title: 'FF11 フェイスチェッカー',
		subtitle: 'ファイナルファンタジーXI フェイス修得状況管理ツール',
		icon: Users,
		features: [
			'フェイスの修得状況・タイプ・入手方法を簡単にチェック',
			'複数キャラクターの個別進捗を管理可能',
		],
	},
	'/fishtracker': {
		title: 'FF11 釣魚チェッカー',
		subtitle: 'ファイナルファンタジーXI 釣果・ハラキリ管理ツール',
		icon: Fish,
		features: [
			'釣果情報・ハラキリ対象・餌を簡単にチェック',
			'複数キャラクターの個別進捗を管理可能',
		],
	},
};

const DEFAULT_CONFIG = TRACKER_CONFIG_MAP['/fishtracker'];

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
	const location = useLocation();
	const isInApp = useMemo(() => checkInAppBrowser(), []);

	// URLパスに応じたチェッカー情報を特定
	const trackerConfig = useMemo(() => {
		const matchedPath = Object.keys(TRACKER_CONFIG_MAP).find((path) =>
			location.pathname.startsWith(path)
		);
		return matchedPath ? TRACKER_CONFIG_MAP[matchedPath] : DEFAULT_CONFIG;
	}, [location.pathname]);

	const IconComponent = trackerConfig.icon;

	const handleOpenBrowser = async () => {
		const result = await openInExternalBrowser();
		if (result === 'copied') {
			setCopied(true);
			setTimeout(() => setCopied(false), 3000);
		} else if (result === 'failed') {
			alert('URLの取得に失敗しました。アドレスバーのURLを直接コピーしてご利用ください。');
		}
	};

	return (
		<div className={COMMON_TOKENS.layout.stackLoose}>
			{/* ヘッダーアイコン & タイトル */}
			<div className={COMMON_TOKENS.layout.headerGroup}>
				<div className={`inline-flex p-3 ${COMMON_TOKENS.color.primaryBg} rounded-2xl shadow-lg`}>
					<IconComponent className={`w-10 h-10 ${COMMON_TOKENS.color.textMain}`} />
				</div>
				<h2 className={COMMON_TOKENS.text.titleMain}>
					{trackerConfig.title}
				</h2>
				<p className={COMMON_TOKENS.text.subText}>
					{trackerConfig.subtitle}
				</p>
			</div>

			{/* アピールポイント（3大特徴） */}
			<div className={`${COMMON_TOKENS.layout.featureGroup} ${COMMON_TOKENS.box.dark}`}>
				{trackerConfig.features.map((feature, index) => (
					<div key={index} className="flex items-center gap-2.5">
						<CheckCircle2 className={`w-4 h-4 ${COMMON_TOKENS.color.primary} shrink-0`} />
						<span>{feature}</span>
					</div>
				))}
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
						onClick={handleOpenBrowser}
						className={`${COMMON_TOKENS.alert.actionButton} flex items-center justify-center gap-2`}
					>
						<ExternalLink className="w-4 h-4" />
						<span>{copied ? '✓ URLをコピーしました！Safari/Chromeで開いてください' : '標準ブラウザで開く'}</span>
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