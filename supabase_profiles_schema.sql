-- KisanSeva User Profiles Table

CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  name VARCHAR(255),
  phone VARCHAR(255),
  email VARCHAR(255),
  farm_location VARCHAR(255),
  farm_size VARCHAR(255),
  primary_crops VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Allow users to view only their OWN profile (Privacy/Encryption equivalent for RLS)
CREATE POLICY "Users can view own profile."
  ON profiles FOR SELECT
  USING ( auth.uid() = id );

-- Allow users to insert their own profile
CREATE POLICY "Users can insert their own profile."
  ON profiles FOR INSERT
  WITH CHECK ( auth.uid() = id );

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile."
  ON profiles FOR UPDATE
  USING ( auth.uid() = id );
