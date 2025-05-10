import PropTypes from 'prop-types';
import { Avatar, Box, Card, Grid, Stack, Typography } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import { fNumber } from 'src/utils/format-number';
import Chart, { useChart } from 'src/components/chart';
import React from 'react';

const CHART_HEIGHT = 300;

const StyledChart = styled(Chart)(({ theme }) => ({
  height: CHART_HEIGHT,
  '& .apexcharts-canvas, .apexcharts-inner, svg, foreignObject': {
    height: `100% !important`,
  },
}));

const formatCurrency = (value) => `${parseFloat(value).toFixed(2)} ₹`;

export default function EcommerceSaleByGender({
                                                title,
                                                subheader,
                                                chart,
                                                banks = [],
                                                ...other
                                              }) {
  const theme = useTheme();

  const {
    colors = [
      [theme.palette.primary.light, theme.palette.primary.main],
      [theme.palette.warning.light, theme.palette.warning.main],
    ],
    series,
    options,
  } = chart;

  const chartSeries = series.map((i) => i.value);
  const labels = series.map((i) => i.label);

  const cash = series[0]?.value || 0;
  const bank = series[1]?.value || 0;
  const calculatedTotal = cash + bank;

  const chartOptions = useChart({
    colors: colors.map((colr) => colr[1]),
    chart: {
      sparkline: { enabled: true },
    },
    labels,
    fill: {
      type: 'gradient',
      gradient: {
        colorStops: colors.map((colr) => [
          { offset: 0, color: colr[0], opacity: 1 },
          { offset: 100, color: colr[1], opacity: 1 },
        ]),
      },
    },
    plotOptions: {
      radialBar: {
        hollow: { size: '70%' },
        dataLabels: {
          name: { show: false },
          value: {
            offsetY: 0,
            fontSize: '22px',
            fontWeight: 600,
          },
          total: {
            show: true,
            label: 'Total',
            fontSize: '16px',
            formatter: () => fNumber(calculatedTotal),
          },
        },
      },
    },
    legend: { show: false },
    ...options,
  });

  return (
    <Card {...other} sx={{ p: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <StyledChart
            dir='ltr'
            type='radialBar'
            series={chartSeries}
            options={chartOptions}
            width='100%'
            height={CHART_HEIGHT}
          />
          <Typography variant='subtitle2' align='center' sx={{ mt: 2 }}>
            <Box component='span' sx={{ color: colors[0][1], fontWeight: 'bold' }}>
              {fNumber(cash)}
            </Box>
            {' + '}
            <Box component='span' sx={{ color: colors[1][1], fontWeight: 'bold' }}>
              {fNumber(bank)}
            </Box>
            {' = '}
            <Box component='span' sx={{ color: 'text.primary', fontWeight: 'bold' }}>
              {fNumber(calculatedTotal)}
            </Box>
            {' Total (Cash + Bank)'}
          </Typography>
          <Stack direction='row' justifyContent='center' spacing={3} sx={{ mt: 2 }}>
            {series.map((item, index) => (
              <Stack key={index} direction='row' alignItems='center' spacing={1}>
                <Box
                  sx={{
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    bgcolor: colors[index][1],
                  }}
                />
                <Typography variant='body2'>{item.label}</Typography>
              </Stack>
            ))}
          </Stack>
        </Grid>
        <Grid item xs={12} md={6}>
          <Grid container spacing={2}>
            {banks.map((bank, index) => (
              <Grid key={index} item xs={6}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    p: 1.5,
                    borderRadius: 2,
                    boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
                    bgcolor: 'background.paper',
                  }}
                >
                  <Avatar
                    alt={bank.name}
                    src={bank.logo}
                    sx={{ mr: 2, cursor: 'pointer' }}
                  />
                  <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                    <Typography
                      variant='subtitle2'
                      sx={{
                        wordBreak: 'break-word',
                        whiteSpace: 'normal',
                        lineHeight: 1.2,
                      }}
                    >
                      {bank.name}
                    </Typography>
                    <Typography variant='subtitle1' fontWeight='bold' whiteSpace='nowrap'>
                      {formatCurrency(bank.amount)}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Card>
  );
}

EcommerceSaleByGender.propTypes = {
  chart: PropTypes.object,
  subheader: PropTypes.string,
  title: PropTypes.string,
  banks: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      amount: PropTypes.number,
      color: PropTypes.string,
      logo: PropTypes.string,
    }),
  ),
};
