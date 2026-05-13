
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://bqjugxnognrwcsmlthpq.supabase.co";
const supabaseKey = "sb_publishable_4HSeOLIUU7F_xksiXkKlLg_JxFwZJQe";

export const supabase = createClient(supabaseUrl, supabaseKey);
