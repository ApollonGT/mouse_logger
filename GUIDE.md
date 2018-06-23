## Description of Mouse Logger flow

Note that this application is for testing - educational purpose and is not to be used as is for a commercial application. A real
life application has to take into account the respective laws and the security of course.
### Flask

Flask is a web application framework for python. Using Flask you can have a python server running the server - side processes, 
including database interaction and serve the HTML/CSS/JS to the client (browser). In any web application, the client is the browser
(unless if there is a native client implemented for the application) and the server is... well... the server. 

### The flow of this application

`app.py`: everything starts from here. When running the flask server, the first thing that happens is the flask to read
this file and see the defined routes. The routs are the paths (utls) that are accepted, and what 
function should run when a request comes to each route.

#### index

```python
@app.route('/', methods=['GET'])
def index():
    global user_id
    user_id = request.values.get('user')
    if not user_id:
        user_id = 1

    return render_template('./index.html', user=user_id)
```

The `index()` function, defined above, will be executed when a `GET` request comes to the
root `/` of the application. What happens here is that the function expects to receive a `user`
parameter during the request `/?user=#` where # is the id of the user. If there is no such value, 
the user_id defaults to 1.

After setting the user_ud parameter, this function returns a rendered template where the 
value of user_id has been passed. This means an html is being sent to the browser (client).


Lets see this template:

```html
<html lang="en">
    <head>
        <meta charset="utf-8">
        <title>Simple Mouse tracker</title>
        <link rel="stylesheet" href="/static/css/styles.css">
    </head>

    <body>
        <div id="main">
            <div id="coordinates">
                <table>
                    <tr>
                        <th >User Id</th>
                        <td>
                            <form target="/" method="GET">
                                <input id="user" name="user" value="{{ user }}"/>
                                <input type="submit" hidden autofocus/>
                            </form>
                        </td>
                    </tr>
                    <tr>
                        <th>x</th><th>y</th>
                    </tr>
                    <tr>
                        <td id="x">-</td><td id="y">-</td>
                    </tr>
                    <tr>
                        <th colspan="2">Window dimensions</th>
                    </tr>
                    <tr>
                        <td id="windim" colspan="2">- x -</td>
                    </tr>
                    <tr>
                        <th colspan="2">Mouse on:</th>
                    </tr>
                    <tr>
                        <td id="mouseon" colspan="2">empty space</td>
                    </tr>
                    <tr>
                        <th colspan="2">Mouse button:</th>
                    </tr>
                    <tr>
                        <td id="mousebutton" colspan="2">NONE</td>
                    </tr>
                    <tr>
                        <th colspan="2">Agent:</th>
                    </tr>
                    <tr>
                        <td id="agent" colspan="2">-</td>
                    </tr>
                </table>
            </div>
            <div id="container">
                <div id="content" data-name="element-1">1</div>
                <div id="content" data-name="element-2">2</div>
                <div id="content" data-name="element-3">3</div>
                <div id="content" data-name="element-4">4</div>
                <div id="content" data-name="element-5">5</div>
                <div id="content" data-name="element-6">6</div>
                <div id="content" data-name="element-7">7</div>
                <div id="content" data-name="element-8">8</div>
                <div id="content" data-name="element-9">9</div>
                <div id="content" data-name="element-10">10</div>
                <div id="content" data-name="element-11">11</div>
                <div id="content" data-name="element-12">12</div>
                <div id="content" data-name="element-13">13</div>
                <div id="content" data-name="element-14">14</div>
                <div id="content" data-name="element-15">15</div>
                <div id="content" data-name="element-16">16</div>
            </div>
        </div>
        <script src="/static/js/jquery.min.js"></script>
        <script src="/static/js/scripts.js"></script>
    </body>
</html>
```

In the header of this template we include a css file `styles.css` where lies the css that defines the style of this page.

In the first part of the `body` we have a table with the information that is being logged. In the form that appears on the first line of the table
we have the `{{ user }}` value, which is the user id passed from the `index()` function during the render of the template.

After this table (we will see later on, how it is filled with the values), we have a `div` with `id="container"` which contains 16 divs with `id="content"`. 
These contents have a `data-name` attribute which will be used to identify each content during the logging.

In the end of the `body` we include two scripts. The one is the well known *jQuery*, which is a JavaScript wrapper and makes JavaScript easier.
The next script is the `scripts.js` which contains all the client side logic and takes care of recording and sending the data back to the server so we can log them in our database.

Lets see these scripts one by one:

```javascript
var idleTime = 0;
var data = {
    x: 0,
    y: 0,
    winX: 0,
    winY: 0,
    mouseon: "empty space",
    agent: "-",
    mouse_button: "NONE"
};
var mustlog = false;
var last_mouseon = "";

var log_data = [];
```

This is where we initialize the data to be used later on. The meaning of each of these data:

|   Variable Name        |     Description                                                                             |
| :--------------------- | :----------------------------------------------------------------------------------------   |
| idleTime               | The time in 0.1sec that the mouse is not moving                                             |
| data.x, data.y         | The mouse coordinates                                                                       |
| data.winX, data.winY   | The browser window dimensions                                                               |
| data.mouseon           | The data-name of the content on which the mouse is on. 'empty space' means no-content       |
| data.agent             | A string with information about the os, browser, ... of the user                            |
| data.mouse_button      | The mouse button status. Possible values: "NONE", "LEFT", "RIGHT", "MIDDLE"                 |
| mustlog                | A flag that defines if the data has to be logged or not. True or False                      |
| last_mouseon           | The content data-name on which the mouse was during the last log                            |
| log_data               | The array of the logged data that will be sent to the server to be saved in the database    |


```javascript
$(document).ready(function(){
    setInterval(logMousePosition, 100);
    setInterval(sendData, 10000);
    ...
```

Everything inside `$(document).ready(function(){...})` will be initialized after the loading of the entire document - html.
This has to be done to ensure that each element has been loaded and is in the browser.

The `setInterval` makes each function to be executed periodically. So the `logMousePosition` function (defined later) will be executed 
every 0.1seconds, while the `sendData` function will be executed every 10seconds.

```javascript
    $('body').mousemove(function(event){
        mustlog = true;
        idleTime = 0;

        data.x = event.pageX;
        data.y = event.pageY;
        data.winX = $(window).width();
        data.winY = $(window).height();
        data.mouseon = $(event.target).attr("data-name");
        data.agent = navigator.userAgent;

        $("#x").html(data.x);
        $("#y").html(data.y);
        $("#windim").html(data.winX+" x "+data.winY);
        $("#agent").html(data.agent);
        if (!data.mouseon) {
            data.mouseon = "empty space";
        }
        if (data.mouseon != "empty space") {
            $("#mouseon").html(data.mouseon)
        } else {
            $("#mouseon").html("empty space");
        }
    });
```

In this part of the code we bind the `mousemove` event on the `body` html element, with the function defined above.
So when the mouse moves we turn the `mustlog` flag to true. This means that something new has happened and we must log it. 
Also the `idleTime` is set to zero since we are not in the idle state anymore. Afterwords the `data` object is being updated with the new mouse position 
information. Thext the html table fields are being updated so we can have visually this information. `$('#x').html(data.x)` means: 
*Find the element with `id="x"` and set its inner html to the value that is stored in `data.x`*. Then we check if the `data.mouseon` has a value. If not, it means 
the mouse was not on one of the elements of interest, so we set the value to 'empty space'. Finally we decide what to write in the `mouseon` field
of the table displayed on the screen.

Lets see the next part of the script:

```javascript
    $('body').mousedown(function(event){
        if (event.which === 1) {
            data.mouse_button = "LEFT";
        } else if (event.which === 2) {
            data.mouse_button = "MIDDLE";
        } else if (event.which === 3) {
            data.mouse_button = "RIGHT"
        } else {
            return;
        }
        $("#mousebutton").html(data.mouse_button);

        // Force log click events
        let copy_data = Object.assign({}, data);
        log_data.push(copy_data);
    });
```

Here we catch the click event of the mouse, on the body element. More specifically the `mousedown` event. What happens here is:

* We save the mouse button status (LEFT, MIDDLE or RIGHT) in the `data.mouse_button`
* We update the table on the screen with this value
* We make a copy of the `data` object so we can store it in our log_data
* We save the copy of the `data` object in the `log_data` array

Note that we have to make the copy, otherwise if we put the data itself in the array, on the next modification of the data, the
array will has the new state, hence we will loose the last saved state.

```javascript
    $('body').mouseup(function(event){
        data.mouse_button = "NONE";
        $("#mousebutton").html(data.mouse_button);
    });
```

Of course, when the mouse button is released, we have to change the `data.mouse_button` to `NONE` and update the respective field in the
table on the screen.

Now, lets see the definition of the functions that are being called periodically because of the `setInterval` we used in the beginning of 
the script.

```javascript
    function logMousePosition() {
        idleTime = idleTime + 1;
        if (idleTime > 2 && mustlog) {
            mustlog = false;
            last_mouseon = data.mouseon;

            // I need to copy so I can modify the initial data
            let copy_data = Object.assign({}, data);
            log_data.push(copy_data);
        }
    }
```

Each time this function is called: 
* It updates the value of `idleTime` with +1. This means the `idleTime` adds 1 each 0.1sec
* When the `idleTime` is more than 2 (at least 0.6 seconds the mouse is not moving) and the `mustlog` is true (this information has not been logged already):
    * we set the `mustlog` to false (so we don't save the same information multiple times)
    * we store the value of `last_mouseon` (so we know where the mouse was wen we stored the data last time)
    * we make a copy of the `data` object
    * we store the copy of `data` in the `log_data` array


And Finally:

```javascript
    function sendData() {
        if (log_data.length > 0) {
            $.ajax({
                type: "POST",
                url: "/api/save",
                data: JSON.stringify(log_data, null, '\t'),
                contentType: 'application/json;charset=UTF-8',
                dataType: 'json'
            });
            log_data = [];
        }
    }
```

Every 10seconds (So we don't keep spamming the server with data), if the `log_data` is not empty:

* We convert the `log_data` array into a json string (using JSON.stringify) 
* We send this string to the server using an AJAX POST request, to the url: `/api/save`
* We empty `log_data` so we start logging new data

Now lets go back to the Flask routes and see what happens when the data arrive to the `/api/save` route:

#### save
#### load
