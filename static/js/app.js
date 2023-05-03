// function that populates the meta data
function demoInfo(sample)
{
    //console.log(sample);

    d3.json("samples.json").then((data) => {
        // grab all of the metadata
        let metadata = data.metadata;
        // console.log(metadata)

        // filter based on the value of the firstsample
        let result = metadata.filter(sampleResult => sampleResult.id == sample);

        //console.log(result);

        // access index 0 of the array of metadata
        let resultdata = result[0];
        //console.log(resultdata);

        // clear the metadata out
        d3.select("#sample-metadata").html("");

        // use Object.entries to get the value keypairs to put in the Demographic Info
        Object.entries(resultdata).forEach(([key, value]) => {
            d3.select("#sample-metadata").append("h5").text(`${key}, ${value}`);

        });
    });

}

// function that builds the graphs
function barChart(sample)
{
    //console.log(sample);
    let data = d3.json("samples.json");
    //console.log(data);

    d3.json("samples.json").then((data) => {
        // grab the sample data for the bar chart
        let sampleData = data.samples;
        //console.log(sampleData);

        // filter based on the value of the sample
        let result = sampleData.filter(sampleResult => sampleResult.id == sample);

        // access index 0
        let resultData = result[0];

        // get the OTU Ids
        let otu_ids = resultData.otu_ids;
        let otu_labels = resultData.otu_labels;
        let sample_values = resultData.sample_values;
        //console.log(otu_ids);
        //console.log(otu_labels);
        //console.log(sample_values);

        // build the bar chart
        let yticks = otu_ids.slice(0, 10).map(id => `OTU ${id}`);
        let xvalues = sample_values.slice(0, 10)
        let labels = otu_labels.slice(0, 10)
        //console.log(labels)

        let barChart = {
            y: yticks.reverse(),
            x: xvalues.reverse(),
            text: labels.reverse(),
            type: "bar",
            orientation: "h"
        };
        let layout = {
            title: "Top 10 Belly Button Bacteria"
        };

        Plotly.newPlot("bar", [barChart, layout])
    });
};

// function that builds a bubble chart
function bubbleChart(sample)
{
    let data = d3.json("samples.json");

         d3.json("samples.json").then((data) => {
        // grab the sample data for the bar chart
        let sampleData = data.samples;
        //console.log(sampleData);

        // filter based on the value of the sample
        let result = sampleData.filter(sampleResult => sampleResult.id == sample);

        // access index 0
        let resultData = result[0];

        // get the OTU Ids
        let otu_ids = resultData.otu_ids;
        let otu_labels = resultData.otu_labels;
        let sample_values = resultData.sample_values;
        //console.log(otu_ids);
        //console.log(otu_labels);
        //console.log(sample_values);

        // build the bar chart
        // let yticks = otu_ids.slice(0, 10).map(id => `OTU ${id}`);
        // let xvalues = sample_values.slice(0, 10)
        // let labels = otu_labels.slice(0, 10)
        //console.log(labels)

        let bubble = {
            y: sample_values,
            x: otu_ids,
            text: otu_labels,
            mode: "markers",
            marker: {
                size: sample_values,
                color: otu_ids,
                colorscale: "Earth"
            }
     };
     let layout = {
         title: "Bacteria Cultures Per Sample",
         hovermode: "closest",
         xaxis: {title: "OTU ID"}
     };

     Plotly.newPlot("bubble", [bubble, layout]);
 });
}

// function that creates the dash board
function initialize()
{
    // access the dropdown selector from the html file
    var select = d3.select("#selDataset");

    // use d3.json to get the data for our selector
    d3.json("samples.json").then((data) => {
        let sampleNames = data.names;

        // use a foreach to create options for each sample in our array for our selector
        sampleNames.forEach((sample) => {
            select.append("option").text(sample).property("value", sample);
        });

        // when initalized, we pass in the information for the first sample
        let firstsample = sampleNames[0];

        // call the function to build the metadata
        demoInfo(firstsample);
        // call function to add bar chart
        barChart(firstsample);

        // call function add bubble chart
        bubbleChart(firstsample);
    });


}

// function that updates the dash board
function optionChanged(item)
{
    // call the update to the metadata
    demoInfo(item);

    // call function to add bar chart
    barChart(item);

    // call function to add bubble chart
    bubbleChart(item);
    
    //console.log(item);
}

// call the create function
initialize();