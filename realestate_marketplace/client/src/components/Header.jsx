// import React from 'react';
import { FaSearch, FaHome, FaBars, FaTimes } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

export default function Header() {
    const { currentUser } = useSelector(state => state.user);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    const [menuOpen, setMenuOpen] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        const urlParams = new URLSearchParams(window.location.search);
        urlParams.set('searchTerm', searchTerm);
        const searchQuery = urlParams.toString();
        navigate(`/search?${searchQuery}`);
        handleMenuClose();
    };

    const handleMenuClose = () => {
        setMenuOpen(false); 
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
                        <FaHome color="white" className='pr-1 text-5xl ' />
                        <span className='text-white text-3xl xl:text-4xl lg:text-3xl md:text-3xl sm:text-3xl pl-1'>Real</span>
                        <span className='text-white text-3xl xl:text-4xl lg:text-3xl md:text-3xl sm:text-3xl'>Estate</span>
                    </h1>
                </Link>
                <form onSubmit={handleSubmit} className='bg-zinc-100 p-3 rounded-lg items-center hidden sm:hidden md:hidden lg:flex'>
                    <input
                        onChange={(e) => setSearchTerm(e.target.value)}
                        value={searchTerm}
                        type="text"
                        placeholder='Search...'
                        className='bg-transparent focus:outline-no2xlne  lg:w-72 xl:w-84 text-xl'
                    />
                    <button>
                        <FaSearch size={20} className='text-zinc-600 cursor-pointer hover:text-zinc-700' />
                    </button>
                </form>



                <div className="md:hidden flex items-center">
                    <button onClick={() => setMenuOpen(!menuOpen)}>
                        {menuOpen ? (
                            <FaTimes size={30} className="text-white cursor-pointer" /> 
                        ) : (
                            <FaBars size={30} className="text-white cursor-pointer" /> 
                        )}
                    </button>
                </div>

                {/* <ul className='flex gap-4 items-center lg:gap-10 md:gap-7 '> */}
                <ul className={`flex gap-7 items-center lg:gap-10 md:gap-7 ${menuOpen ? 'flex-col absolute bg-slate-900 top-0 left-0 right-0 p-5 mt-18 pb-8' : 'hidden md:flex'}`}>
                    <li className="w-full px-3 mb-4 md:hidden">
                        <form onSubmit={handleSubmit} className='bg-zinc-100 p-3 rounded-lg flex items-center'>
                            <input
                                onChange={(e) => setSearchTerm(e.target.value)}
                                value={searchTerm}
                                type="text"
                                placeholder='Search...'
                                className='bg-transparent focus:outline-none w-full text-xl'
                            />
                            <button>
                                <FaSearch size={20} className='text-zinc-600 cursor-pointer hover:text-zinc-700' />
                            </button>
                        </form>
                    </li>


                    <Link to='/' onClick={handleMenuClose} >
                        <li className='text-white hover:text-zinc-200 cursor-pointer text-xl md:text-[22px]'>Home</li>
                    </Link>
                    <Link to='/about'onClick={handleMenuClose} >
                        <li className='text-white hover:text-zinc-200 cursor-pointer text-xl md:text-[22px]'>About</li>
                    </Link>
                    <Link to='/search' onClick={handleMenuClose}>
                        <li className='text-white hover:text-zinc-200 cursor-pointer text-xl md:text-[22px]'>Listings</li>
                    </Link>
                    <Link to='/profile' onClick={handleMenuClose}>
                        {currentUser ? (
                            <img className='rounded-full h-10 w-10 xl:h-12 xl:w-12 object-cover' src={currentUser.avatar} alt="profile" />
                        ) : (
                            <li className='text-white hover:text-zinc-200 cursor-pointer text-xl md:text-[22px]'>Sign In</li>
                        )}
                    </Link>
                </ul>
            </div>
        </header>
    )
}
