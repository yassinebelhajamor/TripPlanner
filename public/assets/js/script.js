$(document).ready(function(){
    
    
var map;
var initialize;
var lt;
var lg;
var lta;
var lga;
var depart;
var arrivee;
var data_max =100;
    
 
var object = jQuery(this),
slider = object.find('.price-slider'),
price_box = object.find('p.caption');
slider.on('slide', function (event, value) {price_box.find('.max').text(value[1]);data_max = value[1]; initialize();	}); 
              
                
$("#x").click(function(){
    
     depart=$("#depart").val();
     arrivee=$("#arrivee").val();
    console.log(arrivee);
    $.ajax({
        
        type: "get",
        url :"https://maps.googleapis.com/maps/api/geocode/json?address="+depart,
        success :function(data){
            
            lt=data.results[0].geometry.location.lat;
            lg=data.results[0].geometry.location.lng;
        

        
        }
        
        
    });
      $.ajax({
        
        type: "get",
        url :"https://maps.googleapis.com/maps/api/geocode/json?address="+arrivee,
        success :function(data){
            
            lta=data.results[0].geometry.location.lat;
            lga=data.results[0].geometry.location.lng;
        

        
        }
        
        
    });
    
        initialize();
    
        
});

    



if(navigator.geolocation)
    {
        navigator.geolocation.getCurrentPosition(showLocation);
    }

function showLocation(position)
{
    lt=position.coords.latitude;
    lg=position.coords.longitude;
    lta=36.859421;
    lga=10.197598;
    initialize();

}


initialize = function(){
    var latLng = new google.maps.LatLng(lt,lg); // Correspond au coordonnées de Lille
    var myOptions = {
        zoom      : 12,
        center    : latLng,
        mapTypeId : google.maps.MapTypeId.TERRAIN, // Type de carte, différentes valeurs possible HYBRID, ROADMAP, SATELLITE, TERRAIN
        maxZoom   : 20
    };

    map      = new google.maps.Map(document.getElementById('map-canvas'), myOptions);
 // get select value   
    
    // ============ cercle ==============
    
    var cercleOptions = {
      map: map,
        center: latLng,
        title: "your position",
        
        radius: Number(data_max)
        
        
    }
    cityCircle = new google.maps.Circle(cercleOptions);
    
    
    //====================================
    
    var marker = new google.maps.Marker({
    position: latLng,
    title:"My position!",
    map : map 
});
     var latLng2 = new google.maps.LatLng(lta,lga);
     var marker2 = new google.maps.Marker({
    position: latLng2,
    title:"My destination!",
    map : map 
});
    
   var directionsService = new google.maps.DirectionsService();
    var directionsDisplay = new google.maps.DirectionsRenderer({
        'map': map
    });
    
    var request = {
        origin : latLng,
        destination : latLng2,
        travelMode: google.maps.DirectionsTravelMode.DRIVING,
        unitSystem: google.maps.DirectionsUnitSystem.METRIC
    };
    
    directionsService.route(request,function(response,status){
        if(status == google.maps.DirectionsStatus.OK){
            
            directionsDisplay.setDirections(response);
            directionsDisplay.suppressMarkers = false;
            directionsDisplay.setOptions({
                polylineOptions: {strokeColor: '#0000FF'},
                preserveViewport : true
            });
        }
    });
    
    

};


});













