CREATE TABLE IF NOT EXISTS story_fires (
  story_id TEXT PRIMARY KEY,
  fire_count INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS user_fires (
  user_id TEXT,
  story_id TEXT,
  PRIMARY KEY (user_id, story_id)
);

-- Upserts the row (seeding with p_initial if new) then increments by 1
CREATE OR REPLACE FUNCTION increment_fire_count(p_story_id TEXT, p_initial INTEGER)
RETURNS void LANGUAGE plpgsql AS $$
BEGIN
  INSERT INTO story_fires (story_id, fire_count)
    VALUES (p_story_id, p_initial + 1)
  ON CONFLICT (story_id)
    DO UPDATE SET fire_count = story_fires.fire_count + 1;
END;
$$;

-- Decrements fire_count by 1, flooring at 0
CREATE OR REPLACE FUNCTION decrement_fire_count(p_story_id TEXT)
RETURNS void LANGUAGE plpgsql AS $$
BEGIN
  UPDATE story_fires
    SET fire_count = GREATEST(fire_count - 1, 0)
  WHERE story_id = p_story_id;
END;
$$;
