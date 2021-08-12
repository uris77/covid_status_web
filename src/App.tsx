import './App.css';
import React from 'react';
import { dark, Grommet, Main } from 'grommet';
import Spinner from './components/Spinner/Spinner';
import _ from 'lodash';
import WeeklyChart, { WeeklyCaseCount } from './components/WeeklyChart';

interface CaseCount {
  // reportingDate: Date;
  count: number;
  // year: number;
  // month: string;
  week: string;
}

interface RawData {
  reportingDate: string;
  count: number;
  year: number;
  month: string;
  week: string;
}

interface RollingAverage {
  reportingDate: string;
  count: number;
  year: number;
  month: string;
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
    const getData = async () => {
      const rawData = await fetch(`${REACT_APP_API_URL}/api/byYear/2021`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      }).then((result) => result.json() as Promise<[RawData]>);

      const d = _.groupBy(rawData, (o: RawData) => {
        return o.week;
      });
      const weeklyCaseCounts: CaseCount[][] = Object.values(d);
      let reduced = weeklyCaseCounts.reduce((acc, v) => {
        const week = v[0].week;
        const count = _.sumBy(v, (x) => x.count);
        acc.push({ week, count });
        return acc;
      }, []);
      reduced = reduced.filter((it) => it.week.split('-')[0] === '2021');
      setData({ loading: false, data: reduced });
    };

    const getRollingData = async () => {
      const rawData = await fetch(`${REACT_APP_API_URL}/api/byYear/2021`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      }).then((result) => result.json() as Promise<[RawData]>);
      const sorted = _.sortBy(rawData, (o) => o.reportingDate);

      const rolling: CaseCount[] = sorted.map((v, idx, arr) => {
        let start = idx + 1 - 7;
        if (start < 0) {
          start = 0;
        }
        const previousSeven = _.slice(arr, start, idx + 1);
        return {
          ...v,
          count: _.sum(previousSeven.map((o) => o.count)) / 7,
        };
      });
      setData({ loading: false, data: rolling.slice(6) });
    };

    if (data.loading && REACT_APP_API_URL) {
      getRollingData();
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
            <WeeklyChart data={data.data as [WeeklyCaseCount]} />
          </>
        )}
      </Main>
    </Grommet>
  );
}

export default App;
