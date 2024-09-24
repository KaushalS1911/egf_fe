import PropTypes from 'prop-types';

import Box from '@mui/material/Box';

import PropertyCard from './property-card';

// ----------------------------------------------------------------------

export default function PropertyCardList({ users }) {
  return (
    <Box
      gap={3}
      display="grid"
      gridTemplateColumns={{
        xs: 'repeat(1, 1fr)',
        sm: 'repeat(2, 1fr)',
        md: 'repeat(3, 1fr)',
      }}
    >
      {users.map((user) => (
        <PropertyCard key={user.id} user={user} />
      ))}
    </Box>
  );
}

PropertyCardList.propTypes = {
  users: PropTypes.array,
};
