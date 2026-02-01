import React from "react";
import { motion } from "framer-motion";
import "../styles/Profile.css";
import {
  darkPurple,
  burgundy,
  burntOrange,
  darkTeal,
  darkGray,
} from "../styles/colors";

const ProfileComponent = () => {
  // Placeholder user data (no database)

  const accentColors = [darkPurple, burgundy, burntOrange, darkTeal, darkGray];
  const user = {
    profilePicture: null,
    username: "scary_reader",
    email: "reader@scaryonline.com",
    password: "••••••••",
  };

  // Placeholder submitted stories (no database)
  const submittedStories = [
    { id: 1, title: "The Midnight Visitor", checkouts: 42 },
    { id: 2, title: "Whispers in the Dark", checkouts: 28 },
  ];

  const handleEdit = (field) => {
    // Placeholder - no functionality
    console.log(`Edit ${field} clicked`);
  };

  return (
    <div className="profile-container">
      <motion.h1
        className="profile-page-title"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        My Profile
      </motion.h1>

      <motion.div
        className="profile-book-wrapper"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {/* Left side stacked pages */}
        <div className="profile-pages-stack-left"></div>

        {/* Right side stacked pages */}
        <div className="profile-pages-stack-right"></div>

        <div className="profile-book">
          {/* Left Page - User Info */}
          <div className="profile-page profile-page-left">
            <div className="profile-avatar">
              {user.profilePicture ? (
                <img src={user.profilePicture} alt="Profile" />
              ) : (
                <span className="material-icons profile-avatar-icon">
                  person
                </span>
              )}
            </div>

            <div className="profile-fields">
              <div className="profile-field">
                <label>Username</label>
                <div className="profile-field-value">
                  <span>{user.username}</span>
                  <button
                    className="profile-edit-btn"
                    onClick={() => handleEdit("username")}
                  >
                    <span className="material-icons">edit</span>
                  </button>
                </div>
              </div>

              <div className="profile-field">
                <label>Email</label>
                <div className="profile-field-value">
                  <span>{user.email}</span>
                  <button
                    className="profile-edit-btn"
                    onClick={() => handleEdit("email")}
                  >
                    <span className="material-icons">edit</span>
                  </button>
                </div>
              </div>

              <div className="profile-field">
                <label>Password</label>
                <div className="profile-field-value">
                  <span>{user.password}</span>
                  <button
                    className="profile-edit-btn"
                    onClick={() => handleEdit("password")}
                  >
                    <span className="material-icons">edit</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Center Spine */}
          <div className="profile-spine"></div>

          {/* Right Page - Submitted Stories */}
          <div className="profile-page profile-page-right">
            <h2 className="profile-section-title">My Stories</h2>

            {submittedStories.length > 0 ? (
              <ul className="profile-stories-list">
                {submittedStories.map((story, index) => {
                  const accentColor = accentColors[index % accentColors.length];
                  return (
                    <li
                      key={story.id}
                      className="profile-story-item"
                      style={{ borderLeft: `6px solid ${accentColor}` }}
                    >
                      <span className="profile-story-title">{story.title}</span>
                      <span className="profile-story-checkouts">
                        {story.checkouts} checkouts
                      </span>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="profile-empty-message">
                You haven't submitted any stories yet.
              </p>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ProfileComponent;
