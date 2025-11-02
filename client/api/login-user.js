export const loginUser = async (email, password) => {
	const response = await fetch('http://localhost:3000/login', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		credentials: 'include',
		body: JSON.stringify({
			login: email,
			password,
		}),
	}).then((data) => data.json());

	return response;
};
