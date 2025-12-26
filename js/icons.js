import { aqhiScale, uvIndexScale } from './scales.js';

const loadIcon = (filename, label = '') => {
	fetch(`/assets/img/${filename}`)
		.then((response) => (response.text()))
		.then((svgText) => {
			const parser = new DOMParser();
			const svgDoc = parser.parseFromString(svgText, 'image/svg+xml');
			const pathElement = svgDoc.querySelector('path');
			const svgPath = pathElement.getAttribute('d');
			const canvas = document.createElement('canvas');
			canvas.className = 'hide';
			document.body.appendChild(canvas);
			if (label) {
				window.svgs[label] = new Path2D(svgPath);
			}
			window.svgs[filename] = svgDoc;
		});
};

export const loadIcons = async () => {
	window.svgs = {};
	await loadIcon('sun.svg', 'UV Index');
	await loadIcon('cloud.svg', 'Air Quality');
	await loadIcon('rain.svg', 'Precipitation');
	await loadIcon('haze.svg');
	await loadIcon('thunder.svg');
	await loadIcon('snow.svg');
	await loadIcon('moon.svg');
	await loadIcon('unknown.svg');
};

export const svgPoint = (context, options) => {
	const canvas = document.createElement('canvas');
	const scale = 2;
	canvas.height = 10 * scale;
	canvas.width = 10 * scale;

	const ctx = canvas.getContext('2d');
	if (options.label === 'Air Quality') {
		ctx.fillStyle = aqhiScale(context.raw);
		ctx.strokeStyle = aqhiScale(context.raw);
	} else if (options.label === 'UV Index') {
		ctx.fillStyle = uvIndexScale(context.raw);
		ctx.strokeStyle = uvIndexScale(context.raw);
	} else {
		ctx.fillStyle = options.backgroundColor;
		ctx.strokeStyle = options.borderColor;
	}
	ctx.scale(scale, scale);
	ctx.fill(window.svgs[options.label]);
	ctx.stroke();

	return canvas;
};

export const weatherIcons = (val, isDark = false) => {
	const sunMoon = isDark ? 'moon.svg' : 'sun.svg';
	if (!val) {
		return ['unknown.svg'];
	}
	if (val === 'sunny' || val.includes('clear')) {
		return [sunMoon];
	}
	if (val === 'cloudy' || val === 'mist') {
		return ['cloud.svg'];
	}
	if (val === 'mainly sunny') {
		return [sunMoon, 'cloud.svg'];
	}
	if (val.includes('cloud')) {
		return ['cloud.svg', sunMoon];
	}
	if (val.includes('storm')) {
		return ['thunder.svg', 'cloud.svg'];
	}
	if (val.includes('shower') || val.includes('rain')) {
		return ['rain.svg'];
	}
	if (val.includes('snow')) {
		return ['snow.svg'];
	}
	if (val.includes('haze') || val.includes('smoke')) {
		return ['haze.svg'];
	}
	return ['unknown.svg'];
};
