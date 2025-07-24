
async function fetch_graph_data(q) {
    return fetch('/get-bubble-graph-data?' + new URLSearchParams({
        q : q
    })).then(res => {
        if (res.status == 200) {
            return res.json();
        } else {
            return {};
        }
    }).then(data => {
        return data;
    })
}

let bubble_chart; // define in global scope

function load_bubble_chart(q) {
    fetch_graph_data(q).then(json_data => {

        // Create the graph
        if (bubble_chart) {
            bubble_chart.destroy();
        }
        Chart.register(ChartDataLabels);

        let max_value = json_data.max_value;
        let graph_data = json_data.data.map((row, index) => ({
            x: index,
            y: (row.value / max_value),
            r: (row.value / max_value) * 20,
            label: (row.value / max_value > 0.4) ? `${row.code}\n${row.value}`  : ''
        }));

        let graph_config = {
            type: 'bubble',
            data: {
                datasets: [{
                    label: 'country',
                    data: graph_data,
                    backgroundColor: 'cyan'
                }]
            },
            options: {
                plugins: {
                    datalabels: {
                        align: 'center',
                        anchor: 'center',
                        color: 'black',
                        font: {
                            weight: 'bold'
                        },
                        formatter: function(value, context) {
                            return value.label;
                        }
                    }
                }
            },
            plugins: [ChartDataLabels]
        };

        const ctx = document.getElementById('bubble-chart').getContext('2d');
        bubble_chart = new Chart(ctx, graph_config);
        document.querySelector('#graph-form__by-country').value = q;

        // Create the table
        document.querySelectorAll('#data-table tbody').forEach(table => {
            table.innerHTML = '';
            json_data.data.forEach(row => {
                tr = document.createElement('tr');
                tr.innerHTML = `<td>${row.code}</td><td>${row.value}</td>`;
                table.appendChild(tr);
            })
        })

    });

}

window.addEventListener('load', e => {
    console.log('loaded script');
    document.querySelectorAll('#graph-form__by-country').forEach(select => {
        select.addEventListener('change', e => {
            console.log(`by country`);
            load_bubble_chart(e.target.value);
        })
        // load the graph on page load
        load_bubble_chart(1);
    })
})
