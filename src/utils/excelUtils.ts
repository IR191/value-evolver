import * as XLSX from 'xlsx';

export const exportToExcel = (originalData: any[][], changes: any[]) => {
  // Create a new workbook
  const wb = XLSX.utils.book_new();
  
  // Create a deep copy of the original data and preserve formatting
  const exportData = originalData.map(row => [...row]);
  
  // Separate changes by direction
  const verticalChanges = changes.filter(change => change.direction === 'vertical');
  const horizontalChanges = changes.filter(change => change.direction === 'horizontal');
  
  // Add vertical changes (to the right of the original values)
  if (verticalChanges.length > 0) {
    // Add header for revised values column
    exportData[0].push('Revised Values');
    
    // Add vertical changes
    verticalChanges.forEach(change => {
      const rowIndex = change.row - 1;
      if (!exportData[rowIndex]) {
        exportData[rowIndex] = Array(exportData[0].length).fill('');
      }
      // Place new value in the last column
      exportData[rowIndex][exportData[0].length - 1] = change.new;
    });
  }
  
  // Add horizontal changes (underneath the original values)
  if (horizontalChanges.length > 0) {
    horizontalChanges.forEach(change => {
      const rowIndex = exportData.length;
      const colIndex = change.column - 1;
      
      // Create new row if needed
      if (!exportData[rowIndex]) {
        exportData[rowIndex] = Array(exportData[0].length).fill('');
      }
      
      // Place new value in the correct column underneath
      exportData[rowIndex][colIndex] = change.new;
    });
  }
  
  // Convert data to worksheet
  const ws = XLSX.utils.aoa_to_sheet(exportData);
  
  // Define styles
  const borderStyle = { style: 'thin', color: { rgb: "000000" } };
  const yellowFill = { fgColor: { rgb: "FFFF00" } };
  
  // Apply formatting to all cells
  const range = XLSX.utils.decode_range(ws['!ref'] || 'A1');
  for (let row = range.s.r; row <= range.e.r; row++) {
    for (let col = range.s.c; col <= range.e.c; col++) {
      const cellRef = XLSX.utils.encode_cell({ r: row, c: col });
      
      // Check if this cell contains a changed value
      const isVerticalChange = verticalChanges.some(change => 
        change.row - 1 === row && col === exportData[0].length - 1
      );
      
      const isHorizontalChange = horizontalChanges.some(change =>
        row === exportData.length - 1 && change.column - 1 === col
      );
      
      // Apply styles
      ws[cellRef] = ws[cellRef] || { v: '', t: 's' };
      ws[cellRef].s = {
        border: {
          top: borderStyle,
          bottom: borderStyle,
          left: borderStyle,
          right: borderStyle
        },
        // Apply yellow fill only to changed cells
        ...(isVerticalChange || isHorizontalChange ? { fill: yellowFill } : {})
      };
    }
  }
  
  // Create changes log sheet
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
      changesSheet[cellRef] = changesSheet[cellRef] || { v: '', t: 's' };
      changesSheet[cellRef].s = {
        border: {
          top: borderStyle,
          bottom: borderStyle,
          left: borderStyle,
          right: borderStyle
        }
      };
    }
  }
  
  // Add sheets to workbook and save
  XLSX.utils.book_append_sheet(wb, ws, "Budget Comparison");
  XLSX.utils.book_append_sheet(wb, changesSheet, "Change Log");
  XLSX.writeFile(wb, "budget_changes.xlsx");
};

export const applyModelFeedback = (changes: any[], feedback: 'positive' | 'negative') => {
  // In a real implementation, this would send the feedback to a backend
  // For now, we'll just log it
  console.log(`Model feedback received: ${feedback}`, changes);
  return true;
};