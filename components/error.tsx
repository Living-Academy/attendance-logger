'use client'

import { Button } from '@nextui-org/react'
import NextLink from 'next/link'

type ButtonProps = {
	text: string
	href?: string
	onPress?: () => void
}

export function ErrMsg({
	text,
	buttons,
}: {
	text: string
	buttons?: ButtonProps[]
}) {
	return (
		<div className="flex h-full flex-col items-center justify-center p-4">
			<h1 className="py-4 text-center text-2xl text-foreground-800">
				{text}
			</h1>
			{buttons && (
				<div className="flex gap-2">
					{buttons.map((button) =>
						button.href ? (
							<Button
								key={button.text}
								as={NextLink}
								color="primary"
								href={button.href}
								variant="flat"
								onPress={button.onPress}
							>
								{button.text}
							</Button>
						) : (
							<Button
								key={button.text}
								color="primary"
								variant="flat"
								onPress={button.onPress}
							>
								{button.text}
							</Button>
						),
					)}
				</div>
			)}
		</div>
	)
}
