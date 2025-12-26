<?php // phpcs:ignore PSR1.Files.SideEffects.FoundWithSymbols

ini_set('display_errors', 'Off');

require_once realpath(__DIR__ . '/../vendor/autoload.php');
require_once realpath(__DIR__ . '/../includes/functions.php');

$dotenv = Dotenv\Dotenv::createImmutable(realpath(__DIR__ . '/../'));
$dotenv->load();

$timezone = $_GET['timezone'];
if (!$timezone) {
	header('Content-Type: application/json');
	http_response_code(400);
	die(json_encode(['error' => 'Invalid timezone.']));
}

$now = new DateTime('now', new DateTimeZone($timezone));
$todayYMD = $now->format('Y-m-d');

$tomorrow = new DateTime('tomorrow', new DateTimeZone($timezone));
$tomorrowYMD = $tomorrow->format('Y-m-d');

$now = time();
$thresholdPast = 6 * 60 * 60; // 6 hours in seconds.
$thresholdFuture = 48 * 60 * 60; // 24 hours in seconds.

$output = [
	'forecast' => [],
	'days' => [],
	'alerts' => [],
];

$json = request('https://weather.gc.ca/api/app/v3/en/Location/' . $_ENV['COORDINATES'] . '?type=city');

$sunrise = $todayYMD . 'T' . str_pad($json[0]->riseSet->rise->time, 5, '0', STR_PAD_LEFT) . ':00.000';
$sunrise = new DateTime($sunrise, new DateTimeZone($timezone));

$sunset = $todayYMD . 'T' . str_pad($json[0]->riseSet->set->time, 5, '0', STR_PAD_LEFT) . ':00.000';
$sunset = new DateTime($sunset, new DateTimeZone($timezone));

$sunrise2 = $tomorrowYMD . 'T' . str_pad($json[0]->riseSetNextDay->rise->time, 5, '0', STR_PAD_LEFT) . ':00.000';
$sunrise2 = new DateTime($sunrise2, new DateTimeZone($timezone));

$output['sunrise'] = $sunrise->format('c');
$output['sunset'] = $sunset->format('c');
$output['sunrise2'] = $sunrise2->format('c');

foreach ($json[0]->hourlyFcst->hourly as $forecast) {
	$key = date('c', $forecast->epochTime);
	$date = new DateTime($key, new DateTimeZone('UTC'));
	$date->setTimezone(new DateTimeZone($timezone));
	if (($forecast->epochTime - $now) > $thresholdFuture) {
		continue;
	}
	$output['forecast'][$key] = [
		'datetime' => $date->format('c'),
		'hour' => $date->format('g A'),
		'temperature' => (int) $forecast->temperature->metric,
		'precipitation' => (int) $forecast->precip,
		'uv' => !empty($forecast->uv) ? (int) $forecast->uv->index : 0,
		'aqhi' => null,
		'weather' => strtolower($forecast->condition),
	];
}

foreach ($json[0]->pastHourly->hours as $forecast) {
	$epochTime = strtotime($forecast->timeStamp);
	$key = date('c', $epochTime);
	$date = new DateTime($key, new DateTimeZone('UTC'));
	$date->setTimezone(new DateTimeZone($timezone));
	if (($now - $epochTime) > $thresholdPast) {
		continue;
	}
	$output['forecast'][$key] = [
		'datetime' => $date->format('c'),
		'hour' => $date->format('g A'),
		'temperature' => (int) $forecast->temperature,
		'precipitation' => null,
		'uv' => null,
		'aqhi' => null,
		'weather' => strtolower($forecast->condition),
	];
}

foreach ($json[0]->dailyFcst->daily as $forecast) {
	if ($forecast->periodLabel === 'Night' || $forecast->periodLabel === 'Tonight') {
		continue;
	}
	$date = DateTime::createFromFormat('D, d M', $forecast->date);
	$date->setDate(date('Y'), $date->format('m'), $date->format('d'));
	$key = $date->format('Y-m-d');
	$output['days'][$key] = [
		'datetime' => $key,
		'weekday' => explode(',', $forecast->date)[0],
		'temperature' => !empty($forecast->temperature) ? (int) $forecast->temperature->metric : null,
		'precipitation' => (int) $forecast->precip,
		'uv' => null,
		'aqhi' => null,
		'humidex' => !empty($forecast->humidex->calculated) ? (int) $forecast->humidex->calculated[0]->value : null,
		'weather' => strtolower($forecast->summary),
		'alert' => false,
	];
}

if (!empty($json[0]->alert->alerts)) {
	foreach ($json[0]->alert->alerts as $alert) {
		$startDate = new DateTime($alert->eventOnsetTime, new DateTimeZone('UTC'));
		$startDate->setTimezone(new DateTimeZone($timezone));
		$startKey = $startDate->format('Y-m-d');

		$endDate = new DateTime($alert->eventEndTime, new DateTimeZone('UTC'));
		$endDate->setTimezone(new DateTimeZone($timezone));
		$endKey = $endDate->format('Y-m-d');
		$endDateFormat = $todayYMD === $endKey ? 'g A' : 'D g A';

		foreach ($output['days'] as $dayKey => $dayData) {
			if ($dayKey >= $startKey && $dayKey <= $endKey) {
				$output['days'][$dayKey]['alert'] = true;
			}
		}

		$output['alerts'][] = [
			'type' => $alert->type,
			'start' => $startDate->format('c'),
			'end' => $endDate->format('c'),
			'title' => str_replace('Special ', '', $alert->alertBannerText),
			'time' => 'until ' . $endDate->format($endDateFormat),
		];
	}
}

$url = 'https://api.weather.gc.ca/collections/aqhi-forecasts-realtime/items';
$url .= '?limit=96';
$url .= '&offset=0';
$url .= '&location_name_en=' . urlencode($_ENV['LOCATION']);
$url .= '&sortby=-forecast_datetime';
$url .= '&f=json';
$json = request($url);
foreach ($json->features as $forecast) {
	$key = date('c', strtotime($forecast->properties->forecast_datetime));
	if (empty($output['forecast'][$key])) {
		continue;
	}
	if (empty($output['forecast'][$key]['aqhi']) || $forecast->properties->publication_datetime > $output['forecast'][$key]['aqhi_date']) {
		$output['forecast'][$key]['aqhi'] = $forecast->properties->aqhi;
		$output['forecast'][$key]['aqhi_date'] = $forecast->properties->publication_datetime;
	}
}

ksort($output['forecast']);
$output['forecast'] = array_values($output['forecast']);
$output['days'] = array_values($output['days']);

header('Content-Type: application/json');
echo json_encode($output);
