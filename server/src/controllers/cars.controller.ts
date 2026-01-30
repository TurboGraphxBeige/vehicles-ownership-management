import type { Request, Response, NextFunction } from 'express';
import { Cars } from '../models/cars.ts';

export const getBrands =  async (req: Request, res: Response, next: NextFunction) => {

    Cars.getBrands(req, res, next)
};

export const getModels =  async (req: Request, res: Response, next: NextFunction) => {
    Cars.getModels(req, res, next)
};

export const getCars =  async (req: Request, res: Response, next: NextFunction) => {
    Cars.getCars(req, res, next)
};

export const getCar =  async (req: Request, res: Response, next: NextFunction) => {
    Cars.getCar(req, res, next)
};

export const newCar =  async (req: Request, res: Response, next: NextFunction) => {
    Cars.newCar(req, res, next)
};

export const deleteVehicle =  async (req: Request, res: Response, next: NextFunction) => {
    console.log('deleteVehicle')
    Cars.deleteVehicle(req, res, next)
};