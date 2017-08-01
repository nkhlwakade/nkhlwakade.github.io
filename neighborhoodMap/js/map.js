// key = AIzaSyAtt6iRuzA4opWq4fS7at0TRPrNJtM7LQA
var map, infowindow;


var hotelInfo = [
        {
            name : "Del Posto",
            location : {lat: 40.74353929999999, lng: -74.00794830000001},
            fs_id : "4533d338f964a5208f3b1fe3"
        },
        {
            name : "Russ & Daughters Cafe",
            location : {lat: 40.7196729, lng: -73.9896809},
            fs_id : "5244bd0e11d2d511de3e244e"
        },
        {
            name : "Blue Hill",
            location : {lat: 40.7320465, lng: -73.99966849999998},
            fs_id : "3fd66200f964a52078e31ee3"
        },
        {
            name : "Gramercy Tavern",
            location : {lat: 40.7384555, lng: -73.9885064},
            fs_id : "3fd66200f964a520aee91ee3"
        },
        {
            name : "Spice Symphony",
            location : {lat: 40.75586879999999, lng: -73.9715473},
            fs_id : "4bb245d92397b71337ca36b3"
        },
        {
            name : "Gabriel Kreuther",
            location : {lat: 40.754538, lng: -73.98250280000002},
            fs_id : "5552087d498eb30c149f785a"
        },
        {
            name : "Eleven Madison Park",
            location : {lat: 40.741726, lng: -73.98717299999998},
            fs_id : "457ebeaaf964a5203f3f1fe3"
        },
        {
            name : "Le Bernardin",
            location : {lat: 40.7615691, lng: -73.98180479999996},
            fs_id : "3fd66200f964a52066e31ee3"
        }
];


      function initMap() {
        // Constructor creates a new map - only center and zoom are required.
        map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: 40.7447587, lng: -73.9932811},
          zoom: 13
        });

        google.maps.event.addDomListener(window, "resize", function() {
            var center = map.getCenter();
            google.maps.event.trigger(map, "resize");
            map.setCenter(center);


            if (window.matchMedia('(max-width:767px)').matches)
            {
                // do functionality on screens smaller than 768px
                document.getElementById("wrapper").classList.remove('toggled');
            }
        });

    infowindow = new google.maps.InfoWindow({
        maxWidth: 100,
        content: ""
      });

  // Close infowindow when clicked elsewhere on the map
  map.addListener("click", function(){
    infowindow.close(infowindow);
  });

    // Bounce effect on marker
  function toggleBounce(marker) {
    if (marker.getAnimation() !== null) {
      marker.setAnimation(null);
    } else {
      marker.setAnimation(google.maps.Animation.BOUNCE);
      setTimeout(function() {
        marker.setAnimation(null);
      }, 700);
    }
  };


// ViewModel is here
var ViewModel = function (){
    var self = this;

    this.hotelList = ko.observableArray([]);

    hotelInfo.forEach(function(hotelItem){
        self.hotelList.push(new Hotel(hotelItem));
    });

    self.hotelList().forEach(function(hotelItem){
        var marker = new google.maps.Marker({
            map: map,
            position: hotelItem.location,
            animation: google.maps.Animation.DROP
        });
        hotelItem.marker = marker;
        // Create an onclick event to open an infowindow and bounce the marker at each marker
        marker.addListener("click", function(e) {
        map.panTo(this.position);
        //pan down infowindow by 200px to keep whole infowindow on screen
        map.panBy(0, -100)
        //infowindow.setContent(getContent(space));
        infowindow.setContent(hotelItem.name);
        infowindow.open(map, marker);
        toggleBounce(marker);
    });
    });

    // Creating click for the list item
    this.itemClick = function (space) {
      var markerId = space.markerId;
      google.maps.event.trigger(space.marker, "click");
    }

    // Filtering the Space list
    self.filter = ko.observable("");

    this.filteredSpaceList = ko.dependentObservable(function() {
      var query = this.filter().toLowerCase();
      //var self = this;
      if (!query) {
      // Return self.spaceList() the original array;
      return ko.utils.arrayFilter(self.hotelList(), function(item) {
        item.marker.setVisible(true);
        return true;
      });
      } else {
        return ko.utils.arrayFilter(this.hotelList(), function(item) {
          if (item.name.toLowerCase().indexOf(query) >= 0) {
          return true;
          } else {
            item.marker.setVisible(false);
          return false;
          }
        });
      }
    }, this);

};


var Hotel = function (data){
    this.name = data.name;
    this.location = data.location;
    this.fs_id = data.fs_id;
    this.marker="";
}

ko.applyBindings(new ViewModel());
}