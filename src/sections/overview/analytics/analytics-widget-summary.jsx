import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';
import { MenuItem, Select } from '@mui/material';
import { fShortenNumber } from 'src/utils/format-number';

export default function AnalyticsWidgetSummary({
                                                 title,
                                                 total,
                                                 average,
                                                 icon,
                                                 filter = 'This Month',
                                                 filterOptions = ['This Month', 'Last Month', 'This Year'],
                                                 onFilterChange = () => {
                                                 },
                                                 color = 'success',
                                                 sx,
                                                 ...other
                                               }) {
  const theme = useTheme();

  return (
    <Stack
      spacing={2}
      sx={{
        p: 3,
        borderRadius: 2,
        backgroundColor: alpha(theme.palette[color].light, 0.3),
        color: theme.palette[color].darker,
        ...sx,
      }}
      {...other}
    >
      <Stack direction='row' justifyContent='space-between' alignItems='center'>
        <Stack direction='row' alignItems='center' spacing={1}>
          <Box sx={{ width: 30, height: 30 }}>{icon}</Box>
          <Typography variant='subtitle1' fontWeight='bold'>
            {title}
          </Typography>
        </Stack>
        <Select
          value={filter}
          size='small'
          onChange={(e) => onFilterChange(e.target.value)}
          sx={{
            bgcolor: alpha(theme.palette[color].main, 0.1),
            fontSize: 12,
            height: 32,
            borderRadius: 1,
          }}
        >
          {filterOptions.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
      </Stack>
      <Stack direction='row' spacing={2} alignItems='center'>
        <Typography variant='h4'>{fShortenNumber(total)}</Typography>
        <Typography variant='body2' sx={{ opacity: 0.7 }}>
          Total
        </Typography>
        <Box sx={{ width: 1, height: 32, borderLeft: '1px solid', borderColor: 'divider', mx: 2 }} />
        <Typography variant='h4'>{fShortenNumber(average)}</Typography>
        <Typography variant='body2' sx={{ opacity: 0.7 }}>
          Day Average
        </Typography>
      </Stack>
    </Stack>
  );
}

AnalyticsWidgetSummary.propTypes = {
  title: PropTypes.string.isRequired,
  total: PropTypes.number.isRequired,
  average: PropTypes.number.isRequired,
  icon: PropTypes.element,
  filter: PropTypes.string,
  filterOptions: PropTypes.arrayOf(PropTypes.string),
  onFilterChange: PropTypes.func,
  color: PropTypes.string,
  sx: PropTypes.object,
};
