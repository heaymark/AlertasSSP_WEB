var cartolayer, sltfeature, lyrs, mkrInicial, lyrRadio, maps, objlayerBase, highlight, dehighlight, select, layerbase, paramlayerbase, parammapbase, viz, vizparam, el, layers, user, api_key;
var geomTools;
var drawControl;
//Se  obtiene de viz en carto
var layerbase = 'https://{s}.base.maps.api.here.com/maptile/2.1/maptile/newest/normal.day.grey/{z}/{x}/{y}/256/png8?lg=eng&token=A7tBPacePg9Mj_zghvKt9Q&app_id=KuYppsdXZznpffJsKT24';
var paramlayerbase = {
	minZoom: 0,
	maxZoom: 20,
	subdomains:"1234",
	attribution: "&copy;2017 HERE <a href='http://here.net/services/terms' target='_blank'>Terms of use</a>"
};
 
var parammapbase = {
    center: new L.LatLng(19.33123050921937,-99.09942626953125),
	zoom : 10,
	minZoom: 0,
	maxZoom: 20,
	attribution: "CARTO",
}
var mapdiv =  'maps';

var param = {
    user:"develop",
};
var viz = "https://finanzasdf.carto.com/u/develop/api/v2/viz/6fe02154-7fef-470b-8ef2-8463e076c672/viz.json";

$(function(){

	objlayerBase = L.tileLayer(layerbase,paramlayerbase);
	maps = new L.Map(mapdiv, parammapbase), maps.addLayer(objlayerBase); //aqui se genera el mapa base
	cartodb.createLayer(maps,viz) //aqui se jala el mapa que esta en el visor, objeto del mapa y variable viz
		.addTo(maps)
		.on('done', function(layer){//evento que se dispara cuando kla peticion a carto
			lyrs = layer;

			/*** Agregar la capa como extra de las que estan en el builder sin importar si esta duplicada / Se agrega al final del JSON ***/
			/*lyrEquip = layer.createSubLayer({ //agregando una nueva capa por codigo con metodo de carto
			  	sql:"SELECT * FROM sector_policia", //propiedad sql el nombre del dataset
			  	cartocss: $("#markerPoint").text(), //se jala del index donde se pone el cartocss que se optiende del editor de carto  (diseñado para puntos)
	    			interactivity: "cartodb_id,delegacion" //campos con los cuales se va interactuar incluidos en el objeto de la capa
			}); //Fin lyrEquip = layer.createSubLayer({*/

			/*** Cuenta todas las capas habilitadas ***/
			/*** Agregar capa de infowindows ***/
			layer.getSubLayer(7).setInteraction(true); //en layer estan todas las capas, getsub se refiera a una capa en especifico empezando de 0 hacia arriva dedes un metod de carto
			layer.getSubLayer(7).setInteractivity(['cartodb_id','asociacion','cadena', 'detalleopc', 'detenidos']);// se  ponen los campos con los cuales se va a jugar o trabjar
			// layer.getSubLayer(7).setSQL("SELECT * FROM develop.alertas_alto_bajo_impacto WHERE alerta_alto_bajo_i = 0");//consulta para poder ver poligono pintado
			// layer.getSubLayer(7).on('featureClick', function(e, latlng, pos, data, lyer){ //data =campos especificados, layer=numerodelayer - feature se renueva la seleccion anterior 
	    			//selectFeature("develop.alertas_alto_bajo_impacto","cartodb_id = "+data.cartodb_id);//pimer cmapo dataset, segundo el filtro que se hara
			// });

		    cartodb.vis.Vis.addInfowindow(maps, layer.getSubLayer(7), ['cartodb_id', 'asociacion', 'cadena', 'detalleopc', 'detenidos'],{
		    	infowindowTemplate: $('#infowindow_template_no_efectiva').html(),//Se obtiene codigo html
		    	templateType:'mustache'//tipo de generador de template (undercode, mustache)
		    });

			/*** Agregar capa de infowindows ***/
			layer.getSubLayer(8).setInteraction(true); //en layer estan todas las capas, getsub se refiera a una capa en especifico empezando de 0 hacia arriva dedes un metod de carto
			layer.getSubLayer(8).setInteractivity(['cartodb_id', 'detalleopc', 'detenidos']);// se  ponen los campos con los cuales se va a jugar o trabjar
			// layer.getSubLayer(8).on('featureClick', function(e, latlng, pos, data, lyer){ //data =campos especificados, layer=numerodelayer - feature se renueva la seleccion anterior 
	    			//selectFeature("develop.alertas_alto_bajo_impacto","cartodb_id = "+data.cartodb_id);//pimer cmapo dataset, segundo el filtro que se hara
			// });

		    cartodb.vis.Vis.addInfowindow(maps, layer.getSubLayer(8), ['cartodb_id', 'detalleopc', 'detenidos'],{
		    	infowindowTemplate: $('#infowindow_template_efectiva').html(),//Se obtiene codigo html
		    	templateType:'mustache'//tipo de generador de template (undercode, mustache)
		    });

		    /*** (Solo funciona si la capa esta habilitada en builder) ***/
			/*** Agregar eventos sobre la capa y hacer cambios sobre una capa ***/
			/* layer.getSubLayer(1).setInteraction(true); //en layer estan todas las capas, getsub se refiera a una capa en especifico empezando de 0 hacia arriva dedes un metod de carto
			 layer.getSubLayer(1).setInteractivity(['cartodb_id','nombre_id']);// se  ponen los campos con los cuales se va a jugar o trabjar
			 layer.getSubLayer(1).setCartoCSS($("#markerManzana").text());//Aqui se cambia el cartocss que tiene la capa por default y se va ubicar el css que se ocupara se encuentra en index
			 layer.getSubLayer(1).setSQL("SELECT * FROM colonias_ok ORDER BY nombre_id ASC");//consulta para poder ver poligono pintado
			 layer.getSubLayer(1).on('featureClick', function(e, latlng, pos, data, lyer){ //data =campos especificados, layer=numerodelayer - feature se renueva la seleccion anterior 
	  			selectFeature("colonias_ok","cartodb_id = "+data.cartodb_id);//pimer cmapo dataset, segundo el filtro que se hara
			 });//Fin layer.getSubLayer(1).on('featureClick', function(e, latlng, pos, data, lyer){*/
		
			btnTools.addTo(maps);//botones que se agrean al mapa
			// btnDelete.addTo(maps);
		}).error(function (err) {
			console.log(err);
		});

    	maps.on("zoomlevelschange",mapGrafica);
    	maps.on("moveend",mapGrafica);

		//se crea objeto para sql
		objsql = new cartodb.SQL({
    		user:"develop",
		});//Fin objsql = new cartodb.SQL({

		//Empieza los sectores
		objsql.execute("SELECT * FROM sectores ORDER BY region ASC")
        .on("done",function(data){
           	$("<option />",{"value":"*","text":'Selecciona un sector...'}).appendTo("#sectores");
        	   	for(idx in data.rows){
                	$("<option />",{"value":data.rows[idx].nombre,"text":data.rows[idx].nombre}).appendTo("#sectores");
            	}//Fin for(idx in data.rows){
    	});//Fin .on("done",function(data){
		
		$("#sectores").on("change",function(e){//Sectores
			var optionSectores =  $("#sectores").val();
			var optionCuadrante = $("#cuadrante").empty();

			objsql = new cartodb.SQL({
    			user:"develop",
			});//Fin objsql = new cartodb.SQL({

				objsql.execute("select * from cuadrantes where sector = '"+optionSectores+"' order by no_cuadran")
				.on("done",function(data){
					for(idx in data.rows){
						$("<option />",{"value":data.rows[idx].no_cuadran,"text":data.rows[idx].no_cuadran}).appendTo("#cuadrante");
					}//Fin for(idx in data.rows){
				});//Fin .on("done",function(data){

				if (optionSectores == "*"){
					 lyrs.getSubLayer(7).setSQL("select alert.* from develop.alertas_alto_bajo_impacto alert");
					
				}else{//Fin if (optionSectores == "*"){
					 lyrs.getSubLayer(7).setSQL("select alert.* from develop.alertas_alto_bajo_impacto alert inner join sectores sec on ST_Contains(sec.the_geom,alert.the_geom) where sec.nombre = '"+optionSectores+"'");
					
					 objsql.execute("SELECT alert.* FROM alertas_efectivas alert inner join sectores sec on ST_Contains(sec.the_geom,alert.the_geom) where sec.nombre = '"+optionSectores+"'")
					
					.on("done",function(data){
						$("#tbldetalle").html('');
						for(idx in data.rows){
							$tr = $("<tr>");
							$("<td />",{"text":data.rows[idx].asociacion }).appendTo($tr);
							$("<td />",{"text":data.rows[idx].cadena }).appendTo($tr);
							$("<td />",{"text":data.rows[idx].detalleefectivo }).appendTo($tr);
							$("<td />",{"text":data.rows[idx].nombre }).appendTo($tr);
							$("<td />",{"text":data.rows[idx].segundos }).appendTo($tr);
							
							$tr.appendTo("#tbldetalle");
						}//Fin for(idx in data.rows){
					});//Fin .on("done",function(data){
				}//Fin else

				bounry({
	    			user:"develop",
						},"sectores","nombre = '"+optionSectores+"'",'',maps);
					maps.setZoom(14);
		});//Fin sector


		$("#cuadrante").on("change",function(e){//Cuadrante
				optionCuadrante = $("#cuadrante").val();
				objsql = new cartodb.SQL({
					user:"develop",
				});//Fin objsql = new cartodb.SQL({

				objsql.execute("SELECT alert.* FROM alertas_efectivas alert inner join cuadrantes sec on ST_Contains(sec.the_geom,alert.the_geom) where sec.no_cuadran = '"+optionCuadrante+"'")
					.on("done",function(data){
						$("#tbldetalle").html('');
						for(idx in data.rows){
							$tr = $("<tr>");
							$("<td />",{"text":data.rows[idx].asociacion }).appendTo($tr);
							$("<td />",{"text":data.rows[idx].cadena }).appendTo($tr);
							$("<td />",{"text":data.rows[idx].detalleopcional }).appendTo($tr);
							$("<td />",{"text":data.rows[idx].nombre }).appendTo($tr);
							$("<td />",{"text":data.rows[idx].segundos }).appendTo($tr);
							
							$tr.appendTo("#tbldetalle");
						}//Fin for(idx in data.rows){
					});//Fin .on("done",function(data){
			
				bounry({
					user:"develop",
						},"cuadrantes",	"sector = '"+$("#sectores").val()+"' and no_cuadran = '"+optionCuadrante+"'",'',maps);
					maps.setZoom(14);
		});//Fin cuadrante

		callbackLeftlet(lyrs);
});

//Funcion para acercar al mapa 
function bounry(user,table,sqlfilter,layer,map) {
	var sqlExtent = new cartodb.SQL(user);
    //regresa la coordenada maxima de mi extend de la geometria
	var sql = "select max(xmax) as xmax,min(xmin) as xmin,max(ymax) as ymax,min(ymin) as ymin from (select ST_Xmax(ST_Extent(the_geom)) as xmax,ST_Xmin(ST_Extent(the_geom)) as xmin,ST_Ymax(ST_Extent(the_geom)) as ymax,ST_Ymin(ST_Extent(the_geom)) as ymin from " + table + " where " + sqlfilter + ") as ext"

	sqlExtent.execute(sql).done(function(data) {
		if (data.rows[0].ymax != '' && data.rows[0].ymin != '' && data.rows[0].xmax && data.rows[0].xmin != '') {
            var southWest = L.latLng(data.rows[0].ymax, data.rows[0].xmin),
            northEast = L.latLng(data.rows[0].ymin, data.rows[0].xmax),
            bounds = L.latLngBounds(southWest, northEast);
            map.fitBounds(bounds);
            // this.selectFeature(table,sqlfilter,layer);
            selectFeature(table,sqlfilter,layer);
        } else {
            console.log("errors: en la ejecucion del sql en cartodb");
        }
	}).error(function(errors) {
		console.log("errors:" + errors);
	});
}

//Funcion para seleccionar el poligono
function selectFeature(table,sqlfilter,layer){

    if(maps.hasLayer(sltfeature)){
        maps.removeLayer(sltfeature);
    };
    // Get CartoDB selection as GeoJSON and Add to Map
	$.getJSON("https://develop.carto.com/api/v2/sql?format=GeoJSON&q=select * from " + table + " where " + sqlfilter, function(data){
    
        sltfeature = L.geoJson(data,{
			style: function (feature) {
				return {color:'#850200',
				weight: 5,
				opacity:0.5,
				fillColor:'#C4C5C6',
				fillOpacity:0.2}
			},
			onEachFeature: function (feature, layer) {
				layer.on({
		            click: function select(e) {
		            	select(e.target);
		           }
				});
            }
        }).addTo(maps);
        sltfeature.bringToBack();
    });
}

//Funcion para habilitar acciones al seleccionar el poligono
function onEachFeature(feature, layer) {
       layer.on({
           mouseover: function (e) {
         highlight(e.target);
       },
           mouseout: function (e) {
         dehighlight(e.target);
       },
           click: function (e) {
             select(e.target);
           }
       });
}

//Leaflet botones de poligonos o radios
function callbackLeftlet(layer){
    lyrLeft = layer;
    var geomTools = new L.FeatureGroup();
    var drawControl = new L.Control.Draw({
        position : 'topleft',
        draw : {
        	/*
	        	polyline : true,
	        	polygon : false,
	        	rectangle : true,
	        	marker : false,
	        	circle: true
        	*/
			polyline: {
				allowIntersection: false,//linea pueden cruzarse
				drawError: {//opc. conf. error si detecta interseccion
					color: '#b00b00',
					timeout: 1000
				},
				guidelineDistance:15,//distancia pixeles entre guion
				shapeOptions: {//opc. al dibujar
					stroke: true,
					color: '#FF33D1',
					weight: 6,
					opacity: 2.5,
					fill: false,
					clickable: true
				},
				metric: true,//sistema de medicion metrico o imperial
				zIndexOffset:2000,//num alto para dibujar sobre todas las capas
				repeatMode:false,//herramienta de dibujo permanece habilitada despues de dibujar una forma
				showLength: true//Si se debe mostrar la distancia en la información de herramientas
			},
			polygon: {
				allowIntersection: false,//linea pueden cruzarse
				drawError: {//opc. conf. error si detecta interseccion
					color: '#b00b00',
					timeout: 1000
				},
				guidelineDistance:15,//distancia pixeles entre guion
				shapeOptions: {//opc. al dibujar
					color: '#bada55',
					stroke: true,
					weight: 4,
					opacity: 0.5,
					fill: true,//llenar
					clickable: true
				},
				metric: true,//sistema de medicion metrico o imperial
				zIndexOffset:2000,//num alto para dibujar sobre todas las capas
				repeatMode:false,//herramienta de dibujo permanece habilitada despues de dibujar una forma
				showArea: true, //muestra area dibujada valida solo para polygon
				showLength: true//Si se debe mostrar la distancia en la información de herramientas
			},
			rectangle:{
				shapeOptions: {
					stroke: true,
					color: '#3388ff',
					weight: 4,
					opacity: 0.5,
					fill: true,
					fillColor: null, //true y false same as color by default
					fillOpacity: 0.2,
					showArea: true,
					clickable: true
				},
				metric: true,
				repeatMode:false
			},
			circle: {
				shapeOptions: { 
					stroke: true,
					color: '#662d91',
					weight: 5,
					opacity: 2.5,
					fill: true,
					fillColor: null, //true y false same as color by default
					fillOpacity: 0.2,
					clickable: true
				},
				showRadius: true,
				metric: true, // Whether to use the metric measurement system or imperial
				feet: true, // When not metric, use feet instead of yards for display
				nautic: false // When not metric, not feet use nautic mile for display
			},
			marker: false
        },
        edit : {
        	featureGroup : geomTools,
        	edit : false,
        	remove : true
        }
    });

    maps.addControl(drawControl);
    maps.addLayer(geomTools);

    maps.on('draw:created', function(e) {
        		var type = e.layerType;
        		var layer = e.layer;
                var coord = layer.toGeoJSON();
                
            	geomTools.addLayer(e.layer);//Dejar el drawcontrol en el visor

                // alert("Layer:"+layer);
                // alert("type:"+type);
                // alert("coord:"+JSON.stringify(coord));

        		switch(type){
        			case "rectangle":
        				fn_datainfo(fn_newgeomJson(coord), 0);
        				break;
        			case 'circle':
        				fn_datainfo(fn_newgeomJson(coord), layer.getRadius());
        				break;
        			case 'polygon':
        				fn_datainfo(fn_newgeomJson(coord), 0);
        				break;
        			case 'polyline':
        				fn_datainfo(fn_newgeomJson(coord), 500);
        				break;
        		}
    });
}

// Funcion para obtener la geometria y cordenadas del radio
function fn_newgeomJson(GeoJson) {
	var SqlJson = {
		'type' : '',
		'coordinates' : []
	};
	SqlJson.type = GeoJson.geometry.type;
	SqlJson.coordinates = GeoJson.geometry.coordinates;
	var geom = "ST_SetSRID(ST_GeomFromGeoJSON('" + JSON.stringify(SqlJson) + "'),4326)";
	return geom;
}

// Funcion para llamar el modal despues del radio
function fn_datainfo(geom, radius) {
	$("#loadingMap").show();
	var sql = new cartodb.SQL({
		user : 'develop'
	});

	// alert(radius);

	if (radius != 0){
		geom = "ST_Buffer(" + geom + "::geography," + radius + ")::geometry"
	}

	var strsql ="SELECT * FROM (SELECT * FROM develop.alertas_alto_bajo_impacto WHERE alerta_alto_bajo_i = 1 UNION SELECT * FROM develop.alertas_alto_bajo_impacto WHERE alerta_alto_bajo_i = 0) AS EfectivaNo WHERE ST_contains(" + geom + ",the_geom) or ST_Intersects(" + geom + ",the_geom)  ORDER BY cartodb_id ASC";

	sql.execute(strsql).done(function(data) {
		var tpl = $('#infoData').html();
		_.templateSettings.variable = "item";
		var htl = _.template(tpl);
		$('#tblSucursal').html(htl(data.rows));
        $('#info').modal('show');
		$("#loadingMap").hide();
	}).error(function(errors) {
		$("#loadingMap").hide();
		console.log("errors:" + errors);
	});
}

// Botono en el mapa para la tabla en el modal
var btnTools = L.control({position: 'topleft'});
// var btnDelete = L.control({position: 'topleft'});

// Funcion para adjuntar un boton leaflet al mapa 
btnTools.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'leaflet-bar'); // create a div with a class "info"
    this._div.setAttribute("id","miiddiv");
    this._filtro = L.DomUtil.create('a','claslinksa',this._div);
    this._filtro.setAttribute("id","amiid");

    this._imgfiltro = L.DomUtil.create('i','',this._filtro);
    this._imgfiltro.setAttribute("class","fa fa-info-circle");
    this._imgfiltro.setAttribute("aria-hidden",true);
    this._imgfiltro.setAttribute("style","margin:6px 8px;");

    L.DomEvent.addListener(this._filtro,'click',this.fnFilter,this);
    return this._div;
};

//Funcion para mandar a llamar al modal
btnTools.fnFilter = function () {
    $('#miModal').modal('show'); 
};

// Funcion para actualizar el mapa conforme se mueve el mapa
function mapGrafica(e) {
    var dataGraph = [];
    var elArray = new Array();
    var dataCfg;
    var totalAE = 0; 
    var totalANE = 0;
    console.log("layer loaded");

    Ymax = maps.getBounds().getNorth();
    Ymin = maps.getBounds().getSouth();
    Xmax = maps.getBounds().getEast();
    Xmin = maps.getBounds().getWest();

    var sql =  new cartodb.SQL({
        user:"develop"
    }); 

    sql.execute("SELECT cartodb_id, alerta_alto_bajo_i, asociacion, cadena, detalleopc, detenidos FROM alertas_alto_bajo_impacto_union WHERE ST_Contains(ST_MakeEnvelope("+Xmin+","+Ymin+","+Xmax+","+Ymax+",4326),the_geom) ORDER BY cartodb_id")

        .done(function(data){

            for (idx in data.rows){
                
                if (data.rows[idx].alerta_alto_bajo_i == 1) {
                	totalAE = parseInt(totalAE) + parseInt(1);
                } else {
                	totalANE = parseInt(totalANE) + 1;
                }

            }

            dataCfg = 
                [
                    {
                    	name:"Alertas Efectivas",
                        y:totalAE,
                    },{
                    	
                        name:"Alertas No Efectivas",
                        y:totalANE,
                    }
                ];

            console.log(dataCfg);
            
            graficapiehighcharts(totalAE,totalANE);
        /*
	        // Forma Grafica 
	        var chart = {
	            plotBackgroundColor: null,
	            plotBorderWidth: null,
	            plotShadow: false
	        };

	        var title= {
	            text: 'Alertas Efectivas y No Efectivas'
	        };
	        var tooltip= {
	            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
	        };
	        var plotOptions= {
	            pie: {
	                allowPointSelect: true,
	                cursor: 'pointer',
	                
	                dataLabels: {
	                    enabled: true,
	                    format: '<b>{point.name}</b>: {point.percentage:.1f} %',
	                        style: {
	                            color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
	                        }
	                }
	            }
	        };
	        var series = [{
	               type: 'pie',
	               name: 'Alertas SSP',
	               data:[
	                    {
	                    	name: 'Alertas Efectivas',
	                     	y:totalAE,
	                    //     sliced: false,
	                    //     selected: false,
	                    },{
	                        name: 'Alertas No Efectivas',
	                     	y:totalANE,
	                    //     sliced: true,
	                    //     selected: true
	                    }
	                ]
	        }];
			    // // Radialize the colors
			    // Highcharts.getOptions().colors = Highcharts.map(
			    //     Highcharts.getOptions().colors, function (color) {
			    //         return {
			    //             radialGradient: { cx: 0.5, cy: 0.3, r: 0.7 },
			    //             stops: [
			    //                 [0, color],
			    //                 [1, Highcharts.Color(color).brighten(-0.3).get('rgb')] // darken
			    //             ]
			    //         };
			    //     }
			    // );
			    // se crea el json 
	        var json = {};   
	        json.chart = chart; 
	        json.title = title;     
	        json.tooltip = tooltip;  
	        json.series = series;
	        json.plotOptions = plotOptions;
	        $('#graficaCircular').highcharts(json);  
	    */
    });//Fin .done(function(data){
}//Fin Function