import React, { useRef, useEffect, useState } from "react";
import { motion, useScroll } from "framer-motion";
import {
  ProgressBarScrollComponent,
  ProgressBarStepsComponent,
} from "./ProgressBarComponent";
import FormattedTextComponent from "./FormattedTextComponent";

import { ComponentContainer } from "../styles/AppStyledComponents";

import useIntersectionTrigger from "../hooks/useIntersectionTrigger";
import useDraggableScroll from "../hooks/useDraggableScroll";
import usePagination from "../hooks/usePagination";
import useCustomWheelScroll from "../hooks/useCustomWheelScroll";

export default function ScreenReaderComponent(props) {
  // Accept book as a prop (object)
  const { title, chapter, textData } = props.book;
  const { onClose } = props;

  const [autoplay, setAutoplay] = useState(false);
  const firstButtonRef = useRef(null);

  // Use the custom hook for intersection trigger logic
  const {
    textAreaRef,
    triggerRef,
    triggerCenterRef,
    triggerCenterHeight,
    triggerCenterOffset,
    currentParagraphId,
    currentParagraphIndex,
    scrollToPreviousParagraph,
    scrollToNextParagraph,
    triggerInterceptSignal,
  } = useIntersectionTrigger();

  const { scrollYProgress } = useScroll({ container: textAreaRef });
  const { currentPageIndex, totalPages, pages, prevPage, nextPage } =
    usePagination({
      textBody: textData,
      container: textAreaRef,
      triggerSignal: triggerInterceptSignal,
    });
  const { containerRef, handleMouseDown } = useDraggableScroll();
  //const { scrollRef } = useCustomWheelScroll({ scrollSpeedMultiplier: 0.1 });

  // Auto-focus first button when component mounts
  useEffect(() => {
    // Small delay to ensure modal is fully rendered
    const timer = setTimeout(() => {
      if (firstButtonRef.current) {
        firstButtonRef.current.focus();
      }
    }, 20);

    return () => clearTimeout(timer);
  }, []);

  // Focus trap: keep tab navigation within the modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Tab") {
        // Get all focusable buttons in the modal
        const modalButtons = document.querySelectorAll(
          '.modal-content button[tabindex="0"]:not([disabled])',
        );

        if (modalButtons.length === 0) return;

        const buttonsArray = Array.from(modalButtons);
        const currentIndex = buttonsArray.indexOf(document.activeElement);

        // Prevent default tab behavior
        e.preventDefault();

        let nextIndex;
        if (e.shiftKey) {
          // Shift+Tab: go backwards
          nextIndex =
            currentIndex <= 0 ? buttonsArray.length - 1 : currentIndex - 1;
        } else {
          // Tab: go forwards
          nextIndex =
            currentIndex >= buttonsArray.length - 1 ? 0 : currentIndex + 1;
        }

        buttonsArray[nextIndex].focus();
      }

      // Explicitly handle Enter and Space for focused buttons
      if (e.key === "Enter" || e.key === " ") {
        const activeElement = document.activeElement;
        if (
          activeElement &&
          activeElement.tagName === "BUTTON" &&
          activeElement.closest(".modal-content")
        ) {
          // Only trigger if focus is on a button within the modal
          // Native behavior usually handles this, but this ensures it works
          // especially if focus is weirdly managed.
          activeElement.click();
          e.preventDefault(); // Prevent scrolling on Space
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    //generateSpeechClient(pages[currentPageIndex][currentParagraphIndex]);
    console.log(
      "generateing speech for: ",
      pages[currentPageIndex][currentParagraphIndex],
    );
  }, [currentParagraphIndex]);

  // Autoplay logic - automatically advance to next paragraph
  useEffect(() => {
    if (!autoplay) return;

    const autoplayInterval = setInterval(() => {
      scrollToNextParagraph();
    }, 2000); // Advance every 2 seconds

    return () => {
      clearInterval(autoplayInterval);
    };
  }, [autoplay, scrollToNextParagraph]);

  return (
    <ComponentContainer style={{ flexDirection: "column" }}>
      <div className="text-scroll-area-container">
        <div className="title-header" style={{ borderRadius: "15px 15px 0 0" }}>
          <h1>{title}</h1>
          <h2>{chapter}</h2>
        </div>
        <motion.div
          className="text-scroll-area"
          ref={(e) => {
            textAreaRef.current = e;
            containerRef.current = e;
            //scrollRef.current = e;
          }}
          onMouseDown={handleMouseDown}
          tabIndex="-1"
        >
          {/* Middle trigger area for intersection observer */}
          <div
            ref={triggerRef}
            className="intersection-trigger"
            style={{
              //border: "2px dashed rgba(255, 140, 0, 0.32)",
              position: "sticky",
              top: "10%",
              width: "99%",
              height: "80%",
              background: "inherit",
              zIndex: -1,
              pointerEvents: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontWeight: "bold",
              fontSize: "1.5rem",
            }}
          >
            <div
              style={{
                //border: "5px dashed rgba(255, 140, 0, 0.32)",
                borderRadius: "10px",
                borderLeftStyle: "none",
                borderRightStyle: "none",
                zIndex: 1,
                height: triggerCenterHeight,
                transition: "height 0.4s ease-in-out, margin 0.2s ease-in",
                width: "100%",
                padding: "10px 0 10px 0",
                //marginTop: triggerCenterOffset * 2,
              }}
            >
              <div
                ref={triggerCenterRef}
                style={{
                  position: "absolute",
                  height: "20%",
                  width: "100%",
                }}
              ></div>
            </div>
          </div>
          <FormattedTextComponent
            containerRef={textAreaRef}
            scrollProgress={scrollYProgress}
            paragraphs={pages[currentPageIndex]}
          />
        </motion.div>
        <ProgressBarScrollComponent
          containerRef={textAreaRef}
          progress={scrollYProgress}
        />

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "10px",
          }}
        >
          {(currentPageIndex > 0 && (
            <button onClick={prevPage} tabIndex="0" ref={firstButtonRef}>
              Prev Page
            </button>
          )) || (
            <button
              onClick={prevPage}
              disabled
              tabIndex="-1"
              ref={firstButtonRef}
            >
              Prev Page
            </button>
          )}

          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              columnGap: "15px",
            }}
          >
            <button onClick={scrollToPreviousParagraph} tabIndex="0">
              -
            </button>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minWidth: "5vw",
                whiteSpace: "nowrap",
              }}
            >
              <h3>
                Line:{" "}
                {Math.min(
                  Math.max(currentParagraphIndex - 5 + 1, 0),
                  pages[currentPageIndex].length - 10,
                )}
                /{pages[currentPageIndex].length - 10}
              </h3>
            </div>

            <button onClick={scrollToNextParagraph} tabIndex="0">
              +
            </button>
          </div>

          {(currentPageIndex < totalPages - 1 && (
            <button onClick={nextPage} tabIndex="0">
              Next Page
            </button>
          )) || (
            <button onClick={nextPage} disabled tabIndex="-1">
              Next Page
            </button>
          )}
        </div>

        <ProgressBarStepsComponent
          progress={currentPageIndex}
          total={totalPages}
        />
      </div>
      <div
        style={{
          padding: "12px",
          display: "flex",
          gap: "15px",
          justifyContent: "center",
        }}
      >
        <button onClick={() => setAutoplay(!autoplay)} tabIndex="0">
          {autoplay ? (
            <span className="material-icons">pause</span>
          ) : (
            <span className="material-icons">play_arrow</span>
          )}
        </button>
        <button onClick={onClose} aria-label="Close Screen Reader" tabIndex="0">
          <span className="material-icons">close</span>
        </button>
      </div>
    </ComponentContainer>
  );
}
