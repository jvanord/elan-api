'use strict';

/*
	© Copyright 2017 Media Services Group, Ltd.

	This is the main client-side application file for this demo. It should be included on all pages in the application before any other application scripts.

	IMPORTANT NOTES:
	
	* This application uses simple javascript and jQuery to demonstrate the functionality of the Élan REST API. 
	  This API can be called from any REST-capable application framework, including web and mobile apps. 
	  We DO NOT recommend creating a production-ready application using the design patterns (or lack there-of) shown here.

	* The functions here assume jQuery has been loaded successfully and that the user agent complies with most HTML5 features.
	  Production applications should use appropriate feature detection and error trapping to verify any such assumptions.
*/

var
	CLIENT_ID = 'f17cea83-18a9-4f34-9389-3c8324c63493', // REMINDER: don't include sensitive information, like keys or credentials, in production source code
	CLIENT_SECRET = 'S1kK3RQqpmkLq7JF', // REMINDER: don't include sensitive information, like keys or credentials, in production source code
	API_TOKEN_URI = 'http://devstage02.msgldemo.com/token',
	API_BASE_URI = 'http://devstage02.msgldemo.com/api/';

// This function determines authentication status by the presence of access token data stored in localStorage
function app_isAuthenticated() {
	var token = app_getToken();
	return !!token && !!token.access_token;
}

// This function gets the access token data stored in localStorage (if any)
function app_getToken() {
	try {
		return JSON.parse(localStorage['token_data']);
	}
	catch (e) {
		console.error('Error getting token.', e);
		localStorage['token_data'] = null;
		return null;
	}
}

// This function logs the current user into the application using the CLIENT_ID and CLIENT_SECRET parameters defined above
// The first parameter allows the calling script to define actions after successful authentication
// The second parameter allows the calling script to define actions after a failure
function app_logIn(successCallback, failCallback) {
	$.ajax({
		url: API_TOKEN_URI,
		method: 'POST',
		data: {
			grant_type: 'client_credentials',
			client_id: CLIENT_ID,
			client_secret: CLIENT_SECRET
		}
	}).done(function(response){
		console.log('Token Response', response);
		if (!!response && !!response.access_token) {
			localStorage['token_data'] = JSON.stringify(response);
			if (typeof successCallback === 'function')
				successCallback.call(response);
		}
		else {
			localStorage['token_data'] = null;
			if (typeof failCallback === 'function')
				failCallback.call(response);
		}
	}).fail(function(){
		if (typeof failCallback === 'function')
			failCallback.call();
	});
}

// This function logs the current user out of the application by "nulling-out" the access token data stored in localStorage
// The first parameter allows the calling script to define actions after this is complete
// The second parameter allows the calling script to define actions after a failure
function app_logOut() {
	localStorage['token_data'] = null;
}

// These are global jQuery AJAX event handlers that handle showing and hiding a loading graphic while AJAX calls are pending
var $loading = $('<div/>').attr('id', 'ajax-loading').css({
	'display': 'none',
	'position': 'fixed',
	'z-index': '1000',
	'top': '0',
	'left': '0',
	'height': '100%',
	'width': '100%',
	'background': 'rgba( 255, 255, 255, .8) url(\'images/ajax-loader.gif\') 50% 50% no-repeat'
}).appendTo('body');
$(document)
	.on('ajaxStart', function () { $loading.show(); })
	.on('ajaxStop', function () { $loading.hide(); });