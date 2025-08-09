export const aqhiScale = (val) => {
	if (val <= 3) {
		return 'green';
	}
	if (val <= 6) {
		return 'gold';
	}
	if (val <= 8) {
		return 'orange';
	}
	if (val <= 10) {
		return 'crimson';
	}
	return 'darkred';
};

export const tempScale = (val) => {
	if (val <= 5) {
		return 'midnightblue';
	}
	if (val <= 10) {
		return 'mediumblue';
	}
	if (val <= 15) {
		return 'dodgerblue';
	}
	if (val <= 20) {
		return 'mediumturquoise';
	}
	if (val <= 25) {
		return 'green';
	}
	if (val <= 28) {
		return 'gold';
	}
	if (val <= 30) {
		return 'orange';
	}
	return 'crimson';
};

export const uvIndexScale = (val) => {
	if (val <= 2) {
		return 'green';
	}
	if (val <= 5) {
		return 'gold';
	}
	if (val <= 7) {
		return 'orange';
	}
	if (val <= 10) {
		return 'crimson';
	}
	return 'darkred';
};
