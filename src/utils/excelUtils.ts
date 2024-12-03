import * as XLSX from 'xlsx';

export const exportToExcel = (originalData: any[][], changes: any[]) => {
  // Create a new workbook
  const wb = XLSX.utils.book_new();
  
  // Create a deep copy of the original data
  const exportData = originalData.map(row => [...row]);
  
  // Add a new column header for revised values
  if (exportData[0]) {
    exportData[0].push('Revised Values');
  }
  
  // Create a style object for yellow background
  const yellowFill = {
    fill: {
      fgColor: { rgb: "FFFF00" }
    }
  };
  
  // Track cells that need yellow highlighting
  const yellowCells: { [key: string]: boolean } = {};
  
  // Add revised values in the new column and track cells to highlight
  changes.forEach(change => {
    const rowIndex = change.row - 1;
    const colIndex = exportData[0]?.length - 1 || 0;
    
    if (exportData[rowIndex]) {
      exportData[rowIndex][colIndex] = change.new;
      yellowCells[XLSX.utils.encode_cell({ r: rowIndex, c: colIndex })] = true;
    }
  });
  
  // Convert data to worksheet
  const ws = XLSX.utils.aoa_to_sheet(exportData);
  
  // Apply yellow highlighting to changed cells
  for (const cellRef in yellowCells) {
    if (!ws[cellRef]) continue;
    
    ws[cellRef].s = yellowFill;
  }
  
  // Add changes log sheet
  const changesSheet = XLSX.utils.json_to_sheet(changes.map(change => ({
    Row: change.row,
    Column: change.column,
    'Original Value': change.original,
    'New Value': change.new,
    'Impact': (parseFloat(change.new) || 0) - (parseFloat(change.original) || 0)
  })));
  
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