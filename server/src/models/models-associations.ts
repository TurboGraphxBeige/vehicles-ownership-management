import { Brand } from './brand.js';
import { VehicleModel } from './model.js';
import { Vehicle } from './vehicle.js';
import { VehiclePhoto } from './vehicle_photo.js';
import { Observation } from "./observation.js"
import { Service } from './service.js';
import { User } from './user.js';
import { OdometerReading } from "./odometer_reading.js";

export function initAssociations() {
    Vehicle.belongsTo(VehicleModel, { foreignKey: 'model_id', as: 'model' });
    VehicleModel.hasOne(Vehicle, { foreignKey: 'model_id', as: 'vehicle' });

    Vehicle.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
    User.hasOne(Vehicle, { foreignKey: 'user_id', as: 'vehicle' });

    Brand.hasMany(VehicleModel, { foreignKey: 'brand_id', as: 'models' });
    VehicleModel.belongsTo(Brand, { foreignKey: 'brand_id', as: 'brand' });

    Vehicle.hasMany(VehiclePhoto, { foreignKey: 'vehicle_id', as: 'photos' });
    VehiclePhoto.belongsTo(Vehicle, { foreignKey: 'vehicle_id', as: 'vehicle' });

    Vehicle.hasMany(Service, { foreignKey: 'vehicle_id', as: 'services' });
    Service.belongsTo(Vehicle, { foreignKey: 'vehicle_id', as: 'vehicle' });

    Vehicle.hasMany(Observation, { foreignKey: 'vehicle_id', as: 'observations' });
    Observation.hasOne(Vehicle, { foreignKey: 'vehicle_id', as: 'observations' });

    Vehicle.hasMany(OdometerReading, { foreignKey: 'vehicle_id', as: 'odometer_readings' });
    OdometerReading.hasOne(Vehicle, { foreignKey: 'vehicle_id', as: 'odometer_readings' });
}