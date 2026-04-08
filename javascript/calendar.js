// Calendrier interactif de reservation
document.addEventListener('DOMContentLoaded', function() {
	const daysContainer = document.getElementById('calendarDays');
	const monthLabel = document.getElementById('calendarMonthLabel');
	const prevButton = document.getElementById('calendarPrev');
	const nextButton = document.getElementById('calendarNext');
	const slotsContainer = document.getElementById('timeSlots');
	const form = document.getElementById('reservationForm');
	const selectedDateInput = document.getElementById('selectedDate');
	const selectedSlotInput = document.getElementById('selectedSlot');
	const summary = document.getElementById('bookingSummary');

	if (!daysContainer || !monthLabel || !prevButton || !nextButton || !slotsContainer || !form) {
		return;
	}

	const months = [
		'Janvier', 'Fevrier', 'Mars', 'Avril', 'Mai', 'Juin',
		'Juillet', 'Aout', 'Septembre', 'Octobre', 'Novembre', 'Decembre'
	];

	const slotList = ['10:10', '10:50', '11:30', '12:10', '12:50', '13:30', '14:10','14:50', '15:30', '16:10', '16:50'];
	const today = new Date();
	today.setHours(0, 0, 0, 0);

	let currentYear = today.getFullYear();
	let currentMonth = today.getMonth();
	let selectedDate = null;
	let selectedSlot = null;

	function pad(value) {
		return String(value).padStart(2, '0');
	}

	function formatIsoDate(date) {
		return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
	}

	function formatDisplayDate(date) {
		return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()}`;
	}

	function renderSlots() {
		slotsContainer.innerHTML = '';

		slotList.forEach(slot => {
			const slotButton = document.createElement('button');
			slotButton.type = 'button';
			slotButton.className = 'time-slot';
			slotButton.textContent = slot;
			slotButton.setAttribute('role', 'option');
			slotButton.setAttribute('aria-selected', selectedSlot === slot ? 'true' : 'false');

			if (selectedSlot === slot) {
				slotButton.classList.add('selected');
			}

			slotButton.addEventListener('click', () => {
				selectedSlot = slot;
				selectedSlotInput.value = selectedSlot;
				renderSlots();
				updateSummary();
			});

			slotsContainer.appendChild(slotButton);
		});
	}

	function updateSummary() {
		if (!summary) return;

		if (!selectedDate) {
			summary.textContent = 'Aucune date selectionnée.';
			return;
		}

		if (!selectedSlot) {
			summary.textContent = `Date choisie : ${formatDisplayDate(selectedDate)}. Selectionnez un creneau.`;
			return;
		}

		summary.textContent = `Reservation en cours : ${formatDisplayDate(selectedDate)} a ${selectedSlot}.`;
	}

	function renderCalendar() {
		daysContainer.innerHTML = '';
		monthLabel.textContent = `${months[currentMonth]} ${currentYear}`;

		const firstDay = new Date(currentYear, currentMonth, 1);
		const startIndex = (firstDay.getDay() + 6) % 7;
		const totalDays = new Date(currentYear, currentMonth + 1, 0).getDate();

		for (let i = 0; i < startIndex; i += 1) {
			const empty = document.createElement('span');
			empty.className = 'day empty';
			daysContainer.appendChild(empty);
		}

		for (let dayNumber = 1; dayNumber <= totalDays; dayNumber += 1) {
			const dayDate = new Date(currentYear, currentMonth, dayNumber);
			dayDate.setHours(0, 0, 0, 0);

			const dayButton = document.createElement('button');
			dayButton.type = 'button';
			dayButton.className = 'day';
			dayButton.textContent = dayNumber;

			const isPast = dayDate < today;
			if (isPast) {
				dayButton.classList.add('disabled');
				dayButton.disabled = true;
			}

			if (selectedDate && dayDate.getTime() === selectedDate.getTime()) {
				dayButton.classList.add('selected');
			}

			dayButton.addEventListener('click', () => {
				selectedDate = dayDate;
				selectedDateInput.value = formatIsoDate(dayDate);
				renderCalendar();
				updateSummary();
			});

			daysContainer.appendChild(dayButton);
		}
	}

	prevButton.addEventListener('click', () => {
		currentMonth -= 1;
		if (currentMonth < 0) {
			currentMonth = 11;
			currentYear -= 1;
		}
		renderCalendar();
	});

	nextButton.addEventListener('click', () => {
		currentMonth += 1;
		if (currentMonth > 11) {
			currentMonth = 0;
			currentYear += 1;
		}
		renderCalendar();
	});

	form.addEventListener('submit', event => {
		event.preventDefault();

		if (!selectedDate || !selectedSlot) {
			if (summary) {
				summary.textContent = 'Selectionnez une date et un creneau pour continuer.';
			}
			return;
		}

		const fullname = document.getElementById('fullname');
		const email = document.getElementById('email');
		const nameValue = fullname ? fullname.value.trim() : '';
		const emailValue = email ? email.value.trim() : '';

		if (!nameValue || !emailValue) {
			if (summary) {
				summary.textContent = 'Veuillez remplir tous les champs.';
			}
			return;
		}

		// Désactiver le bouton de soumission
		const submitBtn = form.querySelector('button[type="submit"]');
		const originalText = submitBtn ? submitBtn.textContent : 'Confirmer';
		if (submitBtn) {
			submitBtn.disabled = true;
			submitBtn.textContent = 'Envoi en cours...';
		}

		// Préparer les données
		const reservationData = {
			fullname: nameValue,
			email: emailValue,
			selectedDate: selectedDateInput.value,
			selectedSlot: selectedSlotInput.value
		};

		if (!window.ReservationDB || !window.ReservationDB.sendReservationData) {
			if (summary) {
				summary.textContent = 'La transmission des données est indisponible.';
				summary.style.color = '#ff6b6b';
			}
			if (submitBtn) {
				submitBtn.disabled = false;
				submitBtn.textContent = originalText;
			}
			return;
		}

		window.ReservationDB.sendReservationData(reservationData)
		.then(data => {
			if (data.success) {
				summary.textContent = `✓ Merci ${nameValue} ! Votre reservation pour le ${formatDisplayDate(selectedDate)} a ${selectedSlot} a ete confirmee. Un email de confirmation a ete envoye a ${emailValue}.`;
				summary.style.color = '#E3CB93';

				// Réinitialiser le formulaire
				form.reset();
				selectedDate = null;
				selectedSlot = null;
				selectedDateInput.value = '';
				selectedSlotInput.value = '';
				renderCalendar();
				renderSlots();
			} else {
				summary.textContent = `✗ Erreur: ${data.message}`;
				summary.style.color = '#ff6b6b';
			}
		})
		.catch(error => {
			console.error('Erreur:', error);
			summary.textContent = `✗ Erreur de connexion au serveur: ${error.message}`;
			summary.style.color = '#ff6b6b';
		})
		.finally(() => {
			// Réactiver le bouton
			if (submitBtn) {
				submitBtn.disabled = false;
				submitBtn.textContent = originalText;
			}
		});
	});

	renderCalendar();
	renderSlots();
	updateSummary();
});
