import React, { useState, useEffect } from "react";
import ScreenReaderComponent from "./ScreenReaderComponent";
import { motion } from "framer-motion";
import { addToBookshelf, isBookInBookshelf } from "../utils/localStorageUtils";
import "../styles/BookCard.css";

const BookCardButtonsComponent = ({ setShowModal, book }) => {
  const [isAdded, setIsAdded] = useState(false);

  // Check if book is already in bookshelf on mount
  useEffect(() => {
    if (book && book.id) {
      const alreadyInBookshelf = isBookInBookshelf(book.id);
      setIsAdded(alreadyInBookshelf);
    }
  }, [book]);

  const handleAddToBookshelf = (e) => {
    e.stopPropagation();
    if (isAdded) return; // Already added, do nothing
    const success = addToBookshelf(book);
    if (success) {
      setIsAdded(true);
    }
  };
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        backgroundColor: "rgba(40, 60, 60, 1.0)",
        padding: "40px 0 0px 0",
        borderRadius: "0 0 20px 20px",
        marginTop: "-30px",
      }}
    >
      <div
        className="book-card-button-tray"
        style={{
          display: "flex",
          justifyContent: "space-evenly",
          borderRadius: "0 0 20px 20px",
          marginTop: "-30px",
          paddingTop: "30px",
          paddingBottom: "20px",
          boxShadow: "0px 10px 10px -10px rgba(0, 0, 0, 0.5)",
          backgroundColor: "rgba(75, 75, 75, 1.0)",
        }}
      >
        <div style={{ display: "flex", flexDirection: "row", gap: "8px", width: "100%" }}>
          <div style={{flex: 1, justifyContent: "center", display: "flex"}}>
            <motion.button
              className="book-card-button"
              onClick={(e) => {
                e.stopPropagation();
                setShowModal(true);
              }}
              type="button"
              aria-label="Read this book"
            >
              Read
            </motion.button>
          </div>
          <div style={{flex: 1, justifyContent: "center", display: "flex"}}>
            {(!isAdded && (
              <motion.button
                className="book-card-button"
                onClick={handleAddToBookshelf}
                type="button"
                aria-label="Add this book to your bookshelf"
              >
                Add to shelf
              </motion.button>
            )) || (
              <motion.button 
                className="book-card-button disabled-button" 
                disabled
                aria-label="Book already added to bookshelf"
              >
                Checked Out
              </motion.button>
            )}
          </div>
        </div>
      </div>
      <div
        className="book-card-button-tray-tab"
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "5px",
          borderRadius: "0 0 20px 20px",
          backgroundColor: "rgba(40, 60, 60, 1.0)",
        }}
      >
        <span className="material-symbols-outlined" aria-hidden="true">arrow_drop_down</span>
      </div>
    </div>
  );
};

const BookCardComponent = ({ book, index }) => {
  const [showModal, setShowModal] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <motion.div
        className="book-card-container"
        tabIndex="0"
        role="listitem"
        aria-label={`${book.title}, ${book.wordCount} words. ${book.description}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onFocus={() => setIsHovered(true)}
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget)) {
            setIsHovered(false);
          }
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            setIsHovered(!isHovered);
          }
        }}
        animate={{ paddingBottom: isHovered ? "12px" : "8px" }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        style={{ position: "relative", outline: "none" }}
      >
        <motion.div
          className="book-card"
          whileTap={{ scale: 0.95 }}
          style={{ zIndex: 5, position: "relative" }}
        >
          {/* Colored accent bar */}
          <div className="book-card-accent"></div>

          <div className="book-card-content">
            <p className="book-card-title">{book.title}</p>
            <p className="book-card-description">{book.description}</p>
          </div>

          <div className="book-card-footer">
            <span>~{book.wordCount} words</span>
          </div>
        </motion.div>
        <motion.div
          initial={false}
          animate={{ y: isHovered ? 0 : -60 }}
          transition={{ duration: 0.5, ease: "easeIn" }}
          style={{ zIndex: 1, position: "relative" }}
        >
          <BookCardButtonsComponent setShowModal={setShowModal} book={book} />
        </motion.div>
      </motion.div>
      {showModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowModal(false)}
          tabIndex="-1"
          role="dialog"
          aria-modal="true"
          aria-label={`Reading ${book.title}`}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <ScreenReaderComponent
              book={book}
              onClose={() => setShowModal(false)}
            />
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default BookCardComponent;
