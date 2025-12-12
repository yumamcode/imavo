import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// サーバーサイドでの利用を想定しているため、SERVICE_ROLE_KEYがあればそれを使う
// これによりRLSをバイパスしてデータ操作が可能になる（管理者権限）
export const supabase = createClient(supabaseUrl, supabaseKey);





