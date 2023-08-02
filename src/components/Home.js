import { useState, useEffect } from "react";
import { GoogleMap, useLoadScript, Marker, DirectionsRenderer} from "@react-google-maps/api";
import usePlacesAutocomplete, {getGeocode, getLatLng} from "use-places-autocomplete";
import {
	Combobox,
	ComboboxInput,
	ComboboxPopover,
	ComboboxList,
	ComboboxOption
} from "@reach/combobox"; // to display results and user input 
import "@reach/combobox/styles.css";
 
function Home() {
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: process.env.REACT_APP_API_KEY,
        libraries: ["places"]
    });

    if (!isLoaded) return <div>Loading...</div>
    return <Map />
}

function Map() {
    const [center, setCenter] = useState({ lat: 1.3521, lng: 103.8198 });
    const [zoom, setZoom] = useState(12);
    const [markers, setMarkers] = useState([]); // {address: address, latlng: {lat, lng}}
    const [directions, setDirections] = useState([]);
    const service = new window.google.maps.DirectionsService();
  
    useEffect(() => {
      setDirections([])
      for (let i = 0; i < markers.length - 1; i++) {
        const from = markers[i].latlng;
        const to = markers[i + 1].latlng;
        service.route(
          {
            origin: from,
            destination: to,
            travelMode: window.google.maps.TravelMode.DRIVING
          },
          (result, status) => {
            if (status === "OK" && result) {
              setDirections((list) => [...list, result]);
            }
          }
        );
      }
    }, [markers.length]);

    const handleSelectLocation = async (marker) => {
        setZoom(12)
        setTimeout(() => {
            setZoom(15); 
        }, 700);
        setCenter(marker.latlng);
    }

    const calculateTotalDistance = (directions) => {
      let totalDistance = 0;
      for (let dir of directions) {
        totalDistance += dir.routes[0].legs[0].distance.value;
      }
      return totalDistance;
    }
    
    return (
      <>
        <div className="places-container">
          <PlacesAutoComplete setMarkers={setMarkers}/>
        </div>

        <div className="location-container">
            <div className="location-container-distance">
              {`Total distance: ${(calculateTotalDistance(directions) / 1000).toFixed(2)} km`}
            </div>
            {markers.map((marker, index) => (
                <div className="location-container-item" onClick={() => handleSelectLocation(marker)}>
                    {marker.address}
                </div>
            ))}
        </div>
  
        <GoogleMap zoom={zoom} center={center} mapContainerClassName="map-container">
          {directions && directions.map((dir, index) => (
            <DirectionsRenderer 
              directions={dir} 
              options={{
                suppressMarkers: true,
                polylineOptions: {
                    strokeColor: "blue",
                    strokeOpacity: 0.8,
                    strokeWeight: 3
                }
              }}
            /> 
          ))}
          {markers.map((x, index) => (
            <Marker 
              key={index} 
              position={x.latlng}
              label={{
                text: String.fromCharCode(65 + index),
                color: "white"
              }}
              // icon={"http://maps.google.com/mapfiles/ms/icons/green-dot.png"}
            />
          ))}
        </GoogleMap>
      </>
    );
  }

function PlacesAutoComplete( { setMarkers } ) {
    const {
        ready,
        value,
        setValue,
        suggestions: {status, data},
        clearSuggestions
    } = usePlacesAutocomplete();
    
    const handleSelect = async (address) => {
        setValue(address, false);
        clearSuggestions(); 
        const results = await getGeocode( {address} );
        const {lat, lng} = await getLatLng(results[0]);
        setMarkers((list) => [...list, {address: address, latlng: {lat, lng}}])
        setValue("") 
    }

    return (
      <Combobox onSelect={handleSelect}>
          <ComboboxInput 
              value={value} 
              onChange={e => setValue(e.target.value)} 
              disabled={!ready}
              className="combobox-input"
              placeholder="Search an address"
          />
          <ComboboxPopover>
              <ComboboxList>
                  {status === "OK" && data.map(({place_id, description}) => 
                      <ComboboxOption 
                        key={place_id}
                        value={description}
                      />
                  )}
              </ComboboxList>
          </ComboboxPopover>
      </Combobox>
    )
}

export default Home;
