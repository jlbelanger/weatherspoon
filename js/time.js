export const convertTo12Hour = (hour) => {
	const period = hour >= 12 ? 'PM' : 'AM';
	const twelveHour = ((hour + 11) % 12) + 1;
	return `${twelveHour} ${period}`;
};

export const updateTime = () => {
	const now = new Date();
	document.getElementById('weekday').textContent = now.toLocaleDateString(window.locale, { weekday: 'short' });
	document.getElementById('day').textContent = now.toLocaleDateString(window.locale, { day: 'numeric' });
	document.getElementById('time').textContent = now
		.toLocaleString(window.locale, { hour: 'numeric', minute: '2-digit', hour12: true })
		.replace(/[^0-9:]+/g, '');
};

export const isDark = (hour, response) => hour < response.sunrise || hour > response.sunset;
