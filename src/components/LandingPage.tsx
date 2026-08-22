/**
 * ============================================================================
 * [FilePath] src/components/LandingPage.tsx
 * [Role] 初回訪問ユーザー向けランディングページ 兼 初期キャラクター作成コンポーネント
 * 
 * [概要]
 * - 初期キャラクター作成フォームとアプリの主な機能説明を表示
 * - COMMON_TOKENS および LAYOUT_TOKENS を参照し、スタイルベタ書きを排除して統一スタイルを適用
 * ============================================================================
 */

import React, { useState, useMemo } from 'react';
import { Fish, CheckCircle2, Users, HardDrive } from 'lucide-react';
import { COMMON_TOKENS } from '@/styles/tokens/commonTokens';
import { LAYOUT_TOKENS } from '@/styles/tokens/layoutTokens';

type LandingPageProps = {
	onCreateCharacter: (name: string) => void;
};

// FFXIの有名キャラクター5選
const SAMPLE_CHARACTERS = [
	'シャントット',
	'アヤメ',
	'アルド',
	'ライオン',
	'プリッシュ',
];

export const LandingPage: React.FC<LandingPageProps> = ({ onCreateCharacter }) => {
	const [charName, setCharName] = useState('');

	// コンポーネント生成時に5名からランダムで1名を選択
	const sampleName = useMemo(() => {
		const randomIndex = Math.floor(Math.random() * SAMPLE_CHARACTERS.length);
		return SAMPLE_CHARACTERS[randomIndex];
	}, []);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (charName.trim()) {
			onCreateCharacter(charName.trim());
		}
	};

	return (
		<div className={LAYOUT_TOKENS.page.centered}>
			<div className={`max-w-md w-full ${COMMON_TOKENS.state.default} rounded-2xl shadow-2xl p-8 space-y-8`}>
				{/* ヘッダーアイコン & タイトル */}
				<div className="text-center space-y-3">
					<div className={`inline-flex p-4 ${COMMON_TOKENS.color.primaryBg} rounded-2xl shadow-lg`}>
						<Fish className={`w-12 h-12 ${COMMON_TOKENS.color.textMain}`} />
					</div>
					<h1 className={COMMON_TOKENS.text.titleMain}>
						FF11 釣魚チェッカー
					</h1>
					<p className={COMMON_TOKENS.text.subText}>
						ファイナルファンタジーXI 釣果・ハラキリ管理ツール
					</p>
				</div>

				{/* 特徴リスト */}
				<div className={`space-y-3 text-xs p-4 rounded-xl ${COMMON_TOKENS.box.dark}`}>
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

				{/* キャラクター作成フォーム */}
				<form onSubmit={handleSubmit} className="space-y-4">
					<div className="space-y-1.5">
						<label htmlFor="initial-char-name" className={COMMON_TOKENS.text.label}>
							最初のキャラクター名を入力してください
						</label>
						<input
							id="initial-char-name"
							type="text"
							placeholder={`例: ${sampleName}`}
							value={charName}
							onChange={(e) => setCharName(e.target.value)}
							className={COMMON_TOKENS.form.input}
							autoFocus
							required
						/>
					</div>

					<button
						type="submit"
						disabled={!charName.trim()}
						className={COMMON_TOKENS.form.primaryButton}
					>
						チェッカーを始める
					</button>
				</form>
			</div>
		</div>
	);
};