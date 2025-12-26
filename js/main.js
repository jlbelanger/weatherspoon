import 'chartjs-adapter-luxon'; // eslint-disable-line import/no-unresolved
import { aqhiScale, tempScale, uvIndexScale } from './scales';
import { convertTo12Hour, isDark, updateTime } from './time';
import { loadIcons, svgPoint, weatherIcons } from './icons';
import annotationPlugin from 'chartjs-plugin-annotation';
import Chart from 'chart.js/auto';
import { DateTime } from 'luxon';
import { effect } from './effects';

const timeLabel = (value) => (
	DateTime.fromMillis(value)
		.toFormat('ha')
		.toLowerCase()
);

const aqhiColor = (context) => {
	if (!context.chart.chartArea) {
		return 'transparent';
	}
	const { top, bottom } = context.chart.chartArea;
	if (!window.aqhiGradient) {
		window.aqhiGradient = context.chart.ctx.createLinearGradient(0, bottom, 0, top);
		window.aqhiGradient.addColorStop(0, aqhiScale(0));
		window.aqhiGradient.addColorStop(0.3, aqhiScale(3));
		window.aqhiGradient.addColorStop(0.4, aqhiScale(4));
		window.aqhiGradient.addColorStop(0.6, aqhiScale(6));
		window.aqhiGradient.addColorStop(0.7, aqhiScale(7));
		window.aqhiGradient.addColorStop(0.8, aqhiScale(8));
		window.aqhiGradient.addColorStop(0.9, aqhiScale(9));
		window.aqhiGradient.addColorStop(1, aqhiScale(10));
	}
	return window.aqhiGradient;
};

const uvColor = (context) => {
	if (!context.chart.chartArea) {
		return 'transparent';
	}
	const { top, bottom } = context.chart.chartArea;
	if (!window.uvGradient) {
		window.uvGradient = context.chart.ctx.createLinearGradient(0, bottom, 0, top);
		window.uvGradient.addColorStop(0, uvIndexScale(0));
		window.uvGradient.addColorStop(0.2, uvIndexScale(2));
		window.uvGradient.addColorStop(0.3, uvIndexScale(3));
		window.uvGradient.addColorStop(0.5, uvIndexScale(5));
		window.uvGradient.addColorStop(0.6, uvIndexScale(6));
		window.uvGradient.addColorStop(0.7, uvIndexScale(7));
		window.uvGradient.addColorStop(0.9, uvIndexScale(9));
		window.uvGradient.addColorStop(1, uvIndexScale(10));
	}
	return window.uvGradient;
};

const bodyClass = (weather) => {
	if (!weather) {
		return '';
	}
	if (weather.includes('storm')) {
		return 'storm';
	}
	if (weather.includes('shower') || weather.includes('rain')) {
		return 'rain';
	}
	if (weather.includes('snow')) {
		return 'snow';
	}
	if (weather.includes('cloud')) {
		return 'cloudy';
	}
	return 'clear';
};

const isDarkX = (x, sunriseX, sunsetX, sunrise2X) => (
	(x < sunriseX) || (sunsetX < x && x < sunrise2X)
);

const updateWeather = () => {
	fetch(`/api.php?timezone=${Intl.DateTimeFormat().resolvedOptions().timeZone}`)
		.then((response) => (response.json()))
		.then((response) => {
			const now = new Date();
			const currentTimestamp = DateTime.local().toISO({ precision: 'seconds' });
			const currentHour24 = now.getHours();
			const currentHour12 = convertTo12Hour(currentHour24);
			const currentForecast = response.forecast.find((f) => (f.hour === currentHour12));

			const timeOfDay = isDark(currentTimestamp, response) ? 'night' : 'day';
			const currentWeather = bodyClass(currentForecast ? currentForecast.weather : null);
			document.body.className = `body--${timeOfDay} body--${currentWeather}`;
			if (!document.body.classList.contains('body--animate')) {
				setTimeout(() => {
					document.body.classList.add('body--animate');
				});
			}
			if (currentWeather === 'rain' || currentWeather === 'storm') {
				effect('raindrop');
			} else if (currentWeather === 'snow') {
				effect('snowflake');
			} else if (currentWeather === 'cloudy') {
				effect('cloudpuff');
			} else {
				effect('');
			}

			// Show current AQHI.
			const elAqhi = document.getElementById('aqhi-data');
			const elAqhiContainer = document.getElementById('aqhi-container');
			const currentAqhiColor = aqhiScale(currentForecast ? currentForecast.aqhi : null);
			elAqhi.textContent = currentForecast ? currentForecast.aqhi : '?';
			elAqhi.className = `label ${aqhiScale(currentForecast ? currentForecast.aqhi : null)}`;
			if (currentAqhiColor !== 'green') {
				elAqhiContainer.className = '';
			} else {
				elAqhiContainer.className = 'hide';
			}

			// Show current UV.
			const elUv = document.getElementById('uv-data');
			const elUvContainer = document.getElementById('uv-container');
			const currentUvColor = uvIndexScale(currentForecast ? currentForecast.uv : null);
			elUv.textContent = currentForecast ? currentForecast.uv : '?';
			elUv.className = `label ${currentUvColor}`;
			if (currentUvColor !== 'green') {
				elUvContainer.className = '';
			} else {
				elUvContainer.className = 'hide';
			}

			// Show current temperature.
			const elTemperature = document.getElementById('temperature-data');
			elTemperature.textContent = `${currentForecast ? currentForecast.temperature : '?'}°`;

			// Show current weather.
			const elWeather = document.getElementById('weather-data');
			elWeather.innerText = '';
			const icons = weatherIcons(currentForecast ? currentForecast.weather : null, isDark(currentTimestamp, response));
			icons.forEach((icon) => {
				if (window.svgs[icon]) {
					elWeather.appendChild(window.svgs[icon].rootElement.cloneNode(true));
				}
			});

			// Show alerts.
			const alerts = document.getElementById('alerts');
			alerts.innerText = '';
			response.alerts.forEach((alert) => {
				const isActive = (alert.start <= currentTimestamp) && (currentTimestamp <= alert.end);

				if (isActive) {
					const alertContainer = document.createElement('div');
					alertContainer.className = `alert alert--${alert.type}`;

					const alertTitle = document.createElement('span');
					alertTitle.className = 'alert_title';
					alertTitle.textContent = alert.title;
					alertContainer.appendChild(alertTitle);

					const alertTime = document.createElement('span');
					alertTime.textContent = alert.time;
					alertContainer.appendChild(alertTime);

					alerts.appendChild(alertContainer);
				}
			});

			// Show 7-day forecast.
			const week = document.getElementById('week');
			week.innerText = '';
			response.days.forEach((day) => {
				const weekdayContainer = document.createElement('div');
				weekdayContainer.className = 'day';

				const weekdayDay = document.createElement('div');
				weekdayDay.className = `day_day${day.alert ? ' label day_day--alert' : ''}`;
				weekdayDay.textContent = day.weekday;
				weekdayContainer.appendChild(weekdayDay);

				const weekdayWeather = document.createElement('div');
				weekdayWeather.className = 'day_weather';
				weatherIcons(day.weather).forEach((icon) => {
					if (window.svgs[icon]) {
						weekdayWeather.appendChild(window.svgs[icon].rootElement.cloneNode(true));
					}
				});
				weekdayContainer.appendChild(weekdayWeather);

				const weekdayTemp = document.createElement('div');
				weekdayTemp.className = `day_temperature label ${tempScale(day.temperature)}`;
				weekdayTemp.textContent = `${day.temperature}°`;
				weekdayContainer.appendChild(weekdayTemp);

				week.appendChild(weekdayContainer);
			});

			const labels = response.forecast.map((h) => (h.datetime));
			const temperatureData = response.forecast.map((h) => (h.temperature));
			const aqhiData = response.forecast.map((h) => (h.aqhi));
			const uvData = response.forecast.map((h) => (h.uv));
			const precipitationData = response.forecast.map((h) => (h.precipitation >= 30 ? h.precipitation / 10 : 0));

			const temperatureColor = (context) => {
				if (!context.chart.chartArea) {
					return 'transparent';
				}
				const { right, left } = context.chart.chartArea;
				const temperatureGradient = context.chart.ctx.createLinearGradient(left, 0, right, 0);
				temperatureData.forEach((t, i) => {
					const xPixel = context.chart.scales.x.getPixelForValue(new Date(labels[i]));
					const stop = (xPixel - left) / (right - left);
					temperatureGradient.addColorStop(Math.min(Math.max(stop, 0), 1), tempScale(t));
				});
				return temperatureGradient;
			};

			const beforeDraw = (chart) => {
				const { ctx, chartArea, scales } = chart;
				if (!chartArea) {
					return;
				}

				const { top, bottom, left, right } = chartArea;
				const width = right - left;
				const gradient = ctx.createLinearGradient(left, 0, right, 0);

				const sunriseX = new Date(response.sunrise).getTime();
				const sunsetX = new Date(response.sunset).getTime();
				const sunrise2X = new Date(response.sunrise2).getTime();

				let nightColor = '#191e4d88';
				let dayColor = 'transparent';
				if (timeOfDay === 'night') {
					nightColor = 'transparent';
					dayColor = '#babdde33';
				}

				const offset = 0.075;

				gradient.addColorStop(0, isDarkX(scales.x.min, sunriseX, sunsetX) ? nightColor : dayColor);

				if (sunriseX > scales.x.min && sunriseX < scales.x.max) {
					const sunriseStop = (scales.x.getPixelForValue(sunriseX) - left) / width;
					gradient.addColorStop(sunriseStop, nightColor);
					if ((sunriseStop + offset) < 1) {
						gradient.addColorStop(sunriseStop + offset, dayColor);
					}
				}

				if (sunsetX > scales.x.min && sunsetX < scales.x.max) {
					const sunsetStop = (scales.x.getPixelForValue(sunsetX) - left) / width;
					gradient.addColorStop(sunsetStop, dayColor);
					if ((sunsetStop + offset) < 1) {
						gradient.addColorStop(sunsetStop + offset, nightColor);
					}
				}

				if (sunrise2X > scales.x.min && sunrise2X < scales.x.max) {
					const sunrise2Stop = (scales.x.getPixelForValue(sunrise2X) - left) / width;
					gradient.addColorStop(sunrise2Stop, nightColor);
					if ((sunrise2Stop + offset) < 1) {
						gradient.addColorStop(sunrise2Stop + offset, dayColor);
					}
				}

				gradient.addColorStop(1, isDarkX(scales.x.max, sunriseX, sunsetX, sunrise2X) ? nightColor : dayColor);

				ctx.save();
				ctx.fillStyle = gradient;
				ctx.clearRect(left, top, right - left, bottom - top);
				ctx.fillRect(left, top, right - left, bottom - top);
				ctx.restore();
			};

			const sunBackgroundPlugin = {
				id: 'sunBackgroundGradient',
				beforeDraw,
			};

			Chart.defaults.animation = false;
			Chart.defaults.font.family = 'Fredoka';
			Chart.defaults.font.size = 14;

			let textColor = '#000';
			let gridColor = '#00000022';
			if (timeOfDay === 'night') {
				textColor = '#fff';
				gridColor = '#ffffff11';
			}

			const datasets = [
				{
					label: 'Temperature',
					data: temperatureData,
					backgroundColor: temperatureColor,
					borderColor: temperatureColor,
					pointStyle: 'circle',
					yAxisID: 'y-temperature',
					pointRadius: 6,
					pointHoverRadius: 10,
					pointBackgroundColor: temperatureData.map(tempScale),
				},
				{
					label: 'Air Quality',
					data: aqhiData,
					backgroundColor: aqhiColor,
					borderColor: aqhiColor,
					pointStyle: svgPoint,
					yAxisID: 'y-aq',
					borderDash: [8, 8],
					borderWidth: 1,
					pointRadius: 6,
					pointHoverRadius: 10,
				},
				{
					label: 'UV Index',
					data: uvData,
					backgroundColor: uvColor,
					borderColor: uvColor,
					pointStyle: svgPoint,
					yAxisID: 'y-aq',
					borderDash: [2, 2],
					borderWidth: 2,
					pointRadius: 6,
					pointHoverRadius: 10,
				},
				{
					type: 'bar',
					label: 'Precipitation',
					data: precipitationData,
					pointStyle: svgPoint,
					barThickness: 4,
					backgroundColor: 'dodgerblue',
					yAxisID: 'y-aq',
				},
			];

			if (window.chart) {
				window.chart.plugins = [sunBackgroundPlugin];
				window.chart.data = { labels, datasets };
				window.chart.options.plugins.annotation.annotations.nowLine.value = currentTimestamp;
				window.chart.options.plugins.annotation.annotations.nowLine.borderColor = textColor;
				window.chart.options.scales['y-aq'].title.color = textColor;
				window.chart.options.scales['y-aq'].ticks.color = textColor;
				window.chart.options.scales['y-temperature'].title.color = textColor;
				window.chart.options.scales['y-temperature'].ticks.color = textColor;
				window.chart.options.scales.x.ticks.color = textColor;
				window.chart.options.scales.x.min = labels[0];
				window.chart.options.scales.x.grid.color = gridColor;
				window.chart.update();
				return;
			}

			Chart.register(annotationPlugin);
			Chart.register(sunBackgroundPlugin);

			const minY = Math.min(...temperatureData);
			const maxY = Math.max(...temperatureData);

			const options = {
				type: 'line',
				plugins: [sunBackgroundPlugin],
				data: {
					labels,
					datasets,
				},
				options: {
					maintainAspectRatio: false,
					responsive: true,
					plugins: {
						annotation: {
							annotations: {
								nowLine: {
									type: 'line',
									scaleID: 'x',
									value: currentTimestamp,
									borderColor: textColor,
									borderWidth: 1,
									label: {
										display: false,
										content: 'Now',
										position: 'start',
									},
								},
							},
						},
						legend: {
							display: false,
						},
						tooltip: {
							callbacks: {
								title: (tooltipItems) => (timeLabel(tooltipItems[0].parsed.x)),
								label: (tooltipItem) => {
									if (tooltipItem.dataset.label === 'Temperature') {
										return `${tooltipItem.dataset.label}: ${tooltipItem.formattedValue}° C`;
									}
									if (tooltipItem.dataset.label === 'Precipitation') {
										return `${tooltipItem.dataset.label}: ${tooltipItem.formattedValue * 10}%`;
									}
									return `${tooltipItem.dataset.label}: ${tooltipItem.formattedValue}`;
								},
							},
						},
					},
					scales: {
						x: {
							type: 'time',
							min: labels[0],
							grid: {
								color: gridColor,
							},
							ticks: {
								callback: (value) => (timeLabel(value)),
								color: textColor,
								stepSize: 3,
								maxRotation: 0,
								minRotation: 0,
							},
							time: {
								unit: 'hour',
								tooltipFormat: 'ha',
								displayFormats: {
									hour: 'ha',
								},
							},
							title: {
								display: false,
							},
						},
						'y-temperature': {
							type: 'linear',
							position: 'left',
							min: minY,
							max: maxY,
							grid: {
								drawOnChartArea: false,
							},
							ticks: {
								color: textColor,
								callback: (value) => (`${value}°`),
								precision: 0,
								stepSize: 1,
							},
							title: {
								color: textColor,
								display: false,
								text: 'Temperature',
							},
						},
						'y-aq': {
							type: 'linear',
							position: 'right',
							min: 0,
							max: 10,
							grid: {
								drawOnChartArea: false,
							},
							ticks: {
								color: textColor,
								precision: 0,
								stepSize: 1,
							},
							title: {
								color: textColor,
								display: false,
								text: 'AQHI / UV / Precipitation',
							},
						},
					},
				},
			};

			window.chart = new Chart(document.getElementById('graph').getContext('2d'), options);
		});
};

const init = async () => {
	window.locale = 'en-CA';

	updateTime();
	setInterval(updateTime, 15000);

	await loadIcons();

	updateWeather();
	setInterval(updateWeather, 60000 * 30);
};

init();
