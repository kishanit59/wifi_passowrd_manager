import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.resolve(__dirname, '../.env');

try {
    const envContent = fs.readFileSync(envPath, 'utf-8');
    const env = {};
    envContent.split('\n').forEach(line => {
        const [key, value] = line.split('=');
        if (key && value) {
            env[key.trim()] = value.trim();
        }
    });

    const supabaseUrl = env.VITE_SUPABASE_URL;
    const supabaseKey = env.VITE_SUPABASE_ANON_KEY;

    if (!supabaseUrl || supabaseUrl.includes('your_supabase_project_url')) {
        console.error('Error: VITE_SUPABASE_URL is not configured in .env');
        process.exit(1);
    }

    if (!supabaseKey || supabaseKey.includes('your_supabase_anon_key')) {
        console.error('Error: VITE_SUPABASE_ANON_KEY is not configured in .env');
        process.exit(1);
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('Testing connection to Supabase...');

    // Try to select from the table. Even if empty, it should not error if connected.
    const { count, error } = await supabase
        .from('wifi_networks')
        .select('*', { count: 'exact', head: true });

    if (error) {
        console.error('Connection failed:', error.message);
        process.exit(1);
    }

    console.log('Success! Connected to Supabase.');
    console.log('Table "wifi_networks" exists and is accessible.');

} catch (err) {
    console.error('Verification failed:', err.message);
    process.exit(1);
}
