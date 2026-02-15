import { Pool } from 'pg'; // Import from pg
//import 'dotenv/config';
import express from 'express';
import type { Request, Response, NextFunction } from 'express';

import { pool } from "./index.js";
import jwt from "jsonwebtoken";
import multer from "multer";

const JWT_SECRET = 'your_jwt_secret_key';

export class Vehicles {
    static async getBrands(req: Request, res: Response, next: NextFunction) {
        console.log("inside the getbrands model")
        try {

            const result = await pool.query('SELECT * FROM viewer.brands')
            res.json(result.rows);

        } catch (error) {
            console.error('Error fetching data from database:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    };

    static async getModels(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await pool.query('SELECT * FROM data.model')
            console.log(result.rows)
            res.json(result.rows);
        } catch (error) {
            console.error('Error fetching data from database:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    };

    static async getVehicles(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await pool.query('SELECT * FROM viewer.vehicle_data WHERE user_id = $1 OR user_id IS NULL', [req.user_id])
            res.json(result.rows);
        }
        catch (error) {
            console.error('Error fetching data from database:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    };

    static async getVehicle(req: Request, res: Response, next: NextFunction) {
        try {
            console.log('getCar single', req.params)
            const result = await pool.query('SELECT * FROM viewer.car_data WHERE car_id = $1', [req.params.car_id])
            res.json(result.rows);
        }
        catch (error) {
            console.error('Error fetching data from database:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }

    };

    static async newVehicle(req: Request, res: Response, next: NextFunction) {
        try {
            //const file = (req as any).file as Express.Multer.File | undefined
            //console.log(file.buffer)
            console.log("req.body", req.body);
            console.log("req.body_brand", req.body.model_id);
            console.log("req.body_brand", req.body.purchase_date);
            console.log("req.body", req);
            const file = (req as any).file
            console.log('req.file', (req as any).file) // multer populates this

            const modelId = req.body.model_id ? req.body.model_id : null;
            const makingYear = req.body.making_year ? Number(req.body.making_year) : null;
            const purchaseDate = req.body.purchase_date ? req.body.purchase_date : null;

            let result: any;
            if (file) {
                result = await pool.query('WITH new_car AS ( INSERT INTO data.vehicle (model_id, making_year, purchase_date) VALUES ($1, $2, $3) RETURNING vehicle_id ) INSERT INTO data.vehicle_photo (vehicle_id, image) VALUES ((SELECT vehicle_id FROM new_car), $4)', [req.body.model_id ?? 'NULL', req.body.making_year ?? 'NULL', req.body.purchase_date ?? 'NULL', file.buffer]);
            } else {
                result = await pool.query('INSERT INTO data.vehicle (model_id, making_year, purchase_date) VALUES ($1, $2, $3) RETURNING vehicle_id', [modelId, makingYear, purchaseDate]);
            }

            res.status(201).json(result.rows);
        }
        catch (error) {
            console.error('Error fetching data from database:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }

    };

    static async deleteVehicle(req: Request, res: Response, next: NextFunction) {
        try {
            //const file = (req as any).file as Express.Multer.File | undefined
            //console.log(file.buffer)

            console.log("req.vehicle_id", req.params.vehicle_id);
            const vehicle_id = req.params.vehicle_id;
            if (!vehicle_id) { return res.status(400); }
            const result = await pool.query('DELETE FROM viewer.vehicle WHERE vehicle_id = $1', [vehicle_id]);
            return res.status(200).json(result.rows);
        }
        catch (error) {
            console.error('Error fetching data from database:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

    };

    static async newVehicleImage(req: Request, res: Response, next: NextFunction) {
        try {
            //const file = (req as any).file as Express.Multer.File | undefined
            //console.log(file.buffer)
            console.log("req.body", req.body);
            console.log("req.body_brand", req.body.model_id);
            console.log("req.body_brand", req.body.purchase_date);
            console.log("req.body", req);
            const file = (req as any).file
            console.log('req.file', (req as any).file) // multer populates this


            const result = await pool.query('INSERT INTO viewer.vehicle_photo (vehicle_id, mimetype, original_name, image) VALUES ($1, $2, $3, $4) RETURNING *', [req.body.vehicle_id, req.body.mimetype, req.body.original_name, file.buffer]);
            res.status(201).json(result.rows);
        }
        catch (error) {
            console.error('Error fetching data from database:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }

    };

    // TODO: Handle ownership of the vehicle here. You can't delete a photo that does not belong to a vehicle not associated to the user
    static async deleteVehicleImage(req: Request, res: Response, next: NextFunction) {
        try {
            console.log("req.body", req);

            const result = await pool.query('DELETE FROM viewer.vehicle_photo WHERE vehicle_id = $1 AND vehicle_photo_id = $2 RETURNING *', [req.params.vehicle_id, req.params.vehicle_photo_id]);
            res.status(201).json(result.rows);
        }
        catch (error) {
            console.error('Error fetching data from database:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    };

}
