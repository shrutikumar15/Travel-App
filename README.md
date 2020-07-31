# Travel App
This is the capstone project of the Udacity Front End Developer Nanodegree.


## Project Ovierview
The goal of the project was to build a Travel App that allows users to get weather forecast or prediction for a location and date they have submitted via the app. 
The Geonames API is used to obtain the latitude and longitude of the location.
The Weatherbit API is used to obtain the weather forecast if the selected date is in the next 16 days. Historical data for the selected date is pulled in case it is more than 16 days away to give a prediction of the expected weather.
The Pixabay API is used to display an image of the city. 

The project is created using HTML, CSS and ES6 JavaScript.

### Extended options
An image for the country is pulled from the Pixabay API when the entered location brings up no results (i.e. in case of obscure localities).



## Instructions
Obtain an API key for Geonames API, Weatherbit API and Pixabay API
1. Clone the repo

```
$ git clone https://github.com/shrutikumar15/Travel-App.git
```

2. Navigate to the project root.
```
$ cd Travel-App
```

3. Install dependencies
```
$ npm install
```

4. Create a .env file with Geonames API key, Weatherbit API key and Pixabay API key
Paste the following lines and update your API_ID and API_KEY with yours:
```
apiKEY=*********
WEATHERBIT_API_KEY=********
pixabay_API_KEY=********
```

5. Build dev env.
```
$ npm run build-dev
```

6. In other terminal build prod env.
```
$ npm run build-prod
```

7. Start express server
```
$ cd $PROJECT_ROOT
$ npm start
```

8. Run jest test in other terminal
```
$ cd $PROJECT_ROOT
$ npm run test
```
