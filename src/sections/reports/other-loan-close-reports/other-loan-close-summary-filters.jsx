import PropTypes from 'prop-types';
import { useCallback } from 'react';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function OtherLoanCloseSummaryFilters({
  filters,
  onFilters,
  onResetFilters,
  results,
  ...other
}) {
  const handleRemoveKeyword = useCallback(() => {
    onFilters('username', '');
  }, [onFilters]);

  const handleRemoveService = useCallback(
    (inputValue) => {
      const newValue = filters.service.filter((item) => item !== inputValue);
      onFilters('service', newValue);
    },
    [filters.service, onFilters]
  );

  const handleRemoveStatus = useCallback(() => {
    onFilters('status', 'all');
  }, [onFilters]);

  return (
    <Stack spacing={1.5} {...other}>
      <Box sx={{ typography: 'body2' }}>
        <strong>{results}</strong>
        <Box component="span" sx={{ color: 'text.secondary', ml: 0.25 }}>
          results found
        </Box>
      </Box>
      <Stack flexGrow={1} spacing={1} direction="row" flexWrap="wrap" alignItems="center">
        {!!filters.service && (
          <Block label="Service:">
            {filters.service.map((item) => (
              <Chip
                key={item}
                label={item}
                size="small"
                onDelete={() => handleRemoveService(item)}
              />
            ))}
          </Block>
        )}
        {!!filters.userName && (
          <Block label="Keyword:">
            <Chip label={filters.userName} size="small" onDelete={handleRemoveKeyword} />
          </Block>
        )}
        <Button
          color="error"
          onClick={onResetFilters}
          startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
        >
          Clear
        </Button>
      </Stack>
    </Stack>
  );
}

OtherLoanCloseSummaryFilters.propTypes = {
  filters: PropTypes.object,
  onFilters: PropTypes.func,
  onResetFilters: PropTypes.func,
  results: PropTypes.number,
};

// ----------------------------------------------------------------------

function Block({ label, children, sx, ...other }) {
  return (
    <Stack
      component={Paper}
      variant="outlined"
      spacing={1}
      direction="row"
      sx={{
        p: 1,
        borderRadius: 1,
        overflow: 'hidden',
        borderStyle: 'dashed',
        ...sx,
      }}
      {...other}
    >
      <Box component="span" sx={{ typography: 'subtitle2' }}>
        {label}
      </Box>
      <Stack spacing={1} direction="row" flexWrap="wrap">
        {children}
      </Stack>
    </Stack>
  );
}

Block.propTypes = {
  children: PropTypes.node,
  label: PropTypes.string,
  sx: PropTypes.object,
};
