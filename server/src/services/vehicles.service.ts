import type { Request, Response, NextFunction } from 'express';
import {sequelize, Vehicle, VehiclePhoto, Service, Brand, VehicleModel, Observation, User} from '../models/index.js';

export class vehicleService {
    static async getVehicles(req: Request, res: Response, next: NextFunction) {
       try {
           const vehicles = await Vehicle.findAll({ include: [
                   { model: VehiclePhoto, as: 'photos' },
                   { model: Service, as: 'services' },
                   { model: Observation, as: 'observations' },
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
             //where: {deletedAt: null, topicId: req.params.id}
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

}


