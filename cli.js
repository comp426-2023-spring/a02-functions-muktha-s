#!/usr/bin/env node

import minimist from "minimist";
import moment from 'moment-timezone';
import fetch from "node-fetch";

var args = minimist(process.argv.slice(2)); 

if (args.h) {
	console.log('Usage: galosh.js [options] -[n|s] LATITUDE -[e|w] LONGITUDE -z TIME_ZONE'); 
	console.log('-h       Show this help message and exit.');
	console.log('-n, -s        Latitude: N positive; S negative.');
	console.log('-e, -w        Longitude: E positive; W negative.');
	console.log('-z            Time zone: uses tz.guess() from moment-timezone by default.');
	console.log('-d 0-6        Day to retrieve weather: 0 is today; defaults to 1.');
	console.log('-j            Echo pretty JSON from open-meteo API and exit.'); 
	process.exit(0); 
} 

var timezone = moment.tz.guess(); 
var day; 
 
if (args.z) {
	timezone = args.z; 
}

if (args.d == 0 || args.d) {
	day = args.d; 
} else {
	day = 1; 
} 
	 

let lat = 0;
let long = 0;

if (args.s) {
	lat = -args.s; 
} else if (args.n) {
	lat = args.n; 
}

if (args.w) {
	long = -args.w; 
} else if (args.e) {
	long = args.e
}

if (!(long && lat)) {
	console.log("Latitude must be in range"); 
	process.exit(0); 
}

const response = await fetch("https://api.open-meteo.com/v1/forecast?latitude=" + lat
+ "&longitude=" + long + "&timezone=" + timezone + "&daily=precipitation_hours");

const data = await response.json();

if (args.j) {
	console.log(data); 
	process.exit(0); 
} 

const days = args.d 

if (days == 0) {
  console.log("today.")
} else if (days > 1) {
  console.log("in " + days + " days.")
} else {
  console.log("tomorrow.")
}
