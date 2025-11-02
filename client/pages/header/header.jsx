import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { fetchRequests, logoutUser } from '../../api';
import styles from './header.module.css';

export const Header = () => {
	const navigate = useNavigate();
	const [userLogin, setUserLogin] = useState(null);
	const [isLoading, setIsLoading] = useState(true);

	const checkAuth = async () => {
		try {
			setIsLoading(true);
			const data = await fetchRequests();

			if (data.userLogin) {
				setUserLogin(data.userLogin);
			} else {
				setUserLogin(null);
			}
		} catch (error) {
			console.error('Ошибка при проверке авторизации:', error);
			setUserLogin(null);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		checkAuth();
	}, [navigate]);

	const handleLogin = () => {
		navigate('/login');
	};

	const handleLogout = async () => {
		try {
			const data = await logoutUser();
			setUserLogin(null);
			navigate(data.redirect);
		} catch (error) {
			console.error('Ошибка при выходе:', error);
		}
	};

	const handleGoHome = () => {
		navigate('/');
	};

	const handleGoToTable = () => {
		navigate('/table');
	};

	return (
		<header className={styles.header}>
			<div className={styles.container}>
				<h1 className={styles.logoText}>Медицинский Центр</h1>
				<nav className={styles.nav}>
					<button className={styles.navButton} onClick={handleGoHome}>
						Запись к врачу
					</button>
					{userLogin && (
						<button className={styles.navButton} onClick={handleGoToTable}>
							Таблица записей
						</button>
					)}
					{!isLoading &&
						(userLogin ? (
							<button
								className={`${styles.navButton} ${styles.logoutButton}`}
								onClick={handleLogout}
							>
								Выйти
							</button>
						) : (
							<button
								className={`${styles.navButton} ${styles.loginButton}`}
								onClick={handleLogin}
							>
								Войти
							</button>
						))}
				</nav>
			</div>
		</header>
	);
};
