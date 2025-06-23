import React from 'react'
import { Routes, Route} from 'react-router-dom'
import Home from './pages/Home.jsx'
import CreateBook from './pages/CreateBook.jsx'
import DeleteBook from './pages/DeleteBook.jsx'
import UpdateBook from './pages/UpdateBook.jsx'
import BookDetails from './pages/BookDetails.jsx'

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/books/create" element={<CreateBook />} />
      <Route path="/books/delete/:id" element={<DeleteBook />} />
      <Route path="/books/edit/:id" element={<UpdateBook />} />
      <Route path="/books/details/:id" element={<BookDetails />} />
    </Routes>
  )
}

export default App
