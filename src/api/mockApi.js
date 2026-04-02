// Simulated async API layer — mimics real network latency for add/edit/delete operations
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

export const mockApi = {
  /** Simulates fetching transactions from a server */
  async fetchTransactions() {
    await delay(450);
    return 'ok';
  },

  /** Simulates POSTing a new transaction */
  async createTransaction(transaction) {
    await delay(320);
    return transaction;
  },

  /** Simulates PATCHing an existing transaction */
  async updateTransaction(transaction) {
    await delay(280);
    return transaction;
  },

  /** Simulates DELETEing a transaction */
  async deleteTransaction(id) {
    await delay(220);
    return id;
  },
};
