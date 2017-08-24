var chart;

$(document).ready(function() {

        // Build the chart
        // Forma 1 enviando el JSON
        var chart = {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false
        };

        var title= {
            text: 'Alertas Efectivas y No Efectivas'
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
               name: 'Alertas SSP',
               data: [
                  ['Alertas Efectivas',   49.2],
                  ['Alertas No Efectivas',   50.7],
                  // ['Firefox',   45.0],
                  ['IE',       26.8],
                  {
                     name: 'Chrome',
                     y: 12.8,
                     sliced: true,
                     selected: true
                  },
                  // ['Safari',    8.5],
                  // ['Opera',     6.2],
                  // ['Others',   0.7]
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
