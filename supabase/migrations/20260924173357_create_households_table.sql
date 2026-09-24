/*
# Create households table for Suraksha-AI Heatwave Preparedness Agent

1. New Tables
- `households`
  - `id` (uuid, primary key)
  - `name` (text, household name/ID)
  - `location` (text, selected city/area)
  - `seniors` (int, number of seniors aged 60+)
  - `children` (int, number of children under 5)
  - `outdoor_workers` (int, number of outdoor workers)
  - `housing_type` (text: concrete, tin_roof, mud_house)
  - `cooling_assets` (text[]: ac, cooler, fan, none)
  - `water_source` (text: piped, borewell, tanker, none)
  - `vulnerability_score` (int, computed 0-100)
  - `risk_level` (text: low, medium, high)
  - `risk_factors` (jsonb, array of risk factor strings)
  - `action_plan` (jsonb, action checklist with categories and checked state)
  - `created_at` (timestamp)

2. Security
- Enable RLS on `households`.
- Allow anon + authenticated CRUD — this is a no-auth app (field workers use it without sign-in).
- All data is intentionally shared/public for field worker collaboration.
*/

CREATE TABLE IF NOT EXISTS households (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL DEFAULT 'Unnamed Household',
  location text DEFAULT 'Lucknow',
  seniors int NOT NULL DEFAULT 0,
  children int NOT NULL DEFAULT 0,
  outdoor_workers int NOT NULL DEFAULT 0,
  housing_type text NOT NULL DEFAULT 'concrete',
  cooling_assets text[] NOT NULL DEFAULT '{}',
  water_source text NOT NULL DEFAULT 'piped',
  vulnerability_score int NOT NULL DEFAULT 0,
  risk_level text NOT NULL DEFAULT 'low',
  risk_factors jsonb NOT NULL DEFAULT '[]'::jsonb,
  action_plan jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE households ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_households" ON households;
CREATE POLICY "anon_select_households" ON households FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_households" ON households;
CREATE POLICY "anon_insert_households" ON households FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_households" ON households;
CREATE POLICY "anon_update_households" ON households FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_households" ON households;
CREATE POLICY "anon_delete_households" ON households FOR DELETE
  TO anon, authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_households_created_at ON households (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_households_risk_level ON households (risk_level);
CREATE INDEX IF NOT EXISTS idx_households_location ON households (location);
