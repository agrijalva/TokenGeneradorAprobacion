// create the module and name it scotchApp
var scotchApp = angular.module('scotchApp', ['ngRoute']);

// configure our routes
scotchApp.config(function($routeProvider) {
	$routeProvider

		// route for the home page
		.when('/', {
			templateUrl : 'pages/login.html',
			controller  : 'mainController',
			cache:false
		})

		// route for the input page
		.when('/input', {
			templateUrl : 'pages/input.html',
			controller  : 'inputController',
			cache:false
		})

		// route for the token page
		.when('/token', {
			templateUrl : 'pages/token.html',
			controller  : 'tokenController',
			cache:false
		});

		if( localStorage.getItem( "_LOGIN" ) == 1 ){
			location.href = '#/input'
		}
});

var _URL = 'http://192.168.0.177:5200/api/mobile/';
// var _URL = 'http://localhost:5200/api/mobile/';
// var _URL = 'http://192.168.20.9:5300/api/mobile/';

// Funcion para cargar el loading en los botones
var contenido = '';
var selector = ''
var showLoading = function( sel ) {
	selector = sel;
	contenido = $( selector ).html();
	$( selector ).attr("disabled","disabled");
	$( selector ).addClass("bg-loading");
	$( selector ).html('<center><img src="images/loading.gif"> <span class="loading">Cargando ...</span><center>');
}

var hideLoading = function(){
	$( selector ).removeClass("bg-loading");
	$( selector ).removeAttr("disabled");
	$( selector ).html( contenido );
}