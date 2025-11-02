import { Routes, Route } from 'react-router-dom';
import { Main, UserTable, Login, Header } from './pages';
import '../index.css';

export const App = () => {
	return (
		<>
			<Header />
			<Routes>
				<Route path="/" element={<Main />} />
				<Route path="/login" element={<Login />} />
				<Route path="/table" element={<UserTable />} />
			</Routes>
		</>
	);
};
