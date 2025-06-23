import React, { use, useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import Spinner from '../components/Spinner.jsx'
import { AiOutlineEdit } from 'react-icons/ai'
import { BsInfoCircle } from 'react-icons/bs'
import { MdOutlineAddBox, MdOutlineDelete } from 'react-icons/md'

const Home = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        setLoading(true);
        axios.get('http://localhost:5000/books')
            .then((response) => {
                setBooks(response.data.data);
                setLoading(false);
            })
            .catch((error) => {
                console.log("Error fetching books:", error);
                setLoading(false);
            });
        }, []);
    return (
        <div className='p-4'>
            <div className='flex justify-between items-center mb-4'>
                <h1 className='text-2xl font-bold'>Book List</h1>
                <Link to="/books/create" className='bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-800'>Add New Book</Link>   
            </div>
            {loading ? (
                <Spinner />
            ) : (
                <table className='min-w-full bg-white border border-gray-200'>
                    <thead>
                        <tr>
                            <th className='border px-4 py-2'>No.</th>
                            <th className='border px-4 py-2'>Title</th>
                            <th className='border px-4 py-2'>Author</th>
                            <th className='border px-4 py-2'>Publish Year</th>
                            <th className='border px-4 py-2'>Genre</th>
                            <th className='border px-4 py-2'>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {books.map((book, index) => (
                            <tr key={book._id}>
                                <td className='border text-center px-4 py-2'>{index + 1}</td>
                                <td className='border text-center px-4 py-2'>{book.title}</td>
                                <td className='border text-center px-4 py-2'>{book.author}</td>
                                <td className='border text-center px-4 py-2'>{book.publishedYear}</td>
                                <td className='border text-center px-4 py-2'>{book.genre}</td>
                                <td className='border px-4 py-2'>
                                    <div className='flex justify-center gap-x-4 text-2xl'>
                                        <Link to={`/books/details/${book._id}`} className='text-blue-500 hover:text-blue-700'>
                                            <BsInfoCircle />
                                        </Link>
                                        <Link to={`/books/edit/${book._id}`} className='text-yellow-500 hover:text-yellow-700'>
                                            <AiOutlineEdit />
                                        </Link>
                                        <Link to={`/books/delete/${book._id}`} className='text-red-500 hover:text-red-700'>
                                            <MdOutlineDelete />
                                        </Link>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    )
}

export default Home
