let map;
let marker; // Declare marker variable outside initMap

async function initMap() {
  const toronto = { lat: 43.7, lng: -79.42 };
  const { Map } = await google.maps.importLibrary("maps");
  const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
  //   console.log({ Marker });
  // The map, centered at Toronto
  if (document.getElementById("map") === null) {
    // If there is no map element on the html,
    // Skipp running the rest of the function to prevent creating map and autocomplete
    return;
  }
  map = new Map(document.getElementById("map"), {
    zoom: 10,
    center: toronto,
    mapId: "f2bac5115a0fbd9",
  });
  console.log(map);
  try {
    marker = new AdvancedMarkerElement({
      map,
      position: toronto,
      title: "Toronto",
    });
  } catch (error) {
    console.log(error);
  }

  //   console.log(newMarker);
  // autocomplete code starts
  const input = document.getElementById("searchBar");
  const autocomplete = new google.maps.places.Autocomplete(input);

  autocomplete.addListener("place_changed", handlerPlaceChange);

  async function handlerPlaceChange() {
    const place = autocomplete.getPlace();
    if (!place.geometry || !place.geometry.location) {
      console.log("No location found for the selected place.");
      return;
    }

    console.log("Place changed");
    console.log(place.geometry.location.lat());
    console.log(place.geometry.location.lng());
    console.log(place);
    let newPlace = {
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng(),
    };

    // Update the marker's position
    map.setCenter(newPlace);
    map.setZoom(15);

    // Update the marker's position
    console.log("marker on change", marker);
    // marker.setPosition(newPlace);
    try {
      // remove previous marker
      marker.setMap(null);
      // create a new marker
      marker = new AdvancedMarkerElement({
        map,
        position: newPlace,
      });
    } catch (error) {
      console.log(error);
    }
  }
  // autocomplete code ends
}

window.addEventListener("load", (event) => {
  try {
    initMap();
  } catch (error) {
    console.error("error in initmap", error);
  }
});
