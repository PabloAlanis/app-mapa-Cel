//iniciliazion del mapa
var map;
map = L.map('map',{ attributionControl: false,center: [-45.8209,-67.5378],zoom: 11.5,minZoom: 11, maxZoom: 22,zoomControl: true});//.setView([-45.8209,-67.5378],11,5);
var baseLayer = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>',maxZoom: 22,maxNativeZoom:19});
baseLayer.addTo(map);
//baseLayer.on('load',loadGeoJSon);

function localizar(){
  //esto permite geolocalizarse (apiREST)
  map.locate({setView:true,zoom:4,enableHighAccuracy:true});

  function onLocationFound(e) {
    var mkii = L.icon.mapkey({icon:"school",color:'#725139',background:'#f2c357',size:40});
    var radius = e.accuracy / 2;
    L.marker(e.latlng,{icon:mkii}).addTo(map).bindPopup("<h5>Si tu ubicación esta bien presiona sobre el circulo</h5>").openPopup();
    var radio=L.circle(e.latlng,radius,{color:'green'});
    radio.addTo(map);
    radio.on('click',function(e){
      $('#modalCliente').modal('show');
    });
  }

   function onLocationError(e) {
     alert("Debes autorizar la geolocalización");
    }
   map.on('locationfound',onLocationFound);
   map.on('locationerror',onLocationError);
   //esto permite geolocalizarse (apiREST)
}
//fin localizar()

//carga de geoJSON
function loadGeoJSon(){

  function onEachFeature(feature, layer) {
    layer.bindPopup(feature.properties.f1);
    if (feature.properties.f1=="puntoA") {
      layer.setIcon(mki);
    }else {
      layer.setIcon(mkii);
     }
  }

  var mki = L.icon.mapkey({icon:"school",color:'#725139',background:'#f2c357',size:25});
  var mkii = L.icon.mapkey({icon:"eye",color:'#725139',background:'#f2c357',size:40});
  var mapaMongo=$('#datoMongoose').html();
  var layerGroup = L.geoJSON(JSON.parse(mapaMongo), {
    onEachFeature:onEachFeature
  }).addTo(map);
  //evento al pasar sobre un punto
  layerGroup.on("mouseover",function(e){
    var clickedMarker=e.layer;
    clickedMarker.openPopup();
    //$('#modalMarcador').modal('show');
  })
  layerGroup.on("mouseout",function(e){
    //$('#modalMarcador').modal('hide');
  })
  //evento click sobre los marcadores
  layerGroup.on("click", function (e) {
      var clickedMarker = e.layer;
      var datosA=clickedMarker.feature.properties.f1;
      var datosB=clickedMarker.feature.properties.f2;
      $('#modalBodyA').html(datosA);
      $('#modalBodyB').html(datosB);
      $('#modalMarcador').modal('show');
  });
}
//
