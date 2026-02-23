/**
 * SQL to create the appointments table in Supabase
 * 
 * Run this in the Supabase SQL Editor:
 */

/*
CREATE TABLE appointments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  service TEXT NOT NULL,
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  notes TEXT,
  status TEXT DEFAULT 'Pending' CHECK (status IN ('Pending', 'Confirmed', 'Completed', 'Cancelled'))
);

CREATE TABLE services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  name TEXT NOT NULL,
  description TEXT,
  price TEXT,
  icon TEXT,
  is_active BOOLEAN DEFAULT true
);

CREATE TABLE offers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  title TEXT NOT NULL,
  description TEXT,
  discount_code TEXT,
  expiry_date DATE,
  is_active BOOLEAN DEFAULT true
);

CREATE TABLE gallery (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  image_url TEXT NOT NULL,
  caption TEXT
);

CREATE TABLE reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  name TEXT NOT NULL,
  role TEXT,
  text TEXT NOT NULL,
  rating INTEGER DEFAULT 5
);

-- RLS Policies
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Allow public read
CREATE POLICY "Allow public select services" ON services FOR SELECT USING (is_active = true);
CREATE POLICY "Allow public select offers" ON offers FOR SELECT USING (is_active = true);
CREATE POLICY "Allow public select gallery" ON gallery FOR SELECT USING (true);
CREATE POLICY "Allow public select reviews" ON reviews FOR SELECT USING (true);

-- Allow public insert for appointments
CREATE POLICY "Allow public insert appointments" ON appointments FOR INSERT WITH CHECK (true);

-- Admin access is handled via service_role key on the backend
*/
