import React from 'react';
import {
  VictoryArea,
  VictoryAxis,
  VictoryChart,
  VictoryLegend,
  VictoryTheme,
} from 'victory';

export interface WeeklyCaseCount {
  count: number;
  week: string;
}

export interface WeeklyChartProps {
  data: [WeeklyCaseCount];
}

const WeeklyChart = (props: WeeklyChartProps): JSX.Element => {
  const { data } = props;
  return (
    <VictoryChart theme={VictoryTheme.material} width={800}>
      <VictoryLegend
        x={225}
        y={10}
        title={'COVID19 Seven Day Rolling Average 2021'}
        centerTitle
        orientation={'horizontal'}
        gutter={20}
        style={{ border: { stroke: 'black' }, title: { fontSize: 20 } }}
        data={[]}
      />
      <VictoryAxis
        style={{ tickLabels: { angle: -60 } }}
        tickFormat={(x) => {
          // divide by 4 to estimate months, and return
          // the name of the month for the first value.
          const [year, week] = x.split('-');
          console.log(year);
          let month = 'Jan';
          switch (week) {
            case '1':
              month = 'Jan';
              break;
            case '5':
              month = 'Feb';
              break;
            case '9':
              month = 'Mar';
              break;
            case '13':
              month = 'Apr';
              break;
            case '17':
              month = 'May';
              break;
            case '22':
              month = 'Jun';
              break;
            case '26':
              month = 'Jul';
              break;
            case '31':
              month = 'Aug';
              break;
            case '35':
              month = 'Sep';
              break;
            default:
              month = '';
          }
          return month;
        }}
      />
      <VictoryAxis dependentAxis />
      <VictoryArea
        data={data.map((d) => ({
          week: d.week,
          count: d.count,
        }))}
        x={'week'}
        y={'count'}
        interpolation={'stepBefore'}
      />
    </VictoryChart>
  );
};

export default WeeklyChart;
