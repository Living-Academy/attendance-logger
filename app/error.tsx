'use client'

import { useEffect } from 'react'
import { Modal, ModalContent, ModalHeader, ModalBody } from '@nextui-org/modal'
import { useDisclosure } from '@nextui-org/react'

import { ErrMsg } from '@/components/error'

export default function Error({
	error,
	reset,
}: {
	error: Error
	reset: () => void
}) {
	const { isOpen, onOpen, onOpenChange } = useDisclosure()

	useEffect(() => {
		// eslint-disable-next-line no-console
		console.error(error)
	}, [error])

	return (
		<>
			<ErrMsg
				buttons={[
					{
						text: 'Try again',
						href: '#',
						onPress: () => reset(),
					},
					{
						text: 'More info',
						onPress: onOpen,
					},
				]}
				text="Something went wrong! 🫤"
			/>
			<Modal isOpen={isOpen} onOpenChange={onOpenChange}>
				<ModalContent>
					{() => (
						<>
							<ModalHeader>{error.name}</ModalHeader>
							<ModalBody className="pb-4">
								{error.message}
							</ModalBody>
						</>
					)}
				</ModalContent>
			</Modal>
		</>
	)
}
