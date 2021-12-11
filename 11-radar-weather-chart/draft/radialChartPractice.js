async function drawChart() {
  // Access Data
  const dataset = await d3.json("./../../my_weather_data.json");

  const temperatureMinAccessor = (d) => d.temperatureMin;
  const temperatureMaxAccessor = (d) => d.temperatureMax;
  const uvAccessor = (d) => d.uvIndex;
  const precipitationProbabilityAccessor = (d) => d.precipProbability;
  const cloudAccessor = (d) => d.cloudCover;
  const dateParser = d3.timeParse("%Y-%m-%d");
  const dateAccessor = (d) => dateParser(d.date);

  // Create Chart dimensions

  const width = 600;
  dimensions = {
    width: width,
    height: width,
    radius: width / 2,
    margin: {
      top: 120,
      right: 120,
      left: 120,
      bottom: 120,
    },
  };
  dimensions.boundedWidth =
    dimensions.width - dimensions.left - dimensions.right;
  dimensions.boundedHeight =
    dimensions.height - dimensions.top - dimensions.bottom;
  dimensions.boundedRadius =
    dimensions.radius - (dimensions.margin.left + dimensions.margin.right) / 2;
  const getCoordinatesForAngle = (angle, offset = 1) => [
    Math.cos(angle - Math.PI / 2) * dimensions.boundedRadius * offset,
    Math.sin(angle - Math.PI / 2) * dimensions.boundedRadius * offset,
  ];
  //  Create canvas
  const wrapper = d3
    .select("#wrapper")
    .append("svg")
    .attr("width", dimensions.width)
    .attr("height", dimensions.height);

  const bounds = wrapper.append("g").style(
    "transform",
    `translate(${dimensions.margin.left + dimensions.boundedRadius}px,
        ${dimensions.margin.top + dimensions.boundedRadius}px)`
  );

  // Create scales
  const angleScale = d3
    .scaleTime()
    .domain(d3.extent(dataset, dateAccessor))
    .range([0, Math.PI * 2]);

  const radiusScale = d3
    .scaleLinear()
    .domain(
      d3.extent([
        ...dataset.map(temperatureMaxAccessor),
        ...dataset.map(temperatureMinAccessor),
      ])
    )
    .range([0, dimensions.boundedRadius])
    .nice();

  const getXFromDataPoint = (d, offset = 1.4) =>
    getCoordinatesForAngle(angleScale(dateAccessor(d)), offset)[0];
  const getYFromDataPoint = (d, offset = 1.4) =>
    getCoordinatesForAngle(angleScale(dateAccessor(d)), offset)[1];

  // Draw peripherals
  const months = d3.timeMonths(...angleScale.domain());
  const peripherals = bounds.append("g");
  months.forEach((month) => {
    const angle = angleScale(month);
    const [x, y] = getCoordinatesForAngle(angle);
    peripherals
      .append("line")
      .attr("x2", x)
      .attr("y2", y)
      .attr("class", "grid-line");

    const [labelX, labelY] = getCoordinatesForAngle(angle, 1.38);
    peripherals
      .append("text")
      .attr("x", labelX)
      .attr("y", labelY)
      .text(d3.timeFormat("%b")(month))
      .attr("class", "tick-labels")
      .style(
        "text-anchor",
        labelX < 5 ? "middle" : labelX > 0 ? "start" : "end"
      );
  });

  const temperatureTicks = radiusScale.ticks(4);
  const gridCircles = temperatureTicks.map((d) =>
    peripherals
      .append("circle")
      .attr("r", radiusScale(d))
      .attr("class", "grid-line")
  );
}
drawChart();
