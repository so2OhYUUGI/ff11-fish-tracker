/**
 * ============================================================================
 * [FilePath] src/hooks/useIsMobileLayout.ts
 * [Role] 画面幅がモバイルレイアウト（1024px未満）かどうかを判定するカスタムフック
 * ============================================================================
 */

import { useState, useEffect } from 'react';

export const useIsMobileLayout = () => {
	const [isMobile, setIsMobile] = useState(() => {
		if (typeof window !== 'undefined') {
			return window.innerWidth < 1024;
		}
		return false;
	});

	useEffect(() => {
		const checkIsMobile = () => {
			setIsMobile(window.innerWidth < 1024);
		};

		window.addEventListener('resize', checkIsMobile);
		return () => window.removeEventListener('resize', checkIsMobile);
	}, []);

	return isMobile;
};