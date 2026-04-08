import emailjs from 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/+esm';

;(function () {
	const emailConfig = window.EMAILJS_CONFIG || {
		serviceId: 'service_9qwbdgl',
		templateId: 'template_59k5ijj',
		publicKey: '-YPI2UCZPFRdptYsU'
	};

	let initialized = false;

	function isEmailReady() {
		return Boolean(
			emailConfig &&
			emailConfig.serviceId &&
			emailConfig.templateId &&
			emailConfig.publicKey &&
			emailConfig.serviceId !== 'YOUR_EMAILJS_SERVICE_ID' &&
			emailConfig.templateId !== 'YOUR_EMAILJS_TEMPLATE_ID' &&
			emailConfig.publicKey !== 'YOUR_EMAILJS_PUBLIC_KEY'
		);
	}

	function initializeMail() {
		if (!isEmailReady()) {
			return false;
		}

		if (!initialized) {
			emailjs.init({ publicKey: emailConfig.publicKey });
			initialized = true;
		}

		return true;
	}

	async function sendConfirmationEmail(reservationData) {
		if (!initializeMail()) {
			throw new Error('EmailJS n\'est pas configure.');
		}

		const templateParams = {
			to_email: String(reservationData.email || '').trim(),
			email: String(reservationData.email || '').trim(),
			user_email: String(reservationData.email || '').trim(),
			to_name: String(reservationData.fullname || '').trim(),
			name: String(reservationData.fullname || '').trim(),
			reservation_date: String(reservationData.selectedDate || '').trim(),
			reservation_time: String(reservationData.selectedSlot || '').trim(),
			from_name: 'Calysta',
			reply_to: 'calysta.ynov@gmail.com'
		};

		const response = await emailjs.send(
			emailConfig.serviceId,
			emailConfig.templateId,
			templateParams
		);

		return {
			success: true,
			message: 'Email de confirmation envoye',
			data: response
		};
	}

	window.MailService = {
		initializeMail,
		isEmailReady,
		sendConfirmationEmail
	};

	initializeMail();
})();