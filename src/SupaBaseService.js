import { createClient } from '@supabase/supabase-js';

class SupabaseService {
  constructor(supabaseUrl, supabaseAnonKey) {
    this.supabase = createClient(supabaseUrl, supabaseAnonKey);
  }

  async saveData(tableName, data) {
    const { data: insertedData, error } = await this.supabase
      .from(tableName)
      .insert(data);

    if (error) {
      throw new Error(`Error saving data to ${tableName}: ${error.message}`);
    }

    return insertedData;
  }

  // Add other methods as needed, e.g., for fetching data, updating, deleting, etc.
}

export default SupabaseService;