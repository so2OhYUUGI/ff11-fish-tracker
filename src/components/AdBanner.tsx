import React from 'react';

type AdBannerProps = {
	slotId?: string; // AdSenseの広告スロットID等
};

export const AdBanner: React.FC<AdBannerProps> = ({ slotId }) => {
	return (
		<div className="my-4 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<div className="bg-slate-800/40 border border-dashed border-slate-700 rounded-lg p-3 text-center">
				<p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">スポンサーリンク</p>

				{/* 開発時プレースホルダー領域（本番時に Google AdSense 等のタグを配置） */}
				<div className="h-16 sm:h-20 bg-slate-900/60 rounded flex items-center justify-center text-xs text-slate-500">
					{slotId ? `Ad Space (Slot: ${slotId})` : '広告枠エリア'}
				</div>
			</div>
		</div>
	);
};