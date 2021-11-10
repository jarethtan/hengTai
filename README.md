# hengtai
A website for a residential property developer to archive past projects and display the company's informaton

## Table of Content
* [General Information](#general-information)
* [Key Functions](#key-functions)
* [Technologies](#technologies)
* [Project Description](#project-description)
* [Project Status](#project-status)
* [Setup](#setup)

## General Information

This website was created to store information and images of past residential development projects for a construction company using CRUD functionality. Besides providing a service to a client, creating this website enable the developer to practice HTML, CSS and JS skillset. Throughout the development process, technologies such as MongoDB, Express and various other packages have been utilise to meet the clients requirements. At completion, the project used close to 20 packages and took approximately 1.5 months to complete. 

## Key Functions
The website key functions are as follows:
1.  User login, logout and register with authentication functionality.
2.  CRUD finctionality for each residential property in the archive. Each property is a thumbnail in the index page and displayed as a point in a cluster map.
3.  Image upload and display using cloudinary with image transformation and upload limit.
4.  Search bar function to search for residential property in the archive.
5.  A home page carousel with CRUD functionality to create new carousel to provide information on new development in the company.
6.  A details page to display information of each individual residential property. 
7.  Layout of webpage is configured to accomodate different devices from mobile to laptop.
8.  Input information validation

## Technologies
1. mongoDB v4.6
2. mongoose v6.0.5
3. express v4.17
4. Bootstrap 5
5. ejs-mate v3
6. ejs v3.1.6
7. passport v0.5.0
8. passport-local v1.0.0
9. passport-local-mongoose v6.1.0
10. joi v17.4.2
11. helmet v4.6.0
12. multer v1.4.3
13. mapbox/mapbox-gl-geocoder v^4.7.4
14. mapbox/mapbox-sdk v0.13.2
15. cloudinary v1.27.0
16. connect-flash v0.1.1
17. express-session v1.17.2

## Project Description
The general idea of the project is to create a webpage to deposit information of past projects into a database and display the information when requested. The aim is to create and intuitive any simple design for the user to navigate around and use. The choice of database use is mongoDB hence mongoose is used to specify the model schema requirement for each collection in mongo. One of the key function required in this website is for user to create new properties and deposit into the database themselves. They must also be able to update and delete any entry the user desire. For this, the project utilises CRUD functionality. As an additional the project also included a carousel homepage to display the company motto, logo and message. The carousel was decided because user are able to insert their own new events (via CRUD) and viewers are able to view latest news and development of the company be simple swiping the carousel. For rendering the webpage, EJS is used due to it compatibility with Javascript. As for image handling, the project uses cloudinary to store and dispaly image. However transforming of imagse was not done in cloudinary service but with a separate custom function (resizing.js).Lastly, helmet is used for basic security measures of the website.

1. Main file with required packaged are situated in app.js file. 
2. The route handler for each CRUD function are in the routes folder. 
3. The controller folder details the function/logic of each CRUD route.
4. The views folders consist of all the ejs files to be rendered to the browser.
5. The model folder consist of the property, user and carousel modelSchema used for mongoose. The model details what fields are required for each schema.
6. Viewers can ignore the seeds folder. It is used during development to generate random properties to test webpage functionality.
7. Utility folder consist the function for handling for async and non-async errors. Error handler can be found at the bottom of app.js file.
8. Middleware folders consist of all the middleware being used in the route handler. Middlewares include input validation (property, user and carousel), login and authorisation.
9. Public folder consists of the following:
  - All static images used in the project
  - JS files used for the project such as clustermap, validate form, eventselectors and etc.
  - stylesheets of the project
10. Cloudinary folder consists of the cloudinary configuration (index.js). The folder also has a image resizing function for cloudinary (resizing.js)

## Project Status
The project status is ready for deployment. The project have been deployed in Heroku and functionality have been tested in multiple types of browser such as Chrome and Microsoft Edge.

## Setup
1. Ensure to have node.js
2. Run app.js in main folder
3. Project have been launch in Heroku (http://stark-inlet-18272.herokuapp.com/home)
