'use client'

import { Button, Checkbox, Input, Link } from '@nextui-org/react'
import { BsEnvelopeAt, BsKey } from 'react-icons/bs'

export default function Page() {
	return (
		<div className="flex h-full w-full max-w-2xl flex-col justify-center gap-4 p-4">
			<h1 className="flex justify-center gap-1 py-4 text-3xl font-semibold">
				LA Attendance Logger
			</h1>
			<div className="flex flex-col gap-4">
				<Input
					endContent={
						<BsEnvelopeAt className="pointer-events-none flex-shrink-0 text-2xl text-default-400" />
					}
					label="Email"
					variant="bordered"
				/>
				<Input
					endContent={
						<BsKey className="pointer-events-none flex-shrink-0 text-2xl text-default-400" />
					}
					label="Password"
					type="password"
					variant="bordered"
				/>
				<div className="flex justify-between px-1">
					<Checkbox
						classNames={{
							label: 'text-small',
						}}
					>
						Remember me
					</Checkbox>
					<Link color="primary" href="#" size="sm">
						Forgot password?
					</Link>
				</div>
			</div>
			{/* <Button color="danger" variant="flat">
					Close
				</Button> */}
			<Button fullWidth color="primary" variant="flat">
				Sign in
			</Button>
		</div>
	)
}
