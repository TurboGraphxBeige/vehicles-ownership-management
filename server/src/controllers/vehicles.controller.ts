import type { Request, Response, NextFunction } from 'express';
import { Vehicles } from '../models/vehicles.model';
import { vehicleService } from '../services/vehicles.service';

export const getBrands =  async (req: Request, res: Response, next: NextFunction) => {

    vehicleService.getBrands(req, res, next)
};

export const getModels =  async (req: Request, res: Response, next: NextFunction) => {
    Vehicles.getModels(req, res, next)
};

export const getVehicles =  async (req: Request, res: Response, next: NextFunction) => {
    vehicleService.getVehicles(req, res, next)
};

export const getVehicle =  async (req: Request, res: Response, next: NextFunction) => {
    Vehicles.getVehicle(req, res, next)
};

export const newVehicle =  async (req: Request, res: Response, next: NextFunction) => {
    Vehicles.newVehicle(req, res, next)
};

export const deleteVehicle =  async (req: Request, res: Response, next: NextFunction) => {
    console.log('deleteVehicle')
    Vehicles.deleteVehicle(req, res, next)
};

//export const getVehicles = async (req: Request, res: Response, next: NextFunction) => {
//    vehicleService.getVehicles(req, res, next)
//};