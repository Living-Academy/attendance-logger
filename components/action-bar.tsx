'use client'

import { BsSunFill, BsMoonStarsFill } from 'react-icons/bs'
import { useTheme } from 'next-themes'
import { useAuth, useSigninCheck } from 'reactfire'
import {
	Navbar,
	Button,
	Modal,
	ModalContent,
	ModalHeader,
	ModalBody,
	useDisclosure,
	Avatar,
	NavbarBrand,
	Switch,
	ModalFooter,
	Chip,
} from '@nextui-org/react'
import NextImage from 'next/image'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

function UserModal({
	isOpen,
	onOpenChange,
}: {
	isOpen: boolean
	onOpenChange: (isOpen: boolean) => void
}) {
	const router = useRouter()
	const auth = useAuth()
	const { theme, setTheme } = useTheme()

	return (
		<Modal
			backdrop="opaque"
			className="mx-8"
			isOpen={isOpen}
			placement="center"
			size="xs"
			onOpenChange={onOpenChange}
		>
			<ModalContent>
				{() => (
					<>
						<ModalHeader>
							{auth.currentUser?.displayName}
						</ModalHeader>
						<ModalBody>
							<div className="flex items-center justify-between">
								<p className="text-lg font-medium text-foreground-700">
									Email
								</p>
								<Chip
									className="bg-foreground-200"
									onClick={() => router.push('/create')}
								>
									{auth.currentUser?.email}
								</Chip>
							</div>
							<div className="flex items-center justify-between">
								<p className="text-lg font-medium text-foreground-700">
									Dark theme
								</p>
								<Switch
									className="mr-[-0.5rem]"
									endContent={<BsSunFill size={15} />}
									isSelected={theme === 'dark'}
									startContent={<BsMoonStarsFill size={15} />}
									onChange={() =>
										setTheme(
											theme === 'light'
												? 'dark'
												: 'light',
										)
									}
								/>
							</div>
						</ModalBody>
						<ModalFooter>
							<Button
								color="primary"
								variant="flat"
								onClick={() => {
									router.push('/')
								}}
							>
								Home
							</Button>
							<Button
								color="danger"
								variant="flat"
								onClick={() => {
									auth.signOut()
								}}
							>
								Sign out
							</Button>
						</ModalFooter>
					</>
				)}
			</ModalContent>
		</Modal>
	)
}

export function ActionBar() {
	const router = useRouter()
	const auth = useAuth()
	const pathname = usePathname()
	const [display, setDisplay] = useState(false)
	const { isOpen, onOpen, onOpenChange } = useDisclosure()
	const { status: signInCheckStatus, data: signInCheckResult } =
		useSigninCheck()

	useEffect(() => {
		if (pathname === '/login') setDisplay(false)
		else setDisplay(true)
	}, [pathname])

	if (!display || signInCheckStatus !== 'success') {
		return <></>
	}

	const { signedIn, user } = signInCheckResult

	return (
		<Navbar
			isBlurred
			isBordered
			className="flex w-full justify-center"
			maxWidth="sm"
		>
			<NavbarBrand className="h-full">
				<div className="flex h-full w-full py-2">
					<div className="relative w-full">
						<NextImage
							fill
							alt="LA Logo"
							className="cursor-pointer p-2"
							objectFit="contain"
							src="/vercel.svg"
							style={{ width: '' }}
							onClick={() => router.push('/')}
						/>
					</div>
				</div>
			</NavbarBrand>
			<div className="w-min">
				<Avatar
					isBordered
					className="cursor-pointer capitalize"
					src={auth.currentUser?.photoURL as string}
					onClick={onOpen}
				/>
			</div>
			{signedIn && user && (
				<UserModal isOpen={isOpen} onOpenChange={onOpenChange} />
			)}
		</Navbar>
	)
}
