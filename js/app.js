document.addEventListener("DOMContentLoaded", function (event) {







  var margin = { left:40, right:20, top:10, bottom:30 };
  var width = 600 - margin.left - margin.right,
      height = 400 - margin.top - margin.bottom;
      
  var g = d3.select("#chart-area")
      .append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
          .append("g")
              .attr("transform", "translate(" + margin.left 
                  + ", " + margin.top + ")");
  
  
  
              
  
  
  
  d3.csv('data/data.csv').then(data => {
    

      data.forEach(e => {
          e.value= + e['Hours spent in congestion']
          
      });
  
      let x = d3.scaleBand().
      domain(data.map(d => d.City))
      .range([0, width])
      .padding(0)
      .paddingOuter(0.3)
      .paddingInner(0.4)
  
  
      // console.log(x('January'))
  
      let y = d3.scaleLinear()
  .domain([0,d3.max(data, d=> d.value)])
  .range([height, 0])
  .nice()    
  
  
      let bars = g.selectAll('rect')
      .data(data)
  
      bars.enter()
      .append('rect')
      .attr('width', x.bandwidth)
      .attr('height', d => height - y(d.value))
      .attr('x', d => x(d.City))
      .attr('y', d => y(d.value))
      .attr('fill', 'grey')
  
  
      let xAxis = d3.axisBottom(x);
      let yAxis = d3.axisLeft(y)
      .ticks(5);
  
      g.append('g')
      .attr('class', 'x-axis')
      .attr('transform', 'translate(0, ' + height + ')')
      .call(xAxis)
  
  
      g.append('g')
      .attr('class', 'y-axis')
      .call(yAxis)
  
  
      g.append('text')
      .attr('transform', 'translate(0, ' + (height+70) + ')')
      .text('AsSA')
      
      
  
  
      
      console.log(data)
  }).catch(function(error) {
     console.log(error)
  });
})