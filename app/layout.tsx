import '@/app/globals.css'
import { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import clsx from 'clsx'

import { FirebaseContextProvider } from '@/config/firebase'
import { NavContextProvider } from '@/hooks/nav-context'
import { Providers } from '@/app/providers'
// import { ActionBar } from '@/components/action-bar'

const inter = Inter({ subsets: ['latin'] })

export const dynamic = 'force-static'

export const metadata: Metadata = {
	metadataBase: new URL('https://chalodaudne.in'),
	title: 'Chalo Daudne Marathon',
	description: 'Inspirit Vision Marathon',
	alternates: { canonical: 'https://chalodaudne.in' },
	appleWebApp: true,
	formatDetection: { telephone: false },
	other: { ['darkreader-lock' as string]: [true as any] },
}

export const viewport: Viewport = {
	themeColor: [
		{ media: '(prefers-color-scheme: light)', color: 'white' },
		{ media: '(prefers-color-scheme: dark)', color: 'black' },
	],
}

export default function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<html suppressHydrationWarning lang="en">
			<head />
			<body
				className={clsx(
					'h-[100svh] w-[100svw] bg-background antialiased',
					inter.className,
				)}
			>
				<FirebaseContextProvider>
					<Providers
						themeProps={{
							attribute: 'class',
							defaultTheme: 'light',
						}}
					>
						<NavContextProvider>
							<main className="flex h-[100svh] w-[100svw] flex-col overflow-hidden">
								{/* <ActionBar /> */}
								<div className="flex h-full w-full flex-col items-center justify-between overflow-hidden">
									{children}
								</div>
							</main>
						</NavContextProvider>
					</Providers>
				</FirebaseContextProvider>
			</body>
		</html>
	)
}
