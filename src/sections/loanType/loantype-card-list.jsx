import PropTypes from 'prop-types';

import Box from '@mui/material/Box';

import LoantypeCard from './loantype-card';

// ----------------------------------------------------------------------

export default function LoantypeCardList({ users }) {
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
        <LoantypeCard key={user.id} user={user} />
      ))}
    </Box>
  );
}

LoantypeCardList.propTypes = {
  users: PropTypes.array,
};
