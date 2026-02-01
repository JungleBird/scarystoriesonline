import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getBookshelf, removeFromBookshelf } from "../utils/localStorageUtils";
import BookCoverComponent from "./BookCoverComponent";
import ScreenReaderComponent from "./ScreenReaderComponent";
import "../styles/Bookshelf.css";

const BookshelfComponent = () => {
  const [books, setBooks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);

  useEffect(() => {
    // Load books from local storage on mount
    const savedBooks = getBookshelf();
    setBooks(savedBooks);
  }, []);

  const handleSelectBook = (book) => {
    setSelectedBook(book);
    setShowModal(true);
  };

  const handleRemoveBook = (bookId) => {
    removeFromBookshelf(bookId);
    // Update local state to reflect the removal
    setBooks(books.filter((book) => book.id !== bookId));
  };

  if (books.length === 0) {
    return (
      <div className="bookshelf-container">
        <motion.h1
          className="bookshelf-title"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          My Bookshelf
        </motion.h1>
        <motion.div
          className="bookshelf-empty"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2>Your Bookshelf is Empty</h2>
          <p>
            Start adding books from the library to build your personal
            collection!
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bookshelf-container">
      <motion.h1
        className="bookshelf-title"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        My Bookshelf
      </motion.h1>
      <div className="bookshelf-grid">
        {books.map((book, index) => (
          <BookCoverComponent
            key={index}
            index={index}
            book={book}
            onSelectBook={handleSelectBook}
            onRemoveBook={handleRemoveBook}
          />
        ))}
      </div>
      {showModal && selectedBook && (
        <div
          className="modal-overlay"
          onClick={() => setShowModal(false)}
          tabIndex="-1"
          role="dialog"
          aria-modal="true"
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <ScreenReaderComponent
              book={selectedBook}
              onClose={() => setShowModal(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default BookshelfComponent;
