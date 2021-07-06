var data = [{
  name: "Feed",
  values: [{
    date: "2021-01-15T10:00:00.000",
    price: .5
  }, {
    date: "2021-01-16T10:00:00.000",
    price: 1.5
  }, {
    date: "2021-01-17T10:00:00.000",
    price: 1.4
  }, {
    date: "2021-01-18T10:00:00.000",
    price: 1.3
  }, {
    date: "2021-01-19T10:00:00.000",
    price: 1.2
  }, {
    date: "2021-01-20T10:00:00.000",
    price: 2.5
  }, {
    date: "2021-01-21T10:00:00.000",
    price: 2.0
  }
  ]
}, {
  name: "Biomass",
  values: [{
    date: "2021-01-15T10:00:00.000",
    price: 10
  }, {
    date: "2021-01-16T10:00:00.000",
    price: 11
  }, {
    date: "2021-01-17T10:00:00.000",
    price: 12
  }, {
    date: "2021-01-18T10:00:00.000",
    price: 12
  }, {
    date: "2021-01-19T10:00:00.000",
    price: 13.5
  }, {
    date: "2021-01-20T10:00:00.000",
    price: 9
  }, {
    date: "2021-01-21T10:00:00.000",
    price: 8
  }
  ]
}, {
  name: "Ammonia",
  values: [{
    date: "2021-01-15T10:00:00.000",
    price: 5.1
  }, {
    date: "2021-01-16T10:00:00.000",
    price: 7
  }, {
    date: "2021-01-17T10:00:00.000",
    price: 7
  }, {
    date: "2021-01-18T10:00:00.000",
    price: 6
  }, {
    date: "2021-01-19T10:00:00.000",
    price: 5
  }, {
    date: "2021-01-20T10:00:00.000",
    price: 4
  }, {
    date: "2021-01-21T10:00:00.000",
    price: 3.1
  }]
}];

var width = 800;
var height = 300;
var margin = 50;
var duration = 250;

var lineOpacity = "0.25";
var lineOpacityHover = "0.85";
var otherLinesOpacityHover = "0.1";
var lineStroke = "1.5px";
var lineStrokeHover = "2.5px";

var circleOpacity = '0.85';
var circleOpacityOnLineHover = "0.25"
var circleRadius = 3;
var circleRadiusHover = 6;


/* Format Data */
var parseDate = d3.utcParse("%Y-%m-%dT%H:%M:%S.%L");
data.forEach(function (d) {
  d.values.forEach(function (d) {
    d.date = parseDate(d.date);
    d.price = d.price * 1000;
  });
});

console.log(' ---- parsed data ---- ', data);

/* Scale */
var xScale = d3.scaleTime()
  .domain(d3.extent(data[0].values, d => d.date))
  .range([0, width - margin]);

var yScale = d3.scaleLinear()
  .domain([0, d3.max(data[1].values, d => d.price)])
  .range([height - margin, 0]);

var color = d3.scaleOrdinal(d3.schemeCategory10);

/* Add SVG */
var svg = d3.select("#chart").append("svg")
  .attr("width", (width + margin) + "px")
  .attr("height", (height + margin) + "px")
  .append('g')
  .attr("transform", `translate(${margin}, ${margin})`);


/* Add line into SVG */
var line = d3.line()
  .x(d => xScale(d.date))
  .y(d => yScale(d.price));

let lines = svg.append('g')
  .attr('class', 'lines');

lines.selectAll('.line-group')
  .data(data).enter()
  .append('g')
  .attr('class', 'line-group')
  .on("mouseover", function (d, i) {
    svg.append("text")
      .attr("class", "title-text")
      .style("fill", color(i))
      .text(d.name)
      .attr("text-anchor", "middle")
      .attr("x", (width - margin) / 2)
      .attr("y", 5);
  })
  .on("mouseout", function (d) {
    svg.select(".title-text").remove();
  })
  .append('path')
  .attr('class', 'line')
  .attr('d', d => line(d.values))
  .style('stroke', (d, i) => color(i))
  .style('opacity', lineOpacity)
  .on("mouseover", function (d) {
    d3.selectAll('.line')
      .style('opacity', otherLinesOpacityHover);
    d3.selectAll('.circle')
      .style('opacity', circleOpacityOnLineHover);
    d3.select(this)
      .style('opacity', lineOpacityHover)
      .style("stroke-width", lineStrokeHover)
      .style("cursor", "pointer");
  })
  .on("mouseout", function (d) {
    d3.selectAll(".line")
      .style('opacity', lineOpacity);
    d3.selectAll('.circle')
      .style('opacity', circleOpacity);
    d3.select(this)
      .style("stroke-width", lineStroke)
      .style("cursor", "none");
  });


/* Add circles in the line */
lines.selectAll("circle-group")
  .data(data).enter()
  .append("g")
  .style("fill", (d, i) => color(i))
  .selectAll("circle")
  .data(d => d.values).enter()
  .append("g")
  .attr("class", "circle")
  .on("mouseover", function (d) {
    d3.select(this)
      .style("cursor", "pointer")
      .append("text")
      .attr("class", "text")
      .text(`${d.price}`)
      .attr("x", d => xScale(d.date) + 5)
      .attr("y", d => yScale(d.price) - 10);
  })
  .on("mouseout", function (d) {
    d3.select(this)
      .style("cursor", "none")
      .transition()
      .duration(duration)
      .selectAll(".text").remove();
  })
  .append("circle")
  .attr("cx", d => xScale(d.date))
  .attr("cy", d => yScale(d.price))
  .attr("r", circleRadius)
  .style('opacity', circleOpacity)
  .on("mouseover", function (d) {
    d3.select(this)
      .transition()
      .duration(duration)
      .attr("r", circleRadiusHover);
  })
  .on("mouseout", function (d) {
    d3.select(this)
      .transition()
      .duration(duration)
      .attr("r", circleRadius);
  });


// var customTimeFormat = 

/* Add Axis into SVG */
var xAxis = d3.axisBottom(xScale).ticks(2).tickFormat(function (d) { return d.toLocaleDateString(); });
var yAxis = d3.axisLeft(yScale).ticks(5);

svg.append("g")
  .attr("class", "x axis")
  .attr("transform", `translate(0, ${height - margin})`)
  .call(xAxis);

svg.append("g")
  .attr("class", "y axis")
  .call(yAxis)
  .append('text')
  .attr("y", 15)
  .attr("transform", "rotate(-90)");