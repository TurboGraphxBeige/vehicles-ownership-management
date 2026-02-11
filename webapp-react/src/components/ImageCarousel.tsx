import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css'; // Import Swiper styles
import { Button } from '@mui/material';

// Sample images
const images = [
    'https://via.placeholder.com/400x300?text=Image+1',
    'https://via.placeholder.com/400x300?text=Image+2',
    'https://via.placeholder.com/400x300?text=Image+3',
];
function imageUrl(data) {
    const byteArray = data; // Example array of byte integers

    const byteArrayToString = (byteArray) => {
        let str = '';
        for (let i = 0; i < byteArray.length; i += 65536) {
            str += String.fromCharCode.apply(null, byteArray.slice(i, i + 65536));
        }
        return str;
    };

    const base64String = btoa(byteArrayToString(byteArray));
    const image = `data:image/jpeg;base64,${base64String}`;
    return image;
}

function ImageCarousel ({photos})  {
    console.log('photooo', photos)
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
                {photos.map((photo, index) => (
                    <SwiperSlide key={index}>
                        <img src={imageUrl(photo.image.data)} alt={`Slide ${index + 1}`} style={{ width: '100%', height: 'auto' }} />
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default ImageCarousel;
