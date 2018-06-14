var idleTime = 0;
var data = {
    x: 0,
    y: 0,
    winX: 0,
    winY: 0,
    mouseon: ""
};
var mustlog = false;
var last_mouseon = "";

var log_data = [];

$(document).ready(function(){
    setInterval(logMousePosition, 200);
    setInterval(sendData, 10000);

    $('body').mousemove(function(event){
        mustlog = true;
        idleTime = 0;

        data.x = event.pageX;
        data.y = event.pageY;
        data.winX = $(window).width();
        data.winY = $(window).height();
        
        $("#x").html(data.x);
        $("#y").html(data.y);
        $("#windim").html(data.winX+" x "+data.winY);
        if ($(event.target).attr('data-name')) {
            data.mouseon = $(event.target).attr("data-name");

            $("#mouseon").html($(event.target).attr("data-name"))
        } else {
            $("#mouseon").html("empty space");
            data.mouseon = "";
        }
    });

    function logMousePosition() {
        idleTime = idleTime + 1;
        if (idleTime > 5 && mustlog &&
            data.mouseon != "empty space" && data.mouseon != "" &&
            data.mouseon != last_mouseon) {
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
