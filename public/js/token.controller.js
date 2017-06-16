scotchApp.controller('tokenController', function($scope) {
	$scope.Token   = '';
	$scope.labelVidaToken = '';
	$scope.Seconds = localStorage.getItem( "Vigencia" );
	var Interval;

	$scope.tiempo = {
        label : '00:00'
    };

	$scope.Init = function(){
		if( localStorage.getItem( "_LOGIN") == 0 ){
			location.href = '#/'
		}
		else{
			if( localStorage.getItem( "Token") == null || localStorage.getItem( "Token") == '' ){
				location.href = '#/input'
			}
			else{
				$scope.Token = localStorage.getItem( "Token");
				$scope.formatTime( $scope.Seconds );
				Interval = setInterval( function(){
					if( $scope.Seconds <= 0 ){
						$scope.GenerarOtro();
					}
					$scope.labelVidaToken = $scope.Seconds;
					$scope.formatTime( $scope.Seconds );
					$scope.Seconds--;
				},1000 );				
			}
		}
	}
	
	$scope.formatTime = function( segundos ){
        var minutos = (( Math.floor( segundos / 60 ) ) <= 9) ? '0' +  Math.floor( segundos / 60 ) :  Math.floor( segundos / 60 );
        var resto = ((segundos % 60) <= 9) ? '0' + segundos % 60 : segundos % 60;
        $scope.labelVidaToken = minutos + ":" + resto;
        $scope.tiempo.label = minutos + ":" + resto;
        $(".tiempo").text( minutos + ":" + resto );
    }

    $scope.copiarAlPortapapeles = function(id_elemento) {
	    var aux = document.createElement("input");
	    aux.setAttribute("value", document.getElementById(id_elemento).innerHTML);
	    document.body.appendChild(aux);
	    aux.select();
  	    document.execCommand("copy");
  	    document.body.removeChild(aux);
  	    swal('Autorizaciones', 'Se ha copiado al portapapeles');
	}

	$scope.GenerarOtro = function(){
		clearInterval( Interval );
		localStorage.setItem( "Token" , "");
		location.reload();
	}

	$scope.logOut = function(){
		localStorage.setItem( "_LOGIN", "0" );
        localStorage.setItem( "Usuario_Id", "" );
        localStorage.setItem( "Usuario_Tipo", "" );
        localStorage.setItem( "Datos_Usuario", "" );
        localStorage.setItem( "Token" , "");
        clearInterval( Interval );
        location.href = '#/';
        location.reload();
	}
});