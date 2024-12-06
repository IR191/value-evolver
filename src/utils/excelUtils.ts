import * as XLSX from 'xlsx';

export const exportToExcel = (originalData: any[][], changes: any[]) => {
  // Create a new workbook
  const wb = XLSX.utils.book_new();
  
  // Create a deep copy of the original data
  const exportData = originalData.map(row => [...row]);
  
  // Separate changes by direction
  const verticalChanges = changes.filter(change => change.direction === 'vertical');
  const horizontalChanges = changes.filter(change => change.direction === 'horizontal');
  
  // Add header for revised values column if there are vertical changes
  if (verticalChanges.length > 0) {
    exportData[0].push('Revised Values');
  }
  
  // Process vertical changes (add to the right)
  verticalChanges.forEach(change => {
    const rowIndex = change.row - 1;
    if (!exportData[rowIndex]) {
      exportData[rowIndex] = Array(exportData[0].length).fill('');
    }
    exportData[rowIndex][exportData[0].length - 1] = change.new;
  });
  
  // Process horizontal changes (add underneath)
  if (horizontalChanges.length > 0) {
    // Add a blank row as separator
    exportData.push(Array(exportData[0].length).fill(''));
    
    // Add header row for horizontal changes
    exportData.push(['Revised Values (Horizontal Changes)', ...Array(exportData[0].length - 1).fill('')]);
    
    // Add the horizontal changes
    horizontalChanges.forEach(change => {
      const newRow = Array(exportData[0].length).fill('');
      newRow[change.column - 1] = change.new;
      exportData.push(newRow);
    });
  }
  
  // Convert data to worksheet
  const ws = XLSX.utils.aoa_to_sheet(exportData);
  
  // Define cell styles
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
        row >= exportData.length - horizontalChanges.length && 
        change.column - 1 === col
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
        // Apply yellow fill to changed cells
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
  
  // Add sheets to workbook
  XLSX.utils.book_append_sheet(wb, ws, "Budget Comparison");
  XLSX.utils.book_append_sheet(wb, changesSheet, "Change Log");
  
  // Write the file
  XLSX.writeFile(wb, "budget_changes.xlsx");
};

export const applyModelFeedback = (changes: any[], feedback: 'positive' | 'negative') => {
  // In a real implementation, this would send the feedback to a backend
  // For now, we'll just log it
  console.log(`Model feedback received: ${feedback}`, changes);
  return true;
};
