import PropTypes from 'prop-types';
import { useCallback } from 'react';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function CaratTableFiltersResult({
  filters,
  onFilters,
  //
  onResetFilters,
  //
  results,
  ...other
}) {
  const handleRemoveKeyword = useCallback(() => {
    onFilters('name', '');
  }, [onFilters]);

  const handleRemoveStatus = useCallback(() => {
    onFilters('isActive', 'all');
  }, [onFilters]);

  const handleRemoveRole = useCallback(
    (inputValue) => {
      const newValue = filters.role.filter((item) => item !== inputValue);

      onFilters('role', newValue);
    },
    [filters.role, onFilters]
  );

  return (
    <Stack spacing={1.5} {...other}>
      <Box sx={{ typography: 'body2' }}>
        <strong>{results}</strong>
        <Box component="span" sx={{ color: 'text.secondary', ml: 0.25 }}>
          results found
        </Box>
      </Box>

      <Stack flexGrow={1} spacing={1} direction="row" flexWrap="wrap" alignItems="center">
        {filters.isActive !== 'all' && (
          <Block label="Active">
            <Chip size="small" label={filters.isActive === "true"?"Active":"Non Active"} onDelete={handleRemoveStatus} />
          </Block>
        )}


        {!!filters.name && (
          <Block label="Scheme Name:">
            <Chip label={filters.name} size="small" onDelete={handleRemoveKeyword} />
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

CaratTableFiltersResult.propTypes = {
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