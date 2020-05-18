import {Kuba} from './d3app2.js'
import {smallBar,updateBar} from './d3small.js'

document.addEventListener("DOMContentLoaded", function (event) {

    


    // Kuba()

    var margin = {
        left: 100,
        right: 20,
        top: 40,
        bottom: 30
    };
    var width = 400 - margin.left - margin.right,
        height = 600 - margin.top - margin.bottom;

    var g = d3.select("#chart-area")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left +
            ", " + margin.top + ")");


    // var g2 = d3.select("#chart-area2")
    //     .append("svg")
    //     .attr("width", width + margin.left + margin.right)
    //     .attr("height", height + margin.top + margin.bottom)
    //     .append("g")
    //     .attr("transform", "translate(" + margin.left +
    //         ", " + margin.top + ")");

    let data, selected_Year

    d3.csv('data/data.csv').then(data => {

        data = data
        selected_Year =2018

        data.forEach(e => {

            e.value = +e['Weighted Score'].replace(",", '.')


        });
        console.log(data)

        //Small bars

        smallBar(data,2018)

        let total = d3.nest()
            .key(d => {
                return d.Year
            })
            .key(d => {
                return d.Country
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

        // console.log(total)

        // let Year18 = total.filter(d => {
        //     return +d.key == 2018
        // })

        

        //  console.log(Year18[0].values.map(d => 
        //     { return d.key}))

        let y = d3.scaleBand().
        domain(total[0].values.map(d => {
                return d.key
            }))



            .range([height, 0])
            .padding(0)
            .paddingOuter(0.3)
            .paddingInner(0.4)

        let y2 = d3.scaleBand().
        domain(data.map(

                d =>
                d.Country))
            .range([height, 0])
            .padding(0)
            .paddingOuter(0.3)
            .paddingInner(0.4)


        // console.log(y('Poland'))

        let color = d3.scaleOrdinal(d3.schemeDark2)
        // .range(["#A07A19", "#AC30C0", "#EB9A72", "#BA86F5", "#EA22A8"]);


        // console.log(x('January'))


        // console.log(d3.max(Year18[0].values,
        //     d => {
        //         return d.value
        //     }))

        let x = d3.scaleLinear()
            .domain([0, d3.max(total[0].values,
                d => {
                    return d.value
                })])
            .range([0, width])
            .nice()

        // console.log(x(40))


        total[0].values.sort((a, b) => {
            return d3.ascending(a.value, b.value)

        })

        y.domain(total[0].values.map(d => {
            return d.key
        }))

        // console.log(total)


        let t = d3.transition().duration(1000)

        let bar = g.selectAll('.Country')
            .data(total)
            .enter()
            .append('g')
            .classed('Country', true)


        bar.selectAll('rect')
            .data(d => {
                return d.values
            })

            .enter()
            //   .classed('bubble')
            // .append('g')
            // .classed('bubble', true)
            .append('rect')
            .classed('bars', true)
            .attr('fill', 'gray')
            .attr('width', 0)
            .attr('height', y.bandwidth())
            .attr('x', 0)
            .attr('y', d => y(d.key))
            .transition(t)
            .attr('width', d => x(d.value))
            .attr('text', d => d.key)



        // bar.selectAll('rect')
        //     .on('mouseover', function () {

        //         bar.selectAll('rect').classed('bigger', false)

        //         d3.select(this)
        //             // .transition(t)
        //             .classed('bigger', true)
        //             .attr('height', y.bandwidth() + 2)
                    


        //         // d3.select(this).fill('red')
        //     })
            // .on('mouseout', function () {

            //     d3.select(this)
            //         // .transition(t)
            //         .classed('bigger', false)
            //         .attr('height', y.bandwidth())


            //     // d3.select(this).fill('red')
            // })


            bar.selectAll('rect')
            .on('click', function() {

                bar.selectAll('rect').classed('bigger', false)

                d3.select(this)
                    // .transition(t)
                    .classed('bigger', true)
                    .attr('height', y.bandwidth() + 2)
                let country = d3.select(this).attr('text')
                updateBar(data, country, selected_Year)
                
            })


            bar.selectAll('text')
            .data(d => {
                return d.values
            })

            .enter()
            //   .classed('bubble')
            // .append('g')
            // .classed('bubble', true)
            .append('text')
            .classed('bars_value', true)
            // .attr('fill', 'gray')
            // .attr('width', 0)
            // .attr('height', y.bandwidth())
            .attr('x',5)
            .attr('y', d => y(d.key)+8)
            .transition(t)
            .attr('width', d => x(d.value))
            // .text(d =>  d.key +" " + d3.format(".1f")(d.value))
            .text(d =>  d3.format(".1f")(d.value))
        // .attr('height', 4)



        let xAxis = d3.axisBottom(x)

        let yAxis = d3.axisLeft(y)


        // g.append('g')
        // .attr('class', 'x-axis')
        // .attr('transform', 'translate(0, ' + height + ')')
        // .call(xAxis)


        g.append('g')
            .attr('class', 'y-axis')
            .call(yAxis)
            // .classed('lable', true)

            // .attr('transform', 'translate(0, ' + 0 + ')')


        d3.selectAll('.y-axis').selectAll('text')
            .classed('label', true)
        //     .attr('transform', 'translate(20, ' + 0 + ')')
        //     .attr('text-anchor', 'start')
        //     .attr('fill', 'black')
        //     .attr('opacity', 0)
        //     // .text(d => console.log(d))
        //     .transition(t)
        //     // .delay((d, i) => {

        //     //     let count = 10;
        //     //     return Math.abs(i - 10) * 700
        //     // })
        //     .attr('opacity', 1)

            let years=    d3.map(data, (d) => {       return d.Year            }).keys()
                
            // g.selectAll('.year')
            // .append('g')
            // .enter(years)
            // .append('text')
            // .classed('year', true)
            // .text(d => d)
            // .attr('transform', 'translate(20, ' + 0 + ')')
            // .attr('text-anchor', 'start')
            // .attr('fill', 'black')


            g.selectAll('.year')
            .data(years)
            .enter()
            .append("text")
            .classed('year', true)
            .attr("x", function (d,i) {
                return i * 40 +5
              })             
            .attr("y", -10)
            // .classed('year', true)
            // .attr("text-anchor", "middle")  
            // .style("font-size", "50px") 
            // .style("text-decoration", "underline")  
            .text((d,i) => (d))
            .on('click', function (d) {

                d3.selectAll('.year')
                .classed('highlight', false)

                selected_Year = d3.select(this).text()

                d3.select(this).classed('highlight', true)

                

                let country =  d3.select('.bar_title').text()
                updateBar(data, country, selected_Year)

                updateGeneral(data,selected_Year)
                
                
              })

              g.selectAll('.year')
              .classed('highlight', (d) => {
                //   console.log(d)
                  if (d==2018) {
                      return true
                  }
              })

            // console.log(d3.selectAll('.year'))


            function updateGeneral(data, year) {

                let total = d3.nest(data)
                .key(d => {
                    return d.Year
                })
                .key(d => {
                    return d.Country
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


                total[0].values.sort((a, b) => {
                    return d3.ascending(a.value, b.value)
        
                })

                y.domain(total[0].values.map(d => {
                    return d.key
                }))

                // x.domain([0, d3.max(total[0].values,
                //     d => {
                //         return d.value
                //     })])


                // console.log(total)

                let newbar = d3.selectAll('Country')
                .data(total)
                .enter()
                        

                

                // console.log(total)



                newbar.exit().remove()


                let bigbar = newbar.selectAll('rect.bars').data(d => d.values, d => d.key)

                // console.log(bigbar)


                bigbar
                .enter()
                .append('rect')
                .merge(bigbar)            
                .attr('fill', 'gray')
                // .attr('width', 0)
            .attr('height', y.bandwidth())
            .attr('x', 0)
            
            .transition()
            .duration(1000)
            .attr('y', d => y(d.key))
            .attr('width', d => x(d.value))
            .attr('text', d => d.key)

            
            let bars_values = newbar.selectAll('text.bars_value').data(d => d.values, d => d.key)
            // .data(d => d.values, d => d.key)
            
                console.log(bars_values.data())
            let format = d3.format(".1f")

            bars_values.enter()
            //   .classed('bubble')
            // .append('g')
            // .classed('bubble', true)
            .append('text')
            .merge(bars_values)   
            // .classed('bars_value', true)
            // .attr('fill', 'gray')
            // .attr('width', 0)
            // .attr('height', y.bandwidth())
            
            .transition()
            .duration(1000)
            .attr('x',5)
            .attr('y', d => y(d.key)+8)
            .attr('width', d => x(d.value))
            .tween("text", function(d) {
                var that = d3.select(this);
                console.log(that)
                // let new_value = d.key +" " + d3.format(".1f")(d.value)
                // console.log(new_value)

                console.log(that.text())
                let i = d3.interpolateString(that.text(), d3.format(".1f")(d.value));
                return function(t) { that.text(format(i(t))); };
              })


            //
            //  .text(d =>  d.key +" " + d3.format(".1f")(d.value))
            
            
             g.select(".y-axis")
             .transition(t)
             .duration(1000)
             .call(yAxis)
             // .call(yAxis)



            }
        

         


            
    }).catch(function (error) {
        console.log(error)
    });



})