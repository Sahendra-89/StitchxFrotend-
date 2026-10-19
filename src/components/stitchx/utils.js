/**
 * Utility functions for StitchX Document Management
 */

export function formatINR(val) {
  const num = Number(val) || 0;
  return '₹' + num.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function formatDate(d) {
  if (!d) return '—';
  try {
    return new Date(d).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return '—';
  }
}

export function formatDateTime(d) {
  if (!d) return '—';
  try {
    return new Date(d).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return '—';
  }
}

export function getStatusBadge(status) {
  switch (status?.toLowerCase()) {
    case 'paid':
    case 'accepted':
    case 'signed':
    case 'active':
    case 'verified':
      return {
        bg: 'bg-emerald-50 text-emerald-800 border-emerald-300 font-black',
        dot: 'bg-emerald-600',
        label: status.toUpperCase(),
      };
    case 'issued':
    case 'sent':
    case 'in_progress':
    case 'partially_paid':
      return {
        bg: 'bg-blue-50 text-blue-800 border-blue-300 font-black',
        dot: 'bg-blue-600',
        label: status.replace('_', ' ').toUpperCase(),
      };
    case 'draft':
    case 'draft_suggestion':
    case 'in_review':
    case 'pending_verification':
      return {
        bg: 'bg-amber-50 text-amber-900 border-amber-300 font-black',
        dot: 'bg-amber-600',
        label: status.replace('_', ' ').toUpperCase(),
      };
    case 'overdue':
    case 'rejected':
    case 'declined':
    case 'cancelled':
    case 'terminated':
      return {
        bg: 'bg-rose-50 text-rose-800 border-rose-300 font-black',
        dot: 'bg-rose-600',
        label: status.replace('_', ' ').toUpperCase(),
      };
    case 'converted_to_invoice':
      return {
        bg: 'bg-purple-50 text-purple-800 border-purple-300 font-black',
        dot: 'bg-purple-600',
        label: 'INVOICED',
      };
    default:
      return {
        bg: 'bg-slate-100 text-slate-800 border-slate-300 font-black',
        dot: 'bg-slate-500',
        label: (status || 'UNKNOWN').toUpperCase(),
      };
  }
}

/**
 * Client-side CSV Exporter
 */
export function exportToCSV(filename, rows) {
  if (!rows || !rows.length) return;
  const separator = ',';
  const keys = Object.keys(rows[0]);
  const csvContent =
    keys.join(separator) +
    '\n' +
    rows
      .map((row) => {
        return keys
          .map((k) => {
            let cell = row[k] === null || row[k] === undefined ? '' : row[k];
            cell = cell instanceof Date ? cell.toLocaleString() : cell.toString();
            cell = cell.replace(/"/g, '""');
            if (cell.search(/("|,|\n)/g) >= 0) {
              cell = `"${cell}"`;
            }
            return cell;
          })
          .join(separator);
      })
      .join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
