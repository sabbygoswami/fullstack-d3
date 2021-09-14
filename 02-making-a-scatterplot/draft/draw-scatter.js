async function drawScatter() {
  // your code goes here
  //  Get Data

  let dataset =  await d3.json('./../../my_weather_data.json')

  const xAccessor = d => d.dewPoint
  const yAccessor = d => d.humidity

  const width = d3.min([
    window.innerWidth * 0.9,
    window.innerHeight * 0.9
  ])

  let dimensions = {
    width: width,
    height: width,
    margins : {
      top: 10,
      right: 10,
      left: 50,
      bottom: 50
    },
  }

dimensions.boundedWidth = dimensions.width
                        - dimensions.margins.left
                        - dimensions.margins.right

dimensions.boundedHeight = dimensions.height
                        - dimensions.margins.top
                        - dimensions.margins.bottom


// Create Chart Area

const wrapper = d3.select('#wrapper').append('svg')
                  .attr('width', dimensions.width)
                  .attr('height', dimensions.height)

const bounds = wrapper.append('g').style  ('transform',
                    `translate(${dimensions.margins.left}px),
                    ${dimensions.margins.top}px`)

//  Creat Scales

xScale = d3.scaleLinear()
            .domain(d3.extent(dataset, xAccessor))
            .range([0, dimensions.boundedWidth])
            .nice()

yScale = d3.scaleLinear()
            .domain(d3.extent(dataset, yAccessor))
            .range([dimensions.boundedHeight,0])
            .nice()


const dots = bounds.selectAll('circle')
                    .data(dataset)
                    .enter().append('circle')
                    .attr('cx', d => xScale(xAccessor(d)))
                    .attr('cy', d => yScale(yAccessor(d)))
                    .attr('r', 5)
                    .attr('fill', 'teal')

//  Draw Peripherals
  const xAxisGenerator = d3.axisBottom().scale(xScale)
  const xAxis = bounds.append('g')
                .call(xAxisGenerator)
                .style('transform',
                `translateY(${dimensions.boundedHeight}px`)

  const yAxisGenerator = d3.axisLeft().scale(yScale).ticks(4)

  const yAxis = bounds.append('g')
                .call(yAxisGenerator)




}
drawScatter()
