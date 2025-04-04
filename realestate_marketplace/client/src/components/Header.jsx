// import React from 'react';
import { FaSearch, FaHome } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

export default function Header() {
    const { currentUser } = useSelector(state => state.user);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        const urlParams = new URLSearchParams(window.location.search);
        urlParams.set('searchTerm', searchTerm);
        const searchQuery = urlParams.toString();
        navigate(`/search?${searchQuery}`);
    };

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const searchTermFromUrl = urlParams.get('searchTerm');
        if (searchTermFromUrl) {
            setSearchTerm(searchTermFromUrl);
        }
    }, [location.search]);

    return (
        <header className='bg-slate-900 shadow-md'>
            <div className='flex justify-between items-center max-w-screen mx-auto p-3 xl:px-5'>
                <Link to='/'>
                    <h1 className='font-bold sm:text-xl flex items-end pr-3'>
                        <FaHome color="white" className='pr-1 text-4xl xl:text-5xl lg:text-5xl md:text-5xl sm:text-4xl' />
                        <span className='text-white text-2xl xl:text-4xl lg:text-3xl md:text-3xl sm:text-2xl pl-1'>Real</span>
                        <span className='text-white text-2xl xl:text-4xl lg:text-3xl md:text-3xl sm:text-2xl'>Estate</span>
                    </h1>
                </Link>
                <form onSubmit={handleSubmit} className='bg-zinc-100 p-3 rounded-lg flex items-center'>
                    <input
                        onChange={(e) => setSearchTerm(e.target.value)}
                        value={searchTerm}
                        type="text"
                        placeholder='Search...'
                        className='bg-transparent focus:outline-no2xlne w-35 sm:w-32 md:w-55 lg:w-72 xl:w-84 text-xl'
                    />
                    <button>
                        <FaSearch size={20} className='text-zinc-600 cursor-pointer hover:text-zinc-700' />
                    </button>

                </form>
                <ul className='flex gap-4 items-center xl:gap-10 lg:gap-10'>
                    <Link to='/'>
                        <li className='hidden sm:inline text-white hover:text-zinc-200 cursor-pointer text-xl lg:text-[22px]'>Home</li>
                    </Link>
                    <Link to='/about'>
                        <li className='hidden sm:inline text-white hover:text-zinc-200 cursor-pointer text-xl lg:text-[22px]'>About</li>
                    </Link>
                    <Link to='/search'>
                        <li className='hidden sm:inline text-white hover:text-zinc-200 cursor-pointer text-xl lg:text-[22px]'>Listings</li>
                    </Link>
                    <Link to='/profile'>
                        {currentUser ? (
                            <img className='rounded-full h-10 w-10 xl:h-12 xl:w-12 object-cover' src={currentUser.avatar} alt="profile" />
                        ) : (
                            <li className='text-zinc-950 hover:text-zinc-600 cursor-pointer text-xl'>Sign In</li>
                        )}
                    </Link>
                </ul>
            </div>
        </header>
    )
}
