// This file will be removed once we implement the actual database
// For now we'll use in-memory data storage

export const mockDatabase = {
  products: [],
  clients: [],
  suppliers: [],
  transactions: [],
  quotes: [],
  deliveryNotes: [],
  creditNotes: [],
  purchaseOrders: [],
  purchaseReceipts: [],
  purchaseReturns: []
};

// Mock database operations
export const db = {
  select: async (table: string) => {
    return mockDatabase[table as keyof typeof mockDatabase];
  },
  insert: async (table: string, data: any) => {
    const tableData = mockDatabase[table as keyof typeof mockDatabase];
    if (Array.isArray(tableData)) {
      tableData.push({ ...data, id: crypto.randomUUID() });
      return data;
    }
    throw new Error(`Table ${table} not found`);
  },
  update: async (table: string, id: string, data: any) => {
    const tableData = mockDatabase[table as keyof typeof mockDatabase];
    if (Array.isArray(tableData)) {
      const index = tableData.findIndex(item => item.id === id);
      if (index !== -1) {
        tableData[index] = { ...tableData[index], ...data };
        return tableData[index];
      }
    }
    throw new Error(`Item not found in ${table}`);
  },
  delete: async (table: string, id: string) => {
    const tableData = mockDatabase[table as keyof typeof mockDatabase];
    if (Array.isArray(tableData)) {
      const index = tableData.findIndex(item => item.id === id);
      if (index !== -1) {
        tableData.splice(index, 1);
        return true;
      }
    }
    throw new Error(`Item not found in ${table}`);
  }
};