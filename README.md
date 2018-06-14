### Simple mouse logger

An example of how one can log mouse coordinates and the components the mouse hovers on, into a sqlite database.

Based on jQuery for client side tracking. API is implemented with flask and the data is stored in a SQLite database.

#### Usage

* Install Flask (pip install flask)
* Clone this repository
* CD into the cloned folder
* Type: `FLASK_APP=index.py flask run`
* Open a browser and visit: localhost:5000

To see the logged data visit: localhost:5000/api/load
