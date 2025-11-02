export const addRequects = (fullName, phone, problemDescription) => {
	const response = fetch('http://localhost:3000/requests', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json;charset=utf-8',
		},
		body: JSON.stringify({
			fullName,
			phone,
			problemDescription,
		}),
	}).then((data) => data.json());

	return response;
};
