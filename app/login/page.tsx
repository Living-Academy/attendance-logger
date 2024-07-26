'use client'

import {
	signInWithEmailAndPassword,
	createUserWithEmailAndPassword,
} from 'firebase/auth'
import { Button, Checkbox, Input, Link, Tab, Tabs } from '@nextui-org/react'
import { BsEnvelopeAt, BsKey } from 'react-icons/bs'
import { doc, setDoc } from 'firebase/firestore'
import { useAuth, useFirestore } from 'reactfire'
import { Key, useState } from 'react'
import { useRouter } from 'next/navigation'

import { isEmailValid, isPasswordValid } from '@/utils/text'

interface ErrorObject {
	message: string
	code: string
}

export default function Page() {
	const router = useRouter()
	const db = useFirestore()
	const auth = useAuth()
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [firstName, setFirstName] = useState('')
	const [lastName, setLastName] = useState('')
	const [selectedTab, setSelectedTab] = useState<string | Key>('signin')
	const [error, setError] = useState<ErrorObject | null>(null)

	function handleSignIn() {
		signInWithEmailAndPassword(auth, email, password)
			.then((userCredential) => {
				router.push('/')
			})
			.catch((error) => {
				setError(error)
				setTimeout(() => setError(null), 2000)
				// eslint-disable-next-line no-console
				console.error(error)
			})
	}

	function handleSignUp() {
		createUserWithEmailAndPassword(auth, email, password)
			.then(async (userCredential) => {
				const user = userCredential.user
				const userRef = doc(db, 'users', user.uid)

				await setDoc(userRef, {
					email: user.email,
					displayName:
						`${firstName.trim()} ${lastName.trim()}`.trim(),
				})
				router.push('/')
			})
			.catch((error) => {
				setError(error)
				setTimeout(() => setError(null), 2000)
				// eslint-disable-next-line no-console
				console.error(error)
			})
	}

	return (
		<div className="flex h-full w-full max-w-2xl flex-col justify-center gap-4 p-4">
			<h1 className="flex justify-center gap-1 py-4 text-3xl font-semibold">
				LA Attendance Logger
			</h1>
			<Tabs
				fullWidth
				selectedKey={String(selectedTab)}
				onSelectionChange={setSelectedTab}
			>
				<Tab key="signin" title="Sign in" />
				<Tab key="signup" title="Sign up" />
			</Tabs>
			<div className="flex flex-col gap-4">
				{selectedTab === 'signup' && (
					<div className="flex items-center gap-2">
						<Input
							isRequired
							inputMode="text"
							label="First name"
							spellCheck={false}
							type="text"
							value={firstName}
							variant="bordered"
							onValueChange={setFirstName}
						/>
						<Input
							inputMode="text"
							label="Last name"
							spellCheck={false}
							type="text"
							value={lastName}
							variant="bordered"
							onValueChange={setLastName}
						/>
					</div>
				)}
				<Input
					endContent={
						<BsEnvelopeAt className="pointer-events-none flex-shrink-0 text-2xl text-default-400" />
					}
					inputMode="email"
					isInvalid={Boolean(email) && !isEmailValid(email)}
					isRequired={selectedTab === 'signup'}
					label="Email"
					spellCheck={false}
					type="email"
					value={email.toLowerCase()}
					variant="bordered"
					onValueChange={(value) => setEmail(value.toLowerCase())}
				/>
				<Input
					endContent={
						<BsKey className="pointer-events-none flex-shrink-0 text-2xl text-default-400" />
					}
					inputMode="text"
					isInvalid={Boolean(password) && !isPasswordValid(password)}
					isRequired={selectedTab === 'signup'}
					label="Password"
					type="password"
					value={password}
					variant="bordered"
					onValueChange={setPassword}
				/>
				<div className="flex justify-between px-[0.125rem]">
					<Checkbox
						classNames={{
							label: 'text-small',
						}}
					>
						Remember me
					</Checkbox>
					{selectedTab === 'signin' && (
						<Link color="primary" href="#" size="sm">
							Forgot password?
						</Link>
					)}
				</div>
			</div>
			<Button
				fullWidth
				color={error ? 'danger' : 'primary'}
				isDisabled={error !== null}
				variant="flat"
				onPress={selectedTab === 'signin' ? handleSignIn : handleSignUp}
			>
				{error ? `${error.code}` : 'Continue'}
			</Button>
		</div>
	)
}
