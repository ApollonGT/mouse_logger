var idleTime = 0;
var data = {
    x: 0,
    y: 0,
    winX: 0,
    winY: 0,
    mouseon: "empty space",
    agent: "-"
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
        }
        if (data.mouseon != "empty space") {
            $("#mouseon").html(data.mouseon)
        } else {
            $("#mouseon").html("empty space");
        }
    });

    function logMousePosition() {
        idleTime = idleTime + 1;
        if (idleTime > 2 && mustlog) {
            console.log("logging");
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
