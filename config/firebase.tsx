'use client'

import { getAuth } from 'firebase/auth'
import { getAnalytics } from 'firebase/analytics'
import { getPerformance } from 'firebase/performance'
import { getFirestore } from 'firebase/firestore'
import {
	FirebaseAppProvider,
	AuthProvider,
	FirestoreProvider,
	useFirebaseApp,
} from 'reactfire'

const firebaseConfig = {
	apiKey: "AIzaSyD8Ln65IM_x6AMtpyX9ZXgI_CM5488iOn4",
	authDomain: "desi-mela.firebaseapp.com",
	projectId: "desi-mela",
	storageBucket: "desi-mela.appspot.com",
	messagingSenderId: "528351165069",
	appId: "1:528351165069:web:0d8f9ccc4e8ecf12b5c0c4",
	measurementId: "G-EC1QR7ZXRT"
}

export function FirebaseComponents({
	children,
}: {
	children: React.ReactNode
}) {
	const app = useFirebaseApp()
	const auth = getAuth(app)
	const db = getFirestore(app, 'development')

	if (typeof window !== 'undefined') {
		getAnalytics(app)
		getPerformance(app)
	}

	return (
		<AuthProvider sdk={auth}>
			<FirestoreProvider sdk={db}>{children}</FirestoreProvider>
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
