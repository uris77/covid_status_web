import React from 'react';
import {
  VictoryAxis,
  VictoryChart,
  VictoryLegend,
  VictoryLine,
  VictoryTheme,
  VictoryTooltip,
  VictoryVoronoiContainer,
} from 'victory';
import { getISODay, getISOWeek, getISOWeekYear, parseISO } from 'date-fns';

export interface WeeklyCaseCount {
  count: number;
  week: string;
  reportingDate: Date;
}

export interface WeeklyChartProps {
  data: [WeeklyCaseCount];
}

const WeeklyChart = (props: WeeklyChartProps): JSX.Element => {
  const { data } = props;
  return (
    <VictoryChart
      theme={VictoryTheme.material}
      width={800}
      containerComponent={<VictoryVoronoiContainer />}
    >
      <VictoryLegend
        x={225}
        y={10}
        title={'COVID19 Seven Day Rolling Average 2021'}
        centerTitle
        orientation={'horizontal'}
        gutter={60}
        style={{ border: { stroke: 'black' }, title: { fontSize: 20 } }}
        data={[]}
      />
      <VictoryAxis
        style={{ tickLabels: { angle: -60 }, axisLabel: { padding: 50 } }}
        label={'Weeks'}
        tickFormat={(x) => {
          const dt = parseISO(x);
          let month = 'Jan';
          switch (`${getISOWeekYear(dt)}-${getISOWeek(dt)}-${getISODay(dt)}`) {
            case '2021-1-4':
              month = 'Jan';
              break;
            case `2021-5-1`:
              month = 'Feb';
              break;
            case `2021-9-1`:
              month = 'Mar';
              break;
            case '2021-13-1':
              month = 'Apr';
              break;
            case '2021-17-1':
              month = 'May';
              break;
            case '2021-22-1':
              month = 'Jun';
              break;
            case '2021-26-1':
              month = 'Jul';
              break;
            case '2021-31-1':
              month = 'Aug';
              break;
            case '2021-35-1':
              month = 'Sep';
              break;
            default:
              month = '';
          }
          return month;
        }}
      />
      <VictoryAxis
        dependentAxis
        style={{ axisLabel: { padding: 30 } }}
        label={'Reported Cases'}
      />
      <VictoryLine
        labelComponent={<VictoryTooltip />}
        data={data.map((d) => ({
          reportingDate: d.reportingDate,
          count: d.count,
          label: d.count,
        }))}
        x={'reportingDate'}
        y={'count'}
        style={{
          data: {
            stroke: '#c43a31',
            strokeWidth: ({ data }) => data.length / 162,
          },
        }}
        interpolation={'linear'}
      />
    </VictoryChart>
  );
};

export default WeeklyChart;
