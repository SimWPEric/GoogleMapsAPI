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
 

function Home() {
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: process.env.REACT_APP_API_KEY,
        libraries: ["places"]
    });

    if (!isLoaded) return <div>Loading...</div>
    return <Map />
}

function Map() {
    const center = useMemo(() => ({ lat: 1.418000, lng: 103.828650 }), []);
    const [selected, setSelected] = useState([]);
    const [directions, setDirections] = useState([]);
    const service = new window.google.maps.DirectionsService();
  
    const generateLabel = (index) => {
      return String.fromCharCode(65 + index);
    };
  
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
  
    return (
      <>
        <div className="places-container">
          <PlacesAutoComplete setSelected={setSelected} />
        </div>
  
        <GoogleMap zoom={10} center={center} mapContainerClassName="map-container">
          {directions &&
            directions.map((dir, index) => (
                <>
                    <DirectionsRenderer 
                        directions={dir} 
                        suppressMarkers={true}
                    />
                    <CustomMarker key={index} position={selected[index]} label={generateLabel(index)} />
                </>
            ))}
          {selected.map((x) => (
            <Marker key={x.lat + x.lng} position={x} />
          ))}
        </GoogleMap>
      </>
    );
  }
  
  const CustomMarker = ({ position, label }) => {
    const markerOptions = {
      label: {
        text: label,
        color: "white",
      },
    };
  
    return <Marker position={position} options={markerOptions} />;
  };

function PlacesAutoComplete( {setSelected } ) {
    const {
        ready,
        value,
        setValue,
        suggestions: {status, data},
        clearSuggestions
    } = usePlacesAutocomplete();
    
    const handleSelect = async (address) => {
        alert(address)
        setValue(address, false);
        clearSuggestions(); 

        // address -> geocode -> lat lng 
        
        const results = await getGeocode( {address} );
        console.log(`results: ${results}`)
        const {lat, lng} = await getLatLng(results[0]);
        setSelected((list) => [...list, {lat, lng}])
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
