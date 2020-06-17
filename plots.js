function init() {
  var selector = d3.select("#selDataset");

  d3.json("samples.json").then((data) => {
    console.log(data);
    var sampleNames = data.names;
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });
    optionChanged(940);
})}

function optionChanged(newSample) {
  buildMetadata(newSample);
  buildCharts(newSample);
}

function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];

    var PANEL = d3.select("#sample-metadata");

    PANEL.html("");
    Object.entries(result).forEach(([key, value]) => {PANEL.append("h6").text(key.toUpperCase() + ': ' + value);}); 
  });
}

function buildCharts(sample) {
  d3.json("samples.json").then((data) => {
    var samples = data.samples;
    var resultArray = samples.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    var topTenSampleValues = result.sample_values.slice(0,10).reverse();
    var topTenOTUIDs = result.otu_ids.slice(0,10).reverse();
    var strOTUIDs = topTenOTUIDs.map(otuLabels);
    var topTenOTULabels = result.otu_labels.slice(0,10).reverse();


    var bar_trace = {
      x: topTenSampleValues,
      y: strOTUIDs,
      type: "bar",
      text: topTenOTULabels,
      orientation: "h"
    };
    var bar_data = [bar_trace];
    var bar_layout = {
      title: "Top Ten Bacterial Species",
      xaxis: { title: "Sample Values"},
      yaxis: { title: "OTU IDs"}
    };
    Plotly.newPlot("bar", bar_data, bar_layout);

    var bubble_trace = {
      x: result.otu_ids,
      y: result.sample_values,
      text: result.otu_labels,
      mode: 'markers',
      marker: {
        color: result.otu_ids,
        size: result.sample_values
      }
    };
    var bubble_data = [bubble_trace];
    var bubble_layout = {
      title: "All Bacterial Species",
      showlegend: false,
      xaxis: { title: "OTU IDs"},
      yaxis: { title: "Sample Values"}
    };
    Plotly.newPlot("bubble", bubble_data, bubble_layout);

  });
}

function otuLabels(value) {
  var label = "OTU " + value;
  return label
}

init();