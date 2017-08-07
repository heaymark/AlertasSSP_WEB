var btnTools = L.control({position: 'topleft'}); //metodo de letflex q genera botones boton abajo del zoom
var btnBaseMap = L.control({position: 'bottomleft'}); //Se agrega los mapa base


btnTools.onAdd = function (map) { //
    this._div = L.DomUtil.create('div', 'leaflet-bar'); // create a div with a class "info"
    this._filtro = L.DomUtil.create('a','',this._div);

    this._imgfiltro = L.DomUtil.create('i','',this._filtro);
    this._imgfiltro.setAttribute("class","fa fa-search");
    this._imgfiltro.setAttribute("aria-hidden",true);
    this._imgfiltro.setAttribute("style","margin:6px 8px;");

    L.DomEvent.addListener(this._filtro,'click',this.fnFilter,this);//se le da la accion al boton
    return this._div;
};

btnTools.fnFilter = function () {
    $("#dgiFilter").toggle();
};

btnBaseMap.onAdd = function (map,objmap){
    this._div = L.DomUtil.create('div', 'leaflet-bar leaflet-bar-horizontal'); // create a div with a class "info"
    this._baseCatastro = L.DomUtil.create('a','',this._div);
    this._baseNormal = L.DomUtil.create('a','',this._div);
    this._baseSatelital = L.DomUtil.create('a','',this._div);

    this._imgCatastro = L.DomUtil.create('img','',this._baseCatastro);
    this._imgNormal = L.DomUtil.create('img','',this._baseNormal);
    this._imgSatelital = L.DomUtil.create('img','',this._baseSatelital);

    this._imgCatastro.src = "https://cartodb-basemaps-a.global.ssl.fastly.net/light_nolabels/6/30/24.png";
    this._imgNormal.src = "https://1.base.maps.api.here.com/maptile/2.1/maptile/newest/normal.day/6/30/24/256/png8?lg=eng&token=A7tBPacePg9Mj_zghvKt9Q&app_id=KuYppsdXZznpffJsKT24";
    this._imgSatelital.src = "https://1.aerial.maps.api.here.com/maptile/2.1/maptile/newest/satellite.day/6/30/24/256/jpg?lg=eng&token=A7tBPacePg9Mj_zghvKt9Q&app_id=KuYppsdXZznpffJsKT24";

    $(this._imgCatastro).css("width","24px");
    $(this._imgNormal).css("width","24px");
    $(this._imgSatelital).css("width","24px");

    this._objmap =  objmap;

    L.DomEvent.addListener(this._baseCatastro,'click',function(){this.fnBaseMap("catastro")},this);
    L.DomEvent.addListener(this._baseNormal,'click',function(){this.fnBaseMap("normal")},this);
    L.DomEvent.addListener(this._baseSatelital,'click',function(){this.fnBaseMap("satelital")},this);
    return this._div;
}

btnBaseMap.fnBaseMap = function(base){
    layerBase ="";
    this._map.eachLayer(function(layer){
        if(layer._leaflet_id == 22){
            layerBase = layer;
        }
    });

    switch(base){

        case "catastro":
            layerBase.setUrl('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png');
            layerBase.redraw();
            break;
        case 'normal':
            layerBase.setUrl('https://{s}.base.maps.api.here.com/maptile/2.1/maptile/newest/normal.day/{z}/{x}/{y}/256/png8?lg=eng&token=A7tBPacePg9Mj_zghvKt9Q&app_id=KuYppsdXZznpffJsKT24');
            layerBase.redraw();
            break;
        case 'satelital':
            layerBase.setUrl('https://{s}.maps.nlp.nokia.com/maptile/2.1/maptile/newest/satellite.day/{z}/{x}/{y}/256/jpg?lg=eng&token=A7tBPacePg9Mj_zghvKt9Q&app_id=KuYppsdXZznpffJsKT24');
            layerBase.redraw();
            break;
    }
}
