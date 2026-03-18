import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css'; // Import Swiper styles
import type {Photo} from "../types/Photo.ts";
import imageUrl from '../utils/imageUrl.ts'

interface ImageCarouselProps {
    photos: Photo[];
}

function ImageCarousel (props: ImageCarouselProps)  {
    const {
        photos
    } = props

    return (

        <div>
            <Swiper
                spaceBetween={20}
                slidesPerView={1}
                navigation
                pagination={{ clickable: true }}
                scrollbar={{ draggable: true }}

                loop={true}
            >
                {photos.map((photo: Photo, index: number) => (
                    <SwiperSlide key={index}>
                        <img src={imageUrl(photo?.image?.data)} alt={`Slide ${index + 1}`} style={{ width: '100%', height: 'auto' }} />
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default ImageCarousel;
