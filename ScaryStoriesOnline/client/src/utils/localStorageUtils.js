// Local Storage utility functions for managing bookshelf

const BOOKSHELF_KEY = "scary-stories-bookshelf";

/**
 * Get all books from the bookshelf
 * @returns {Array} Array of book objects
 */
export const getBookshelf = () => {
  try {
    const bookshelf = localStorage.getItem(BOOKSHELF_KEY);
    return bookshelf ? JSON.parse(bookshelf) : [];
  } catch (error) {
    console.error("Error reading from localStorage:", error);
    return [];
  }
};

/**
 * Check if a book is already in the bookshelf
 * @param {string} bookId - The ID of the book to check
 * @returns {boolean} True if book is in bookshelf
 */
export const isBookInBookshelf = (bookId) => {
  const bookshelf = getBookshelf();
  return bookshelf.some((book) => book.id === bookId);
};

/**
 * Add a book to the bookshelf
 * @param {Object} book - The book object to add
 * @returns {boolean} True if successfully added, false if already exists
 */
export const addToBookshelf = (book) => {
  try {
    const bookshelf = getBookshelf();

    // Check if book already exists
    if (isBookInBookshelf(book.id)) {
      console.log("Book already in bookshelf");
      return false;
    }

    // Add book to bookshelf
    bookshelf.push(book);
    localStorage.setItem(BOOKSHELF_KEY, JSON.stringify(bookshelf));
    return true;
  } catch (error) {
    console.error("Error adding to bookshelf:", error);
    return false;
  }
};

/**
 * Remove a book from the bookshelf
 * @param {string} bookId - The ID of the book to remove
 * @returns {boolean} True if successfully removed
 */
export const removeFromBookshelf = (bookId) => {
  try {
    const bookshelf = getBookshelf();
    const filteredBookshelf = bookshelf.filter((book) => book.id !== bookId);

    localStorage.setItem(BOOKSHELF_KEY, JSON.stringify(filteredBookshelf));
    return true;
  } catch (error) {
    console.error("Error removing from bookshelf:", error);
    return false;
  }
};
