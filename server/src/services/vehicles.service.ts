import type { Request, Response, NextFunction } from 'express';
import {sequelize, Vehicle, VehiclePhoto, Service, Brand, VehicleModel, Observation, User} from '../models_seq/index.js';
import { pool } from "../models";

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
            console.log(models)
            return res.status(200).json(models);
        } catch (err) {
            return res.status(500)
        }
    };

    static async newVehicle (req: Request, res: Response, next: NextFunction) {
        try {
            const file: Buffer<ArrayBufferLike> | null = (req as any).file ? (req as any).file : null;

            const modelId: string | undefined = req.body.model_id ? req.body.model_id : undefined;
            const makingYear: number | undefined = req.body.making_year ? Number(req.body.making_year) : undefined;
            const purchaseDate: string | undefined = req.body.purchase_date ? req.body.purchase_date : undefined;

            const newVehicle = await Vehicle.create(
                {
                    model_id: modelId ? modelId : undefined,
                    making_year: makingYear ? makingYear : undefined,
                    purchase_date: purchaseDate ? purchaseDate : undefined,
                    main_picture: file ? file.buffer : undefined,
                }
            );

            res.status(201).json(newVehicle);
        }
        catch (error) {
            console.error('Error fetching data from database:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

}


