# React Google Maps Directions App

Deployed website: https://g-maps.vercel.app

![image](https://github.com/SimWPEric/GoogleMapsAPI/assets/122194518/1e16ea65-2e41-4ee6-a378-373955b2825b)

This is a React web application that allows users to select multiple locations and get driving directions between them using the Google Maps API. The app uses the @react-google-maps/api library for map rendering and the use-places-autocomplete library for location autocomplete functionality.

## Features

Search and select multiple locations using the Places Autocomplete feature.
Display markers on the map for the selected locations.
Show driving directions between consecutive selected locations on the map.

## Prerequisites

Before running the application, make sure you have the following:

Node.js and npm installed on your system.
Google Maps API key. You can obtain it from the Google Cloud Console.
Getting Started

Follow the steps below to set up and run the application:

Clone this repository to your local machine.
`git clone <repository-url>`

Navigate to the project directory.
`cd react-google-maps-directions-app`

Install the dependencies.
`npm install`

Create a .env file in the project root and add your Google Maps API key.
`REACT_APP_API_KEY=YOUR_GOOGLE_MAPS_API_KEY`

Start the development server.
`npm start`

Open your browser and visit http://localhost:3000 to see the application running.

## Usage

Search for a location: Type the name or address of a location in the search box, and the app will suggest matching locations based on the input.
Select locations: Click on a suggestion to select a location. You can select multiple locations to get driving directions between them.
View driving directions: After selecting multiple locations, the app will display driving directions on the map between consecutive locations. Markers labeled with letters (A, B, C, ...) represent each selected location.

## Built With

React - JavaScript library for building user interfaces.
@react-google-maps/api - Library for integrating Google Maps into React applications.
use-places-autocomplete - Library for implementing Places Autocomplete functionality.
@reach/combobox - Library for creating accessible combobox dropdowns.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

Thanks to the creators and maintainers of the @react-google-maps/api, use-places-autocomplete, and @reach/combobox libraries for their valuable contributions to the project.
Notes

This project is a demonstration of integrating Google Maps functionality into a React application and is not intended for production use without further development and improvements.
Make sure to follow the Google Maps API usage policies and billing requirements when deploying the application to production.
