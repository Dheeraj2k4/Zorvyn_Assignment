// Utility functions for exporting transaction data to CSV or JSON

/**
 * Download an in-memory string as a file.
 */
function downloadFile(content, filename, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

/**
 * Export transactions as a CSV file.
 * @param {Array}  transactions  — array of transaction objects
 * @param {string} filename      — base filename (no extension)
 */
export function exportToCSV(transactions, filename = 'transactions') {
  const headers = ['ID', 'Date', 'Description', 'Amount', 'Category', 'Type'];

  const rows = transactions.map((t) => [
    t.id,
    t.date,
    `"${String(t.description).replace(/"/g, '""')}"`,
    t.amount,
    t.category,
    t.type,
  ]);

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  downloadFile(csvContent, `${filename}.csv`, 'text/csv;charset=utf-8;');
}

/**
 * Export transactions as a JSON file.
 * @param {Array}  transactions  — array of transaction objects
 * @param {string} filename      — base filename (no extension)
 */
export function exportToJSON(transactions, filename = 'transactions') {
  const jsonContent = JSON.stringify(transactions, null, 2);
  downloadFile(jsonContent, `${filename}.json`, 'application/json');
}
