import React, { useState, useEffect } from 'react';
import {
  Grid,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Button,
} from '@mui/material';
import { useGetCarat } from '../../api/carat';
import { useGetScheme } from '../../api/scheme';

function GoldLoanCalculator() {
  const { carat } = useGetCarat();
  const { scheme } = useGetScheme();

  const [goldGramsTables, setGoldGramsTables] = useState([[{ netGram: 0, goldGram: '' }]]);
  const [totalNetGram, setTotalNetGram] = useState(0);
  const [financeTables, setFinanceTables] = useState([[{ netGram: '' }]]);
  const [totalFinance, setTotalFinance] = useState(0);

  const handleGoldGramChange = (tableIndex, rowIndex, value) => {
    const updatedTables = [...goldGramsTables];
    const caratPercentage = carat[rowIndex]?.caratPercentage || 0;
    const netGram = ((Number(value) || 0) * caratPercentage) / 100;

    updatedTables[tableIndex][rowIndex] = {
      ...updatedTables[tableIndex][rowIndex],
      goldGram: value,
      netGram: netGram.toFixed(2),
    };

    setGoldGramsTables(updatedTables);

    const total = updatedTables.flat().reduce((sum, table) => sum + Number(table.netGram), 0).toFixed(2);
    setTotalNetGram(total);
  };

  const handleNetGramChange2 = (tableIndex, rowIndex, value) => {
    const updatedTables = [...financeTables];
    updatedTables[tableIndex][rowIndex] = {
      ...updatedTables[tableIndex][rowIndex],
      netGram: value,
    };

    setFinanceTables(updatedTables);
    calculateTotalFinance(updatedTables);
  };

  const calculateTotalFinance = (tables) => {
    let total = 0;
    tables.forEach((table, tableIndex) => {
      table.forEach((row, rowIndex) => {
        const ratePerGram = scheme[rowIndex]?.ratePerGram || 0;
        if (row.netGram && ratePerGram) {
          total += Number(row.netGram) * Number(ratePerGram);
        }
      });
    });
    setTotalFinance(total.toFixed(2));
  };

  const addTable = () => {
    setGoldGramsTables((prevTables) => [...prevTables, [{ netGram: 0, goldGram: '' }]]);
    setFinanceTables((prevTables) => [...prevTables, [{ netGram: '' }]]);
  };

  const resetTables = () => {
    setGoldGramsTables([[{ netGram: 0, goldGram: '' }]]);
    setFinanceTables([[{ netGram: '' }]]);
    setTotalNetGram(0);
    setTotalFinance(0);
  };

  const renderTable = (rows, tableIndex, handleChange, dataTable, type) => (
    <TableContainer component={Paper} key={tableIndex}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>{type === 'gold' ? 'Carat' : 'No.'}</TableCell>
            <TableCell>{type === 'gold' ? 'Value' : 'Int Rate'}</TableCell>
            <TableCell>{type === 'gold' ? 'Gold Gram' : 'Per Gram'}</TableCell>
            <TableCell>Net Gram</TableCell>
            {type === 'finance' && <TableCell>Total Finance</TableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, rowIndex) => (
            <TableRow key={rowIndex}>
              <TableCell>{type === 'gold' ? row.name : rowIndex + 1}</TableCell>
              <TableCell>{type === 'gold' ? row.caratPercentage : row.interestRate}</TableCell>
              <TableCell>
                {type === 'gold' ? (
                  <TextField
                    variant='outlined'
                    size='small'
                    value={dataTable[tableIndex][rowIndex]?.goldGram || ''}
                    onChange={(e) => handleChange(tableIndex, rowIndex, e.target.value)}
                    InputProps={{ sx: { color: 'red' } }}
                  />
                ) : (
                  row.ratePerGram
                )}
              </TableCell>
              <TableCell>
                <TextField
                  variant='outlined'
                  size='small'
                  value={dataTable[tableIndex][rowIndex]?.netGram || ''}
                  onChange={(e) => type === 'finance' && handleChange(tableIndex, rowIndex, e.target.value)}
                  readOnly={type === 'gold'}
                  InputProps={{ sx: { color: 'red' } }}
                />
              </TableCell>
              {type === 'finance' && (
                <>
                  <TableCell>
                    <TextField
                      variant='outlined'
                      size='small'
                      value={
                        dataTable[tableIndex]?.[rowIndex]?.netGram && row?.ratePerGram
                          ? (Number(dataTable[tableIndex][rowIndex].netGram) * Number(row.ratePerGram)).toFixed(2)
                          : ''
                      }
                      readOnly
                      InputProps={{ sx: { color: 'red' } }}
                    />
                  </TableCell>
                </>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  const renderTable2 = (rows, tableIndex, handleChange, dataTable, type) => (
    <TableContainer component={Paper} key={tableIndex}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>{type === 'gold' ? 'Carat' : 'No.'}</TableCell>
            <TableCell>{type === 'gold' ? 'Value' : 'Int Rate'}</TableCell>
            <TableCell>{type === 'gold' ? 'Gold Gram' : 'Per Gram'}</TableCell>
            <TableCell>Net Gram</TableCell>
            {type === 'finance' && <TableCell>Total Finance</TableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, rowIndex) => (
            <TableRow key={rowIndex}>
              <TableCell>{type === 'gold' ? row.name : rowIndex + 1}</TableCell>
              <TableCell>{type === 'gold' ? row.caratPercentage : row.interestRate}</TableCell>
              <TableCell>
                {type === 'gold' ? (
                  <TextField
                    variant='outlined'
                    size='small'
                    value={dataTable[tableIndex][rowIndex]?.goldGram || ''}
                    onChange={(e) => handleChange(tableIndex, rowIndex, e.target.value)}
                    InputProps={{ sx: { color: 'red' } }}
                  />
                ) : (
                  row.ratePerGram
                )}
              </TableCell>
              <TableCell>
                <TextField
                  variant='outlined'
                  size='small'
                  value={totalNetGram || ''}
                  onChange={(e) => type === 'finance' && handleChange(tableIndex, rowIndex, e.target.value)}
                  readOnly={type === 'gold'}
                  InputProps={{ sx: { color: 'red' } }}
                />
              </TableCell>
              {type === 'finance' && (
                <>
                  <TableCell>
                    <TextField
                      variant='outlined'
                      size='small'
                      value={
                        dataTable[tableIndex]?.[rowIndex]?.netGram && row?.ratePerGram
                          ? (Number(dataTable[tableIndex][rowIndex].netGram) * Number(row.ratePerGram)).toFixed(2)
                          : (totalNetGram * Number(row.ratePerGram)).toFixed(2)
                      }
                      readOnly
                      InputProps={{ sx: { color: 'red' } }}
                    />
                  </TableCell>
                </>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <Box p={3}>
      <Box display='flex' justifyContent='space-between' my={2} textAlign='center'>
        <Typography variant='h6' gutterBottom>
          Type 1
        </Typography>
        <Box>
          <Button variant='contained' onClick={addTable}>
            Add
          </Button>
          <Button variant='outlined' onClick={resetTables} style={{ marginLeft: '10px' }}>
            Reset
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {goldGramsTables.map((_, tableIndex) => (
          <Grid item xs={12} md={4} key={tableIndex}>
            {renderTable(carat, tableIndex, handleGoldGramChange, goldGramsTables, 'gold')}
          </Grid>
        ))}
      </Grid>

      <Box mt={4}>
        <Typography variant='h6' gutterBottom>
          Total Net Gram: {totalNetGram}
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {financeTables.map((_, tableIndex) => (
          <Grid item xs={12} md={4} key={tableIndex}>
            {renderTable2(scheme, tableIndex, handleNetGramChange2, financeTables, 'finance')}
          </Grid>
        ))}
      </Grid>

      <Box mt={4}>
        <Typography variant='h6' gutterBottom>
          Total Finance: {totalFinance}
        </Typography>
      </Box>
    </Box>
  );
}

export default GoldLoanCalculator;
