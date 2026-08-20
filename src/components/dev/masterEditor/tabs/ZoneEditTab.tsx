/**
 * ============================================================================
 * [FilePath] src/components/dev/masterEditor/tabs/ZoneEditTab.tsx
 * [Role] リージョン別ゾーン（エリア）設定タブ
 * ============================================================================
 */

import React, { useState } from 'react';
import type { ZoneMaster, RegionMaster } from '@/types/fish';
import { RelationEditor } from '../RelationEditor';
import type { EntityItem } from '../types';

type Props = {
	zoneList: ZoneMaster[];
	regionList: RegionMaster[];
	onZoneChange: (updatedZone: ZoneMaster) => void;
};

export const ZoneEditTab: React.FC<Props> = ({ zoneList, regionList, onZoneChange }) => {
	const [selectedRegionId, setSelectedRegionId] = useState<number | string | null>(
		regionList[0]?.id ?? null
	);

	const selectedRegion = regionList.find((r) => r.id === selectedRegionId);

	// 選択中リージョンに所属しているゾーンIDの配列
	const currentBelongingZoneIds = zoneList
		.filter((z) => z.regionId === selectedRegionId)
		.map((z) => z.id);

	// ゾーンのトグル処理（チェック時: 選択中regionIdを設定 / 解除時: regionIdを未設定にする）
	const handleZoneToggle = (zoneId: number | string) => {
		if (selectedRegionId === null) return;

		const targetZone = zoneList.find((z) => z.id === zoneId);
		if (!targetZone) return;

		const isBelonging = targetZone.regionId === selectedRegionId;

		const updatedZone: ZoneMaster = {
			...targetZone,
			regionId: isBelonging ? undefined : Number(selectedRegionId),
		};

		onZoneChange(updatedZone);
	};

	// ゾーンリストを RelationEditor 用のエンティティデータに変換
	const zoneEntityItems: EntityItem[] = zoneList.map((z) => {
		// 他のリージョンに所属している場合はサブテキストに表示
		const otherRegion = regionList.find((r) => r.id === z.regionId);
		const subLabel = z.regionId && z.regionId !== selectedRegionId
			? `(現在: ${otherRegion?.ja || z.regionId})`
			: z.en;

		return {
			id: z.id,
			label: z.ja,
			subLabel,
		};
	});

	return (
		<>
			{/* 左パネル: リージョン選択リスト */}
			<div
				style={{
					width: '260px',
					overflowY: 'auto',
					border: '1px solid #ccc',
					background: '#fff',
					flexShrink: 0,
				}}
			>
				<div style={{ padding: '8px', fontWeight: 'bold', borderBottom: '1px solid #ccc', background: '#f7fafc', fontSize: '12px' }}>
					リージョン一覧
				</div>
				{regionList.map((region) => {
					// 該当リージョンに紐づくエリア数をカウント
					const count = zoneList.filter((z) => z.regionId === region.id).length;

					return (
						<div
							key={region.id}
							onClick={() => setSelectedRegionId(region.id)}
							style={{
								padding: '8px',
								cursor: 'pointer',
								fontSize: '13px',
								backgroundColor: selectedRegionId === region.id ? '#e2e8f0' : 'transparent',
								borderBottom: '1px solid #eee',
								display: 'flex',
								alignItems: 'center',
							}}
						>
							<span>[{region.id}] {region.ja}</span>
							<span
								style={{
									fontSize: '11px',
									color: count > 0 ? '#2b6cb0' : '#a0aec0',
									fontWeight: count > 0 ? 'bold' : 'normal',
									backgroundColor: count > 0 ? '#ebf8ff' : '#edf2f7',
									padding: '2px 6px',
									borderRadius: '10px',
								}}
							>
								{count}件
							</span>
						</div>
					);
				})}
			</div>

			{/* 右パネル: 選択中リージョンに紐づくエリア（ゾーン）チェック設定 */}
			<div style={{ flex: 1, background: '#fff', padding: '15px', border: '1px solid #ccc', overflowY: 'auto' }}>
				{selectedRegion ? (
					<div style={{ display: 'grid', gap: '15px', fontSize: '13px' }}>
						<h3 style={{ margin: 0 }}>
							[{selectedRegion.id}] {selectedRegion.ja} ({selectedRegion.en}) に所属するエリア
						</h3>

						<RelationEditor
							mode="multiple"
							title="所属ゾーン（エリア）を選択"
							targets={zoneEntityItems}
							selectedTargetIds={currentBelongingZoneIds}
							onToggle={handleZoneToggle}
						/>
					</div>
				) : (
					<p style={{ color: '#666', margin: 0 }}>左側のリストからリージョンを選択してください。</p>
				)}
			</div>
		</>
	);
};