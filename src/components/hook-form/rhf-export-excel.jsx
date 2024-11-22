import React from 'react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { Button } from '@mui/material';
import Iconify from '../iconify';

const RHFExportExcel = ({
                       data = [],
                       fileName = 'ExportedData',
                       sheetName = 'Sheet1'
                     }) => {
  const handleExport = () => {
    if (!data || !data.length) {
      alert('No data available to export.');
      return;
    }

    // Create workbook and worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(data);

    // Append worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

    // Convert to binary data and create a blob
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });

    // Save the blob
    saveAs(blob, `${fileName}.xlsx`);
  };

  return (
    <Button sx={{fontWeight:'normal',p:0}}
      onClick={handleExport}
    >
      <Iconify icon='uiw:file-excel' />Export to Excel
    </Button>
  );
};

export default RHFExportExcel;
