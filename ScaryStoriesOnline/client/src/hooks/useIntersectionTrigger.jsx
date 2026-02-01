import { useRef, useEffect, useState } from "react";

export default function useIntersectionTrigger() {
  const textAreaRef = useRef(null);
  const triggerRef = useRef(null);
  const triggerCenterRef = useRef(null);
  const [triggerCenterHeight, setTriggerCenterHeight] = useState("20%");
  const [triggerCenterOffset, setTriggerCenterOffset] = useState(0);
  const [currentParagraphId, setCurrentParagraphId] =
    useState("text-paragraph0");
  const [currentParagraphIndex, setCurrentParagraphIndex] = useState(0);

  const [scrollPosition, setScrollPosition] = useState();
  const [scrollMarker, setScrollMarker] = useState(0);
  const [page, setPage] = useState(0);

  function getBoundingRect(elementRect, scrollAreaRect, scrollArea) {
    const top = elementRect.top - scrollAreaRect.top + scrollArea.scrollTop;
    const bottom =
      elementRect.bottom - scrollAreaRect.top + scrollArea.scrollTop;
    return [top, bottom];
  }

  const updateScrollMarker = () => {
    setScrollMarker(textAreaRef.current.scrollTop);
  };

  // This function will trigger useEffect on page change by updating the page state\
  const triggerInterceptSignal = (pageNumber) => {
    if (typeof pageNumber === "number" && pageNumber !== page) {
      setPage(pageNumber);
      setCurrentParagraphIndex(0);
    }
  };

  function checkIntersection(
    allParagraphs,
    triggerRect,
    triggerCenterRect,
    scrollAreaRect,
    scrollArea,
  ) {
    const [triggerTop, triggerBottom] = getBoundingRect(
      triggerRect,
      scrollAreaRect,
      scrollArea,
    );
    const [triggerCenterTop, triggerCenterBottom] = getBoundingRect(
      triggerCenterRect,
      scrollAreaRect,
      scrollArea,
    );

    let newCenterHeight = null;
    let viewElements = [];
    let showElements = [];

    allParagraphs.forEach((paragraph, idx) => {
      if (idx > currentParagraphIndex + 5 || idx < currentParagraphIndex - 5)
        return; //only check nearby paragraphs for performance

      const paraRect = paragraph.getBoundingClientRect();
      const [paraTop, paraBottom] = getBoundingRect(
        paraRect,
        scrollAreaRect,
        scrollArea,
      );
      const paraHeight = paraBottom - paraTop;
      // Intersection with trigger area
      const intersectionTop = Math.max(paraTop, triggerTop);
      const intersectionBottom = Math.min(paraBottom, triggerBottom);
      const intersectionHeight = Math.max(
        0,
        intersectionBottom - intersectionTop,
      );
      const intersectionRatio = intersectionHeight / paraHeight;
      const isIntersecting = intersectionRatio >= 0.32;

      // Intersection with triggerCenter area
      const centerIntersectionTop = Math.max(paraTop, triggerCenterTop);
      const centerIntersectionBottom = Math.min(
        paraBottom,
        triggerCenterBottom,
      );
      const centerIntersectionHeight = Math.max(
        0,
        centerIntersectionBottom - centerIntersectionTop,
      );
      const centerIntersectionRatio = centerIntersectionHeight / paraHeight;
      const isIntersectingCenter = centerIntersectionRatio >= 0.2;

      if (isIntersecting) {
        viewElements.push(paragraph);
      } else {
        paragraph.classList.remove("fade-in");
      }

      if (isIntersectingCenter) {
        showElements.push(paragraph);
        newCenterHeight = paraHeight;
        const centerIntersectionPoint =
          (triggerCenterTop + triggerCenterBottom) / 2;
        const centerParagraphPoint = (paraTop + paraBottom) / 2;

        //const centerOffset = centerParagraphPoint - centerIntersectionPoint;
        //setTriggerCenterOffset(centerOffset);
      } else {
        paragraph.classList.remove("show");
      }
    });

    if (viewElements.length > 0) {
      viewElements.forEach((p) => p.classList.add("fade-in"));
    }
    // Handle show class - ensure only one paragraph has "show" class
    if (showElements.length > 0) {
      const showElementNode = showElements[0]; //showElements[showElements.length - 1];
      showElementNode.classList.remove("fade-in");
      showElementNode.classList.add("show");

      setCurrentParagraphId(showElementNode.id);
      setCurrentParagraphIndex(showElementNode.getAttribute("index"));
    }

    /*
    // Set trigger center height if a paragraph is intersecting center
    if (newCenterHeight) {
      setTriggerCenterHeight(newCenterHeight);
    } else {
      setTriggerCenterHeight("20%");
    }
    */
  }

  useEffect(() => {
    const handleScroll = () => {
      if (textAreaRef.current) {
        setScrollPosition(textAreaRef.current.scrollTop);
      }

      if (Math.abs(scrollPosition - scrollMarker) > 40) {
        updateScrollMarker();
      }
    };

    const handleKeyDown = (event) => {
      event.preventDefault();
      if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
        scrollToPreviousParagraph();
      } else if (event.key === "ArrowRight" || event.key === "ArrowDown") {
        scrollToNextParagraph();
      }
    };

    const scrollArea = textAreaRef.current;
    scrollArea.addEventListener("scroll", handleScroll);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      scrollArea.removeEventListener("scroll", handleScroll);
      window.removeEventListener("keydown", handleKeyDown);
    };
  });

  useEffect(() => {
    const scrollArea = textAreaRef.current;
    const trigger = triggerRef.current;
    const triggerCenter = triggerCenterRef.current;

    if (!scrollArea || !trigger) return;

    const scrollAreaRect = scrollArea.getBoundingClientRect();
    const triggerRect = trigger.getBoundingClientRect();
    const triggerCenterRect = triggerCenter.getBoundingClientRect();
    const allParagraphs = scrollArea.querySelectorAll(".text-paragraph");

    checkIntersection(
      allParagraphs,
      triggerRect,
      triggerCenterRect,
      scrollAreaRect,
      scrollArea,
    );
  }, [page, scrollMarker, currentParagraphId, currentParagraphIndex]);

  function scrollToPreviousParagraph() {
    const current = textAreaRef.current.querySelector(`#${currentParagraphId}`);
    if (current && current.previousElementSibling) {
      setCurrentParagraphId(current.previousElementSibling.id);
      current.previousElementSibling.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      updateScrollMarker();
    }
  }

  function scrollToNextParagraph() {
    const current = textAreaRef.current.querySelector(`#${currentParagraphId}`);
    if (current && current.nextElementSibling) {
      setCurrentParagraphId(current.nextElementSibling.id);
      current.nextElementSibling.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      updateScrollMarker();
    }
  }

  return {
    textAreaRef,
    triggerRef,
    triggerCenterRef,
    triggerCenterHeight,
    triggerCenterOffset,
    currentParagraphId,
    currentParagraphIndex,
    scrollToPreviousParagraph,
    scrollToNextParagraph,
    setCurrentParagraphId,
    setCurrentParagraphIndex,
    triggerInterceptSignal,
  };
}
