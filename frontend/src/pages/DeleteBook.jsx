import React, { useState }  from 'react';
import BackButton from '../components/BackButton';
import axios from 'axios';
import Spinner from '../components/Spinner';
import { useNavigate, useParams } from 'react-router-dom';

const DeleteBook = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  const handleDeleteBook = () => {
    setLoading(true);
    axios.delete(`http://localhost:5000/books/${id}`)
      .then((response) => {
        setLoading(false);
        console.log(response.data);
        navigate('/');
      })
      .catch((error) => {
        setLoading(false);
        alert("There was an error deleting the book!");
        console.log("There was an error deleting the book!", error);
      });
  }
  return (
    <div className='p-4'>
      <BackButton />
      <h1 className='text-3xl font-bold my-4'>Delete Book</h1>
      {loading ? <Spinner /> : ''}
      <div className='flex flex-col items-center border-2 border-red-400 p-8 rounded-lg mx-auto w-[600px]'>
        <h3 className='text-2xl'>Are you sure you want to delete this book?</h3>
        <button className='p-4 bg-red-600 text-white m-8 w-full'
        onClick={handleDeleteBook}
        >
          Delete Book
        </button>
      </div>
    </div>
  );
};

export default DeleteBook;