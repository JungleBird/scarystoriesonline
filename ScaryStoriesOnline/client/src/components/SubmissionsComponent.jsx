import React, { useState } from "react";
import { motion } from "framer-motion";
import "../styles/Submissions.css";
import { formatTextToParagraphs } from "../hooks/usePagination";

const SubmissionsComponent = () => {
  const [storyText, setStoryText] = useState("");

  const handleFormat = () => {
    // Get paragraphs array
    const paragraphs = formatTextToParagraphs(storyText);
    // Join paragraphs with a single newline between each for textarea display
    setStoryText(paragraphs.join("\n\n"));
  };

  const handleSubmit = () => {
    console.log("Submit button clicked");
  };

  return (
    <div className="submissions-container">
      <motion.div
        className="submissions-content"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="submissions-title">Submit a Story</h1>
        <p className="submissions-subtitle">
          Paste your story below and click format to prepare it for submission
        </p>
        <div className="submissions-wrapper">
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "100%",
              flex: 1,
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
              }}
            >
              <label htmlFor="story-title" className="visually-hidden">Story Title</label>
              <input
                id="story-title"
                className="submissions-input"
                type="text"
                placeholder="Title"
                aria-label="Story title"
              />
              <label htmlFor="story-chapter" className="visually-hidden">Chapter</label>
              <input
                id="story-chapter"
                className="submissions-input"
                type="text"
                placeholder="Chapter"
                aria-label="Chapter name or number"
              />
            </div>
            <label htmlFor="story-content" className="visually-hidden">Story Content</label>
            <textarea
              id="story-content"
              className="submissions-textarea"
              value={storyText}
              onChange={(e) => setStoryText(e.target.value)}
              placeholder="Paste your story here..."
              spellCheck="false"
              aria-label="Story content"
            />
          </div>
          <div className="submissions-actions">
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                paddingLeft: "20px",
              }}
            >
              <button 
                className="submissions-format-btn" 
                onClick={handleFormat}
                type="button"
                aria-label="Format story text"
              >
                <span className="material-icons" aria-hidden="true">format_align_left</span>
                Format Text
              </button>

              <span className="submissions-format-info">
                See a preview how your story will be formatted
              </span>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                paddingLeft: "20px",
              }}
            >
              <button 
                className="submissions-submit-btn" 
                onClick={handleSubmit}
                type="button"
                aria-label="Submit your story"
              >
                Submit Story <span className="material-icons" aria-hidden="true">send</span>
              </button>

              <span className="submissions-format-info">
                Submit your completed story
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SubmissionsComponent;
