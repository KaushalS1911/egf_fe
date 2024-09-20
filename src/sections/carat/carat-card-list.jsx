import PropTypes from 'prop-types';

import Box from '@mui/material/Box';

import CaratCard from './carat-card';

// ----------------------------------------------------------------------

export default function CaratCardList({ users }) {
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
        <CaratCard key={user.id} user={user} />
      ))}
    </Box>
  );
}

CaratCardList.propTypes = {
  users: PropTypes.array,
};
