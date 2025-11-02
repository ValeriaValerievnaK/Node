import { useCallback, useEffect, useState } from 'react';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import styles from './login.module.css';
import { fetchRequests, loginUser } from '../../api';

const loginSchema = yup.object().shape({
	email: yup
		.string()
		.required('Email является обязательным полем')
		.email('Введите корректный email адрес'),
	password: yup
		.string()
		.required('Пароль является обязательным полем')
		.min(6, 'Пароль должен содержать минимум 6 символов'),
});

export const Login = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [errors, setErrors] = useState({});
	const [serverError, setServerError] = useState('');
	const navigate = useNavigate();

	const checkAuth = useCallback(async () => {
		try {
			const data = await fetchRequests();

			if (data.userLogin) {
				navigate('/table');
			}
		} catch (error) {
			console.error('Ошибка при проверке авторизации:', error);
		}
	}, [navigate]);

	useEffect(() => {
		checkAuth();
	}, [checkAuth]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setServerError('');
		
		const formData = {
			email,
			password,
		};

		try {
			await loginSchema.validate(formData, { abortEarly: false });
			setErrors({});
			setIsSubmitting(true);
			const response = await loginUser(email, password);

			navigate(response.redirect);
		} catch (error) {
			if (error instanceof yup.ValidationError) {
				const validationErrors = {};
				error.inner.forEach((err) => {
					validationErrors[err.path] = err.message;
				});
				setErrors(validationErrors);
			} else {
				setServerError(error.message || 'Произошла ошибка при входе');
			}
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleFieldChange = (field, value) => {
		switch (field) {
			case 'email':
				setEmail(value);
				break;
			case 'password':
				setPassword(value);
				break;
			default:
				break;
		}

		if (errors[field]) {
			setErrors((prev) => ({ ...prev, [field]: '' }));
		}
		if (serverError) {
			setServerError('');
		}
	};

	return (
		<div className={styles.loginContainer}>
			<div className={styles.loginForm}>
				<h2 className={styles.title}>Вход систему</h2>
				<p className={styles.subtitle}>Доступ только для сотрудников клиники</p>
				{serverError && <div className={styles.serverError}>{serverError}</div>}
				<form onSubmit={handleSubmit} className={styles.form}>
					<div className={styles.field}>
						<label htmlFor="email" className={styles.label}>
							Email *
						</label>
						<input
							type="email"
							id="email"
							value={email}
							onChange={(e) => handleFieldChange('email', e.target.value)}
							disabled={isSubmitting}
							className={`${styles.input} ${errors.email ? styles.error : ''}`}
							placeholder="Введите ваш email"
						/>
						{errors.email && (
							<div className={styles.errorMessage}>{errors.email}</div>
						)}
					</div>
					<div className={styles.field}>
						<label htmlFor="password" className={styles.label}>
							Пароль *
						</label>
						<input
							type="password"
							id="password"
							value={password}
							onChange={(e) =>
								handleFieldChange('password', e.target.value)
							}
							disabled={isSubmitting}
							className={`${styles.input} ${errors.password ? styles.error : ''}`}
							placeholder="Введите ваш пароль"
						/>
						{errors.password && (
							<div className={styles.errorMessage}>{errors.password}</div>
						)}
					</div>
					<button
						type="submit"
						disabled={isSubmitting}
						className={styles.button}
					>
						{isSubmitting ? 'Вход...' : 'Войти'}
					</button>
				</form>
			</div>
		</div>
	);
};
