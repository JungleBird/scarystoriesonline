
import React from "react";
import { motion } from "framer-motion";
import "../styles/Bookshelf.css";
import "../styles/BookCover.css";
import { darkPurple, burgundy, burntOrange, darkTeal, darkGray } from "../styles/colors";



export default function BookCoverComponent({
  book,
  onSelectBook,
  onRemoveBook,
  index,
}) {
  const coverColors = [darkPurple, burgundy, burntOrange, darkTeal, darkGray];
  const coverColor = coverColors[index % coverColors.length];

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onSelectBook(book);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <div
        key={book.id}
        className="bookcover-container"
        onClick={() => onSelectBook(book)}
        onKeyDown={handleKeyDown}
        tabIndex="0"
        role="button"
        aria-label={`${book.title}, ${book.wordCount} words`}
      >
        <div
          className="bookcover-front-cover"
          style={{ backgroundColor: coverColor }}
        >
          <div className="bookcover-front-cover-text">
            <h3 className="bookshelf-book-title">{book.title}</h3>
            <p className="bookshelf-book-words">~{book.wordCount} words</p>
          </div>
        </div>
        <div className="bookcover-page"></div>
        <div className="bookcover-back-cover"></div>
      </div>
      <div
        style={{ display: "flex", justifyContent: "center", padding: "12px" }}
      >
        <button
          className="bookshelf-remove-btn"
          onClick={() => onRemoveBook(book.id)}
          aria-label={`Remove ${book.title} from bookshelf`}
        >
          Remove
        </button>
      </div>
    </motion.div>
  );
}
