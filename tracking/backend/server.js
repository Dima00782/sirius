let http_module = require('http');
let url_module = require('url');
const port = 8080;
const cookie_name = "tracking_id";
const trackImg = new Buffer('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64');

function parseCookies(request) {
    let list = {},
        rc = request.headers.cookie;

    rc && rc.split(';').forEach(function(cookie) {
        let parts = cookie.split('=');
        list[parts.shift().trim()] = decodeURI(parts.join('='));
    });

    return list;
}

function HandleRequest(request, response) {
    let cookies = parseCookies(request);
    let query = url_module.parse(request.url, true).query;
    if (cookies.server_tracking_id) {
        console.log("Victim ", query.fingerprint, " visit site: ", query.site_id);
    } else {
        response.setHeader('Set-Cookie', 'server_tracking_id=' + query.fingerprint);
    }

    response.writeHead(200, {
        'Content-Type': 'image/gif',
        'Content-Length': trackImg.length
    });

    response.end(trackImg);
}

let server = http_module.createServer(HandleRequest);
server.listen(port, () => {
    console.log("server is listening...");
});
  