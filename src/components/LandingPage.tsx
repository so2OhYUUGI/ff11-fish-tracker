/**
 * ============================================================================
 * [FilePath] src/components/LandingPage.tsx
 * [Role] 初回訪問ユーザー向けランディングページ 兼 初期キャラクター作成コンポーネント
 * ============================================================================
 */

import React, { useState, useMemo } from 'react';
import { Fish, CheckCircle2, Users, HardDrive } from 'lucide-react';

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
		<div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-center items-center px-4 py-12">
			<div className="max-w-md w-full bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl p-8 space-y-8">
				{/* ヘッダーアイコン & タイトル */}
				<div className="text-center space-y-3">
					<div className="inline-flex p-4 bg-blue-600 rounded-2xl shadow-lg">
						<Fish className="w-12 h-12 text-white" />
					</div>
					<h1 className="text-2xl font-bold tracking-tight text-white">
						FF11 釣魚チェッカー
					</h1>
					<p className="text-xs text-slate-400">
						ファイナルファンタジーXI 釣果・ハラキリ管理ツール
					</p>
				</div>

				{/* 特徴リスト */}
				<div className="space-y-3 text-xs text-slate-300 bg-slate-900/50 p-4 rounded-xl border border-slate-700/50">
					<div className="flex items-center gap-2.5">
						<CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
						<span>釣果情報・ハラキリ対象・餌を簡単にチェック</span>
					</div>
					<div className="flex items-center gap-2.5">
						<Users className="w-4 h-4 text-blue-400 shrink-0" />
						<span>複数キャラクターの個別進捗を管理可能</span>
					</div>
					<div className="flex items-center gap-2.5">
						<HardDrive className="w-4 h-4 text-blue-400 shrink-0" />
						<span>データはブラウザに自動保存＆ファイル保存に対応</span>
					</div>
				</div>

				{/* キャラクター作成フォーム */}
				<form onSubmit={handleSubmit} className="space-y-4">
					<div className="space-y-1.5">
						<label htmlFor="initial-char-name" className="block text-xs font-medium text-slate-300">
							最初のキャラクター名を入力してください
						</label>
						<input
							id="initial-char-name"
							type="text"
							placeholder={`例: ${sampleName}`}
							value={charName}
							onChange={(e) => setCharName(e.target.value)}
							className="w-full bg-slate-700 border border-slate-600 text-white placeholder-slate-400 text-sm rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
							autoFocus
							required
						/>
					</div>

					<button
						type="submit"
						disabled={!charName.trim()}
						className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm rounded-lg shadow-md transition-colors"
					>
						チェッカーを始める
					</button>
				</form>
			</div>
		</div>
	);
};