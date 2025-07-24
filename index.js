// Use the command "node index.js" to start the server on localhost

const http = require('http');
const fs = require('fs');
const url = require('url');

function read_static_file(req, res, path, mime_type, status_code = 200) {
    fs.readFile(path, function(err, data) {
        res.writeHead(status_code, {'content-Type' : mime_type});
        res.end(data);
    });
    return res;
}

function fetch_bubble_chart_data(res, q) {
    let data = JSON.parse(fs.readFileSync('data/countries.json'));
    output_json = JSON.stringify({'success' : true})

    let output_array = []
    data.forEach(country => {
        let country_stats = {
            1 : country.population,
            2 : country.borders.length,
            3 : country.timezones.length,
            4 : country.languages.length
        }

        output_array.push({
            'code' : country.alpha3Code,
            'value' : country_stats[q]
        })
    })
    res.writeHead(200, {'content-Type' : 'application/json'});
    res.end(JSON.stringify(output_array));
}

http.createServer(function (req, res) {
    let url_obj = new URL(req.url, `http://${req.headers.host}`);

    if (url_obj.pathname == '/styles.css') {
        read_static_file(req, res, 'static/styles.css', 'text/css');
    } else if (url_obj.pathname == '/script.js') {
        read_static_file(req, res, 'static/script.js', 'text/javascript');
    } else if (url_obj.pathname == '/get-bubble-graph-data') {
        fetch_bubble_chart_data(res, url_obj.searchParams.get('q'));
    } else if (url_obj.pathname == '/') {
        read_static_file(req, res, 'templates/main.html', 'text/html');
    } else {
        read_static_file(req, res, 'templates/404.html', 'text/html', status_code = 404);
    }
}).listen(8000);
