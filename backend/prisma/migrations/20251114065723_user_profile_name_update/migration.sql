ALTER TABLE "users" ADD COLUMN "first_name" TEXT;
ALTER TABLE "users" ADD COLUMN "last_name" TEXT;
ALTER TABLE "users" ADD COLUMN "about" TEXT;

UPDATE "users"
SET 
  "first_name" = split_part("name", ' ', 1),
  "last_name" = CASE 
                  WHEN position(' ' in "name") > 0 THEN substring("name" from position(' ' in "name") + 1) 
                  ELSE NULL 
                END
WHERE "name" IS NOT NULL;

ALTER TABLE "users" DROP COLUMN "name";