export function encodeEmailKey(email: string) {
	return encodeURIComponent(email.toLowerCase()).replace(/\./g, '%2E')
}

export function isEmailValid(email: string) {
	return email.match(
		/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
	)
}

export function isPasswordValid(password: string) {
	return password.length >= 8
}
