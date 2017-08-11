var chart;
// Segunda Opción
$(document).ready(function() {

        // Build the chart
        // Forma 1 enviando el JSON
        var chart = {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false
        };

        //Forma codigo Highcharts
        // Highcharts.chart('container', {
        //   chart: {
        //       plotBackgroundColor: null,
        //       plotBorderWidth: null,
        //       plotShadow: false,
        //       type: 'pie'
        //   },
        

        //Forma 2
        // chart = new Highcharts.Chart({
        //     chart: {
        //         renderTo: 'graficaCircular',
        //         plotBackgroundColor: null,
        //         plotBorderWidth: null,
        //         plotShadow: false,
        //         type: 'pie'
        //     },
        

        var title= {
            text: 'Browser market shares. January, 2015 to May, 2015'
        };
        var tooltip= {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        };
        var plotOptions= {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                        style: {
                            color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                        }
                }
            }
        };
        var series = [{
               type: 'pie',
               name: 'Browser share',
               data: [
                  ['Firefox',   45.0],
                  ['IE',       26.8],
                  {
                     name: 'Chrome',
                     y: 12.8,
                     sliced: true,
                     selected: true
                  },
                  ['Safari',    8.5],
                  ['Opera',     6.2],
                  ['Others',   0.7]
               ]
        }];
        // Radialize the colors
        Highcharts.getOptions().colors = Highcharts.map(
            Highcharts.getOptions().colors, function (color) {
                return {
                    radialGradient: { cx: 0.5, cy: 0.3, r: 0.7 },
                    stops: [
                        [0, color],
                        [1, Highcharts.Color(color).brighten(-0.3).get('rgb')] // darken
                    ]
                };
            }
        );
        // se crea el json 
        var json = {};   
        json.chart = chart; 
        json.title = title;     
        json.tooltip = tooltip;  
        json.series = series;
        json.plotOptions = plotOptions;
        $('#graficaCircular').highcharts(json);  
});


/* Primera  Opción
$(document).ready(function () {
    // Radialize the colors
    Highcharts.getOptions().colors = Highcharts.map(Highcharts.getOptions().colors, function (color) {
        return {
            radialGradient: {
                cx: 0.5,
                cy: 0.3,
                r: 0.7
            },
            stops: [
                [0, color],
                [1, Highcharts.Color(color).brighten(-0.3).get('rgb')] // darken
            ]
        };
    });

    // Build the chart
    // Highcharts.chart('container', {
    chart = new Highcharts.Chart({
        chart: {
            renderTo: 'graficaCircular',
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie'
        },
        title: {
            text: 'Browser market shares. January, 2015 to May, 2015'
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                    style: {
                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                    },
                    connectorColor: 'silver'
                }
            }
        },
        series: [{
            name: 'Brands',
            data: [
                { name: 'Microsoft Internet Explorer', y: 56.33 },
                {
                    name: 'Chrome',
                    y: 24.03,
                    sliced: true,
                    selected: true
                },
                { name: 'Firefox', y: 10.38 },
                { name: 'Safari', y: 4.77 }, { name: 'Opera', y: 0.91 },
                { name: 'Proprietary or Undetectable', y: 0.2 }
            ]
        }]
    });
});
*/