import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Collapse,
  Box,
  Typography,
  Paper,
  Button
} from '@mui/material';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';

const CollapsibleTable = ({ data, allow }) => {
  
  const downloadCSV = () => {
    const headers = ['Header', 'Median 50%', 'Optimal 63%', 'Top 75%', 'Order'];
    
    const rows = data.map(row => [
      row.Header,
      row.median_50perc_population ?? 'N/A',
      row.optimal_63perc_population ?? 'N/A',
      row.top_75perc_population ?? 'N/A',
      row.order
    ]);

    const csvContent = [
      headers.join(','), // Header row
      ...rows.map(row => row.join(',')) // Data rows
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'table_data.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      {allow && (
        <Button variant="contained" onClick={downloadCSV} sx={{ marginBottom: 2 }}>
          Download CSV
        </Button>
      )}
      <TableContainer component={Paper}>
        <Table aria-label="collapsible table" sx={{ border: '1px solid black' }}>
          <TableHead>
            <TableRow>
              <TableCell style={{ fontWeight: 'bold', backgroundColor: '#f0f0f0', border: '1px solid black' }} />
              <TableCell style={{ fontWeight: 'bold', backgroundColor: '#f0f0f0', border: '1px solid black' }}>Header</TableCell>
              <TableCell style={{ fontWeight: 'bold', backgroundColor: '#f0f0f0', border: '1px solid black' }}>Median 50%</TableCell>
              <TableCell style={{ fontWeight: 'bold', backgroundColor: '#f0f0f0', border: '1px solid black' }}>Optimal 63%</TableCell>
              <TableCell style={{ fontWeight: 'bold', backgroundColor: '#f0f0f0', border: '1px solid black' }}>Top 75%</TableCell>
              <TableCell style={{ fontWeight: 'bold', backgroundColor: '#f0f0f0', border: '1px solid black' }}>Order</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, index) => (
              <Row key={index} row={row} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

const Row = ({ row }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <TableRow>
        <TableCell style={{ border: '1px solid black' }}>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </IconButton>
        </TableCell>
        <TableCell style={{ border: '1px solid black' }}>{row.Header}</TableCell>
        <TableCell style={{ border: '1px solid black' }}>{row.median_50perc_population ?? 'N/A'}</TableCell>
        <TableCell style={{ border: '1px solid black' }}>{row.optimal_63perc_population ?? 'N/A'}</TableCell>
        <TableCell style={{ border: '1px solid black' }}>{row.top_75perc_population ?? 'N/A'}</TableCell>
        <TableCell style={{ border: '1px solid black' }}>{row.order}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0, border: '1px solid black' }} colSpan={7}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <Typography variant="h6" gutterBottom component="div">
                Records
              </Typography>
              <Table size="small" aria-label="records">
                <TableHead>
                  <TableRow>
                    <TableCell style={{ fontWeight: 'bold', backgroundColor: '#e0e0e0', border: '1px solid black' }}>Header</TableCell>
                    <TableCell style={{ fontWeight: 'bold', backgroundColor: '#e0e0e0', border: '1px solid black' }}>Categories</TableCell>
                    <TableCell style={{ fontWeight: 'bold', backgroundColor: '#e0e0e0', border: '1px solid black' }}>Median 50%</TableCell>
                    <TableCell style={{ fontWeight: 'bold', backgroundColor: '#e0e0e0', border: '1px solid black' }}>Optimal 63%</TableCell>
                    <TableCell style={{ fontWeight: 'bold', backgroundColor: '#e0e0e0', border: '1px solid black' }}>Top 75%</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.records.map((record, index) => (
                    <TableRow key={index}>
                      <TableCell style={{ border: '1px solid black' }}>{record.Header}</TableCell>
                      <TableCell style={{ border: '1px solid black' }}>{record.CATEGORIES}</TableCell>
                      <TableCell style={{ border: '1px solid black' }}>{record.median_50perc_population}</TableCell>
                      <TableCell style={{ border: '1px solid black' }}>{record.optimal_63perc_population}</TableCell>
                      <TableCell style={{ border: '1px solid black' }}>{record.top_75perc_population}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

export default CollapsibleTable;
