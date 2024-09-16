import PropTypes from 'prop-types';

import Box from '@mui/material/Box';

import SchemeCard from './scheme-card';

// ----------------------------------------------------------------------

export default function SchemeCardList({ users }) {
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
        <SchemeCard key={user.id} user={user} />
      ))}
    </Box>
  );
}

SchemeCardList.propTypes = {
  users: PropTypes.array,
};
