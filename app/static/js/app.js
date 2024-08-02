// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // get the metadata field
    let metadata = data.metadata;
    

    // Filter the metadata for the object with the desired sample number
    // dictionary
    let filtered = metadata.filter(x => x.id == sample)[0];

    // Use d3 to select the panel with id of `#sample-metadata`
    
    let field = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    field.html(""); 

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    // source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/entries
    
    for (const [key, value] of Object.entries(filtered)) {
      field.append("h6").text(`${key}: ${value}`);
    }
  });
}


// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
    let graph = data.samples;

    // Filter the samples for the object with the desired sample number
    let filtered = graph.filter(x => x.id === sample)[0];
    

    // Get the otu_ids, otu_labels, and sample_values
    let otu_ids= filtered.otu_ids;
    let otu_labels= filtered.otu_labels;
    let sample_values= filtered.sample_values;

    // Build a Bubble Chart
    let bubble = {
      x: otu_ids,
      y: sample_values,
      mode: 'markers',
      marker: {
        color: otu_ids,
        opacity: [1, 0.8, 0.6, 0.4],
        size:sample_values,
        colorscale: "Aggrnyl"
      },
      text: otu_labels
      };
    
    let bubble_data = [bubble];
    
    let bar_layout = {
      title: 'Bacteria Cultures per Sample',
      length: 600,
      width: 1000,
      xaxis: {
        title: 'OTU ID'
      },
      yaxis: {
        title: 'Number of Bacteria'
      }
    };
    

    // Render the Bubble Chart
    Plotly.newPlot('bubble', bubble_data, bar_layout);

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    let bar_y = otu_ids.map(x => `OTU: ${x}`);
   

    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately
    let trace1 = {
      x:sample_values.slice(0,10).reverse(),
      y: bar_y.slice(0,10).reverse(),
      type: 'bar',
      marker: {
        colorscale: "Aggrnyl",
        color: sample_values.slice(0, 10).reverse()
      },
      text: otu_labels.slice(0, 10).reverse(),
      orientation: 'h'
    };

  

    // Render the Bar Chart

    let bar_data= [trace1];

    let layout = {
      title: 'Top 10 Bacteria Cultures Found',
      xaxis: {
        title: 'Number of Bacteria',
      }
    };

    Plotly.newPlot('bar_chart', bar_data, layout);
  });
}

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {


    console.log(data)
    // Get the names field
    let names= data.names;

    // Use d3 to select the dropdown with id of `#selDataset`
    let dropdown = d3.select('#selDataset');


    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    for (let i = 0; i < names.length; i++){
      let name=names[i];
      dropdown.append("option").text(name);
    }

    // Get the first sample from the list
      first_sample= names[0];

    // Build charts and metadata panel with the first sample
    // use functions 
    buildCharts(first_sample);
    buildMetadata(first_sample);

  });
}

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
