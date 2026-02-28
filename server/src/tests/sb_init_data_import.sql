-- Sample data: insert brands/models and create a car (Postgres + pgcrypto)
-- Assumes schema "data" exists and pgcrypto extension is available.
-- This script is idempotent (won't create duplicates for the same brand/model)
-- and will create a Toyota -> Prius C model and a car record: Toyota Prius C 2015 purchased 2020-08-01.

--BEGIN;
CREATE SCHEMA IF NOT EXISTS data;
create extension if not exists pgcrypto;
INSERT INTO data.role (role_id, role_name) VALUES (uuidv4(), 'admin');


INSERT INTO "data"."user" (user_id,first_name,last_name,username,"password",role_id) VALUES
    ('468d1e13-3931-425b-b3fe-235fa90dcdd8'::uuid,NULL,NULL,'myuser','$2a$06$/Y1pY3MUCgaBiCaOOVWJye6B6IALo1GjNLqQ1SRa0bIlm.uZQ8WXC','33d10df8-0c11-45d0-a823-6999e1d7f6a4'::uuid);

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


INSERT INTO "data".brand (brand_id,brand_name) VALUES
                                                   ('b683b4da-7087-41e6-af38-3257512a2c6a'::uuid,'Honda'),
                                                   ('b658294e-f2d6-490b-9f49-51c0600a3f52'::uuid,'Ford'),
                                                   ('1f1e4759-8fdc-4cdf-ba48-7d21a8949b8f'::uuid,'Chevrolet'),
                                                   ('7ea0c436-2b9d-4a91-ab5d-b3f69ce66c46'::uuid,'BMW'),
                                                   ('ac4eca37-1b87-4f11-9989-4d9627080de1'::uuid,'Mercedes-Benz'),
                                                   ('8ddc192f-669c-40a3-9676-cd4521664ec3'::uuid,'Volkswagen'),
                                                   ('433f299e-6f9d-4f77-b5a0-96e825f276ae'::uuid,'Audi'),
                                                   ('ca3f8a8f-4b6e-4041-a126-f166ad9cd34f'::uuid,'Hyundai'),
                                                   ('d580e597-15f2-4e4d-a125-e40806eb31d2'::uuid,'Kia');
INSERT INTO "data".brand (brand_id,brand_name) VALUES
                                                   ('8ea5f796-a0dd-49f4-8f90-eceb7dca08b2'::uuid,'Nissan'),
                                                   ('35cfe3e2-50a1-4bfb-8683-ddc41414f216'::uuid,'Tesla'),
                                                   ('cb556919-f609-455e-aef6-a2682d443091'::uuid,'Subaru'),
                                                   ('09ea147d-cdff-43b5-b9bc-68163a70fc8f'::uuid,'Mazda'),
                                                   ('3e318a04-bf69-4ac0-972e-6fe23cafa3f0'::uuid,'Lexus');

INSERT INTO "data".model (model_id,brand_id,model_name) VALUES
                                                            ('bd95423f-0d7e-4053-9c9f-783de0b8db80'::uuid,'ac4eca37-1b87-4f11-9989-4d9627080de1'::uuid,'Prius V'),
                                                            ('2596b4e4-f1dc-4428-9c55-490d0945c765'::uuid,'ac4eca37-1b87-4f11-9989-4d9627080de1'::uuid,'Prius'),
                                                            ('86949063-8ff1-46a0-9def-58cc53f38bfd'::uuid,'ac4eca37-1b87-4f11-9989-4d9627080de1'::uuid,'Corolla'),
                                                            ('138f1c75-adca-4c17-91a6-78eea663e954'::uuid,'ac4eca37-1b87-4f11-9989-4d9627080de1'::uuid,'GLC'),
                                                            ('ca45b95d-33c0-437e-9720-ba299c570974'::uuid,'ac4eca37-1b87-4f11-9989-4d9627080de1'::uuid,'GLE'),
                                                            ('31a78bb7-443f-4fb1-b9d0-4c798cde829f'::uuid,'ac4eca37-1b87-4f11-9989-4d9627080de1'::uuid,'GLS'),
                                                            ('f3f38352-f182-4577-9443-e0f4c29cfb61'::uuid,'ac4eca37-1b87-4f11-9989-4d9627080de1'::uuid,'A-Class'),
                                                            ('96cdd986-1fc1-48f1-9582-530aefccec6a'::uuid,'ac4eca37-1b87-4f11-9989-4d9627080de1'::uuid,'CLA'),
                                                            ('ecc7fc58-d094-4ba8-adf3-57d3631cb775'::uuid,'ac4eca37-1b87-4f11-9989-4d9627080de1'::uuid,'G-Class');
INSERT INTO "data".model (model_id,brand_id,model_name) VALUES
                                                            ('c21f0410-8990-4f9d-9d61-3ccf3fe7a7cc'::uuid,'ac4eca37-1b87-4f11-9989-4d9627080de1'::uuid,'AMG GT'),
                                                            ('a3f79396-fe58-48e8-8d30-d422943a80c9'::uuid,'ac4eca37-1b87-4f11-9989-4d9627080de1'::uuid,'EQE'),
                                                            ('3618d317-72f1-4a77-a00a-141255a79c92'::uuid,'ac4eca37-1b87-4f11-9989-4d9627080de1'::uuid,'EQS'),
                                                            ('5d83c925-89df-4ddd-8025-cb6a5d16f85e'::uuid,'ac4eca37-1b87-4f11-9989-4d9627080de1'::uuid,'EQC'),
                                                            ('8a8fe9aa-407e-48ec-b67f-d943a55cb75e'::uuid,'ac4eca37-1b87-4f11-9989-4d9627080de1'::uuid,'Sprinter'),
                                                            ('ba2439ec-57b0-4ea8-b22a-b1979dfd46ae'::uuid,'ca3f8a8f-4b6e-4041-a126-f166ad9cd34f'::uuid,'Elantra'),
                                                            ('372592eb-49c9-471f-bc10-64527516b51f'::uuid,'ca3f8a8f-4b6e-4041-a126-f166ad9cd34f'::uuid,'Sonata'),
                                                            ('badcbcd5-339a-493e-9f1c-ede3c9bda145'::uuid,'ca3f8a8f-4b6e-4041-a126-f166ad9cd34f'::uuid,'Santa Fe'),
                                                            ('76f347ba-9c50-493b-848f-42a257416f18'::uuid,'ca3f8a8f-4b6e-4041-a126-f166ad9cd34f'::uuid,'Tucson'),
                                                            ('bd4a2ce9-776e-4364-b152-7a648b3eed48'::uuid,'ca3f8a8f-4b6e-4041-a126-f166ad9cd34f'::uuid,'Kona');
INSERT INTO "data".model (model_id,brand_id,model_name) VALUES
                                                            ('578144ac-f773-45dd-b9ac-abaf5e7ebcb4'::uuid,'ca3f8a8f-4b6e-4041-a126-f166ad9cd34f'::uuid,'Venue'),
                                                            ('e1710aec-e21f-41fe-858a-fd7821580c79'::uuid,'ca3f8a8f-4b6e-4041-a126-f166ad9cd34f'::uuid,'Palisade'),
                                                            ('a3e72252-a03a-4b82-8e49-49b7844a7670'::uuid,'ca3f8a8f-4b6e-4041-a126-f166ad9cd34f'::uuid,'Ioniq'),
                                                            ('1d6003f4-25da-4f86-a748-bf015e9e906a'::uuid,'ca3f8a8f-4b6e-4041-a126-f166ad9cd34f'::uuid,'Ioniq 5'),
                                                            ('abaab33f-ec94-450c-8f19-05d22d790c0b'::uuid,'ca3f8a8f-4b6e-4041-a126-f166ad9cd34f'::uuid,'Ioniq 6'),
                                                            ('dc15556a-26e3-414c-9e97-7e022f5148fe'::uuid,'ca3f8a8f-4b6e-4041-a126-f166ad9cd34f'::uuid,'Ioniq 7'),
                                                            ('44a702ad-13a0-4e33-bf76-cab9677e123b'::uuid,'ca3f8a8f-4b6e-4041-a126-f166ad9cd34f'::uuid,'Accent'),
                                                            ('1c9f0861-d113-4bdd-ad0b-168a980c0616'::uuid,'ca3f8a8f-4b6e-4041-a126-f166ad9cd34f'::uuid,'Veloster'),
                                                            ('8d30b59a-bacc-4e8d-b876-7c6f917bb4d2'::uuid,'ca3f8a8f-4b6e-4041-a126-f166ad9cd34f'::uuid,'Nexo'),
                                                            ('d4aeff24-cf63-4e13-9e0c-8c8d644c6164'::uuid,'ca3f8a8f-4b6e-4041-a126-f166ad9cd34f'::uuid,'Bayon');

