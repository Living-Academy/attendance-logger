'use client'

import { getAuth } from '@firebase/auth'
import { getAnalytics } from '@firebase/analytics'
import { getPerformance } from '@firebase/performance'
import { getFirestore } from '@firebase/firestore'
import { getStorage } from '@firebase/storage'
import {
	FirebaseAppProvider,
	AuthProvider,
	FirestoreProvider,
	StorageProvider,
	useFirebaseApp,
} from 'reactfire'

const firebaseConfig = {
	apiKey: 'AIzaSyC7F6j5l_ekZO18OABHJitNrrHt2aGzGMk',
	authDomain: 'la-attendance-logger.firebaseapp.com',
	projectId: 'la-attendance-logger',
	storageBucket: 'la-attendance-logger.appspot.com',
	messagingSenderId: '967786349861',
	appId: '1:967786349861:web:7d19023db61f3eee3446cc',
	measurementId: 'G-NWTEHMN8Q5',
}

export function FirebaseComponents({
	children,
}: {
	children: React.ReactNode
}) {
	const app = useFirebaseApp()
	const auth = getAuth(app)
	const db = getFirestore(app)
	const storage = getStorage(app)

	if (typeof window !== 'undefined') {
		getAnalytics(app)
		getPerformance(app)
	}

	return (
		<AuthProvider sdk={auth}>
			<FirestoreProvider sdk={db}>
				<StorageProvider sdk={storage}>{children}</StorageProvider>
			</FirestoreProvider>
		</AuthProvider>
	)
}

export function FirebaseContextProvider({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<FirebaseAppProvider firebaseConfig={firebaseConfig}>
			<FirebaseComponents>{children}</FirebaseComponents>
		</FirebaseAppProvider>
	)
}
