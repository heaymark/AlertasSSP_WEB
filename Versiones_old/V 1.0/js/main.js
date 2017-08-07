// Se obtiene del viz  que se muestra en el json  asi como los param base
var capaBase = 'http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png';

var paramBase = {
    minZoom: 0,
    maxZoom: 18,
    subdomains: "1234", //tiles (imagenes que completan la capa base)
    attribution: "&copy;2017 HERE <a href='http://here.net/services/terms' target='_blank'>Terms of use</a>"
};

//parametros leafleft (cliente ligero)
//Se obtiene del viz o se  puede agreagar los zoom personales
var paramMapBase = {
	//las coordenadas se pueden consultar en maps en  @122322,15z
    center: new L.LatLng(19.33123050921937,-99.09942626953125),
    zoom: 10,
    minZoom: 0, 
    maxZoom: 15    
};

//DIV DONDE SE RENDERIZARA MAPA
var map = 'maps';
//usuario de la cuenta de carto
var user ={
    user: 'develop'    
};

//namedmap o en su caso un link
//Primera forma de cargar el viz
var viz = "https://finanzasdf.carto.com/u/develop/api/v2/viz/6fe02154-7fef-470b-8ef2-8463e076c672/viz.json";
//Segunda forma de cargar el viz 
/*var viz = {
			user_name: 'datasig',//usuario
			type: 'namedmap',//tipo
			named_map: { //nombre del namemap
				name: 'datamap',
				layers: [
					{ layer_name: "guarderias"},
					{ layer_name: "educacion_superior"},
					{ layer_name: "educacion_media"},
					{ layer_name: "educacion_basica"},
					{ layer_name: "hoteles"},
					{ layer_name: "barrios_magicos"},
					{ layer_name: "restaurantes"},
					{ layer_name: "mercado"},
					{ layer_name: "comercio"},
					{ layer_name: "industria"},
					{ layer_name: "administraciones_tributarias"},
					{ layer_name: "centros_de_servicio_de_la_tesoreria"},
				]
			}
	};
*/  
//FIN DE PARAMETROS BASICOS PARA NUESTRA LIBRERIA

var objMap = new cdmxCarto(capaBase,viz,map,user,paramBase,paramMapBase);    

var callBack = function(layer){};

objMap.renderMap(callBack);