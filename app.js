// Define url
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

function init() {
    // Dropdown menu 
    let dropdown = d3.select("#selDataset");

    // Read in data using D3
    d3.json(url).then(function(data) {
    
        // Print data to console
        console.log(data)

        // Get id data to dropdown menu
        data.names.forEach(function(name) {
            dropdown.append("option").text(name).property("value");
        });

        // Call functions
        getDemoInfo(data.names[0]);
        barPlot(data.names[0]);
        bubblePlot(data.names[0]);
    });
}

function getDemoInfo(subjectId) {
    // Read json
    d3.json("samples.json").then((data)=> {
        // Get metadata info
        let metadata = data.metadata;
    
        // Filter metadata by id
        let result = metadata.filter(meta => meta.id.toString() === subjectId)[0];

        // Select demographic panel
        let demoInfo = d3.select("#sample-metadata");
            
        // Reset panel
        demoInfo.html("");
    
        // Insert demographic data into panel
        Object.entries(result).forEach((key) => {   
            demoInfo.append("h5").text(key[0] + ": " + key[1] + "\n");  
        });
    });
}
    
function barPlot(subjectId) {
    // Read json
    d3.json(url).then(function(data) {
        // Find id index
        let idIndex = data.samples.filter(x => x.id.toString() === subjectId)[0];

        // Get data
        let sampleValues =  idIndex.sample_values.slice(0,10).reverse();
        let labels =  idIndex.otu_labels.slice(0,10);
        let OTU_top = idIndex.otu_ids.slice(0,10).reverse();
        let OTU_id = OTU_top.map(d => "OTU " + d);

        // Create trace for bar plot
        let barTrace = {
            x: sampleValues,
            y: OTU_id,
            text: labels,
            type:"bar",
            orientation: "h",
        };
        let barData = [barTrace];

        // Create bar plot
        Plotly.newPlot("bar", barData);
    });
}function bubblePlot(subjectId) {
    d3.json(url).then(function(data) {
        // Find id index
        let idIndex = data.samples.filter(x => x.id.toString() === subjectId)[0];

        // Create trace for bubble chart
        let bubbleTrace = {
            x: idIndex.otu_ids,
            y: idIndex.sample_values,
            mode: "markers",
            marker: {
                size: idIndex.sample_values,
                color: idIndex.otu_ids,
                colorscale: 'Earth'
            },
            text: idIndex.otu_labels
        };
        let bubbleData = [bubbleTrace];

        // Add title and layout
        let layout = {
            xaxis: {title: "OTU ID"}
        };

        // Create bubble chart
        Plotly.newPlot("bubble", bubbleData, layout);
    });
}

function optionChanged(subjectId) {
    // Change demographic data and plots on ID change
    getDemoInfo(subjectId);
    barPlot(subjectId);
    bubblePlot(subjectId);
}

init();


