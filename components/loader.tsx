'use client'

import { CircularProgress } from '@nextui-org/react'

export function Loader() {
	return (
		<div className="flex h-full w-full items-center justify-center scrollbar-hide">
			<CircularProgress aria-label="loading" size="lg" />
		</div>
	)
}
