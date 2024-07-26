'use client'

import { useRouter } from 'next/navigation'
import { useSigninCheck } from 'reactfire'

import { Loader } from '@/components/loader'

export default function Page() {
	const router = useRouter()
	const { status: signInCheckStatus, data: signInCheckResult } =
		useSigninCheck()

	if (signInCheckStatus !== 'success') {
		return <Loader />
	}

	const { signedIn, user } = signInCheckResult

	if (!signedIn || !user) router.push('/login')
	else return <div>hello</div>
}
