### Client Setup

##### Setup Process:

Install NPM dependencies: ```npm install```

Build client side code:

* For local development: ```grunt```
* For deployment: ```grunt deployment``

Start the NGINX server: ```grunt start```

The local server will be running on ```localhost:9991```

To access the welcome page go to: ```localhost:9991/#/welcome```

##### Grunt tasks:

* ```grunt``` : Build target directory.
* ```grunt deployment```: Build target and deployment directories. Deployment has javascript files minified and CSS files concatenated.
* ```grunt watch:less```: Watch LESS files.
* ```grunt watchify``` : Watch JSX files.
* ```grunt fuckYoTests``` : Self explanatory.
* ```grunt jest```: Run unit tests.
* ```grunt start``` : Start NGINX server.
* ```grunt stop``` : Stop NGINX server.
* ```grunt restart``` : Restart NGINX server.

