import { Heart } from 'lucide-react';

export const Footer = () => {
	return (
		<footer className="bg-slate-950 border-t border-slate-800 py-6 text-xs text-slate-500">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
				<div>
					<p>© FINAL FANTASY XI ALL RIGHTS RESERVED.</p>
					<p className="mt-1">FF11 釣魚チェッカー (ff11-fish-tracker)</p>
				</div>

				<div className="flex items-center gap-4">
					<a
						href="https://amzn.to/example"
						target="_blank"
						rel="noopener noreferrer"
						className="text-slate-400 hover:text-amber-400 flex items-center gap-1 transition-colors"
					>
						<Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
						<span>開発者を支援する (Amazon)</span>
					</a>
				</div>
			</div>
		</footer>
	);
};