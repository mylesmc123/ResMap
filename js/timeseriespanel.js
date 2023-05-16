function toggleTimeseriesPanel() {
    // turn off panel
    if (document.getElementById("timeseriespanel").style.visibility == "visible") {
        // console.log('hide timeseries panel');
        document.getElementById("timeseriespanel").style.visibility = "hidden"
    } else {
        var ts_panel = document.getElementById("timeseriespanel")
        // turn on panel
       ts_panel.style.visibility = "visible"
        // get timeseries json data
        fetch(`../data/westPark/timeseries/timeseries.json`)
        .then(response => response.json())
        .then(data => {
            // console.log(data)
            // console.log(Object.keys(data));
            // for each event, create plotly trace
            var tracedata = [];
            innerHTMLtext = ts_panel.innerHTML
            Object.keys(data).forEach(key => {
                // console.log(key, data[key]);
                console.log(key);
                console.log(ts_panel);
                innerHTMLtext +=
                    `<dt class="row" style="background:#AB2706;display: inline-block;width:16px;height:16px;"></dt>` +
                    `<dd class="row" style="display: inline-block;font-size:16px;margin-bottom:0;">${key}</dd><br></br>`

            ts_panel.innerHTML = innerHTMLtext


                // var values = data[key][name].map(d => d.values);
                // var times = data[key][name].map(d => d.datetime);
                // // console.log(times);
                // var trace =
                // {
                //     x: times,
                //     y: values,
                //     yaxis: 'WSE (ft)',
                //     type: 'scatter',
                //     name: key
                // }
                // ;
                // tracedata.push(trace)
            });   
        });
    }
}



