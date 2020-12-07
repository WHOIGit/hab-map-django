import React, { useState, useEffect, useRef } from 'react';
import { makeStyles } from '@material-ui/styles'
import {
  Card,
  CardHeader,
  CardActionArea,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  IconButton,
  Button } from '@material-ui/core'
import Highcharts from 'highcharts'
import Exporting from 'highcharts/modules/exporting';
import Serieslabel from 'highcharts/modules/series-label';
import HighchartsReact from 'highcharts-react-official'
Exporting(Highcharts);
Serieslabel(Highcharts);

const expandWidth = window.outerWidth - 316;
const useStyles = makeStyles(theme => ({
  chartContainer: {
  },
  chartContainerExpand: {
    width: expandWidth,
    height: '100%',
  }
}))

const StationsGraph = ({results, chartExpanded, yAxisScale}) => {
  const chartRef = useRef();
  const classes = useStyles()
  console.log(results);

  useEffect(() => {
    if (chartExpanded) {
      console.log(window.outerWidth, window.outerHeight);
      chartRef.current.chart.setSize(expandWidth, null);
    } else {
      chartRef.current.chart.setSize(550, 300);
    }
  }, [chartExpanded]);
/*
  useEffect(() => {
    console.log(yAxisScale);
    if (yAxisScale==='linear') {
      console.log(chartRef.current.chart);
      chartRef.current.chart.yAxis[0].update({
        type: 'linear',
        min: 0,
      });
    }
    else if (yAxisScale==='logarithmic') {
      console.log(chartRef.current.chart);
      chartRef.current.chart.yAxis[0].update({
        type: 'logarithmic',
        //minorTickInterval: 1,
        min: 100,
      });
    }
  }, [yAxisScale]);
*/
  const data = results.properties.toxicity_timeseries_data;
  const chartData = data.map(item => [Date.parse(item.date), item.measurement] ).sort();
  console.log(chartData);

  const chartOptions = {
    chart: {
      type: 'spline',
    },
    title: {
      text: null
    },
    xAxis: {
      type: 'datetime'
    },
    yAxis: {
      title: {
          text: 'Shellfish meat toxicity'
      },
      min: 0,
      softMax: 150,
      plotLines: [{
        value: 80,
        color: 'red',
        dashStyle: 'shortdash',
        width: 2,
        label: {
          text: 'Closure threshold'
        }
      }]
    },
    plotOptions: {
      series: {threshold: 100}
    },
    series: [{
      name: 'Shellfish meat toxicity',
      data: chartData
    }]
  };

  return (

        <HighchartsReact
          highcharts={Highcharts}
          allowChartUpdate={true}
          options={chartOptions}
          containerProps={chartExpanded ? { className: classes.chartContainerExpand } : { className: classes.chartContainer }}
          ref={chartRef}
        />


  )
}

export default StationsGraph;