let http_module = require('http');
const port = 8080;
let global_id = 0;
const cookie_name = "tracking_id";

function parseCookies(request) {
    var list = {},
        rc = request.headers.cookie;

    rc && rc.split(';').forEach(function( cookie ) {
        var parts = cookie.split('=');
        list[parts.shift().trim()] = decodeURI(parts.join('='));
    });

    return list;
}

function HandleRequest(request, response) {
    let script = `
    function getCookie(name) {
        var value = "; " + document.cookie;
        var parts = value.split("; " + name + "=");
        if (parts.length == 2) return parts.pop().split(";").shift();
    }

    console.log("script successfuly loaded!");
    if (getCookie("tracking_id")) {
        console.log("Do some action on client!");
    }
    console.log(document.cookie);
    document.cookie = "'tracking_id'=0";`;
    response.writeHead(200, {
        'Set-Cookie': 'server_tracking_id=fingerprint',
        'Content-Type': 'text/javascript',
        'Content-Length': script.length
    });
    let cookies = parseCookies(request);
    if (cookies.server_tracking_id) {
        console.log("Victim visit site:", request.url);
    }

    response.end(script);
}

let server = http_module.createServer(HandleRequest);
server.listen(port, () => {
    console.log("server is listening...");
});
  