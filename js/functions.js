function cmb(evt){
    // evt.preventDefault();
    // evt.stopPropagation();

    // alert(evt.target.value);
    // alert(evt.target.id);
        // $("#aai").attr('checked', true);
 
    switch(evt.target.value){
        case "alertaaltoimpacto":
            lyrs.getSubLayer(7).show();
            lyrs.getSubLayer(6).hide();
            // evt.target.id.attr('checked', true);
            break;
        case "alertabajoimpacto":
            lyrs.getSubLayer(6).show();
            lyrs.getSubLayer(7).hide();
            break;
    }
}

