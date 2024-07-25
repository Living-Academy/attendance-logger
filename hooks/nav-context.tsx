'use client'

import { useContext, createContext, useState } from 'react'

interface NavProps {
	navValue: number
	setNavValue: React.Dispatch<React.SetStateAction<number>>
}

const NavContext = createContext({})

export function NavContextProvider({
	children,
}: {
	children: React.ReactNode
}) {
	const [navValue, setNavValue] = useState<number>(0)

	return (
		<NavContext.Provider value={{ navValue, setNavValue }}>
			{children}
		</NavContext.Provider>
	)
}

export default function useNav() {
	return useContext(NavContext) as NavProps
}
