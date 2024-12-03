import * as XLSX from 'xlsx';

export const exportToExcel = (originalData: any[][], changes: any[]) => {
  // Create a new workbook
  const wb = XLSX.utils.book_new();
  
  // Create worksheet with original data
  const ws = XLSX.utils.aoa_to_sheet(originalData);
  
  // Add a new sheet for changes
  const changesSheet = XLSX.utils.json_to_sheet(changes);
  
  // Add both sheets to workbook
  XLSX.utils.book_append_sheet(wb, ws, "Original with Changes");
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