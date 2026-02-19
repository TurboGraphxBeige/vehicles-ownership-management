-- Sample data: insert brands/models and create a car (Postgres + pgcrypto)
-- Assumes schema "data" exists and pgcrypto extension is available.
-- This script is idempotent (won't create duplicates for the same brand/model)
-- and will create a Toyota -> Prius C model and a car record: Toyota Prius C 2015 purchased 2020-08-01.

--BEGIN;
CREATE SCHEMA IF NOT EXISTS data
create extension if not exists pgcrypto;
INSERT INTO data.role (role_id, role_name) VALUES (uuidv4(), 'admin');
INSERT INTO data."user" (user_id, username, password, role_id)
VALUES (
           uuidv4(),
           'myuser',
           crypt('mypass', gen_salt('bf')),
           (SELECT role_id FROM data.role WHERE role_name = 'admin')
       );
-- 1) Ensure Toyota brand exists (insert only if missing), then get brand_id
WITH existing_brand AS (
    SELECT brand_id
    FROM data.brand
    WHERE brand_name = 'Toyota'
),
     ins_brand AS (
INSERT INTO data.brand (brand_id, brand_name)
SELECT uuidv4(), 'Toyota'
    WHERE NOT EXISTS (SELECT 1 FROM existing_brand)
  RETURNING brand_id
),
brand_upsert AS (
SELECT brand_id FROM ins_brand
UNION ALL
SELECT brand_id FROM existing_brand
    ),

-- 2) Ensure model "Prius C" exists for that brand (insert only if missing), then get model_id
    existing_model AS (
SELECT model_id
FROM data.model
WHERE model_name = 'Prius C'
  AND brand_id = (SELECT brand_id FROM brand_upsert LIMIT 1)
    ),
    ins_model AS (
INSERT INTO data.model (model_id, brand_id, model_name)
SELECT uuidv4(), (SELECT brand_id FROM brand_upsert LIMIT 1), 'Prius C'
WHERE NOT EXISTS (SELECT 1 FROM existing_model)
    RETURNING model_id
    ),
    model_upsert AS (
SELECT model_id FROM ins_model
UNION ALL
SELECT model_id FROM existing_model
    )

-- 3) Insert the car (Toyota Prius C 2015, purchased 2020-08-01) referencing the model
INSERT INTO data.vehicle (vehicle_id, model_id, making_year, purchase_date)
SELECT gen_random_uuid(), (SELECT model_id FROM model_upsert LIMIT 1), 2015, '2020-08-01'::date
WHERE NOT EXISTS (
    SELECT 1 FROM data.vehicle c
    WHERE c.model_id = (SELECT model_id FROM model_upsert LIMIT 1)
  AND c.making_year = 2015
  AND c.purchase_date = '2020-08-01'::date
    );

--COMMIT;

-- You can verify what was created with:
-- SELECT * FROM data.brand WHERE brand_name = 'Toyota';
-- SELECT * FROM data.model WHERE model_name = 'Prius C' AND brand_id = (SELECT brand_id FROM data.brand WHERE brand_name = 'Toyota');
-- SELECT * FROM data.vehicle WHERE model_id = (SELECT model_id FROM data.model WHERE model_name = 'Prius C' AND brand_id = (SELECT brand_id FROM data.brand WHERE brand_name = 'Toyota')) AND making_year = 2015 AND purchase_date = '2020-08-01';