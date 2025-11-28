# Supabase Database Setup

## 1. Create Supabase Account
- Go to https://supabase.com
- Sign up for free account
- Create new project

## 2. Create Database Tables

Run these SQL commands in Supabase SQL Editor:

```sql
-- Visitors table
CREATE TABLE visitors (
  id SERIAL PRIMARY KEY,
  fingerprint TEXT NOT NULL,
  date DATE NOT NULL,
  visits INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(fingerprint, date)
);

-- Ratings table  
CREATE TABLE ratings (
  id SERIAL PRIMARY KEY,
  fingerprint TEXT UNIQUE NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Shares table
CREATE TABLE shares (
  id SERIAL PRIMARY KEY,
  platform TEXT NOT NULL,
  date DATE NOT NULL,
  count INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(platform, date)
);

-- Enable Row Level Security (RLS)
ALTER TABLE visitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE ratings ENABLE ROW LEVEL SECURITY;  
ALTER TABLE shares ENABLE ROW LEVEL SECURITY;

-- Create policies for public access
CREATE POLICY "Allow public read access" ON visitors FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON visitors FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON visitors FOR UPDATE USING (true);

CREATE POLICY "Allow public read access" ON ratings FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON ratings FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read access" ON shares FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON shares FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON shares FOR UPDATE USING (true);
```

## 3. Get API Keys
- Go to Settings > API
- Copy your Project URL
- Copy your anon/public key

## 4. Update Configuration
Replace in `src/utils/supabase.ts`:
```typescript
const SUPABASE_URL = 'https://your-project.supabase.co'
const SUPABASE_ANON_KEY = 'your-anon-key-here'
```

## 5. Features Enabled
- ✅ Unique visitor tracking (no duplicates on refresh)
- ✅ Persistent ratings across devices  
- ✅ Real share count tracking
- ✅ Daily visitor statistics
- ✅ Cross-device data sync