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

