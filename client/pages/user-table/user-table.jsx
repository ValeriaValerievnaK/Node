import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchRequests } from '../../api';
import styles from './user-table.module.css';

export const UserTable = () => {
	const [requests, setRequests] = useState([]);
	const [userLogin, setUserLogin] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState('');

	const navigate = useNavigate();

	useEffect(() => {
		if (!userLogin) {
			navigate('/login');
		}
	}, [userLogin, navigate]);

	const loadRequests = async () => {
		try {
			setIsLoading(true);
			setError('');
			const data = await fetchRequests();
			setRequests(data.notes || []);
			setUserLogin(data.userLogin);
		} catch (err) {
			setError('Ошибка при загрузке данных с сервера. =(');
			console.error('Ошибка:', err);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		loadRequests();
	}, []);

	const handleRefresh = async () => {
		await loadRequests();
	};

	const formatDate = (dateString) => {
		const date = new Date(dateString);
		return date.toLocaleString('ru-RU', {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
		});
	};

	return (
		<div className={styles.content}>
			<div className={styles.header}>
				<h2>Записи на прием к врачу</h2>
				<button
					onClick={handleRefresh}
					className={styles.update}
					disabled={isLoading}
				>
					Обновить
				</button>
			</div>
			{error && <div className={styles.errorMessage}>{error}</div>}
			{isLoading && <div className={styles.loadingMessage}>Загрузка...</div>}
			{!isLoading && !error && (
				<div className={styles.tableContainer}>
					<table className={styles.table}>
						<thead>
							<tr>
								<th className={styles.th}>Пациент</th>
								<th className={styles.th}>Телефон</th>
								<th className={styles.th}>Описание проблемы</th>
								<th className={styles.th}>Дата и время записи</th>
							</tr>
						</thead>
						<tbody>
							{requests.length > 0 ? (
								requests.map((request) => (
									<tr key={request._id} className={styles.tr}>
										<td className={styles.td}>{request.fullName}</td>
										<td className={styles.td}>{request.phone}</td>
										<td className={styles.td}>
											{request.problemDescription || '—'}
										</td>
										<td className={styles.td}>
											{formatDate(request.createdAt)}
										</td>
									</tr>
								))
							) : (
								<tr>
									<td colSpan="4" className={styles.noData}>
										Нет записей
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>
			)}
		</div>
	);
};
