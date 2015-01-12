Mortgage Manager - Server
=========================

1) npm install

2) Before you start off, ensure that you have execute permissions on app.sh

	sudo chmod -R 777 server/lib/app.sh

3) Install mongo if you haven't already. Follow the instructions in the link [here] (http://docs.mongodb.org/manual/tutorial/install-mongodb-on-os-x/)

4) To start the application - server and mongodb

	grunt start

5) To run unit and integration tests

	grunt test

6) To populate the json files that live in server/lib/db/resources into mongo

	grunt populate

7) For coverage reports

	grunt coverage
