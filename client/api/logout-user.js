export const logoutUser = async () => {
	const response = await fetch('http://localhost:3000/logout', {
		credentials: 'include',
	}).then((data) => data.json());

	return response;
};
