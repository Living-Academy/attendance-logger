'use client'

import {
	signInWithEmailAndPassword,
	createUserWithEmailAndPassword,
	updateProfile,
} from 'firebase/auth'
import {
	Avatar,
	Button,
	Checkbox,
	Input,
	Link,
	Tab,
	Tabs,
} from '@nextui-org/react'
import { BsEnvelopeAt, BsEye, BsEyeSlash, BsUpload } from 'react-icons/bs'
import { doc, setDoc } from '@firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from '@firebase/storage'
import { useAuth, useFirestore, useStorage } from 'reactfire'
import { Key, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import NextImage from 'next/image'

import { isEmailValid, isPasswordValid } from '@/utils/text'

interface ErrorObject {
	message: string
	code: string
}

function dataURLToBlob(dataURL: string) {
	const parts = dataURL.split(';base64,')
	const contentType = parts[0].split(':')[1]
	const raw = window.atob(parts[1])
	const rawLength = raw.length
	const uInt8Array = new Uint8Array(rawLength)

	for (let i = 0; i < rawLength; ++i) {
		uInt8Array[i] = raw.charCodeAt(i)
	}

	return new Blob([uInt8Array], { type: contentType })
}

export default function Page() {
	const router = useRouter()
	const db = useFirestore()
	const storage = useStorage()
	const auth = useAuth()
	const fileInputRef = useRef<HTMLInputElement>(null)
	const [image, setImage] = useState<string | null>(null)
	const [isImgLoading, setIsImgLoading] = useState(false)
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [passwordVisible, setPasswordVisible] = useState(false)
	const [firstName, setFirstName] = useState('')
	const [lastName, setLastName] = useState('')
	const [selectedTab, setSelectedTab] = useState<string | Key>('signin')
	const [error, setError] = useState<ErrorObject | null>(null)
	const [isLoading, setIsLoading] = useState(false)

	function handleSignIn() {
		setIsLoading(true)
		signInWithEmailAndPassword(auth, email, password)
			.then(() => {
				router.push('/')
			})
			.catch((error) => {
				setIsLoading(false)
				setError(error)
				setTimeout(() => setError(null), 2000)
				// eslint-disable-next-line no-console
				console.error(error)
			})
	}

	function handleSignUp() {
		setIsLoading(true)
		const displayName = `${firstName.trim()} ${lastName.trim()}`.trim()

		createUserWithEmailAndPassword(auth, email, password)
			.then(async (userCredential) => {
				const user = userCredential.user

				if (image) {
					const userRef = doc(db, 'users', user.uid)
					const storageRef = ref(
						storage,
						`profilePictures/${user.uid}.webp`,
					)

					const response = await fetch(image)
					const blob = await response.blob()

					await uploadBytes(storageRef, blob)
					const photoURL = await getDownloadURL(storageRef)

					await updateProfile(user, {
						displayName,
						photoURL,
					})

					await setDoc(userRef, {
						displayName,
						photoURL,
						email: user.email,
						uid: user.uid,
					})

					router.push('/')
				} else {
					updateProfile(user, {
						displayName,
					}).then(() => {
						router.push('/')
					})
				}
			})
			.catch((error) => {
				setIsLoading(false)
				setError(error)
				setTimeout(() => setError(null), 2000)
				// eslint-disable-next-line no-console
				console.error(error)
			})
	}

	function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
		const file = event.target.files?.[0]
		const reader = new FileReader()

		if (file) setIsImgLoading(true)
		reader.onload = (event) => {
			const img = new Image()

			img.onload = async () => {
				const canvas = document.createElement('canvas')

				canvas.width = img.width
				canvas.height = img.height

				const ctx = canvas.getContext('2d')

				ctx?.drawImage(img, 0, 0)

				let low = 0,
					high = 1
				const desiredSize = 100000 // 100 kB
				let blob

				while (high - low > 0.01) {
					const quality = (low + high) / 2
					const webpDataUrl = canvas.toDataURL('image/webp', quality)

					blob = dataURLToBlob(webpDataUrl)

					if (blob.size > desiredSize) {
						high = quality
					} else {
						low = quality
					}
				}

				const url = blob ? URL.createObjectURL(blob) : undefined

				setImage(url ?? null)
				setIsImgLoading(false)
			}
			img.src = event.target?.result as string
		}

		if (file) {
			reader.readAsDataURL(file)
		}
	}

	return (
		<div className="flex h-full w-full max-w-2xl flex-col justify-center gap-4 p-4">
			<div className="flex w-full items-center justify-center gap-3">
				<NextImage
					alt="logo"
					height={42}
					src="./favicon.ico"
					width={42}
				/>
				<h1 className="flex justify-center gap-1 py-4 text-3xl font-semibold">
					LA Logger
				</h1>
			</div>
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
						<BsEnvelopeAt className="text-default-400" size={25} />
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
						<button
							onClick={() => setPasswordVisible(!passwordVisible)}
						>
							{passwordVisible ? (
								<BsEye className="text-default-400" size={25} />
							) : (
								<BsEyeSlash
									className="text-default-400"
									size={25}
								/>
							)}
						</button>
					}
					inputMode="text"
					isInvalid={Boolean(password) && !isPasswordValid(password)}
					isRequired={selectedTab === 'signup'}
					label="Password"
					type={passwordVisible ? 'text' : 'password'}
					value={password}
					variant="bordered"
					onValueChange={setPassword}
				/>
				{selectedTab === 'signin' ? (
					<div className="flex justify-between px-[0.125rem]">
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
				) : (
					<div className="flex items-center gap-1">
						<input
							ref={fileInputRef}
							hidden
							accept="image/*"
							type="file"
							onChange={handleFileChange}
						/>
						<Avatar fallback={firstName} src={image || ''} />
						<Link
							className="cursor-pointer px-2"
							color="primary"
							isDisabled={isImgLoading}
							onClick={() => fileInputRef.current?.click()}
						>
							{isImgLoading ? (
								'Loading...'
							) : (
								<div className="flex items-center gap-2">
									<BsUpload size={16} />
									Upload profile picture
								</div>
							)}
						</Link>
					</div>
				)}
			</div>
			<Button
				fullWidth
				color={error ? 'danger' : 'primary'}
				isDisabled={error !== null || isLoading}
				variant="flat"
				onPress={selectedTab === 'signin' ? handleSignIn : handleSignUp}
			>
				{error
					? `${error.code}`
					: isLoading
						? 'Loading...'
						: 'Continue'}
			</Button>
		</div>
	)
}
