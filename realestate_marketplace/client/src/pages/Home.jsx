import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css/bundle';
import SwiperCore from 'swiper';
import { Navigation } from 'swiper/modules';
import ListingItem from '../components/ListingItem';




export default function Home() {
  const [offerListings, setOfferListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  SwiperCore.use([Navigation]);

  console.log(saleListings);

  useEffect(() => {
    const fetchOfferListings = async () => {
      try {
        const res = await fetch('/api/listing/get?offer=true&limit=4');
        const data = await res.json();
        setOfferListings(data);
        fetchRentListings();
      } catch (error) {
        console.log(error);
      }
    }

    const fetchRentListings = async () => {
      try {
        const res = await fetch('/api/listing/get?type=rent&limit=4');
        const data = await res.json();
        setRentListings(data);
        fetchSaleListings();
      } catch (error) {
        console.log(error);
      }
    }

    const fetchSaleListings = async () => {
      try {
        const res = await fetch('/api/listing/get?type=sale&limit=4');
        const data = await res.json();
        setSaleListings(data);
      } catch (error) {
        console.log(error);
      }
    }
    fetchOfferListings();
  }, []);

  return (
    <div>
      <div className='bg-slate-200 mt-28 flex flex-col lg:flex-row justify-center xl:justify-between'>
        <div className='bg-slate-200 xl:w-2xl lg:w-3xl xl:pt-18 xl:pl-16 lg:pb-0 pt-5 pb-28 px-10 flex flex-col gap-6'>
          <h1 className='text-slate-800 font-bold text-4xl xl:text-5xl lg:text-4xl'>
            Find your next <span className='text-slate-600'>home</span><br />with Us
          </h1>
          <div className='text-gray-400 text-sm sm:text-md'>
            Real Estate will help you find your next home Lorem ipsum dolor sit amet consectetur, adipisicing elit.
            <br /> We have a wide range of properties Lorem.
          </div>
          <Link to={"/search"} className='text-xs sm:text-sm text-blue-800 font-bold hover:underline'>
            Start your search. . .
          </Link>
        </div>
        <div className='xl:w-5xl lg:w-4xl'>
          <Swiper navigation>
            {
              offerListings && offerListings.length > 0 && offerListings.map((listing) => (
                <SwiperSlide>
                  <div key={listing._id} style={{ background: `url(${listing.imageUrls[0]}) center no-repeat`, backgroundSize: "cover" }} className='h-[600px]'></div>
                </SwiperSlide>
              ))
            }
          </Swiper>
        </div>
      </div>

      <div className='max-w-8xl mx-auto p-3 flex flex-col gap-8 my-10'>
        {offerListings && offerListings.length > 0 && (
          <div className='flex justify-center p-3'>
            <div className=''>
              <div className='my-3'>
                <h2 className='text-2xl font-semibold text-slate-600'>Recent Offers</h2>
                <Link className='text-sm text-blue-800 hover:underline' to={'/search?offer=true'}>Show more offers</Link>
              </div>
              <div className='flex flex-wrap gap-4'>
                {offerListings.map((listing) => (
                  <ListingItem listing={listing} key={listing._id} />
                ))}
              </div>
            </div>
          </div>
        )}
        {rentListings && rentListings.length > 0 && (
          <div className='flex justify-center p-3'>
            <div>
              <div className='my-3'>
                <h2 className='text-2xl font-semibold text-slate-600'>Recent Places for Rent</h2>
                <Link className='text-sm text-blue-800 hover:underline' to={'/search?type=rent'}>Show more places for rent</Link>
              </div>
              <div className='flex flex-wrap gap-4'>
                {rentListings.map((listing) => (
                  <ListingItem listing={listing} key={listing._id} />
                ))}
              </div>
            </div>
          </div>
        )}
        {saleListings && saleListings.length > 0 && (
          <div className='flex justify-center p-3'>
            <div>
              <div className='my-3'>
                <h2 className='text-2xl font-semibold text-slate-600'>Recent Places for Sale</h2>
                <Link className='text-sm text-blue-800 hover:underline' to={'/search?type=sale'}>Show more places for sale</Link>
              </div>
              <div className='flex flex-wrap gap-4'>
                {saleListings.map((listing) => (
                  <ListingItem listing={listing} key={listing._id} />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
