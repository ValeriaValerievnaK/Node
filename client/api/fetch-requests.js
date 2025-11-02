export const fetchRequests = async () => {
	const response = await fetch('http://localhost:3000/requests', {
		credentials: 'include',
	}).then((data) => data.json());

	return response;
};
