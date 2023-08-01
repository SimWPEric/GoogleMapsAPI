import { useMemo, useState } from "react";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";
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
    const center = useMemo (() => ({lat:1.418000, lng: 103.828650}), []);
    const [selected, setSelected] = useState([]);
    console.log(selected);
    return (
        <>
            <div className="places-container">
                <PlacesAutoComplete setSelected={setSelected} />
            </div>

            <GoogleMap 
                zoom={10} 
                center={center} 
                mapContainerClassName="map-container"
            >
                {selected.map((x) => <Marker position={x} />)} 
            </GoogleMap>
        </>
    )
}

function PlacesAutoComplete( {setSelected } ) {
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
        console.log(`results: ${results}`)
        const {lat, lng} = await getLatLng(results[0]);
        setSelected((list) => [...list, {lat, lng}])
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
