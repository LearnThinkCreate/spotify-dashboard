

export function generateDateFilters(month, year): {
    sum_units?: "hours" | "minutes" | null;
    dateFilter?: string | null;
  
  }{
    const minYearDate = 2014;
  
    // Helper function to create date filter string in SQL syntax
    function getDateFilterString(start, end) {
      return `(ts > '${start.toISOString()}' AND ts < '${end.toISOString()}')`;
    }
  
    // When both month and year are null
    if (month == null && year == null) {
      return { sum_units: 'hours', dateFilter: null };
    }
  
    // Current date for calculations
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
  
    // When only year is provided
    if (year != null && month == null) {
      const startOfYear = new Date(year, 0, 1);
      const endOfYear = new Date(year + 1, 0, 1);
      return { sum_units: 'hours', dateFilter: getDateFilterString(startOfYear, endOfYear) };
    }
  
    // When only month is provided
    if (month != null && year == null) {
      let dateFilters = [];
      for (let yr = minYearDate; yr <= currentYear; yr++) {
        const startOfMonth = new Date(yr, month - 1, 1);
        const endOfMonth = new Date(yr, month, 1);
        dateFilters.push(getDateFilterString(startOfMonth, endOfMonth));
      }
      return { sum_units: 'hours', dateFilter: `(${dateFilters.join(' OR ')})` };
    }
  
    // When both month and year are provided
    if (month != null && year != null) {
      const startOfMonth = new Date(year, month - 1, 1);
      const endOfMonth = new Date(year, month, 1);
      return { sum_units: 'minutes', dateFilter: getDateFilterString(startOfMonth, endOfMonth) };
    }
  }
  