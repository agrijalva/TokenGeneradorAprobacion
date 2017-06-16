// create the controller and inject Angular's $scope
scotchApp.controller('mainController', function($scope, $http) {
	$('body').removeClass( 'fondoColor' );
	$('body').addClass( 'fondoImg' );

	// create a message to display in our view
	$scope.message   = 'Everyone come and see how good I look!';
	$scope.usuario   = '';
	$scope.password  = '';
	$scope.userHide  = true;

	$scope.LoginInit = function () {
		if( localStorage.getItem( "_LOGIN" ) == null ){
			$(".user").focus();
			$scope.userHide = true;
		}
		else if( localStorage.getItem( "_LOGIN" ) == 0 ){
			$scope.usuario = localStorage.getItem( "Usuario_Name" );
			$scope.userHide = false;
			$(".pass").focus();
		}	
	}

	$scope.Login = function(){
		showLoading( ".btn-login" );

		$(".btn-login").attr("disabled","disabled");
		if( $scope.usuario == '' && $scope.password == '' ){
			swal("Autorizaciones", "Propocione sus credenciales para poder acceder");
			hideLoading();
		}
		else if( $scope.usuario == '' ){
			swal("Autorizaciones", "Ingrese su usuario");
			hideLoading();
		}
		else if( $scope.password == '' ){
			swal("Autorizaciones", "Ingrese su contraseña");
			hideLoading();
		}
		else{
			// Simple GET request example:
			$http({
			  method: 'GET',
			  url: _URL + 'login?usuario=' + $scope.usuario + '&password=' + $scope.password
			}).then(function successCallback(response) {
				console.warn( response );
				console.log("Tipado", typeof(response.data) );

				if( typeof(response.data) != 'object' ){
					swal( 'Autorizaciones', 'Se ha generado una respuesta diferente a la esperada: \n \n ' + response.data);
				}
				else{
					if( response.data.length != 0 ){
	                    localStorage.setItem( "_LOGIN", "1" );
	                    localStorage.setItem( "Usuario_Id", response.data[0].idUsuario );
	                    localStorage.setItem( "Usuario_Name", response.data[0].nombreUsuario );
	                    localStorage.setItem( "Usuario_Tipo", response.data[0].idCatalogoRol );
	                    localStorage.setItem( "Datos_Usuario", JSON.stringify(response.data) );
	                    location.href = '#/input';

	                    console.log( '==================' );
	                    console.log( response.data[0].idCatalogoRol );
	                    console.log( '==================' );
	                }
	                else{
	                    swal( 'Usuario no encontrado', 'No se ha encontrado su usuario, verifique sus credenciales.' );
	                    if(!$scope.userHide){
	                    	$scope.password = '';
	                    	$(".pass").focus();
	                    }
	                    else{
		                    $scope.usuario = '';
		                    $scope.password = '';
		                    $(".user").focus();
	                    }
	                }
				}
				hideLoading();
                
			}, function errorCallback(response) {
			  	hideLoading();
			  	swal( 'Autorizaciones', 'No se ha podido establer conexión con el servidor, intente más tarde.' );
			});
		}
	}

	$scope.OlvidarUsuario = function(){
		$scope.userHide = true;
		$scope.usuario = '';
		localStorage.clear();
		$(".user").focus();
	}

	$scope.presEnter = function( e ){
		e.keyCode == 13 ? $scope.Login() : false;
	}
});