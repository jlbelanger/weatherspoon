<?php require_once '../includes/header.php'; ?>

<noscript>This site requires Javascript to be enabled.</noscript>

<article>
	<header id="header">
		<div id="date">
			<div id="weekday"></div>
			<div id="day"></div>
		</div>
		<div id="time"></div>
		<div id="alerts"></div>
		<div class="flex-rows">
			<div id="temperature-data"></div>
			<div class="flex-columns">
				<div class="flex-rows hide" id="aqhi-container">
					<span>AQ</span>
					<span class="label" id="aqhi-data"></span>
				</div>
				<div class="flex-rows hide" id="uv-container">
					<span>UV</span>
					<span class="label" id="uv-data"></span>
				</div>
			</div>
		</div>
		<div id="weather-data"></div>
	</header>

	<canvas id="graph"></canvas>

	<div id="legend"></div>

	<div id="week"></div>
</article>

<footer id="footer">
	<p>Source: <a href="https://api.weather.gc.ca/">ECCC</a></p>
	<p><a href="https://github.com/jlbelanger/weatherspoon/">GitHub</a></p>
</footer>

<?php require_once '../includes/footer.php';
