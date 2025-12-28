<?php require_once 'functions.php'; ?>
<!doctype html>
<html class="no-js" lang="en">
	<head>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width,initial-scale=1">
		<meta name="description" content="Weather forecasts.">
		<meta name="keywords" content="weather, temperature, air quality, uv index, precipitation">
		<meta property="og:description" content="Weather forecasts.">
		<meta property="og:title" content="<?= title(); ?>Weatherspoon">
		<meta name="mobile-web-app-capable" content="yes">
		<link rel="apple-touch-startup-image" href="/assets/splash/apple-splash-2048-2732.png" media="(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)">
		<link rel="apple-touch-startup-image" href="/assets/splash/apple-splash-1668-2388.png" media="(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)">
		<link rel="apple-touch-startup-image" href="/assets/splash/apple-splash-1536-2048.png" media="(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)">
		<link rel="apple-touch-startup-image" href="/assets/splash/apple-splash-1640-2360.png" media="(device-width: 820px) and (device-height: 1180px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)">
		<link rel="apple-touch-startup-image" href="/assets/splash/apple-splash-1668-2224.png" media="(device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)">
		<link rel="apple-touch-startup-image" href="/assets/splash/apple-splash-1620-2160.png" media="(device-width: 810px) and (device-height: 1080px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)">
		<link rel="apple-touch-startup-image" href="/assets/splash/apple-splash-1488-2266.png" media="(device-width: 744px) and (device-height: 1133px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)">
		<link rel="apple-touch-startup-image" href="/assets/splash/apple-splash-1320-2868.png" media="(device-width: 440px) and (device-height: 956px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)">
		<link rel="apple-touch-startup-image" href="/assets/splash/apple-splash-1206-2622.png" media="(device-width: 402px) and (device-height: 874px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)">
		<link rel="apple-touch-startup-image" href="/assets/splash/apple-splash-1290-2796.png" media="(device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)">
		<link rel="apple-touch-startup-image" href="/assets/splash/apple-splash-1179-2556.png" media="(device-width: 393px) and (device-height: 852px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)">
		<link rel="apple-touch-startup-image" href="/assets/splash/apple-splash-1170-2532.png" media="(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)">
		<link rel="apple-touch-startup-image" href="/assets/splash/apple-splash-1284-2778.png" media="(device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)">
		<link rel="apple-touch-startup-image" href="/assets/splash/apple-splash-1125-2436.png" media="(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)">
		<link rel="apple-touch-startup-image" href="/assets/splash/apple-splash-1242-2688.png" media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)">
		<link rel="apple-touch-startup-image" href="/assets/splash/apple-splash-828-1792.png" media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)">
		<link rel="apple-touch-startup-image" href="/assets/splash/apple-splash-1242-2208.png" media="(device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)">
		<link rel="apple-touch-startup-image" href="/assets/splash/apple-splash-750-1334.png" media="(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)">
		<link rel="apple-touch-startup-image" href="/assets/splash/apple-splash-640-1136.png" media="(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)">
		<title><?= title(); ?>Weatherspoon</title>
		<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
		<link rel="icon" type="image/png" sizes="32x32" href="/favicon.png">
		<link rel="icon" href="/favicon.png">
		<link rel="manifest" href="/manifest.json">
		<link rel="stylesheet" href="<?= mix('/assets/css/style.min.css'); ?>">
		<script integrity="sha256-tuKyZn/3ycw/MNMDii/kvSPrelo6SCsJSecqb1n2neg=">document.documentElement.classList.remove('no-js');</script>
	</head>
	<body>
		<div id="effects"></div>
		<main>
