document.addEventListener("DOMContentLoaded", function (event) {







  var margin = { left:30, right:20, top:50, bottom:70 };
  var width = 800 - margin.left - margin.right,
      height = 600 - margin.top - margin.bottom;
      
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

      data = data.sort((a,b)=> {
        return d3.ascending(a.value,b.value)
    })
  
      let y = d3.scaleBand().
      domain(data.map(d => d.City))
      .range([height, 0])
      .padding(0)
      .paddingOuter(0.3)
      .paddingInner(0.4)
      // .tickValues(data)
      // .tickFormat(d => (d.year +":"+ d.val));

  

    
    let color = d3.scaleOrdinal(d3.schemeDark2)
    // .range(["#A07A19", "#AC30C0", "#EB9A72", "#BA86F5", "#EA22A8"]);
  
    
      // console.log(x('January'))
  
      let x = d3.scaleLinear()
  .domain([0,d3.max(data, d=> d.value)])
  .range([0, width])
  .nice()

  
  let t = d3.transition().duration(1000)
  
      let circle = g.selectAll('circle')
      .data(data)

    
  
      circle.enter()
    //   .classed('bubble')
      .append('g')
      .classed('bubble', true)
      .append('circle')
      .attr('width', 0)
      .attr('height', y.bandwidth)
      .attr('cx', 0)
      .attr('cy', d => y(d.City))
      .attr('r', 5)
      .transition(t)
    //   .sort(d=> d.value)
      .delay((d,i)=> {
          console.log(i, d.City)
          let count = 10;
          return  Math.abs(i-10)*700
      })
      .attr('height', y.bandwidth)
      .attr('width', d => x(d.value))
      .attr('cx', d => x(d.value))
      .attr('cy', d => y(d.City)+1)
      .attr('r', 10)
      .attr('fill', d=> color(d.Country))
      

    //   d3.selectAll('.bubble')
    //   .append('text')
    //   .text('dsa')
    //   .append('g')
    //   .append('text')
    //   .text('dsa')
    //   .text('dsads')
  

    let bars = g.selectAll('rect')
      .data(data)
  
      bars.enter()
      .append('rect')
      .attr('height', 4)
      .attr('width', 0)
      .attr('y', d => y(d.City))
      .transition(t)
      .delay((d,i)=> {
        console.log(i, d.City)
        let count = 10;
        return  Math.abs(i-10)*700
    })
      .attr('width', d => x(d.value))
    //   .attr('cx', d => x(d.value))
      .attr('y', d => y(d.City))
    //   .attr('r', 5)
    .attr('fill', d=> color(d.Country))
  
      let xAxis = d3.axisBottom(x)
     
      let yAxis = d3.axisLeft(y)
      // .tickValues(data)
      // .tickFormat(d => (d.City ));
      // .ticks(5);
  
      g.append('g')
      .attr('class', 'x-axis')
      .attr('transform', 'translate(0, ' + height + ')')
      .call(xAxis)
  
  
      g.append('g')
      .attr('class', 'y-axis')
      .call(yAxis)
      .attr('transform', 'translate(0, ' + 0 + ')')
  
  
      g.append('text')
      .attr('transform', 'translate(0, ' + (height+70) + ')')
      // .text('AsSA')


      let text  = g.selectAll('.bubble')
      .data(data)

      var xLabel = g.append("text")
      .attr("y", height + 50)
      .attr("x", width / 2)
      .attr("font-size", "17px")
      .attr("text-anchor", "middle")
      .text("Hours Spent In Traffic");

      console.log(text)
    //   text.enter()
      text.append('text')
      
    //   .classed('highlight',true)
    //   .attr('height', 3)
      .attr('width', d => x(d.value))
      .attr('x', d => x(d.value))
      .attr('y', d => y(d.City))
      .attr('transform', 'translate(-15, ' + 0 + ')')
      .attr('z-index',1)
    //   .attr('r', 5)
    // .attr('fill', d=> color(d.Country))
    .text(d => d.value)
    .attr('opacity', 0)
      
    d3.selectAll('.y-axis').selectAll('text')
    .classed('lable', true)
    .attr('transform', 'translate(20, ' + -30 + ')')
    .attr('text-anchor', 'start')
    .attr('fill', 'black')
    .attr('opacity', 0)
    // .text(d => d)
    .transition(t)
    .delay((d,i)=> {
      console.log(i, d.City)
      let count = 10;
      return  Math.abs(i-10)*700
  })
    .attr('opacity',1)
    // .text(d => d.City)
    

    d3.selectAll(".bubble")
			.on("mouseover", function(d) {

				//Instead of d3.select(this), now we want to
				//select ALL groups that match the same 
				//criteria as this one, i.e. this group
				//and the corresponding one in the other chart.
				//
				//We begin by selecting all groups, then
				//filtering to exclude those that don't match.
				//
				//We'll use each person's "name" as a unique
				//identifier. (With a real-world data set, you'd
				//probably use an ID number here.)

                var thisName = d.City;
                let thisCountry = d.Country;
                console.log(thisName)
				d3.selectAll(".bubble")
					.filter(function(d) {
						//If the name from the original group on
						//which mouseover was triggered matches the
						//name on the group we're evaluating right now…
						if (thisName == d.City) {
							return true;  //…then it's a match
						}
                    })
                    // .append('p').text('Toja')
                    .classed("highlight", true)
                    .selectAll('circle')
                    .transition().ease(d3.easeElastic)
                    .duration(1000)
                    .attr('r',40)
                    // .text('dsads')
                    // .attr('opacity',1)

                    d3.selectAll(".bubble")
					.filter(function(d) {
						//If the name from the original group on
						//which mouseover was triggered matches the
						//name on the group we're evaluating right now…
						if (thisCountry !== d.Country) {
							return true;  //…then it's a match
						}
                    })
                    // .append('p').text('Toja')
                    // .classed("highlight", true)
                    .selectAll('circle')
                    .transition().ease(d3.easeElastic)
                    .duration(1000)
                    // .attr('r',40)
                    .attr('fill','grey')
                    // .text('dsads')
                    // .attr('opacity',1)
                    
                    d3.selectAll("rect")
					.filter(function(d) {
						//If the name from the original group on
						//which mouseover was triggered matches the
						//name on the group we're evaluating right now…
						if (thisCountry !== d.Country) {
							return true;  //…then it's a match
						}
                    })
                    // .append('p').text('Toja')
                    .classed("highlight2", true)
                    // .selectAll('circle')
                    .transition().ease(d3.easeElastic)
                    .duration(1000)
                    // .attr('fill', 'grey')
			})
			.on("mouseout", function() {

				//We could be selective, using the same filtering
				//criteria above, or, for simplicity, just 
				//de-highlight all the groups.

				d3.selectAll(".bubble")
                    .classed("highlight", false)
                    .selectAll('circle')
                    .transition().ease(d3.easeElastic)
                    .duration(1000)
                    .attr('fill',d=> color(d.Country))
                    .attr('r',10);


                    d3.selectAll("rect")
				
                    // .append('p').text('Toja')
                    .classed("highlight2", false)
                    // .selectAll('circle')
                    .transition().ease(d3.easeElastic)
                    .duration(1000) 
                    // .attr('fill', color(d.Country))
                    
                    
			})

  
  
      
      console.log(data)
  }).catch(function(error) {
     console.log(error)
  });
})