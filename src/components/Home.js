import { useMemo } from "react";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";

function Home() {
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: process.env.REACT_APP_API_KEY,
        libraries: ["places"]
    });

    if (!isLoaded) return <div>Loading...</div>
    return <Map />
}

export default Home;

function Map() {
    const center = useMemo (() => ({lat:1.418000, lng: 103.828650}), []);
    return (
        <>
            <GoogleMap 
                zoom={10} 
                center={center} 
                mapContainerClassName="map-container"
            >
                <Marker position={center} />
            </GoogleMap>
        </>
    )
}

