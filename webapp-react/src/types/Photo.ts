import type {Image} from "./Image";
export interface Photo {
    vehicle_photo_id: string;
    original_name: string;
    image?: Image | null;
}