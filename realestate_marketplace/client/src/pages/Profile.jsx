import React, { useRef, useState, useEffect } from 'react'
import { useSelector } from 'react-redux';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase';
import { updateUserStart, updateUserSuccess, updateUserFailure, deleteUserFailure, deleteUserStart, deleteUserSuccess, signOutUserStart, signOutUserFailure, signOutUserSuccess } from '../redux/user/userSlice';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';


export default function Profile() {
  const fileRef = useRef(null);
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState([]);
  const [deleteListingsError, setDeleteListingsError] = useState(false);
  const dispatch = useDispatch();

  // Firebase Storage Rules
  // allow read;
  // allow write: if request.resource.size < 2 * 1024 * 1024 && 
  // request.resource.contentType.matches('image/.*')

  useEffect(() => {
    const fetchUserListings = async () => {
      try {
        const res = await fetch(`/api/user/listings/${currentUser._id}`);
        const data = await res.json();
        if (data.success === false) {
          setShowListingsError(true);
          return;
        }
        setUserListings(data);
      } catch (error) {
        setShowListingsError(true);
      }
    };
    if (currentUser && currentUser._id) {
      fetchUserListings();
    }
  }, [currentUser]);

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes * 100);
        setFilePerc(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({ ...formData, avatar: downloadURL })
        );
      }
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }

      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);

    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  const handleDeleteUser = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete your account? This action cannot be undone.");
    if (!confirmDelete) {
      return;
    }
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch('/api/auth/signout');
      const data = await res.json();
      if (data.success === false) {
        dispatch(signOutUserFailure(data.message));
        return;
      }
      dispatch(signOutUserSuccess(data));
    } catch (error) {
      dispatch(signOutUserFailure(data.message));
    }
  };

  const handleListingDelete = async (listingId) => {
    const confirmListingDelete = window.confirm("Are you sure you want to delete this listing? This action cannot be undone.");
    if (!confirmListingDelete) {
      return;
    }
    try {
      setDeleteListingsError(false);
      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success === false) {
        setDeleteListingsError(true);
        return;
      }
      setUserListings((prev) => prev.filter((listing) => listing._id !== listingId));
    } catch (error) {
      setDeleteListingsError(true);
      return
    }
  };

  return (
    <div className=' flex flex-col md:flex-row'>
      <div className='p-7 border-b-2 md:border-r-2 md:min-h-screen sm:min-h-170 min-h-170 flex flex-col justify-between'>
        <div className='p-3 xl:w-[420px]'>
          <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
          <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
            <input onChange={(e) => setFile(e.target.files[0])} type="file" ref={fileRef} hidden accept='image/*' />
            <img
              onClick={() => fileRef.current.click()}
              className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2'
              src={formData.avatar || currentUser.avatar} alt="profile image" />
            <p className='text-sm self-center'>
              {fileUploadError ? (
                <span className='text-red-600'>Image Upload Failed (Image must be less than 2 MB) </span>
              ) : filePerc > 0 && filePerc < 100 ? (
                <span className='text-slate-700'>{`Uploading ${filePerc}%`} </span>
              ) : filePerc === 100 ? (
                <span className='text-green-600'>Image Successfully Uploaded</span>
              ) : (
                ''
              )}
            </p>
            <input type="text" defaultValue={currentUser.username} placeholder='username' id='username' className='border p-3 rounded-lg' onChange={handleChange} />
            <input type="email" defaultValue={currentUser.email} placeholder='email' id='email' className='border p-3 rounded-lg' onChange={handleChange} />
            <input type="password" placeholder='password' id='password' className='border p-3 rounded-lg' onChange={handleChange} />
            <button disabled={loading} className='bg-slate-700 text-white rounded-lg mt-5 p-3 uppercase hover:opacity-95 disabled:opacity-85 cursor-pointer'>
              {loading ? 'Loading...' : 'Update'}
            </button>
          </form>
        </div>
        <div className='flex justify-between p-3'>
          <div className=''>
            <span onClick={handleDeleteUser} className='text-red-600 cursor-pointer'>Delete Account</span>
          </div>
          <div className=''>
            <span onClick={handleSignOut} className='text-white cursor-pointer rounded-lg bg-slate-700 p-3 hover:opacity-95 '>Sign Out</span>
          </div>
        </div>
      </div>

      <div className='flex w-full'>
        {userListings && userListings.length === 0 &&
          <div className='flex-1 flex-col gap-4 p-3 mb-5 align-center max-w-3xl mx-auto'>
            <h1 className='text-left mt-14 text-3xl font-semibold p-2 border-b'>Your Listings:</h1>
            <div className='flex justify-end pt-3 pb-3'>
              <Link to={"/create-listing"} className='bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95 cursor-pointer'>
                Create Listing
              </Link>
            </div>
            <div className='flex justify-center pt-15 pb-5 text-[18px]'>
              <p>No listings yet!</p>
            </div>
          </div>
        }

        {userListings && userListings.length > 0 &&
          <div className='flex-1 flex-col gap-4 p-3 mb-5 align-center max-w-3xl mx-auto'>
            <h1 className='text-left mt-14 text-3xl font-semibold p-2 border-b'>Your Listings:</h1>
            <div className='flex justify-end pt-3 pb-3'>
              <Link to={"/create-listing"} className='bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95 cursor-pointer'>
                Create Listing
              </Link>
            </div>
            {userListings.map((listing) => (
              <div key={listing._id} className='flex justify-between items-center border rounded-lg p-3 mb-5 gap-4'>
                <Link to={`/listing/${listing._id}`}>
                  <img src={listing.imageUrls[0]} alt="listing cover image" className='h-16 w-16 object-contain' />
                </Link>
                <Link to={`/listing/${listing._id}`} className='flex-1 text-slate-800 font-semibold hover:underline o truncate'>
                  <p>{listing.name}</p>
                </Link>
                <div className='flex flex-col sm:flex-row items-center'>
                  <div className='p-1'>
                    <Link to={`/update-listing/${listing._id}`}>
                      <button className='text-green-700 border-1 pt-1 pb-1 px-5  rounded-lg uppercase cursor-pointer hover:bg-green-100'>Edit</button>
                    </Link>
                  </div>
                  <div className='p-1'>
                    <button onClick={() => handleListingDelete(listing._id)} className='text-red-600 border-1 pt-1 pb-1 px-2 rounded-lg uppercase cursor-pointer hover:bg-red-100'>Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>}
      </div>
    </div>
  );
}
