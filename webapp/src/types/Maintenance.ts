export interface Service {
    maintenance_id: string;
    service_id: string;
    vehicle_id: string;
    vehicle_component_id: string;
    vehicle_component_system_id: string;
    description: string;
    cost: number;
    maintenance_task_type: string;
    notes: string;
}