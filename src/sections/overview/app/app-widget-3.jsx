import PropTypes from 'prop-types';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import ListItemText from '@mui/material/ListItemText';

import { fNumber } from 'src/utils/format-number';
import Chart, { useChart } from 'src/components/chart';

// ----------------------------------------------------------------------

export default function AppWidget3({ title, total, percent = 0, color = 'primary', sx, ...other }) {
  const theme = useTheme();

  const chartOptions = useChart({
    chart: {
      sparkline: {
        enabled: true,
      },
    },
    legend: {
      show: false,
    },
    fill: {
      type: 'solid',
      colors: [theme.palette[color].main],
    },
    plotOptions: {
      radialBar: {
        hollow: {
          size: '60%', // smaller hollow for a thinner ring
        },
        track: {
          background: theme.palette.grey[300],
          strokeWidth: '100%',
        },
        dataLabels: {
          show: false, // Hide numbers inside
        },
      },
    },
    stroke: {
      lineCap: 'round',
    },
  });

  return (
    <Stack
      direction="column"
      alignItems="center"
      justifyContent="center"
      spacing={1}
      sx={{
        p: 3,
        borderRadius: 2,
        overflow: 'hidden',
        position: 'relative',
        bgcolor: 'background.paper',
        boxShadow: 1,
        ...sx,
      }}
      {...other}
    >
      <Stack direction="row" alignItems="center" spacing={2}>
        <ListItemText
          primary={fNumber(total)}
          secondary={title}
          primaryTypographyProps={{
            typography: 'h4',
            component: 'span',
          }}
          secondaryTypographyProps={{
            color: 'text.secondary',
            component: 'span',
            typography: 'subtitle2',
          }}
        />

        <Chart
          dir="ltr"
          type="radialBar"
          series={[percent]}
          options={chartOptions}
          width={64}
          height={64}
        />
      </Stack>

      {/* Optional: Display percent below */}
      <div style={{ color: 'gray', fontSize: '12px' }}>
        +{percent}% last 7 days
      </div>
    </Stack>
  );
}

AppWidget3.propTypes = {
  color: PropTypes.string,
  sx: PropTypes.object,
  title: PropTypes.string,
  total: PropTypes.number,
  percent: PropTypes.number, // <- Added this
};
