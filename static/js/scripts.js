var idleTime = 0;
var data = {
    x: 0,
    y: 0,
    winX: 0,
    winY: 0,
    mouseon: "empty space",
    element: {
        top: 0,
        left: 0,
        width: 0,
        height: 0
    },
    agent: "-",
    mouse_button: "NONE"
};
var mustlog = false;
var last_mouseon = "";

var log_data = [];

$(document).ready(function(){
    setInterval(logMousePosition, 100);
    setInterval(sendData, 10000);

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
            data.element.top = 0;
            data.element.left = 0;
            data.element.width = 0;
            data.element.height = 0;
        } else {
            var pos = $(event.target).offset();
            var w = $(event.target).width();
            var h = $(event.target).height();
            data.element.top = pos.top;
            data.element.left = pos.left;
            data.element.width = w;
            data.element.height = h;
        }
        $("#pos").html(data.element.top+" x "+data.element.left);
        $("#dim").html(data.element.width+" x "+data.element.height);
        if (data.mouseon != "empty space") {
            $("#mouseon").html(data.mouseon)
        } else {
            $("#mouseon").html("empty space");
        }
    });

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
        data.mouseon = $(event.target).attr("data-name");
        if (!data.mouseon) {
            data.mouseon = "empty space";
            data.element.top = 0;
            data.element.left = 0;
            data.element.width = 0;
            data.element.height = 0;
        } else {
            var pos = $(event.target).offset();
            var w = $(event.target).width();
            var h = $(event.target).height();
            data.element.top = pos.top;
            data.element.left = pos.left;
            data.element.width = w;
            data.element.height = h;
        }
        $("#mousebutton").html(data.mouse_button);

        // Force log click events
        let copy_data = Object.assign({}, data);
        log_data.push(copy_data);
    });

    $('body').mouseup(function(event){
        data.mouse_button = "NONE";
        $("#mousebutton").html(data.mouse_button);
    });

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
});
