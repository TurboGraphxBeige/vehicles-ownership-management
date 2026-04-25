import type { Request, Response, NextFunction } from 'express';
import {sequelize, Vehicle, VehiclePhoto, Service, Brand, VehicleModel, Observation, User} from '../models/index.js';
import {OdometerReading} from "../models/odometer_reading.js";
import {MaintenanceTask} from "../models/maintenance_task";

export class vehicleService {
    static async getVehicles(req: Request, res: Response, next: NextFunction) {
       try {
           const vehicles = await Vehicle.findAll({ include: [
                   { model: VehiclePhoto, as: 'photos' },
                   { model: Service, as: 'services' },
                   { model: Observation, as: 'observations' },
                   { model: MaintenanceTask, as: 'maintenances' },
                   { model: OdometerReading, as: 'odometer_readings' },
                   { model: VehicleModel, as: 'model', include: [{ model: Brand, as: 'brand' }] },
                   { model: User, as: 'user', attributes: ['user_id', 'first_name', 'last_name'] },

               ]
           });
            return res.status(200).json(vehicles);
        } catch (err) {
            return res.status(500)
        }
    };

    static async getVehicle(req: Request, res: Response, next: NextFunction) {
        try {
            console.log('getCar single', req.params)
            //const result = await pool.query('SELECT * FROM viewer.car_data WHERE car_id = $1', [req.params.car_id])
            const vehicle: Vehicle | null = await Vehicle.findOne({ where: { vehicle_id: req.params.vehicle_id } });
            res.json(vehicle);
        }
        catch (error) {
            console.error('Error fetching data from database:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    };

    static async deleteVehicle(req: Request, res: Response, next: NextFunction) {
        try {
            console.log('getCar single', req.params)
            //const result = await pool.query('SELECT * FROM viewer.car_data WHERE car_id = $1', [req.params.car_id])
            const vehicle: number = await Vehicle.destroy({ where: { vehicle_id: req.params.vehicle_id } });
            res.json(vehicle);
        }
        catch (error) {
            console.error('Error fetching data from database:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    };

    static async getBrands(req: Request, res: Response, next: NextFunction) {
        try {
            const brands = await Brand.findAll({
                include: [
                    { model: VehicleModel, as: 'models' },
                ]
            });
            return res.status(200).json(brands);
        } catch (err) {
            return res.status(500)
        }
    };

    static async getModels(req: Request, res: Response, next: NextFunction) {
        try {
            const models = await VehicleModel.findAll({
                include: [
                    { model: Brand, as: 'brand' },
                ]
            });

            return res.status(200).json(models);
        } catch (err) {
            return res.status(500)
        }
    };

    static async newVehicle (req: Request, res: Response, next: NextFunction) {
        try {
            const file: Buffer | null = (req as any).file ? (req as any).file?.buffer : null;

            const modelId: string | undefined = req.body.model_id ? req.body.model_id : undefined;
            const makingYear: number | undefined = req.body.making_year ? Number(req.body.making_year) : undefined;
            const purchaseDate: string | undefined = req.body.purchase_date ? req.body.purchase_date : undefined;
            const odometerReading: number | undefined = req.body.odometer_reading ? Number(req.body.odometer_reading) : undefined;
            const pricePaid: number | undefined = req.body.price_paid ? Number(req.body.price_paid) : undefined;
            const transaction = await sequelize.transaction();

            const newPhoto = await VehiclePhoto.create(
                {
                    vehicle_id: undefined,
                    mimetype: 'image/jpeg',
                    original_name: '',
                    image: file ? file as Buffer : null,
                }, {transaction}
            );

            const newVehicle = await Vehicle.create(
                {
                    model_id: modelId ? modelId : undefined,
                    making_year: makingYear ? makingYear : undefined,
                    purchase_date: purchaseDate ? purchaseDate : undefined,
                    main_picture: newPhoto ? newPhoto.vehicle_photo_id : undefined,
                    price_paid: pricePaid ? pricePaid : undefined,
                }, {transaction}
            );

            const newOdometerReading: OdometerReading = await OdometerReading.create(
                {
                    vehicle_id: newVehicle ? newVehicle.vehicle_id : undefined,
                    reading: odometerReading ? odometerReading: undefined
                }, {transaction}
            );

            await newPhoto.update(
                { vehicle_id: String(newVehicle.vehicle_id) },
                { transaction }
            );

            await transaction.commit();
            res.status(201).json(newVehicle);
        }
        catch (error) {
            console.error('Error fetching data from database:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }


    static async updateObservation (req: Request, res: Response, next: NextFunction) {
        try {
            console.log("updateObservation", req.body);
            let observationId: string | undefined;
            let serviceId: string | undefined;
            let vehicleId: string | undefined;
            let vehicleComponentId: string | undefined;
            let vehicleComponentSystemId: string | undefined;
            let description: string | undefined;
            let estimatedCost: number | undefined;
            let priority: string | undefined;
            let status: string | undefined;
            let observationDate: string | undefined;

            if (req.body?.observation_id) { observationId = req.body.observation_id ? String(req.body.observation_id) : undefined }
            if (req.body?.service_id) { serviceId = req.body.service_id ? String(req.body.service_id) : undefined }
            if (req.body?.contact_id) { vehicleId = req.body.contact_id ? String(req.body.contact_id) : undefined }
            if (req.body?.vehicle_component_id) { vehicleComponentId = req.body.vehicle_component_id ? String(req.body.vehicle_component_id) : undefined }
            if (req.body?.vehicle_component_system_id) { vehicleComponentSystemId = req.body.vehicle_component_system_id ? String(req.body.vehicle_component_system_id) : undefined }
            if (req.body?.description) { description = req.body.description ? String(req.body.description) : undefined }
            if (req.body?.estimated_cost) { estimatedCost = req.body.estimated_cost ? Number(req.body.estimated_cost) : undefined }
            if (req.body?.priority) { priority = req.body.priority ? String(req.body.priority) : undefined }
            if (req.body?.status) { status = req.body.status ? String(req.body.status) : undefined }
            if (req.body?.observation_date) { observationDate = req.body.observation_date ? String(req.body.observation_date) : undefined }

            const transaction = await sequelize.transaction();

            const updates: any = {};
            if (observationId) updates.observation_id = observationId;
            if (serviceId !== undefined) updates.service_id = serviceId;
            if (vehicleId) updates.contact_id = vehicleId;
            if (vehicleComponentId !== undefined) updates.vehicle_component_id = vehicleComponentId;
            if (vehicleComponentSystemId) updates.vehicle_component_system_id = vehicleComponentSystemId;
            if (description) updates.description = description;
            if (estimatedCost !== undefined) updates.estimated_cost = estimatedCost;
            if (priority) updates.priority = priority;
            if (status) updates.status = status;
            if (observationDate) updates.observation_date = observationDate;

            const observation: Observation | null = await Observation.findOne({ where: { observation_id: req.params.observation_id }, transaction });
            await observation?.update(updates, { transaction });

            await transaction.commit();
            res.status(201).json(observation);
        }
        catch (error) {
            console.error('Error fetching data from database:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    static async updateVehicle (req: Request, res: Response, next: NextFunction) {
        try {
            console.log(req.body);
            let modelId: string | undefined;
            let makingYear: number | undefined;
            let purchaseDate: string | undefined;
            let pricePaid: number | undefined;
            let userId: string | undefined;
            let contactId: string | undefined;

            if (req.body?.model_id) { modelId = req.body.model_id ? req.body.model_id : undefined }
            if (req.body?.user_id) { userId = req.body.user_id ? req.body.user_id : undefined }
            if (req.body?.contact_id) { contactId = req.body.contact_id ? req.body.contact_id : undefined }
            if (req.body?.making_year) { makingYear = req.body.making_year ? Number(req.body.making_year) : undefined }
            if (req.body?.purchase_date) { purchaseDate = req.body.purchase_date ? req.body.purchase_date : undefined }

            if (req.body?.price_paid) { pricePaid = req.body.price_paid ? Number(req.body.price_paid) : undefined }
            const transaction = await sequelize.transaction();

            const updates: any = {};
            if (modelId) updates.model_id = modelId;
            if (userId) updates.user_id = userId;
            if (contactId) updates.contact_id = contactId;
            if (makingYear) updates.making_year = makingYear;
            if (purchaseDate) updates.purchase_date = purchaseDate;
            if (pricePaid) updates.price_paid = pricePaid;

            const vehicle: Vehicle | null = await Vehicle.findOne({ where: { vehicle_id: req.params.vehicle_id }, transaction });
            await vehicle?.update(updates, { transaction });

            await transaction.commit();
            res.status(201).json(vehicle);
        }
        catch (error) {
            console.error('Error fetching data from database:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    static async getVehicleImages ( req: Request, res: Response, next: NextFunction) {
        try {
            console.log("todo")
        }
        catch (error) {
            console.error('Error fetching data from database:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }


    static async newVehicleImage(req: Request, res: Response, next: NextFunction) {
        try {
            if (!req.params?.vehicle_id || !req.params?.vehicle_id) { return }

            const file: Buffer | null = (req as any).file ? (req as any).file?.buffer : null;
            const vehicle_id: string = req.params.vehicle_id as string

            //const result = await pool.query('INSERT INTO viewer.vehicle_photo (vehicle_id, mimetype, original_name, image) VALUES ($1, $2, $3, $4) RETURNING *', [req.body.vehicle_id, req.body.mimetype, req.body.original_name, file.buffer]);
            const newPhoto = await VehiclePhoto.create({
                vehicle_id: vehicle_id,
                mimetype: 'image/jpeg',
                original_name: '',
                image: file ? file as Buffer : null,
            })
            console.log('newPhoto', newPhoto.dataValues)
            res.status(201).json(newPhoto.dataValues);
        }
        catch (error) {
            console.error('Error fetching data from database:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }

    };

    // TODO: Handle ownership of the vehicle here. You can't delete a photo that does not belong to a vehicle not associated to the user
    static async deleteVehicleImage(req: Request, res: Response, next: NextFunction) {
        try {
            console.log("req.body", req.params);
            if (!req.params.vehicle_id || !req.params.vehicle_id) { return }

            const vehicle_id: string = req.params.vehicle_id as string
            const vehicle_photo_id: string = req.params.vehicle_photo_id as string

            //const result = await pool.query('DELETE FROM viewer.vehicle_photo WHERE vehicle_id = $1 AND vehicle_photo_id = $2 RETURNING *', [req.params.vehicle_id, req.params.vehicle_photo_id]);
            const deletedVehicleImage = await VehiclePhoto.destroy({
                where: {
                    vehicle_id: vehicle_id,
                    vehicle_photo_id: vehicle_photo_id
                }
            })
            console.log('deletedVehicleImage', deletedVehicleImage)
            res.status(201).json(deletedVehicleImage);
        }
        catch (error) {
            console.error('Error fetching data from database:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    };

    static async newService(req: Request, res: Response, next: NextFunction) {
        try {
            console.log("service req.body", req.body);
            const service: Service = await Service.create({
                vehicle_id: req.body.vehicle_id,
                service_date: req.body.service_date,
                total_cost: req.body.total_cost,
                contact_id: req.body.contact_id,
                service_request_description: req.body.service_request_description,
                notes: req.body.notes,
                //invoice: req.body.invoice,
            })
            res.status(201).json(service.dataValues);
        }
        catch (error) {
            console.error('Error fetching data from database:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

}


