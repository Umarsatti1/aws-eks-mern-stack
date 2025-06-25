import React, { useState, useEffect } from 'react';
import BackButton from "../components/BackButton";
import Spinner from "../components/Spinner";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const UpdateBook = () => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [publishedYear, setPublishedYear] = useState('');
  const [genre, setGenre] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  useEffect(() => {
    setLoading(true);
    axios.get(`/books/${id}`)
      .then((response) => {
        setTitle(response.data.title);
        setAuthor(response.data.author);
        setPublishedYear(response.data.publishedYear);
        setGenre(response.data.genre);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        alert("Error fetching book details. Please try again.");
        console.log("Error fetching book details:", error);
      });
  }, []);

  const handleUpdateBook = () => {
    const data = {
      title,
      author,
      publishedYear,
      genre,
    };
    setLoading(true);
    axios.put(`/books/${id}`, data)
    .then(() => {
      setLoading(false);
      navigate('/');
    })
    .catch((error) => {
      setLoading(false);
      alert("Error creating book. Please try again.");
      console.log("Error creating book:", error);    
    });
  }

  return (
    <div className='p-4'>
      <BackButton />
      <h1 className='text-3xl my-4'>Update Current Book</h1>
      {loading ? <Spinner /> : ''}
      <div className='flex flex-col border-2 border-sky-400 rounded-xl w-[600px] p-4'>
        <div className='my-4'>
          <label className='text-xl mr-4 text-gray-500'>Title</label>
          <input
            type='text'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className='border border-gray-500 rounded px-4 p-2 w-full'
            placeholder='Enter a book title'
          />
        </div>
        <div className='my-4'>
          <label className='text-xl mr-4 text-gray-500'>Author</label>
          <input
            type='text'
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className='border border-gray-500 rounded px-4 p-2 w-full'
            placeholder='Enter the author name'
          />
        </div>
        <div className='my-4'>
          <label className='text-xl mr-4 text-gray-500'>Publish Year</label>
          <input
            type='text'
            value={publishedYear}
            onChange={(e) => setPublishedYear(e.target.value)}
            className='border border-gray-500 rounded px-4 p-2 w-full'
            placeholder='Enter the year of publication'
          />
        </div>
        <div className='my-4'>
          <label className='text-xl mr-4 text-gray-500'>Genre</label>
          <input
            type='text'
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            className='border border-gray-500 rounded px-4 p-2 w-full'
            placeholder='Enter the Genre of the book'
          />
        </div>
        <button className='p-2 bg-sky-300 m-8' onClick={handleUpdateBook}>
          Save Book
        </button>
      </div>
    </div>
  );
};

export default UpdateBook;