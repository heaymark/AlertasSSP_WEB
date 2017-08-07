var cartolayer;
var sltfeature;
var lyrs;
var mkrInicial;
var lyrRadio;
var maps;
var objlayerBase;
//Se  obtiene de viz en carto
var layerbase = 'https://{s}.base.maps.api.here.com/maptile/2.1/maptile/newest/normal.day.grey/{z}/{x}/{y}/256/png8?lg=eng&token=A7tBPacePg9Mj_zghvKt9Q&app_id=KuYppsdXZznpffJsKT24';
var paramlayerbase = {
	minZoom: 0,
	maxZoom: 20,
	subdomains:"1234",
	attribution: "&copy;2017 HERE <a href='http://here.net/services/terms' target='_blank'>Terms of use</a>"
};
 
var parammapbase = {
	// center : new L.LatLng(19.42523, -99.14645),
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
		.on('done', function(layer) {

		lyrs = layer;


		/*** Agregar una capa al map ***/
			lyrEquip = layer.createSubLayer({ //agregando una nueva capa por codigo con metodo de carto
				// sql:"SELECT * FROM inegi_equipaurbano", //propiedad sql el nombre del dataset
				sql:"SELECT * FROM sector_policia", //propiedad sql el nombre del dataset
				cartocss: $("#markerPoint").text(), //se jala del index donde se pone el cartocss que se optiende del editor de carto  (diseñado para puntos)
	  			interactivity: "cartodb_id,delegacion" //campos con los cuales se va interactuar 
	  			// interactivity: "cartodb_id,colonia" //campos con los cuales se va interactuar 
			});

		/*** Agregar eventos sobre la capa y hacer cambios sobre una capa***/
		layer.getSubLayer(1).setInteraction(true); //en layer estan todas las capas, getsub se refiera a una capa en especifico empezando de 0 hacia arriva dedes un metod de carto
		layer.getSubLayer(1).setInteractivity(['cartodb_id','nombre_id']);// se  ponen los campos con los cuales se va a jugar o trabjar
		layer.getSubLayer(1).setCartoCSS($("#markerManzana").text());//Aqui se cambia el cartocss que tiene la capa por default y se va ubicar el css que se ocupara se encuentra en index
		layer.getSubLayer(1).setSQL("SELECT * FROM colonias_ok ORDER BY nombre_id ASC");//consulta para poder ver poligono pintado
		layer.getSubLayer(1).on('featureClick', function(e, latlng, pos, data, lyer) { //data =campos especificados, layer=numerodelayer - feature se renueva la seleccion anterior 
  			selectFeature("colonias_ok","cartodb_id = "+data.cartodb_id);//pimer cmapo dataset, segundo el filtro que se hara
		});

		/*** Agregar una leyenda al mapa ***/
		/*
			legend = new cdb.geo.ui.Legend.Custom({
				title: "Tipo de manzana",
				data: [
					{ name: "Tipo 1", value: "#A6CEE3"},
					{ name: "Tipo 2",	value: "#1F78B4"},
					{ name: "Tipo 3",	value: "#B2DF8A"},
					{ name: "Tipo 4",	value: "#33A02C"},
					{ name: "Tipo 5",	value: "#FB9A99"},
					{ name: "Tipo 6",	value: "#E31A1C"},
					{ name: "Tipo 7", value: "#FDBF6F"},
					{ name: "Tipo 8", value: "#FF7F00"}
				]
			});
			$('#map').append(legend.render().el);
		*/

        /*** Agregar un infoWindow ***/
		/*cartodb.vis.Vis.addInfowindow(maps,layer.getSubLayer(2),['cartodb_id','tipomza'] ,{
			infowindowTemplate: $('#infoWindow').html(),
			templateType: 'mustache'
		});*/

		/*** Crear un selector de  capas ***/
		/*$(".subitem").on('click', function(e) {
			var capa = $(this).attr('data-attr');
			var type = $(this).attr('data-layer');
			createSelector(capa,type);
		});*/


        /*** Uso de la  api de sql  combo de delegaciones***/
		/*var sqlExtent = new cartodb.SQL(param);

			sqlExtent.execute("select * from basedel order by nombre asc").done(function(data) {
				for(idx in data.rows){
		            $("<option/>",{"value":data.rows[idx].conse,"text":data.rows[idx].nombre}).appendTo("#dgiCmbDel");
		        }
	        }).error(function(errors) {
	            console.log("errors:" + errors);
	        });

            
	        sqlExtent.execute("select * from basecol order by delegacion asc,nombre asc").done(function(data) {
				$("#dgiCmbCol").html('');
		        $("<option/>",{"value":"","text":""}).appendTo("#dgiCmbCol");
		        for(idx in data.rows){
		            $("<option/>",{"value":data.rows[idx].mslink,"text":data.rows[idx].nombre,"data-deleg":data.rows[idx].delegacion}).appendTo("#dgiCmbCol");
		        }
		        //$("#dgiFlrCol").show();

		        $("#dgiCmbCol option[data-deleg != '1']").hide();
	        }).error(function(errors) {
	            console.log("errors:" + errors);
	        });   
	    */

		btnTools.addTo(maps);//botones que se agrean al mapa
		// btnBaseMap.addTo(maps);//botonesde mapa base que se agrean al mapa
		$(".cartodb-logo").off( "click", "a");
	}).error(function (err) {
		console.log(err);
	});

    /***  Functionalidad de combos uso de la api de sql***/
	/*$("#dgiCmbDel").on("change",function(evt){
		$("#dgiFlrCalle").hide();
		getDelColonia();
	});

	$("#dgiFilterSearch").on("click",function(evt){
		getSearch();
	});*/

	/*$("#dgiFilterSearch").on("click",function(evt){
		maps.getSearch();
	}).bind(maps);*/
});

function createSelector(capa,tipo){
	switch(tipo){
		case 'base':
			base(capa);
			break;
		case 'layer':
			layers(capa);
			break;
	}
}

function layers(capa){
	switch(capa){
		case 'delegaciones_df':
			lyrs.getSubLayer(0).toggle();
			if(maps.hasLayer(sltfeature)){
        		maps.removeLayer(sltfeature);
    		};
			break;
		case 'colonias_ok':
			lyrs.getSubLayer(1).toggle();
			if(maps.hasLayer(sltfeature)){
        		maps.removeLayer(sltfeature);
    		};
			break;
		case 'predios_origin':
			lyrs.getSubLayer(2).toggle();
			if(maps.hasLayer(sltfeature)){
        		maps.removeLayer(sltfeature);
    		};
			break;
		case 'sector_policial':
			lyrs.getSubLayer(3).toggle();
			if(maps.hasLayer(sltfeature)){
        		maps.removeLayer(sltfeature);
    		};
			break;
	}
}

function base(capa){
	switch(capa){
		case 'sinbase':
			objlayerBase.setUrl('');
			objlayerBase.redraw();
			break;
		case 'dia':
			objlayerBase.setUrl('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png');
			objlayerBase.redraw();
			break;
		case 'noche':
			objlayerBase.setUrl('http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png');
			objlayerBase.redraw();
			break;
		case 'satelital':
			objlayerBase.setUrl('https://{s}.maps.nlp.nokia.com/maptile/2.1/maptile/newest/satellite.day/{z}/{x}/{y}/256/jpg?lg=eng&token=A7tBPacePg9Mj_zghvKt9Q&app_id=KuYppsdXZznpffJsKT24');
			objlayerBase.redraw();
			break;
	}
}

function selectFeature(table,sqlfilter){
    if(maps.hasLayer(sltfeature)){
        maps.removeLayer(sltfeature);
    };
    // Get CartoDB selection as GeoJSON and Add to Map
	$.getJSON("https://develop.cartodb.com/api/v2/sql?format=GeoJSON&q=select * from " + table + " where " + sqlfilter, function(data) {
	// $.getJSON("https://finanzasdf.carto.com/u/develop/api/v2/sql?format=GeoJSON&q=select * from " + table + " where " + sqlfilter, function(data) {
    
        sltfeature = L.geoJson(data,{
			style: function (feature) {
				return {color:'#03f',
				weight: 5,
				opacity:0.5,
				fillColor:'#C4C5C6',
				fillOpacity:0.2}
			},
			onEachFeature: function (feature, layers) {

            }
        }).addTo(maps);
        sltfeature.bringToBack();
    });
}

function bounry(param,table,sqlfilter,layer,map) {
	var sqlExtent = new cartodb.SQL(param);
    //regresa la coordenada maxima de mi extend de la geometria
	var sql = "select max(xmax) as xmax,min(xmin) as xmin,max(ymax) as ymax,min(ymin) as ymin from (select ST_Xmax(ST_Extent(the_geom)) as xmax,ST_Xmin(ST_Extent(the_geom)) as xmin,ST_Ymax(ST_Extent(the_geom)) as ymax,ST_Ymin(ST_Extent(the_geom)) as ymin from " + table + " where " + sqlfilter + ") as ext"

	sqlExtent.execute(sql).done(function(data) {
		if (data.rows[0].ymax != '' && data.rows[0].ymin != '' && data.rows[0].xmax && data.rows[0].xmin != '') {
            var southWest = L.latLng(data.rows[0].ymax, data.rows[0].xmin),
            northEast = L.latLng(data.rows[0].ymin, data.rows[0].xmax),
            bounds = L.latLngBounds(southWest, northEast);
            map.fitBounds(bounds);
            //this.selectFeature(table,sqlfilter,layer);
        } else {
            console.log("errors: en la ejecucion del sql en cartodb");
        }
	}).error(function(errors) {
		console.log("errors:" + errors);
	});
}

function getDelColonia(){
    $("#dgiCmbCol option[data-deleg != '"+ $("#dgiCmbDel").val() +"']").hide();
    $("#dgiCmbCol option[data-deleg = '"+ $("#dgiCmbDel").val() +"']").show();
    $("#dgiCmbCol option:first").prop("selected",true);
}

function getSearch (){
	var del = $("#dgiCmbDel").val();
	var col = $("#dgiCmbCol").val();
	var calle = $("#dgiCmbCalle").val();

	if (calle != ""){
		bounry(param,"basecalle","delegacion = "+ del +" and colonia = " + col + " and nombre = '" + calle +"'",lyrs,maps);
	} else if (col != "") {
		bounry(param,"basecol","delegacion = "+ del +" and mslink = " + col,lyrs,maps);
	} else if (del != "") {
		bounry(param,"basedel","conse = "+ del,lyrs,maps);
	}
}

function search(sqlStr,response){
	var jsonData = [];
	var sql = new cartodb.SQL({
		user : 'develop'
	});
	sql.execute(sqlStr).done(function(data) {
		response(data.rows);
	}).error(function(errors) {
		console.log("errors:" + errors);
	});
}
