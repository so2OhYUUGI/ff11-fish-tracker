import { MasterDataEditor } from '@/components/dev/MasterDataEditor';
import { isDev } from '@/utils/env';
import { X } from 'lucide-react';

type Props = {
	isOpen: boolean;
	onClose: () => void;
};

export const MasterDataEditorModal = ({ isOpen, onClose }: Props) => {
	if (!isDev || !isOpen) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
			<div className="bg-slate-800 rounded-xl border border-slate-700 max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
				<div className="p-4 bg-slate-900 border-b border-slate-700 flex justify-between items-center">
					<h2 className="font-bold text-red-400 flex items-center gap-2">
						🛠️ 開発用マスターデータエディタ
					</h2>
					<button
						onClick={onClose}
						className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-1 text-xs"
					>
						<X className="w-4 h-4" />
						<span>閉じる</span>
					</button>
				</div>
				<div className="p-4 overflow-y-auto flex-1 text-slate-900">
					<MasterDataEditor />
				</div>
			</div>
		</div>
	);
};