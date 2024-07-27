'use client'

import { useRouter } from 'next/navigation'
import { User as UserType } from '@firebase/auth'
import {
	doc,
	collection,
	DocumentData,
	setDoc,
	Timestamp,
} from '@firebase/firestore'
import {
	useFirestore,
	useFirestoreCollectionData,
	useFirestoreDocData,
	useSigninCheck,
} from 'reactfire'
import {
	Button,
	Table,
	TableHeader,
	TableColumn,
	TableBody,
	TableRow,
	TableCell,
	User,
	Input,
	Spacer,
	Chip,
} from '@nextui-org/react'
import { BsDoorClosed, BsDoorOpen, BsSearch } from 'react-icons/bs'
import { useState } from 'react'

import { Loader } from '@/components/loader'
import { ErrMsg } from '@/components/error'

function formatTimestamp(timestamp: Timestamp) {
	return new Date(timestamp.seconds * 1000).toLocaleTimeString([], {
		hour: '2-digit',
		minute: '2-digit',
	})
}

function LogTable({
	logData,
	usersData,
}: {
	logData: DocumentData
	usersData: any
}) {
	const [search, setSearch] = useState('')

	return (
		<div className="flex w-full flex-col gap-4">
			<div className="flex items-center gap-2">
				<Input
					isClearable
					className="w-full"
					labelPlacement="outside"
					placeholder="Search"
					startContent={<BsSearch />}
					type="text"
					value={search}
					variant="faded"
					onValueChange={setSearch}
				/>
				<Chip
					className="h-full"
					color="primary"
					radius="md"
					variant="dot"
				>
					{new Date().toLocaleDateString('en-GB', {
						day: 'numeric',
						month: 'short',
					})}
				</Chip>
			</div>
			<Table aria-label="Articles table">
				<TableHeader>
					<TableColumn align="start">USER</TableColumn>
					<TableColumn>ENTRY</TableColumn>
					<TableColumn>EXIT</TableColumn>
				</TableHeader>
				<TableBody>
					{Object.keys(logData)
						.filter((field) => field !== 'NO_ID_FIELD')
						.filter(
							(uid) =>
								search === '' ||
								usersData[uid].displayName
									.toLowerCase()
									.includes(search.trim().toLowerCase()),
						)
						.map((uid: string) => (
							<TableRow key={uid}>
								<TableCell>
									<User
										avatarProps={{
											size: 'sm',
											src: usersData[uid].photoURL,
											fallback:
												usersData[
													uid
												].displayName.split(' ')[0],
										}}
										className="text-nowrap"
										// description={usersData[uid].email}
										name={usersData[uid].displayName}
									/>
								</TableCell>
								<TableCell>
									{formatTimestamp(logData[uid].entry)}
								</TableCell>
								<TableCell>
									{formatTimestamp(logData[uid].exit)}
								</TableCell>
							</TableRow>
						))}
				</TableBody>
			</Table>
		</div>
	)
}

function App({ user }: { user: UserType }) {
	const db = useFirestore()
	const today = new Date().toISOString().split('T')[0]
	const usersRef = collection(db, 'users')
	const logRef = doc(db, 'logs', today)

	const { status: usersDocsStatus, data: usersDocs } =
		useFirestoreCollectionData(usersRef)
	const { status: logStatus, data: logData } = useFirestoreDocData(logRef)

	if (usersDocsStatus !== 'success' || logStatus !== 'success')
		return <Loader />

	const usersData = usersDocs.reduce((acc, userDoc) => {
		acc[userDoc.NO_ID_FIELD] = userDoc

		return acc
	}, {})

	function handleUpdate(type: 'entry' | 'exit') {
		setDoc(
			logRef,
			{
				[user.uid]: {
					[type]: new Date(),
				},
			},
			{ merge: true },
		)
	}

	return (
		<div className="flex h-full w-full max-w-2xl flex-col items-center gap-4 p-4">
			{logData ? (
				<LogTable logData={logData} usersData={usersData} />
			) : (
				<ErrMsg text="No entries today 😴" />
			)}
			<Spacer className="flex-grow" />
			<div className="flex w-full items-center gap-2">
				<Button
					fullWidth
					startContent={<BsDoorOpen className="text-success" />}
					variant="flat"
					onPress={() => handleUpdate('entry')}
				>
					Mark entry
				</Button>
				<Button
					fullWidth
					startContent={<BsDoorClosed className="text-danger" />}
					variant="flat"
					onPress={() => handleUpdate('exit')}
				>
					Mark exit
				</Button>
			</div>
		</div>
	)
}

export default function Page() {
	const router = useRouter()
	const { status: signInCheckStatus, data: signInCheckResult } =
		useSigninCheck()

	if (signInCheckStatus !== 'success') {
		return <Loader />
	}

	const { signedIn, user } = signInCheckResult

	if (!signedIn || !user) router.push('/login')
	else return <App user={user} />
}
