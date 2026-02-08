import type { Request, Response, NextFunction } from 'express';
import {sequelize, Vehicle, VehiclePhoto, Brand, VehicleModel, Observation, User} from '../models_seq/index.js';

export class vehicleService {



   static async getVehicles(req: Request, res: Response, next: NextFunction) {
       try {
           const vehicles = await Vehicle.findAll({ include: [
                   { model: VehiclePhoto, as: 'photos' },
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

            //const contacts_c = await Contact.create({ contact_name: 'Jane' });
            //const contacts = await Contact.findAll();
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
}
