import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import BookCard from "./BookCardComponent";

import { ComponentContainer } from "../styles/AppStyledComponents";
import usePagination from "../hooks/usePagination";

import storyDataMap from "../assets/data/StoryRegistry.js";
import bookLibraryData from "../assets/data/bookLibrary.json";
import { NavigationBar } from "./NavigationBar";

import "../styles/screenReader.css";
import "../styles/BookCardLibrary.css";

// Story data mapping is now handled by StoryRegistry.js

export function debounce(func, delay = 300) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
}

export default function LandingPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeSearchTerm, setActiveSearchTerm] = useState("");
  
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  // Update search term when transcript changes
  useEffect(() => {
    console.log('Transcript updated:', transcript);
    if (transcript) {
      setSearchTerm(transcript);
    }
  }, [transcript]);

  const toggleListening = async () => {
    if (!browserSupportsSpeechRecognition) {
      alert('Your browser does not support speech recognition. Please use Chrome, Edge, or Safari.');
      return;
    }

    if (listening) {
      SpeechRecognition.stopListening();
    } else {
      resetTranscript();
      setSearchTerm(""); // Clear the search term when starting to listen
      try {
        await SpeechRecognition.startListening({ 
          continuous: true,
          language: 'en-US'
        });
        console.log('Speech recognition started');
      } catch (error) {
        console.error('Error starting speech recognition:', error);
        alert('Unable to start voice input. Please check microphone permissions in your browser settings.');
      }
    }
  };

  const handleSearch = () => {
    setActiveSearchTerm(searchTerm);
  };

  // Process book library data with actual story data, handle missing stories gracefully
  const bookLibrary = bookLibraryData.map((book) => {
    const storyData = storyDataMap[book.storyFile];
    if (!storyData || !storyData.text) {
      // If story data is missing, return a placeholder object
      return {
        id: book.id,
        title: book.title || "unknown title",
        author: "unknown author",
        chapter: book.chapter || "",
        description: "(Story not found)",
        textData: "",
        wordCount: 0,
        pageCount: 0,
      };
    }
    const { totalPages } = usePagination({ textBody: storyData.text });
    return {
      id: book.id, // Include the unique ID for bookshelf tracking
      title: storyData.title || "unknown title",
      author: storyData.author || "unknown author",
      chapter: storyData.chapter || "",
      description: storyData.description || "(No Description)",
      textData: storyData.text,
      wordCount: storyData.text.split(" ").length,
      pageCount: totalPages || 0,
    };
  });

  const filteredBooks = bookLibrary.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(activeSearchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(activeSearchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <ComponentContainer>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
        }}
      >
        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{
            padding: "40px",
            display: "flex",
            justifyContent: "center",
          }}
        >
          {/*https://blog.logrocket.com/using-the-react-speech-recognition-hook-for-voice-assistance/ */}
          <div className="search-with-mic" role="search">
            <button
              className="mic-button"
              onClick={toggleListening}
              title={listening ? "Stop listening" : "Start voice search"}
              aria-label={listening ? "Stop voice search" : "Start voice search"}
              aria-pressed={listening}
              type="button"
            >
              <span
                className="material-icons"
                style={{ color: listening ? "#ff7b00" : "rgba(255, 255, 255, 0.6)" }}
              >
                {listening ? "mic" : "mic_none"}
              </span>
            </button>
            <div className="search-input-wrapper">
              <textarea
                id="book-search"
                className="book-search-input"
                aria-label="Search for books by title or author"
                placeholder={browserSupportsSpeechRecognition ? "Type a search term... or click the mic to use voice" : "Search..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <button 
            style={{ marginLeft: "10px" }} 
            onClick={handleSearch}
            aria-label="Search books"
            type="button"
          >
            <span
              className="material-icons md-48"
              style={{ padding: "5px", color: "#565461" }}
              aria-hidden="true"
            >
              support_agent
            </span>
          </button>
        </motion.div>

        {/* Book Grid */}
        <motion.div 
          className="book-grid"
          role="list"
          aria-label="Book collection"
        >
          {filteredBooks.map((book, index) => (
            <BookCard key={`book${index}`} book={book} index={index} />
          ))}
        </motion.div>

        {/* No Results */}

        {filteredBooks.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              textAlign: "center",
              padding: "60px 20px",
              opacity: 0.7,
            }}
          >
            <h3 style={{ fontSize: "1.5rem", marginBottom: "16px" }}>
              No books found
            </h3>
            <p>Try adjusting your search terms</p>
          </motion.div>
        )}
      </div>
    </ComponentContainer>
  );
}
