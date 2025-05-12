import PropTypes from 'prop-types';
import { useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import { fNumber } from 'src/utils/format-number';
import Chart, { useChart } from 'src/components/chart';

// ----------------------------------------------------------------------

export default function AnalyticsConversionRates({
                                                   title,
                                                   subheader,
                                                   chart,
                                                   footer,
                                                   onTimeRangeChange,
                                                   timeRangeOptions = [],
                                                   ...other
                                                 }) {
  const [timeRange, setTimeRange] = useState('this_month');

  const handleTimeRangeChange = (event) => {
    const newValue = event.target.value;
    setTimeRange(newValue);
    if (onTimeRangeChange) {
      onTimeRangeChange(newValue);
    }
  };

  const chartSeries = chart.series;

  const chartOptions = useChart({
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: (value) => fNumber(value),
        title: {
          formatter: (seriesName) => seriesName,
        },
      },
    },
    plotOptions: {
      bar: {
        horizontal: true,
        barHeight: '28%',
        borderRadius: 2,
      },
    },
    xaxis: {
      categories: chart.categories,
    },
  });

  return (
    <Card {...other}>
      <CardHeader
        title={title}
        subheader={subheader}
        action={
          <FormControl size='small' sx={{ minWidth: 120 }}>
            <InputLabel id='time-range-select'>Range</InputLabel>
            <Select
              labelId='time-range-select'
              id='time-range'
              value={timeRange}
              label='Range'
              onChange={handleTimeRangeChange}
            >
              {timeRangeOptions.length > 0 ? (
                timeRangeOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))
              ) : (
                <MenuItem value=''>No options</MenuItem>
              )}
            </Select>
          </FormControl>
        }
      />
      <Box sx={{ mx: 3 }}>
        <Chart
          dir="ltr"
          type="bar"
          series={chartSeries}
          options={chartOptions}
          width="100%"
          height={364}
        />
      </Box>
      <CardContent sx={{ pt: 0 }}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Box
              sx={{
                bgcolor: 'success.main',
                color: 'common.white',
                borderRadius: 2,
                p: 2,
                textAlign: 'center',
              }}
            >
              <Typography variant='body2'>Interest Average Rate</Typography>
              <Typography variant='h6'>{footer?.interestRate}</Typography>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box
              sx={{
                bgcolor: 'primary.main',
                color: 'common.white',
                borderRadius: 2,
                p: 2,
                textAlign: 'center',
              }}
            >
              <Typography variant='body2'>Amount</Typography>
              <Typography variant='h6'>{footer?.amount}</Typography>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

// ----------------------------------------------------------------------

AnalyticsConversionRates.propTypes = {
  title: PropTypes.string,
  subheader: PropTypes.string,
  chart: PropTypes.shape({
    series: PropTypes.array.isRequired,
    categories: PropTypes.array.isRequired,
  }),
  footer: PropTypes.shape({
    interestRate: PropTypes.string,
    amount: PropTypes.string,
  }),
  onTimeRangeChange: PropTypes.func,
  timeRangeOptions: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.string,
    }),
  ),
};

AnalyticsConversionRates.defaultProps = {
  timeRangeOptions: [],
};
