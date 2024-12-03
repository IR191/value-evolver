import * as XLSX from 'xlsx';

export const exportToExcel = (originalData: any[][], changes: any[]) => {
  // Create a new workbook
  const wb = XLSX.utils.book_new();
  
  // Create a deep copy of the original data
  const exportData = originalData.map(row => [...row]);
  
  // Track vertical and horizontal changes
  const verticalChanges = changes.filter(change => change.direction === 'vertical');
  const horizontalChanges = changes.filter(change => change.direction === 'horizontal');
  
  // Add vertical changes (to the right)
  if (verticalChanges.length > 0) {
    exportData[0].push('Revised Values');
    verticalChanges.forEach(change => {
      const rowIndex = change.row - 1;
      const colIndex = exportData[0].length - 1;
      if (exportData[rowIndex]) {
        exportData[rowIndex][colIndex] = change.new;
      }
    });
  }
  
  // Add horizontal changes (underneath)
  if (horizontalChanges.length > 0) {
    horizontalChanges.forEach(change => {
      const rowIndex = exportData.length;
      const colIndex = change.column - 1;
      if (!exportData[rowIndex]) {
        exportData[rowIndex] = Array(exportData[0].length).fill('');
      }
      exportData[rowIndex][colIndex] = change.new;
    });
  }
  
  // Convert data to worksheet
  const ws = XLSX.utils.aoa_to_sheet(exportData);
  
  // Define border style
  const borderStyle = {
    style: 'thin',
    color: { rgb: "000000" }
  };
  
  // Define cell style with borders and optional yellow fill
  const cellStyle = (isChanged: boolean) => ({
    border: {
      top: borderStyle,
      bottom: borderStyle,
      left: borderStyle,
      right: borderStyle
    },
    ...(isChanged && {
      fill: {
        fgColor: { rgb: "FFFF00" }
      }
    })
  });
  
  // Apply styles to all cells
  const range = XLSX.utils.decode_range(ws['!ref'] || 'A1');
  for (let row = range.s.r; row <= range.e.r; row++) {
    for (let col = range.s.c; col <= range.e.c; col++) {
      const cellRef = XLSX.utils.encode_cell({ r: row, c: col });
      const isChanged = changes.some(change => 
        (change.row - 1 === row && exportData[0].length - 1 === col) || // vertical changes
        (exportData.length - 1 === row && change.column - 1 === col)    // horizontal changes
      );
      
      if (!ws[cellRef]) {
        ws[cellRef] = { v: '', t: 's' };
      }
      
      ws[cellRef].s = cellStyle(isChanged);
    }
  }
  
  // Add changes log sheet
  const changesSheet = XLSX.utils.json_to_sheet(changes.map(change => ({
    Row: change.row,
    Column: change.column,
    'Original Value': change.original,
    'New Value': change.new,
    'Direction': change.direction,
    'Impact': (parseFloat(change.new) || 0) - (parseFloat(change.original) || 0)
  })));
  
  // Apply borders to changes log sheet
  const changesRange = XLSX.utils.decode_range(changesSheet['!ref'] || 'A1');
  for (let row = changesRange.s.r; row <= changesRange.e.r; row++) {
    for (let col = changesRange.s.c; col <= changesRange.e.c; col++) {
      const cellRef = XLSX.utils.encode_cell({ r: row, c: col });
      if (!changesSheet[cellRef]) {
        changesSheet[cellRef] = { v: '', t: 's' };
      }
      changesSheet[cellRef].s = cellStyle(false);
    }
  }
  
  // Add both sheets to workbook
  XLSX.utils.book_append_sheet(wb, ws, "Budget Comparison");
  XLSX.utils.book_append_sheet(wb, changesSheet, "Change Log");
  
  // Save the file
  XLSX.writeFile(wb, "budget_changes.xlsx");
};

export const applyModelFeedback = (changes: any[], feedback: 'positive' | 'negative') => {
  // In a real implementation, this would send the feedback to a backend
  // For now, we'll just log it
  console.log(`Model feedback received: ${feedback}`, changes);
  return true;
};