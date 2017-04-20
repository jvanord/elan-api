'use strict';

/*
	© Copyright 2017 Media Services Group, Ltd.

	This is the client-side application file general, cross-module features in this demo. 
	Include this file on relevant application pages after the main application script file ("demo.js") but before any other application scripts.

	IMPORTANT NOTES:

	* Some functions and variables are defined in the main application script file ("demo.js").
	
	* This application uses simple javascript and jQuery to demonstrate the functionality of the Élan REST API. 
	  This API can be called from any REST-capable application framework, including web and mobile apps. 
	  We DO NOT recommend creating a production-ready application using the design patterns (or lack there-of) shown here.

	* The functions here assume jQuery has been loaded successfully and that the user agent complies with most HTML5 features.
	  Production applications should use appropriate feature detection and error trapping to verify any such assumptions.
*/

// This function gets information about all the countries in Élan
// The callback parameter allows the calling script to define actions after a result has been returned
function app_getCountries(callback) {
	var token = app_getToken();
	if (!token) throw new Error('Access Token not found or corrupted.');
	$.ajax({
		method: 'GET',
		url: API_BASE_URI + 'general/countries',
		beforeSend: function (xhr) { xhr.setRequestHeader('Authorization', 'Bearer ' + token.access_token) },
	}).done(function (data) {
		if (typeof callback === 'function')
			callback.call(data);
	}).fail(function (jqXHR, textStatus, errorThrown) {
		console.log("Request failed: " + textStatus);
		console.error(errorThrown);
	});
}

