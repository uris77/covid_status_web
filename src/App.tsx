import './App.css';
import React from 'react';
import { dark, Grommet, Main } from 'grommet';
import Spinner from './components/Spinner/Spinner';
import {
  VictoryChart,
  VictoryTheme,
  VictoryArea,
  VictoryLegend,
  VictoryAxis,
} from 'victory';
import _ from 'lodash';

interface CaseCount {
  // reportingDate: Date;
  count: number;
  // year: number;
  // month: string;
  week: string;
}

interface CaseCountState {
  loading: boolean;
  data: CaseCount[];
  error?: Error;
}

const { REACT_APP_API_URL } = process.env;

function App() {
  const [data, setData] = React.useState<CaseCountState>({
    loading: true,
    data: [],
  });

  React.useEffect(() => {
    if (data.loading && REACT_APP_API_URL) {
      fetch(`${REACT_APP_API_URL}/api/byYear/2021`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      })
        .then((result) => result.json())
        .then((result) => result as CaseCount[])
        .then((result) => {
          const d = _.groupBy(result, (o) => {
            return o.week;
          });
          let reduced = Object.values(d).reduce((acc, v) => {
            const week = v[0].week;
            const count = _.sumBy(v, (x) => x.count);
            acc.push({ week, count });
            return acc;
          }, []);
          reduced = reduced.filter((it) => it.week.split('-')[0] === '2021');
          console.dir({ reduced });
          setData({ loading: false, data: reduced });
        });
    }
  }, [data]);

  return (
    <Grommet theme={dark} full>
      <Main
        direction={'column'}
        flex={false}
        overflow={'auto'}
        responsive={true}
        background={'light-3'}
      >
        {data.loading && <Spinner size={228} />}
        {!data.loading && !data.error && (
          <>
            <VictoryChart theme={VictoryTheme.material} width={800}>
              <VictoryLegend
                x={225}
                y={10}
                title={'COVID19 Reported Cases By Week for 2021'}
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
                data={data.data.map((d) => ({
                  week: d.week,
                  count: d.count,
                }))}
                x={'week'}
                y={'count'}
                interpolation={'natural'}
              />
            </VictoryChart>
          </>
        )}
      </Main>
    </Grommet>
  );
}

export default App;
