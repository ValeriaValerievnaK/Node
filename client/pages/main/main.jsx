import { useState } from 'react';
import * as yup from 'yup';
import { addRequects } from '../../api/add-requests';
import styles from './main.module.css';

const formSchema = yup.object().shape({
	fullName: yup
		.string()
		.required('Введите ФИО')
		.min(2, 'ФИО должно содержать минимум 2 символа'),

	phone: yup
		.string()
		.required('Введите номер телефона')
		.matches(
			/^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/,
			'Номер телефона должен быть в формате +7 (999) 999-99-99',
		),

	problemDescription: yup
		.string()
		.max(500, 'Описание проблемы не должно превышать 500 символов'),
});

export const Main = () => {
	const [fullName, setFullName] = useState('');
	const [phone, setPhone] = useState('');
	const [problemDescription, setProblemDescription] = useState('');
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [showSuccessMessage, setShowSuccessMessage] = useState(false);
	const [errors, setErrors] = useState({});

	const handleSubmit = async (e) => {
		e.preventDefault();
		setIsSubmitting(true);

		const formData = {
			fullName,
			phone,
			problemDescription,
		};

		try {
			await formSchema.validate(formData, { abortEarly: false });
			setErrors({});
			setIsSubmitting(true);

			await addRequects(fullName, phone, problemDescription);
			setShowSuccessMessage(true);
			setFullName('');
			setPhone('');
			setProblemDescription('');

			setTimeout(() => {
				setShowSuccessMessage(false);
			}, 4000);
		} catch (error) {
			if (error instanceof yup.ValidationError) {
				const validationErrors = {};
				error.inner.forEach((err) => {
					validationErrors[err.path] = err.message;
				});
				setErrors(validationErrors);
			} else {
				console.error('Ошибка при отправке:', error);
				alert('Произошла ошибка при отправке формы. Попробуйте позднее =(');
			}
		} finally {
			setIsSubmitting(false);
		}
	};

	const handlePhoneChange = (e) => {
		let value = e.target.value.replace(/\D/g, '');

		if (value.length > 0) {
			if (value[0] === '7' || value[0] === '8') {
				value = value.substring(1);
			}

			let formattedValue = '+7 (';

			if (value.length > 0) {
				formattedValue += value.substring(0, 3);
			}
			if (value.length > 3) {
				formattedValue += ') ' + value.substring(3, 6);
			}
			if (value.length > 6) {
				formattedValue += '-' + value.substring(6, 8);
			}
			if (value.length > 8) {
				formattedValue += '-' + value.substring(8, 10);
			}

			setPhone(formattedValue);

			if (errors.phone) {
				setErrors((prev) => ({ ...prev, phone: '' }));
			}
		} else {
			setPhone('');
		}
	};

	const handleFieldChange = (field, value) => {
		switch (field) {
			case 'fullName':
				setFullName(value);
				break;
			case 'problemDescription':
				setProblemDescription(value);
				break;
			default:
				break;
		}

		if (errors[field]) {
			setErrors((prev) => ({ ...prev, [field]: '' }));
		}
	};

	return (
		<div className={styles.content}>
			<h2>Запись к врачу</h2>
			{showSuccessMessage && (
				<div className={styles.successMessage}>Вы записались к специалисту!</div>
			)}
			<form onSubmit={handleSubmit} className={styles.form}>
				<div className={styles.field}>
					<label htmlFor="fullName">ФИО *</label>
					<input
						type="text"
						id="fullName"
						value={fullName}
						onChange={(e) => handleFieldChange('fullName', e.target.value)}
						required
						disabled={isSubmitting}
						className={`${styles.input} ${errors.fullName ? styles.error : ''}`}
					/>
					{errors.fullName && (
						<div className={styles.errorMessage}>{errors.fullName}</div>
					)}
				</div>
				<div className={styles.field}>
					<label htmlFor="phone">Номер телефона *</label>
					<input
						type="tel"
						id="phone"
						value={phone}
						onChange={handlePhoneChange}
						required
						disabled={isSubmitting}
						placeholder="+7 (999) 999-99-99"
						className={`${styles.input} ${errors.phone ? styles.error : ''}`}
					/>
					{errors.phone && (
						<div className={styles.errorMessage}>{errors.phone}</div>
					)}
				</div>
				<div className={styles.field}>
					<label htmlFor="problemDescription">Опишите вашу проблему</label>
					<textarea
						id="problemDescription"
						value={problemDescription}
						onChange={(e) =>
							handleFieldChange('problemDescription', e.target.value)
						}
						disabled={isSubmitting}
						rows={7}
						className={`${styles.textarea} ${errors.problemDescription ? styles.error : ''}`}
					/>
					{errors.problemDescription && (
						<div className={styles.errorMessage}>
							{errors.problemDescription}
						</div>
					)}
				</div>
				<button type="submit" disabled={isSubmitting} className={styles.button}>
					Отправить
				</button>
			</form>
		</div>
	);
};
