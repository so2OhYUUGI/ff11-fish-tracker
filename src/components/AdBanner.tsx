import React from 'react';

type AdBannerProps = {
	slotId?: string;
};

export const AdBanner: React.FC<AdBannerProps> = () => {
	// 広告未契約期間は何もレンダリングしない（非表示）
	return null;

	/* 将来広告を導入する際に以下のコメントアウトを解除
	return (
		<div className="my-4 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<div className="bg-slate-800/40 border border-slate-700/50 rounded-lg p-3 text-center">
				<p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">スポンサーリンク</p>
				...
			</div>
		</div>
	);
	*/
};