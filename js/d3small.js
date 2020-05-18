var margin = {
    left: 40,
    right: 20,
    top: 10,
    bottom: 30
};

var width = 300 - margin.left - margin.right,
height = 500 - margin.top - margin.bottom;

var g2 = d3.select("#chart-area2")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left +
        ", " + margin.top + ")");

let totalCategories,y,x,EU28   


function smallBar(data) {

    

     totalCategories = d3.nest()
                .key(d => {
            return d.Country
        })
        .key(d => {
            return d.Indicator
        })
        .rollup(v => {
            return d3.sum(v, d => {
                return d.value;
            })
        })
        .sortValues((a, b) => {
            return b.value - a.value
        })
        .entries(data.filter(d => {
            return +d.Year == 2018
        }))


        totalCategories[0].values.sort((a,b) => {
            return d3.descending(a.key, b.key)
        })

        console.log(totalCategories)


        // console.log(d3.max(totalCategories,
        //     d => {
        //         return d3.max(d.values, (d) => {
        //             // console.log(d)
        //             return (d.value)
        //         })
        //     }))


        // console.log( totalCategories.filter(d => {
        //     return d.key == 'Spain'
        // })
        // )

        y = d3.scaleBand().
        domain(totalCategories[0].values.map(d => {
                return d.key
            }))
            .range([height, 0])
            .padding(20)
            .paddingOuter(1)
            .paddingInner(0.5)


            x = d3.scaleLinear()
            .domain([0, d3.max(totalCategories,
                d => {
                    return d3.max(d.values, (d) => {
                        // console.log(d)
                        return (d.value)
                    })
                })])
            .range([0, width])
            .nice()
            
            
            
            let t = d3.transition().duration(1000)


            let bars = g2.selectAll('.smallBar')
            .data(totalCategories.filter(d => {
                return d.key == 'European Union 28'}))
                .enter()
            .append('g')
            .classed('smallBar', true)


            EU28 = g2.selectAll('.EU28')
            .data(totalCategories.filter(d => {
                return d.key == 'European Union 28'}))
                .enter()
            .append('g')
            .classed('EU28', true)

            // console.log(EU28.data())

            // bars.exit().remove()

            let EU28_dot= EU28.selectAll('line')
            .data(d => {
                d.values.sort((a,b) => {
                    return d3.descending(a.key, b.key)
                })
                // console.log(d)
                return d.values
            });


            
            // .style("stroke", '#E97F02');
            // .attr('width', d => x(d.value))
            // .attr('text', d => d.key)

           
            



            
            // .merge(bars)


            let all = bars.selectAll('rect')
            .data(d => {
                d.values.sort((a,b) => {
                    return d3.descending(a.key, b.key)
                })
                // console.log(d)
                return d.values
            })

         

            


            all
            .enter()
            //   .classed('bubble')
            // .append('g')
            // .classed('bubble', true)
            .append('rect')
            .classed('bars', true)
            // .merge(all)
            .attr('fill', 'gray')
            .attr('width', 0)
            .attr('height', y.bandwidth())
            .attr('x', 0)
            .attr('y', d => y(d.key))
            .transition(t)
            .attr('width', d => x(d.value))
            .attr('text', d => d.key)       
            
            EU28_dot
            .enter()
            //   .classed('bubble')
            // .append('g')
            // .classed('bubble', true)
            .append('line')
            .classed('stroke', true)
            .classed('highlight', function(d) {

                console.log(d)
                let bar = bars.selectAll('rect').data()

                console.log(bar)

                let odp
                
                bar.forEach((e) => {
                    // console.log(d)                  

                    if (e.key == d.key) {
                        if (e.value <= d.value) {
                            //    console.log(d.key, 'Tak')
                            odp = true
                        } else {
                            odp = false
                        }
                    }
                })
                    // console.log(d.key, odp)
                    return odp

            })
            
            // .merge(all)
            .attr("x1", d => x(d.value))
            .attr("x2", d => x(d.value))
            .attr("y1", d => y(d.key))
            .attr("y2", d => y(d.key) + y.bandwidth())
            .style('stroke-width',2)
           


            bars.selectAll('text')
            .data(d => {
                // console.log(d)
                return d.values
            })

            .enter()
            //   .classed('bubble')
            // .append('g')
            // .classed('bubble', true)
            .append('text')

            .attr('fill', '#00B4CC')
            .attr('width', 0)
            .attr('height', y.bandwidth())
            .attr('x', 0)
            .attr('y', d => y(d.key)-4)
            .transition(t)
            // .attr('width',10)
            .text(d => { return d.key})
            .attr("font-size", "12px")
            // .attr("fill", "red");

            // attr("font-family", "sans-serif")


            bars.append("text")
            .attr("x", (0))             
            .attr("y", 30 - (margin.top / 2))
            .classed('bar_title', true)
            // .attr("text-anchor", "middle")  
            // .style("font-size", "50px") 
            // .style("text-decoration", "underline")  
            .text((d) => { return d.key});


            bars.append("text")
            .attr("x", 0)             
            .attr("y", height-50)
            .classed('note', true)
            // .attr("text-anchor", "middle")  
            // .style("font-size", "50px") 
            // .style("text-decoration", "underline")  
            .text('Line shows EU28 results');
           

            

            bars.selectAll('.numbers')
            .data(d => {
                // console.log(d)
                return d.values
            })

            .enter()
            //   .classed('bubble')
            // .append('g')
            // .classed('bubble', true)
            .append('text')
            .classed('numbers', true)

            .attr('fill', 'gray')
            .attr('width', d => x(d.value))
            .attr('height', y.bandwidth())
            .attr('x', d => 5)
            .attr('y', d => y(d.key)+20)
            .transition(t)
            // .attr('width',10)
            .text(d => { return  d3.format(".1f")(d.value)})
            .attr("font-size", "12px")
            
            // let EU = bars.selectAll('.numbers').data()
            // console.log(EU)


            bars.selectAll('rect').classed('bigger', function(d) {
                // console.log(d)
                let EU = EU28.selectAll('line').data()
                // console.log(EU)
                let odp
                
                EU.forEach((e) => {
                    // console.log(d)                  

                    if (e.key == d.key) {
                        if (e.value <= d.value) {
                            //    console.log(d.key, 'Tak')
                            odp = true
                        } else {
                            odp = false
                        }
                    }
                })
                    console.log(d.key, odp)
                    return odp


                   
                
        })
          

        // console.log(totalCategories)
}


function updateBar(data, country, year) {

    totalCategories = d3.nest(data)
                .key(d => {
            return d.Country
        })
        .key(d => {
            return d.Indicator
        })
        .rollup(v => {
            return d3.sum(v, d => {
                return d.value;
            })
        })
        .sortValues((a, b) => {
            return b.value - a.value
        })
        .entries(data.filter(d => {
            return +d.Year == year
        }))


        totalCategories[0].values.sort((a,b) => {
            return d3.descending(a.key, b.key)
        })

    let t = d3.transition().duration(1000)

    // totalCategories[0].values.sort((a,b) => {
    //     return d3.descending(a.key, b.key)
    // })


    let bars = g2.selectAll('.smallBar')
    .data(totalCategories.filter(d => {
        return d.key == country}))

    // console.log(totalCategories.filter(d => {
    //     return d.key == country}))    

    bars.exit().remove()

    bars
    .enter()
    .append('g')
    // .merge(bars)
    .text(d => d.key)




            let all = bars.selectAll('rect')
            .data(d => {
                // console.log(d)
                d.values.sort((a,b) => {
                    return d3.descending(a.key, b.key)
                })
        
                return d.values
            })

            all.exit().remove();


            all
            .enter()
            //   .classed('bubble')
            // .append('g')
            // .classed('bubble', true)
            .append('rect')
            .merge(all)
            .attr('fill', 'gray')
            // .attr('width', 0)
            .attr('height', y.bandwidth())
            // .attr('x', 0)
            .attr('y', d => y(d.key))
            .transition(t)
            .attr('width', d => x(d.value))
            .attr('text', d => d.key)


            let numbers = bars.selectAll('.numbers')
            .data(d => {
                // console.log(d)
                return d.values
            })


            
            // console.log(number)

            console.log(numbers.enter())

            numbers
            .enter()
            //   .classed('bubble')
            // .append('g')
            // .classed('bubble', true)
            .append('text')

            numbers.exit().remove()

            let format = d3.format(".1f");

            numbers
            .merge(numbers)
            // .attr('fill', 'gray')
            // .attr('width', 0)
            .attr('height', y.bandwidth())
            // .attr('x', 0)
            // .attr('y', d => y(d.key)-4)
            .transition(t)
            .attr('x', d => 5 )
            // .text(d => { return d3.format(".1f")(d.value)})
            .tween("text", function(d) {
                var that = d3.select(this)
                // console.log(that)
                let i = d3.interpolateNumber(that.text().replace(/,/g, ""), d3.format(".1f")(d.value));
                return function(t) { that.text(format(i(t))); };
              })
            .attr("font-size", "12px")

            // console.log(numbers.data())

            EU28 = g2.selectAll('.EU28')
            .data(totalCategories.filter(d => {
                return d.key == 'European Union 28'}))


            EU28    
            .enter()
            .append('g')
            .classed('EU28', true)

            console.log(g2.selectAll('.EU28'))

            

            // bars.exit().remove()

            let EU28_dot= EU28.selectAll('line')
            .data(d => {
                d.values.sort((a,b) => {
                    return d3.descending(a.key, b.key)
                })
                // console.log(d)
                return d.values
            });


            EU28_dot.exit().remove()


            EU28_dot
            .enter()
            
            //   .classed('bubble')
            // .append('g')
            // .classed('bubble', true)
            .append('line')
            .merge(EU28_dot)
            .style('z-index',-1)
            // .style("stroke", '#E97F02')
            .classed('stroke', true)
            .classed('highlight', function(d) {

                console.log(d)
                let bar = bars.selectAll('rect').data()

                console.log(bar)

                let odp
                
                bar.forEach((e) => {
                    // console.log(d)                  

                    if (e.key == d.key) {
                        if (e.value <= d.value) {
                            //    console.log(d.key, 'Tak')
                            odp = true
                        } else {
                            odp = false
                        }
                    }
                })
                    // console.log(d.key, odp)
                    return odp

            })
            // .merge(all)
            .transition(t)
            .attr("x1", d => x(d.value))
            .attr("x2", d => x(d.value))
            .attr("y1", d => y(d.key))
            .attr("y2", d => y(d.key) + y.bandwidth())
            .style('stroke-width',2)
            
            

            bars.selectAll('rect')

            
            
                
            .classed('bigger', function(d) {
                // console.log(d)
                let EU = EU28.selectAll('line').data()
                // console.log(EU)
                let odp
                
                EU.forEach((e) => {
                    // console.log(d)                  

                    if (e.key == d.key) {
                        if (e.value <= d.value) {
                            //    console.log(d.key, 'Tak')
                            odp = true
                        } else {
                            odp = false
                        }
                    }
                })
                    // console.log(d.key, odp)
                    return odp
                                
        
    })




        


    let title = bars.selectAll('.bar_title')
    .data(totalCategories.filter(d => {
        return d.key == country}))
   
   

    // console.log(title.data())

    title.exit().remove();




    title
    .enter()
    .merge(title)
    .style("opacity", 0)  
    .text((d) => { return d.key})
    .transition(t)
    
    // .attr("text-anchor", "middle")  
    // .style("font-size", "50px") 
    // .style("text-decoration", "underline")  
    
    .style("opacity", 1) ;
    


}






export {smallBar, updateBar}