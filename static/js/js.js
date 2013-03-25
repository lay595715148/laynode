$(document).ready(function() {
    $("#form input[name=authorize]").click(function() {
        $("#form").prop("action","./authorize");
        $("#form input[name=action]").prop("value","./authorize");
    });
    $("#form input[name=token]").click(function() {
        $("#form").prop("action","./token");
        $("#form input[name=action]").prop("value","./token");
    });
    $("#form input[name=resource]").click(function() {
        $("#form").prop("action","./resource");
        $("#form input[name=action]").prop("value","./resource");
    });
    $("#form input[name=logout]").click(function() {
        $("#form").prop("action","./logout");
        $("#form input[name=action]").prop("value","./logout");
    });
    $("#form input[name=change]").click(function() {
        var m = $("#form").prop("method");
        if(m == "get") {
            $("#form").prop("method","post");
            $("#form input[name=change]").prop("value","post");
        } else {
            $("#form").prop("method","get");
            $("#form input[name=change]").prop("value","get");
        }
    });
});
