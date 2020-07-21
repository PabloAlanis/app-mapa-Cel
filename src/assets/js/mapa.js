//iniciliazion del mapa
var map;
map = L.map('map',{ attributionControl: false,center: [-45.8209,-67.5378],zoom: 11.5,minZoom: 11, maxZoom: 22,zoomControl: true});//.setView([-45.8209,-67.5378],11,5);
var baseLayer = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>',maxZoom: 22,maxNativeZoom:19});
baseLayer.addTo(map);
//baseLayer.on('load',loadGeoJSon);

function localizar(){
  //esto permite geolocalizarse (apiREST)
  map.locate({setView:true,maxZoom:17,enableHighAccuracy:true});

  function onLocationFound(e) {
    $('#botonLocalizar').attr("disabled", true); //deshabilito boton localizar
    Swal.fire({
    position: 'top-end',
    customClass:'swalModal',//busca en css
    icon: 'success',
    backdrop:false,
    title: 'Hola, si es correcta la ubicacion presiona el circulo verde',
    showConfirmButton: false,
    timer: 3000
    })
    var mkii = L.icon.mapkey({icon:"smartphone",color:'#FFFFFF',background:'#69b777',size:70,opacity:0.8});
    //var radius = e.accuracy / 2;
    var icono = L.marker(e.latlng,{icon:mkii}).addTo(map).bindPopup("<h5>Si tu ubicación esta bien presiona sobre el circulo, si no presiona afuera</h5>").openPopup();
    icono.addTo(map);
    //var radio=L.circle(e.latlng,radius,{color:'#218838', border:'#218838'});
    //radio.addTo(map);
    icono.on('click',function(e){
      //$('#modalCliente').modal('show');
      //
      Swal.mixin({
  input: 'text',
  backdrop:false,
  confirmButtonText: 'Next &rarr;',
  showCancelButton: true,
  progressSteps: ['1', '2', '3']
}).queue([
  {
    title: 'Question 1',
    text: 'Chaining swal2 modals is easy'
  },
  'Question 2',
  'Question 3'
]).then((result) => {
  if (result.value) {
    const answers = JSON.stringify(result.value)
    Swal.fire({
      title: 'All done!',
      backdrop:false,
      html: `
        Your answers:
        <pre><code>${answers}</code></pre>
      `,
      confirmButtonText: 'Lovely!'
    })
  }
})
      //
    });
    map.on('click',function(e){
      $('#botonLocalizar').attr("disabled", false);
      //radio.remove(map);
      icono.remove(map);

    });
  }

   function onLocationError(e) {
     Swal.fire({
     position: 'top-end',
     customClass:'swalModal',//busca en css
     icon: 'error',
     backdrop:false,
     title: 'Tenes que activar la localización',
     showConfirmButton: false,
     timer: 3000
     })
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
