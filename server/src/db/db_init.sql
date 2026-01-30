DROP SCHEMA "admin" CASCADE;
CREATE SCHEMA "admin" AUTHORIZATION postgres;

DROP SCHEMA "data" CASCADE;
CREATE SCHEMA "data" AUTHORIZATION postgres;

DROP SCHEMA data_import CASCADE;
CREATE SCHEMA data_import AUTHORIZATION postgres;

DROP SCHEMA viewer CASCADE;
CREATE SCHEMA viewer AUTHORIZATION postgres;

ALTER DEFAULT PRIVILEGES IN SCHEMA viewer GRANT SELECT, UPDATE, DELETE, INSERT ON TABLES TO car_app_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA viewer GRANT USAGE ON SEQUENCES TO car_app_user;



CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

--------------------------------------------------------
--------------------------------------------------------
--------------------------------------------------------


-- Create tables in order of dependencies

-- role table
CREATE TABLE data.role (
    role_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), 
    role_name VARCHAR(255) NOT NULL
);

-- user table
CREATE TABLE data."user" (
    user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), 
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role_id UUID NOT NULL,
    FOREIGN KEY (role_id) REFERENCES data.role(role_id) ON DELETE RESTRICT ON UPDATE CASCADE
);

-- contact table
CREATE TABLE data.contact (
    contact_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), 
    contact_name VARCHAR(255) NOT NULL,
    address VARCHAR(255),
    telephone VARCHAR(20),
    email VARCHAR(255)
);

-- brand table
CREATE TABLE data.brand (
    brand_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), 
    brand_name VARCHAR(255) NOT NULL
);

-- model table
CREATE TABLE data.model (
    model_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), 
    brand_id UUID NOT NULL,
    model_name VARCHAR(255) NOT NULL,
    FOREIGN KEY (brand_id) REFERENCES data.brand(brand_id) ON DELETE RESTRICT ON UPDATE CASCADE
);

-- vehicle table
CREATE TABLE data.vehicle (
    vehicle_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), 
    model_id UUID NOT NULL,
    making_year INTEGER,
    purchase_date DATE,
    price_paid DECIMAL(10, 2),
    invoice bytea,
    user_id UUID,
    contact_id UUID,
    FOREIGN KEY (model_id) REFERENCES data.model(model_id) ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY (user_id) REFERENCES data."user"(user_id) ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY (contact_id) REFERENCES data.contact(contact_id) ON DELETE RESTRICT ON UPDATE CASCADE
);

-- vehicle_photo table
CREATE TABLE data.vehicle_photo (
    vehicle_photo_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), 
    vehicle_id UUID NOT NULL,
    mimetype VARCHAR(255),
    original_name VARCHAR(255),
    description TEXT,
    image BYTEA,
    FOREIGN KEY (vehicle_id) REFERENCES data.vehicle(vehicle_id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- car_component_system table
CREATE TABLE data.vehicle_component_system (
    vehicle_component_system_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), 
    name VARCHAR(255) NOT NULL
);

-- car_component table
CREATE TABLE data.vehicle_component (
    vehicle_component_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), 
    vehicle_component_system_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    FOREIGN KEY (vehicle_component_system_id) REFERENCES data.vehicle_component_system(vehicle_component_system_id) ON DELETE RESTRICT ON UPDATE CASCADE
);

-- service table
CREATE TABLE data.service (
    service_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), 
    vehicle_id UUID NOT NULL,
    service_date DATE NOT NULL,
    service_request_description TEXT,
    contact_id UUID NOT NULL,
    total_cost DECIMAL(10, 2),
    invoice VARCHAR(255),
    notes TEXT,
    FOREIGN KEY (vehicle_id) REFERENCES data.vehicle(vehicle_id) ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY (contact_id) REFERENCES data.contact(contact_id) ON DELETE RESTRICT ON UPDATE CASCADE
);

-- observation table
CREATE TABLE data.observation (
    observation_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), 
    service_id UUID NOT NULL,
    vehicle_id UUID,
    vehicle_component_id UUID,
    vehicle_component_system_id UUID,
    service_date DATE,
    description TEXT,
    estimated_cost DECIMAL(10, 2),
    priority VARCHAR(50),
    status VARCHAR(50),
    FOREIGN KEY (service_id) REFERENCES data.service(service_id) ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY (vehicle_id) REFERENCES data.vehicle(vehicle_id) ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY (vehicle_component_id) REFERENCES data.vehicle_component(vehicle_component_id) ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY (vehicle_component_system_id) REFERENCES data.vehicle_component_system(vehicle_component_system_id) ON DELETE SET NULL ON UPDATE CASCADE
    -- CHECK constraint to ensure observation.vehicle_id matches service.vehicle_id

);

-- observation_photo table
CREATE TABLE data.observation_photo (
    observation_photo_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), 
    observation_id UUID NOT NULL,
    mimetype VARCHAR(255),
    original_name VARCHAR(255),
    description TEXT,
    image BYTEA,
    FOREIGN KEY (observation_id) REFERENCES data.observation(observation_id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- maintenance_task table
CREATE TABLE data.maintenance_task (
    maintenance_task_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), 
    service_id UUID NOT NULL,
    vehicle_id UUID NOT NULL,
    vehicle_component_id UUID,
    vehicle_component_system_id UUID,
    description TEXT,
    cost DECIMAL(10, 2),
    maintenance_task_type VARCHAR(255),
    notes TEXT,
    FOREIGN KEY (service_id) REFERENCES data.service(service_id) ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY (vehicle_id) REFERENCES data.vehicle(vehicle_id) ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY (vehicle_component_id) REFERENCES data.vehicle_component(vehicle_component_id) ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY (vehicle_component_system_id) REFERENCES data.vehicle_component_system(vehicle_component_system_id) ON DELETE SET NULL ON UPDATE CASCADE
    -- CHECK constraint to ensure maintenance_task.vehicle_id matches service.vehicle_id

);

-- Create indexes for foreign keys and commonly queried fields
CREATE INDEX idx_user_role_id ON data."user"(role_id);
CREATE INDEX idx_vehicle_model_id ON data.vehicle(model_id);
CREATE INDEX idx_vehicle_user_id ON data.vehicle(user_id);
CREATE INDEX idx_vehicle_contact_id ON data.vehicle(contact_id);
CREATE INDEX idx_vehicle_photo_vehicle_id ON data.vehicle_photo(vehicle_id);
CREATE INDEX idx_vehicle_component_system_id ON data.vehicle_component(vehicle_component_system_id);
CREATE INDEX idx_service_vehicle_id ON data.service(vehicle_id);
CREATE INDEX idx_service_contact_id ON data.service(contact_id);
CREATE INDEX idx_observation_service_id ON data.observation(service_id);
CREATE INDEX idx_observation_vehicle_id ON data.observation(vehicle_id);
CREATE INDEX idx_observation_photo_observation_id ON data.observation_photo(observation_id);
CREATE INDEX idx_maintenance_task_service_id ON data.maintenance_task(service_id);
CREATE INDEX idx_maintenance_task_vehicle_id ON data.maintenance_task(vehicle_id);


--------------------------------------------------------
--------------------------------------------------------
--------------------------------------------------------


-- viewer.brands source

CREATE OR REPLACE VIEW viewer.brands
AS SELECT brand.brand_id,
    brand.brand_name AS brand_name,
    json_agg(json_build_object('model_id', model.model_id, 'model_name', model.model_name)) AS models
   FROM data.brand
     LEFT JOIN data.model USING (brand_id)
  GROUP BY brand.brand_id, brand.brand_name;


-- viewer.car_images source

CREATE OR REPLACE VIEW viewer.vehicle_images
AS SELECT c.vehicle_id,
    c.model_id,
    brand.brand_id,
    model.model_name,
    brand.brand_name,
    c.making_year,
    c.purchase_date,
    json_agg(json_build_object('photoid', i.vehicle_id, 'data', concat('data:', 'data:image/jpeg', ';base64,', encode(i.image, 'base64'::text)))) FILTER (WHERE i.vehicle_id IS NOT NULL) AS images,
    c.user_id
   FROM data.vehicle c
     LEFT JOIN data.vehicle_photo i ON i.vehicle_id = c.vehicle_id
     LEFT JOIN data.model USING (model_id)
     LEFT JOIN data.brand USING (brand_id)
  GROUP BY c.vehicle_id, brand.brand_id, brand.brand_name, c.model_id, model.model_name, c.making_year, c.purchase_date;


CREATE OR REPLACE VIEW viewer.role AS
SELECT * FROM data.role;

CREATE OR REPLACE VIEW viewer.contact AS
SELECT * FROM data.contact;

CREATE OR REPLACE VIEW viewer.brand AS
SELECT * FROM data.brand;

CREATE OR REPLACE VIEW viewer.model AS
SELECT * FROM data.model;

-- "user" is a reserved word; keep quotes for both schema/table
CREATE OR REPLACE VIEW viewer."user" AS
SELECT * FROM data."user";

--DROP VIEW IF EXISTS viewer.car;
CREATE OR REPLACE VIEW viewer.vehicle AS
SELECT * FROM data.vehicle;

-- VIEW car_data
CREATE OR REPLACE VIEW viewer.vehicle_data
AS 
SELECT
  c.vehicle_id,
  c.model_id,
  b.brand_id,
  m.model_name,
  b.brand_name,
  c.making_year,
  c.purchase_date,
  COALESCE(imgs.images, '[]'::jsonb) AS images,
  COALESCE(sv.services, '[]'::jsonb) AS services,
  c.user_id
FROM data.vehicle c
LEFT JOIN data.model m ON m.model_id = c.model_id
LEFT JOIN data.brand b ON b.brand_id = m.brand_id
-- images aggregated per car
LEFT JOIN LATERAL (
  SELECT
    jsonb_agg(
      jsonb_build_object(
        'vehicle_photo_id', p.vehicle_photo_id,
        'mimetype', p.mimetype,
        'original_name', p.original_name,
        'data', concat('data:', p.mimetype, ';base64,', encode(p.image, 'base64'))
      ) 
    ) AS images
  FROM data.vehicle_photo p
  WHERE p.vehicle_id = c.vehicle_id
) imgs ON true
-- services aggregated per car; each service contains recommendations and maintenance_tasks
LEFT JOIN LATERAL (
  SELECT
    jsonb_agg(
      jsonb_build_object(
        'service_id', s.service_id,
        'service_date', s.service_date,
        'service_request_description', s.service_request_description,
        'contact_id', s.contact_id,
        'total_cost', s.total_cost,
        'notes', s.notes,
        'recommendations', COALESCE(recs.recommendations, '[]'::jsonb),
        'maintenance_tasks', COALESCE(mts.maintenance_tasks, '[]'::jsonb)
      ) ORDER BY s.service_date DESC
    ) AS services
  FROM data.service s
  -- recommendations for each service
  LEFT JOIN LATERAL (
    SELECT
      jsonb_agg(
        jsonb_build_object(
          'observation_id', sr.observation_id,
          'service_date', sr.service_date,
          'description', sr.description,
          'estimated_cost', sr.estimated_cost,
          'priority', sr.priority,
          'status', sr.status,
          'vehicle_component_id', sr.vehicle_component_id,
          'vehicle_component_system_id', sr.vehicle_component_system_id
        ) 
      ) AS recommendations
    FROM data.observation sr
    WHERE sr.service_id = s.service_id
  ) recs ON true
  -- maintenance tasks for each service
  LEFT JOIN LATERAL (
    SELECT
      jsonb_agg(
        jsonb_build_object(
          'maintenance_task_id', mt.maintenance_task_id,
          'description', mt.description,
          'cost', mt.cost,
          'notes', mt.notes,
          'maintenance_task_type', mt.maintenance_task_type,
          'vehicle_component_id', mt.vehicle_component_id,
          'vehicle_component_system_id', mt.vehicle_component_system_id
        ) 
      ) AS maintenance_tasks
    FROM data.maintenance_task mt
    WHERE mt.service_id = s.service_id
  ) mts ON true

  WHERE s.vehicle_id = c.vehicle_id
) sv ON true
;


  
  

CREATE OR REPLACE VIEW viewer.vehicle_photo AS
SELECT * FROM data.vehicle_photo;

CREATE OR REPLACE VIEW viewer.service AS
SELECT * FROM data.service;

CREATE OR REPLACE VIEW viewer.car_component_system AS
SELECT * FROM data.vehicle_component_system;

CREATE OR REPLACE VIEW viewer.car_component AS
SELECT * FROM data.vehicle_component;

CREATE OR REPLACE VIEW viewer.maintenance_task AS
SELECT * FROM data.maintenance_task;

CREATE OR REPLACE VIEW viewer.service_recommendation AS
SELECT * FROM data.observation;

-- Optional: expose viewer schema to PUBLIC (adjust for your security requirements)

GRANT SELECT, UPDATE, DELETE, INSERT ON ALL TABLES IN SCHEMA viewer TO car_app_user;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA viewer TO car_app_user;
GRANT USAGE ON SCHEMA viewer TO car_app_user;


