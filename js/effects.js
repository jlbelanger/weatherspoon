const randomBetween = (min, max) => (
	Math.floor(Math.random() * (max - min + 1) + min)
);

export const effect = (className) => {
	const effects = document.getElementById('effects');
	if (!className) {
		effects.innerText = '';
		return;
	}

	if (effects.classList.contains(`effects--${className}`)) {
		return;
	}

	effects.innerText = '';
	effects.className = `effects--${className}`;

	let num;
	if (className === 'cloudpuff') {
		num = 20;
	} else {
		num = 100;
	}

	for (let i = 0; i < num; i += 1) {
		const drop = document.createElement('div');
		drop.className = `precipitation ${className}`;
		drop.style.animationDelay = `${(Math.random() * 5)}s`;
		let size;
		let duration;

		if (className === 'cloudpuff') {
			drop.style.top = `${randomBetween(0, 100)}vh`;
		} else {
			drop.style.left = `${randomBetween(0, 100)}vw`;
		}

		if (className === 'cloudpuff') {
			drop.style.opacity = Math.min(Math.random(), 0.5);
		} else if (className === 'raindrop') {
			drop.style.opacity = Math.random();
		}

		if (className === 'cloudpuff') {
			size = randomBetween(100, 200);
			drop.style.left = `-${size}px`;
			drop.style.width = `${size}px`;
			drop.style.height = `${size}px`;
		} else if (className === 'raindrop') {
			size = randomBetween(10, 15);
			drop.style.width = `${size}px`;
			drop.style.height = `${size}px`;
		}

		if (className === 'snowflake') {
			duration = randomBetween(5, 10);
		} else if (className === 'raindrop') {
			duration = randomBetween(1, 3);
		} else {
			duration = randomBetween(10, 30);
		}

		if (className === 'snowflake') {
			drop.style.fontSize = `${randomBetween(12, 32)}px`;
		}

		drop.style.animationDuration = `${(duration + Math.random())}s`;

		effects.appendChild(drop);
	}
};
