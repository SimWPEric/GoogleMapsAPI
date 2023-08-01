import { useMemo, useState, useEffect } from "react";
import { GoogleMap, useLoadScript, Marker, DirectionsRenderer} from "@react-google-maps/api";
import usePlacesAutocomplete, {getGeocode, getLatLng} from "use-places-autocomplete";
import {
	Combobox,
	ComboboxInput,
	ComboboxPopover,
	ComboboxList,
	ComboboxOption,
	ComboboxOptionText,
} from "@reach/combobox"; // to display results and user input 
import "@reach/combobox/styles.css";

function calculateTotalDistance(directions) {
  let totalDistance = 0;
  for (const dir of directions) {
    const route = dir.routes[0];
    for (const leg of route.legs) {
      totalDistance += leg.distance.value;
    }
  }
  return totalDistance;
}
 
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
    const [selected, setSelected] = useState([]); // contains {lat, lng}
    const [directions, setDirections] = useState([]);
    const [locations, setLocations] = useState([]); // contains address name 
    const service = new window.google.maps.DirectionsService();
  
    useEffect(() => {
      for (let i = 0; i < selected.length - 1; i++) {
        const from = selected[i];
        const to = selected[i + 1];
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
    }, [selected.length]);

    const handleSelectLocation = async (address) => {
        setZoom(12)
        setTimeout(() => {
            setZoom(15); 
        }, 700);
        const results = await getGeocode( {address} );
        const {lat, lng} = await getLatLng(results[0]);
        setCenter({lat, lng});
    }
    
    return (
      <>
        <div className="places-container">
          <PlacesAutoComplete setSelected={setSelected} setLocations={setLocations} />
        </div>

        <div className="location-container">
            <div className="location-container-distance">
              {`Total distance: ${(calculateTotalDistance(directions) / 1000).toFixed(2)} km`}
            </div>
            {locations.map((locationName, index) => (
                <div className="location-container-item" onClick={() => handleSelectLocation(locationName)}>
                    {locationName}
                </div>
            ))}
        </div>
  
        <GoogleMap zoom={zoom} center={center} mapContainerClassName="map-container">
          {directions &&
            directions.map((dir, index) => (
                <>
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
                </>
            ))}
          {selected.map((x, index) => (
            <Marker 
              key={index} 
              position={x} 
              label={{
                text: String.fromCharCode(65 + index),
                color: "white"
              }}
            />
          ))}
        </GoogleMap>
      </>
    );
  }

function PlacesAutoComplete( {setSelected, setLocations } ) {
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

        // address -> geocode -> lat lng 
        
        const results = await getGeocode( {address} );
        const {lat, lng} = await getLatLng(results[0]);
        setSelected((list) => [...list, {lat, lng}])

        setValue("") 
        setLocations((list) => [...list, address])
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
