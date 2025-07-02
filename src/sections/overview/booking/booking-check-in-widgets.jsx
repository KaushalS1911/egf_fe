import PropTypes from 'prop-types';
import { useState } from 'react';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { useTheme } from '@mui/material/styles';
import { useResponsive } from 'src/hooks/use-responsive';
import Box from '@mui/material/Box';

const formatNumberWithCommas = (number) => {
  if (number == null || isNaN(number)) {
    return 'No data';
  }

  const [whole, decimal] = number.toString().split('.');

  const lastThree = whole.slice(-3);
  const otherNumbers = whole.slice(0, -3);

  const formattedWhole = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + (otherNumbers ? ',' : '') + lastThree;
  return decimal ? `${formattedWhole}.${decimal}` : formattedWhole;
};

// ----------------------------------------------------------------------

export default function BookingCheckInWidgets({
                                                chart,
                                                title,
                                                subheader,
                                                onTimeRangeChange,
                                                timeRangeOptions,
                                                chartTitle,
                                                ...other
                                              }) {
  const theme = useTheme();
  const smUp = useResponsive('up', 'sm');
  const [timeRange, setTimeRange] = useState('this_month');

  const {
    series,
  } = chart;

  const handleChange = (event) => {
    setTimeRange(event.target.value);
    if (onTimeRangeChange) {
      onTimeRangeChange(event.target.value);
    }
  };

  return (
    <Card {...other}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Box sx={{ padding: '24px 24px 0px 24px' }}>
          <Typography variant={'h4'} color={'black'}>{chartTitle}</Typography>
        </Box>
        <Box>
          <Box>
            <Typography>{title}</Typography>
          </Box>
          <CardHeader
            title={title}
            subheader={subheader}
            sx={{ mb: 2 }}
            action={
              timeRangeOptions && (
                <Box>
                  <FormControl size='small'>
                    <InputLabel id='time-range-select'>Range</InputLabel>
                    <Select
                      labelId='time-range-select'
                      id='time-range'
                      value={timeRange}
                      label='Range'
                      onChange={handleChange}
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
                </Box>
              )
            }
          />
        </Box>
      </Box>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        divider={
          <Divider
            orientation={smUp ? 'vertical' : 'horizontal'}
            flexItem
            sx={{ borderStyle: 'dashed' }}
          />
        }
      >
        {series.map((item, index) => (
          <Stack
            key={item.label}
            spacing={3}
            direction="row"
            alignItems="center"
            justifyContent={{ sm: 'center' }}
            sx={{
              py: 2,
              width: 1,
              px: { xs: 3, sm: 0 },
            }}
          >
            <Box sx={{ color: 'black' }}>{item.icon}</Box>
            <div>
              <Typography variant="h4" sx={{ mb: 0.5 }}>
                {item.total ? formatNumberWithCommas(item.total) : 'No data'}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.72 }}>
                {item.label}
              </Typography>
            </div>
          </Stack>
        ))}
      </Stack>
    </Card>
  );
}

BookingCheckInWidgets.propTypes = {
  chart: PropTypes.object,
  title: PropTypes.string,
  subheader: PropTypes.string,
  onTimeRangeChange: PropTypes.func,
  timeRangeOptions: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.string,
    }),
  ),
};
