<?php

function mix(string $filename)
{
	$path = '../build/manifest.json';
	if (!file_exists($path)) {
		return $filename;
	}
	$json = json_decode(file_get_contents($path), true);
	return !empty($json[$filename]) ? $json[$filename] : $filename;
}

function title()
{
	if (empty($GLOBALS['title'])) {
		return '';
	}
	return $GLOBALS['title'] . ' | ';
}

function request(string $url) : array|stdClass
{
	$ch = curl_init();
	curl_setopt($ch, CURLOPT_URL, $url);
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_TIMEOUT, 30);
	$response = curl_exec($ch);
	curl_close($ch);

	return json_decode($response);
}
