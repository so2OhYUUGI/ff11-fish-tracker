/**
 * ============================================================================
 * [FilePath] src/components/dev/masterEditor/tabs/TrustEditTab/components/TrustBasicFields.tsx
 * [Role] フェイス編集（ジョブ、戦闘タイプ、所属分類、限定、修得情報）コンポーネント
 * ============================================================================
 */

import React from 'react';
import type { TrustMaster, TrustCombatType, TrustAffiliation } from '@/types/trusttracker';
import { EDITOR_STYLES } from '@/styles/components/editorStyles';

type TrustBasicFieldsProps = {
	trust: TrustMaster;
	onFieldChange: <K extends keyof TrustMaster>(field: K, value: TrustMaster[K]) => void;
};

const COMBAT_TYPES: TrustCombatType[] = ['近接物理', '遠隔物理', '魔法攻撃', '回復', '支援', '盾'];
const AFFILIATIONS: TrustAffiliation[] = [
	'サンドリア',
	'バストゥーク',
	'ウィンダス',
	'ジュノ',
	'プロマシア',
	'アトルガン',
	'アルタナ',
	'アドゥリン',
	'その他',
];

export const TrustBasicFields: React.FC<TrustBasicFieldsProps> = ({
	trust,
	onFieldChange,
}) => {
	return (
		<div className="space-y-4 text-xs">
			{/* 選択中フェイス参照表示 */}
			<div className="bg-slate-100 p-3 rounded-lg border border-slate-200 flex items-center justify-between">
				<div>
					<span className="font-mono text-slate-400 mr-2">#{trust.id}</span>
					<span className="font-bold text-sm text-slate-800">{trust.ja}</span>
					<span className="text-slate-500 text-xs ml-2">({trust.en})</span>
				</div>
			</div>

			{/* 編集領域 */}
			<div className={EDITOR_STYLES.trustEdit.sectionCard}>
				<h4 className={EDITOR_STYLES.trustEdit.sectionTitle}>
					⚙️ 属性・修得情報編集
				</h4>

				{/* ジョブ設定 */}
				<div>
					<label className={EDITOR_STYLES.trustEdit.fieldLabel}>ジョブ</label>
					<input
						type="text"
						value={trust.job || ''}
						onChange={(e) => onFieldChange('job', e.target.value)}
						className={EDITOR_STYLES.fishEdit.inputField}
						placeholder="例: ナ/戦, 赤/黒"
					/>
				</div>

				{/* 戦闘タイプ (排他ボタン) */}
				<div>
					<label className={EDITOR_STYLES.trustEdit.fieldLabel}>戦闘タイプ</label>
					<div className="flex flex-wrap gap-1.5 pt-0.5">
						{COMBAT_TYPES.map((type) => {
							const isActive = trust.combatType === type;
							return (
								<button
									key={type}
									type="button"
									onClick={() => onFieldChange('combatType', type)}
									className={`${EDITOR_STYLES.fishEdit.segmentBtnBase} ${isActive
											? EDITOR_STYLES.fishEdit.segmentBtnActive
											: EDITOR_STYLES.fishEdit.segmentBtnInactive
										}`}
								>
									{type}
								</button>
							);
						})}
					</div>
				</div>

				{/* 所属分類 (排他ボタン) */}
				<div>
					<label className={EDITOR_STYLES.trustEdit.fieldLabel}>所属分類</label>
					<div className="flex flex-wrap gap-1.5 pt-0.5">
						{AFFILIATIONS.map((aff) => {
							const isActive = (trust.affiliation || 'その他') === aff;
							return (
								<button
									key={aff}
									type="button"
									onClick={() => onFieldChange('affiliation', aff)}
									className={`${EDITOR_STYLES.fishEdit.segmentBtnBase} ${isActive
											? EDITOR_STYLES.fishEdit.segmentBtnActive
											: EDITOR_STYLES.fishEdit.segmentBtnInactive
										}`}
								>
									{aff}
								</button>
							);
						})}
					</div>
				</div>

				{/* 限定（isLimited） & 修得情報 */}
				<div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-3 items-center pt-2 border-t border-slate-200">
					<label className={EDITOR_STYLES.trustEdit.checkboxLabel}>
						<input
							type="checkbox"
							checked={!!trust.isLimited}
							onChange={(e) => onFieldChange('isLimited', e.target.checked)}
							className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
						/>
						<span>限定</span>
					</label>

					<div>
						<label className={EDITOR_STYLES.trustEdit.fieldLabel}>修得情報 (acquireInfo)</label>
						<input
							type="text"
							value={trust.acquireInfo || ''}
							onChange={(e) => onFieldChange('acquireInfo', e.target.value)}
							className={EDITOR_STYLES.fishEdit.inputField}
							placeholder="修得条件や入手方法を入力..."
						/>
					</div>
				</div>
			</div>
		</div>
	);
};