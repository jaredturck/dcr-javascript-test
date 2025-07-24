
function fetch_graph_data(q) {
    fetch('/get-bubble-graph-data?' + new URLSearchParams({
        q : q
    })).then(res => {
        if (res.status == 200) {
            return res.json();
        } else {
            return {};
        }
    }).then(data => {
        console.log(data);
        document.getElementById('output').innerHTML = JSON.stringify(data);
    })
}

window.addEventListener('load', e => {
    console.log('loaded script');
    document.querySelectorAll('#graph-form__by-country').forEach(select => {
        select.addEventListener('change', e => {
            console.log(`by country`);
            fetch_graph_data(e.target.value);
        })
    })
})
