import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import { Navigation } from 'swiper/modules';
import { useSelector } from 'react-redux';
import 'swiper/css/bundle';
import { FaBath, FaBed, FaChair, FaMapMarkedAlt, FaMapMarkerAlt, FaParking, FaShare, FaArrowDown, } from 'react-icons/fa';
import Contact from '../components/Contact';

export default function Listing() {
    SwiperCore.use([Navigation]);
    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [copied, setCopied] = useState(false);
    const [contact, setContact] = useState(false);
    const params = useParams();
    const { currentUser } = useSelector((state) => state.user);
    useEffect(() => {
        const fetchListing = async () => {
            try {
                setLoading(true);
                const res = await fetch(`/api/listing/get/${params.listingId}`);
                const data = await res.json();
                if (data.success === false) {
                    setError(true);
                    setLoading(false);
                    return;
                }
                setListing(data);
                setLoading(false);
                setError(false);
            } catch (error) {
                setError(true);
                setLoading(false);
            }

        };
        fetchListing();
    }, [params.listingId]);

    return (
        <main className='p-1 mx-auto max-w-7xl'>
            {loading && <p className='text-center my-7 text-2xl'>Loading...</p>}
            {error && <p className='text-center my-7 text-2xl'>Something went wrong!</p>}
            {listing && !loading && !error && (
                <div className='p-3 flex flex-col '>
                    <div className='relative'>
                        <Swiper navigation >
                            {listing.imageUrls.map((url) => (
                                <SwiperSlide key={url}>
                                    <div className='h-[600px]' style={{ background: `url(${url}) center no-repeat`, backgroundSize: 'cover', }}></div>
                                </SwiperSlide>
                            )
                            )}
                        </Swiper>
                        <div
                            onClick={() => {
                                navigator.clipboard.writeText(window.location.href);
                                setCopied(true);
                                setTimeout(() => {
                                    setCopied(false);
                                }, 2000);
                            }}
                            className='absolute top-6 right-6 z-10 border-2 rounded-full w-12 h-12 flex justify-center items-center bg-slate-200 cursor-pointer'
                        >
                            <FaShare className='text-black' />
                            {copied && (
                                <p className='absolute top-15 right-8 z-10 w-[110px] rounded-md bg-green-200 p-2 font-semibold' >Link copied!</p>
                            )}
                        </div>
                    </div>
                    <div className='flex flex-col max-w-5xl mx-auto p-3 my-7 gap-7'>
                        <p className='text-3xl font-semibold'>
                            {listing.name} - ${' '}
                            {listing.offer
                                ? listing.discountPrice.toLocaleString('en-us')
                                : listing.regularPrice.toLocaleString('en-us')}
                            {listing.type === 'rent' && ' / month'}
                        </p>
                        <p className='flex items-center mt-[-10px] gap-2 text-slate-600 text-md'>
                            <FaMapMarkerAlt className='text-slate-600' />
                            {listing.address}
                        </p>
                        <div className='flex gap-4'>
                            <p className='bg-blue-900 w-full max-w-[200px] text-white text-md text-center p-1 rounded-md'>
                                {listing.type === 'rent' ? 'For Rent' : 'For Sale'}
                            </p>
                            {listing.offer && (

                                <div className=' flex justify-center gap-2 bg-green-900 w-full max-w-[200px] text-white text-md text-center p-1 rounded-md'>
                                    <FaArrowDown className='flex justify-center mt-1' />
                                    ${(+listing.regularPrice - +listing.discountPrice).toLocaleString('en-us')}
                                </div>
                            )}
                        </div>
                        <p className='text-slate-800'>
                            <span className='font-semibold text-lg text-black'>Description - </span>
                            {listing.description}
                        </p>
                        <ul className='text-slate-800 font-semibold text-md flex flex-wrap items-center gap-5 sm:gap-6'>
                            <li className='flex items-center gap-1 whitespace-nowrap'>
                                <FaBed className='text-lg' />
                                {listing.bedrooms > 1
                                    ? `${listing.bedrooms} Beds `
                                    : `${listing.bedrooms} Bed `}
                            </li>
                            <li className='flex items-center gap-1 whitespace-nowrap'>
                                <FaBath className='text-lg' />
                                {listing.bathrooms > 1
                                    ? `${listing.bathrooms} Baths `
                                    : `${listing.bathrooms} Bath `}
                            </li>
                            <li className='flex items-center gap-1 whitespace-nowrap'>
                                <FaParking className='text-lg' />
                                {listing.parking ? 'Parking Spot' : 'No Parking'}
                            </li>
                            <li className='flex items-center gap-1 whitespace-nowrap'>
                                <FaChair className='text-lg' />
                                {listing.furnished ? 'Furnished' : 'Unfurnished'}
                            </li>
                        </ul>
                        {currentUser && listing.userRef != currentUser._id && !contact && (
                            <button onClick={() => setContact(true)} className='bg-slate-700 text-white text-lg rounded-lg uppercase hover:opacity-95 p-3 cursor-pointer mt-10'>Contact Listing Agent</button>
                        )}
                        {contact && <Contact listing={listing} />}
                    </div>
                </div>
            )}
        </main>
    );
}
