scotchApp.controller('inputController', function($scope, $http) {
	$scope.numero_orden = '';
	$scope.comentarios  = '';
	$scope.tiempo		= '';
	$scope.calificacion = false;
	$scope.vigencia 	= 0;
	$scope.estrellas 	= 0;
	$scope.idToken 		= 0;
	$scope.DatosUsuario;
	$scope.KPI_id;
	$scope.KPI_name;

	$scope.kpi1;

	$scope.checkboxModel = {
       kpi1 : 0,
       kpi2 : 0,
       kpi3 : 0,
       kpi4 : 0,
       kpi5 : 0,
       kpi6 : 0,
       kpi7 : 0,
       kpi8 : 0,
       kpi9 : 0,
       kpi10 : 0
     };

	$scope.InputInit = function(){
		if( localStorage.getItem( "_LOGIN" ) == null || localStorage.getItem( "_LOGIN" ) == 0 ){
			location.href = "#/"
		}

		$('body').addClass( 'fondoColor' );
		$('.numero_orden').focus();

		$scope.DatosUsuario = JSON.parse( localStorage.getItem( "Datos_Usuario" ) );

		$scope.GetSettings();
	}

	var _orden = [];
	$scope.GetOrden = function(){ // 03-1633010407005-000113-1
		var _orden 		 = $scope.numero_orden.split('-');

		switch( _orden.length ){
			case 1: // El bloque corresponde a una orden de la version 1
				var orden = $scope.numero_orden 
				break;
			case 2: // El bloque corresponde a una cotizacion de la version 1
				var orden = _orden[0] 
				break;
			case 3: // El bloque corresponde a una orden de la version 2
				var orden = $scope.numero_orden 
				break;
			case 4: // El bloque corresponde a una cotizacion de la version 2
				var orden = _orden[0] + "-" + _orden[1] + "-" +_orden[2];
				break;
		}

		
		var idCotizacion = 0;
		// localStorage.getItem( Usuario_Id );
		showLoading( ".btn-login" );
		if( $scope.numero_orden == '' ){
			swal("Autorizaciones", "Proporcione el Número de Orden para generar el Token");
			hideLoading();
		}
		else{
			$http({
			  method: 'GET',
			  url: _URL + 'buscarOrden/',
			  params:{ numeroOrden: orden,
			  		 idUsuario: localStorage.getItem( 'Usuario_Id' ),
			  		 consecutivoCotizacion: ( _orden.length == 4 ) ? _orden[3] : 0
			  		}
			}).then(function successCallback(response) {
				var data = response.data[0];
				
				if( data.Success == 0 ){ // No hay permisos o token
					$scope.numero_orden = '';
					swal("Autorizaciones", data.Msg);
					hideLoading();
				}
				else{ // Si hay permisos y token
	                // Validamos que la Orden la valide el perfil correcto
                    var SaveToken = false;

					// Obtenemos el indice de la operacion a la que perteneceria la orden
	                var flagInd   = false;
	                var indice    = 0;

					for( var i = 0; i < $scope.DatosUsuario.length; i++ ){
	                    if( $scope.DatosUsuario[ i ].idOperacion == data.Operacion ){
	                        flagInd = true;
	                        indice  = i;
	                    }
	                }

	                // Validamos que el usuario tenga permiso de realizar el token en la operacion
                    if( !flagInd ){
                        swal( 'Autorizaciones', 'No cuenta con los privilegios necesarios para realizar el Token. (no tienes permisos en esta operación)' );
                        hideLoading();
                    }
                    else{
                    	if( data.tipo == 1 && data.idEstatusOrden != 4 ){
                                if( parseInt( localStorage.getItem( "Usuario_Tipo" ) ) == 2 ){ // Generar Token
                                    SaveToken = true;
                                }
                                else{
                                    swal( 'Autorizaciones Utilidad', 'No cuenta con los privilegios necesarios para realizar el Token. (Debes ser administrador)' );
                                }
                            }
                        else if( data.idEstatusOrden == 4 || data.idEstatusOrden == 5 ){ // ( Administrador )}
                    		// alert( localStorage.getItem( "Usuario_Tipo" ) );
                            if( parseInt( localStorage.getItem( "Usuario_Tipo" ) ) == 1 || parseInt( localStorage.getItem( "Usuario_Tipo" ) ) == 2 ){ // Generar Token
                                SaveToken = true;
                            }
                            else{
                                swal( 'Autorizaciones', 'No cuenta con los privilegios necesarios para realizar el Token. (Es Aprobacion)' );
                                hideLoading();
                            }
                        }
                        else if( data.idEstatusOrden == 6 ){ // ( Administrador )}
                            if( parseInt( localStorage.getItem( "Usuario_Tipo" ) ) == 2 ){ // Generar Token
                                SaveToken = true;
                            }
                            else{
                                swal( 'Autorizaciones', 'No cuenta con los privilegios necesarios para realizar el Token. (Eres cliente)' );
                                hideLoading();
                            }
                        }
                        else if( data.idEstatusOrden == 7 ){ // ( Cliente )
                            if( parseInt( localStorage.getItem( "Usuario_Tipo" ) ) == 1 ){ // Generar Token
                                SaveToken = true;
                            }
                            else{
                                swal( 'Autorizaciones', 'No cuenta con los privilegios necesarios para realizar el Token.( Eres administrador )' );
                                hideLoading();
                            }
                        }
                    }

                    // Guardamos el token
                    if( SaveToken ){
                        $scope.GetSettings();
                        $scope.GuardarToken( data );
                        if( data.Calificacion == 1 ){ // Se calificara el servicio
                        	$scope.tiempo = $scope.TimeNow();
                            $scope.calificacion = true;
                        }
                        else{
                            location.href = '#/token';
                        }                            
                    }
				}
			}, function errorCallback(response) {
			  	hideLoading();
			  	swal( 'Autorizaciones', 'No se ha podido establer conexión con el servidor, intente más tarde.' );
			});
		}
	}

	$scope.GuardarToken = function( respuesta ){
        localStorage.setItem( "Token", $scope.RandomHash(6) );
        var ubicacion = '';
        var URL_method = '';

        if(navigator.geolocation) {
		    navigator.geolocation.getCurrentPosition(
		    function( position ){
		    	ubicacion = position.coords.latitude + ':' + position.coords.longitude;
		    },
		    function( e ){
		    	ubicacion = JSON.stringify( e );
		    }, {
		    	enableHighAccuracy: true, 
		    	maximumAge: 5000, 
		    	timeout: 10000 
		    });
		}
		else {	
			ubicacion = 'No soportado'
		}

        var brw = new Browser();
        var deviceData = {
            fullName: brw.fullName,
            fullVersion: brw.fullVersion,
            platform: brw.platform,
            mobile: brw.mobile
        };

        setTimeout( function(){
	        var URL_method = _URL + 'insertToken'
	                                  + '?token=' + localStorage.getItem( "Token" )
	                                  + '&Vigencia=' + localStorage.getItem( "Vigencia")
	                                  + '&numeroOrden=' + $scope.numero_orden
	                                  + '&ubicacionToken=' + ubicacion
	                                  + '&datosMovil=' + JSON.stringify( deviceData )
	                                  + '&idUsuario=' + localStorage.getItem("Usuario_Id")
	                                  + '&idOrdenServicio=' + respuesta.idOrden
	                                  + '&origenToken=web'
	                                  + '&idEstatusOrden=' + respuesta.idEstatusOrden
	                                  + '&idCotizacion=' + respuesta.idCotizacion;

        	$http({
			    method: 'GET',
			    url: URL_method
			}).then(function successCallback(response) {
				$scope.idToken = response.data[0].LastInsertId;
			}, function errorCallback(response) {
			  	swal( 'Autorizaciones', 'No se ha podido establer conexión con el servidor, intente más tarde.' );
			});
        }, 500);
    }

    $scope.GuardarCalificacion = function(){
        if( $scope.idToken != 0 ){
	        if( $scope.estrellas == 0 ){
	            swal( 'Ayudanos a mejorar', 'Tu opinión es importante para nosotros favor de proporcionarnos su punto de vista.' );
	        }
	        else{
	            var URL_method = _URL + 'insertCalificacion'
	                                      + '?calificacionToken=' + $scope.estrellas
	                                      + '&comentariosToken=' + $scope.comentarios
	                                      + '&idToken=' + $scope.idToken
	                                      + '&kpi1=' + (($scope.estrellas == 5) ? $scope.checkboxModel.kpi6 : $scope.checkboxModel.kpi1)
	                                      + '&kpi2=' + (($scope.estrellas == 5) ? $scope.checkboxModel.kpi7 : $scope.checkboxModel.kpi2)
	                                      + '&kpi3=' + (($scope.estrellas == 5) ? $scope.checkboxModel.kpi8 : $scope.checkboxModel.kpi3)
	                                      + '&kpi4=' + (($scope.estrellas == 5) ? $scope.checkboxModel.kpi9 : $scope.checkboxModel.kpi4)
	                                      + '&kpi5=' + (($scope.estrellas == 5) ? $scope.checkboxModel.kpi10 : $scope.checkboxModel.kpi5);

	            $http({
				    method: 'GET',
				    url: URL_method
				}).then(function successCallback(response) {
					location.href = "#token"
				}, function errorCallback(response) {
				  	swal( 'Autorizaciones', 'No se ha podido establer conexión con el servidor, intente más tarde.' );
				});	           
	        }
        }
        else{
        	swal( 'Autorizaciones', 'Se esta ejecutando una operación en segundo plano espere un par de segundos y vuelva a hacer su peración.' );
        }
    }

	$scope.GetSettings = function(){
        $http({
			  method: 'GET',
			  url: _URL + 'settings'
			}).then(function successCallback(response) {
				var data = response.data[0];
				$scope.KPI_id   = [data.kpi1_id, data.kpi2_id, data.kpi3_id, data.kpi4_id, data.kpi5_id, data.kpi6_id, data.kpi7_id, data.kpi8_id, data.kpi9_id, data.kpi10_id ];
				$scope.KPI_name = [data.kpi1_name, data.kpi2_name, data.kpi3_name, data.kpi4_name, data.kpi5_name, data.kpi6_name, data.kpi7_name, data.kpi8_name, data.kpi9_name, data.kpi10_name ];
				localStorage.setItem( "Vigencia", data.vigencia);
			}, function errorCallback(response) {
			  	console.log( 'No se ha podido establer conexión con el servidor, intente más tarde.' );
			});
    }

	$scope.logOut = function(){
		localStorage.setItem( "_LOGIN", "0" );
        localStorage.setItem( "Usuario_Id", "" );
        localStorage.setItem( "Usuario_Tipo", "" );
        localStorage.setItem( "Datos_Usuario", "" );
        location.href = '#/';
	}

	$scope.presEnter = function( e ){
		e.keyCode == 13 ? $scope.GetOrden() : false;
	}

	$scope.TimeNow = function(){
        var d = new Date();
        var tiempo = d.getHours() + ':' + d.getMinutes();
        var hora = '00';

        switch( d.getHours() ){
            case 1: hora = "01"; break;
            case 2: hora = "02"; break;
            case 3: hora = "03"; break;
            case 4: hora = "04"; break;
            case 5: hora = "05"; break;
            case 6: hora = "06"; break;
            case 7: hora = "07"; break;
            case 8: hora = "08"; break;
            case 9: hora = "09"; break;
            case 10: hora = "10"; break;
            case 11: hora = "11"; break;
            case 12: hora = "12"; break;
            case 13: hora = "01"; break;
            case 14: hora = "02"; break;
            case 15: hora = "03"; break;
            case 16: hora = "04"; break;
            case 17: hora = "05"; break;
            case 18: hora = "06"; break;
            case 19: hora = "07"; break;
            case 20: hora = "08"; break;
            case 21: hora = "09"; break;
            case 22: hora = "10"; break;
            case 23: hora = "11"; break;
            case 24: hora = "00"; break;
        }

        return hora + ':' + ( (d.getMinutes() <= 9) ? ( '0' + d.getMinutes() ) : d.getMinutes() ) + ' ' + ( ( d.getHours() < 12 ) ? 'a.m.' : 'p.m.' );
    }

	$scope.RandomHash = function(nChar) {
		var text = "";
	    var possible = "0123456789ABCDEFG0123456789HIJKLMNO0123456789PQRSTUV0123456789WXYZ0123456789";

	    for( var i=0; i < nChar; i++ )
	        text += possible.charAt(Math.floor(Math.random() * possible.length));

	    return text;
    }
});