import { useState } from "react";

export default function usePagination({ textBody, container, triggerSignal }) {
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const { totalPages, pages } = PaginateText(textBody);
  function nextPage() {
    if (currentPageIndex < totalPages - 1) {
      const currentPage = currentPageIndex;
      setCurrentPageIndex(currentPage + 1);
      if (container.current) {
        container.current.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      }
      triggerSignal(currentPage + 1); //trigger intersection check on page change
    }
  }

  function prevPage() {
    if (currentPageIndex > 0) {
      const currentPage = currentPageIndex;
      setCurrentPageIndex(currentPage - 1);
      if (container.current) {
        container.current.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      }
      triggerSignal(currentPage - 1); //trigger intersection check on page change
    }
  }

  return { currentPageIndex, totalPages, pages, prevPage, nextPage };
}

export function formatTextToParagraphs(textData) {
  let paragraphsArray = [];

  if (textData) {
    const sentencesArray = [];
    // Split by sentences, but do not split quoted sentences or break on commas inside quotes
    // This regex matches quoted text (with commas or punctuation inside) as a single unit, or unquoted sentences ending with . ? !
    // Regex: treat ellipses as part of the sentence, not as sentence boundaries
    // Also treat triple asterisks (***) as their own paragraph break
    let regex =
      /\*\*\*|"[^"]+"|[^.!?\s][^.!?]*(?:\.\.\.[^.!?]*|[.!?](?!\\.+|['"]?\s|[.])[^.!?]*)*[.!?]?['"]?(?=\s|$)/g;
    let match;
    let quotedParagraphSize = 2;
    while ((match = regex.exec(textData)) !== null) {
      let sentence = match[0].trim();

      // Check if this is a triple asterisk break
      if (sentence === "***") {
        sentencesArray.push(sentence);
        continue;
      }

      let quotedRegex = /^".*"$/s;

      if (sentence && quotedRegex.test(sentence)) {
        // This is a quoted sentence - split it into individual sentences if it contains multiple
        const quotedContent = sentence.slice(1, -1); // Remove outer quotes
        const individualSentences = quotedContent
          .split(/(?<=[.!?])\s+/)
          .filter((s) => s.trim());

        if (individualSentences.length > quotedParagraphSize) {
          // Split into 2-sentence chunks
          for (
            let i = 0;
            i < individualSentences.length;
            i += quotedParagraphSize
          ) {
            const chunk = individualSentences.slice(i, i + quotedParagraphSize);
            sentencesArray.push(`"${chunk.join(" ")}"`);
          }
        } else {
          // Keep as is if quotedParagraphSize sentences or less
          sentencesArray.push(`"${individualSentences.join(" ")}"`);
        }
      } else if (sentence) {
        sentencesArray.push(sentence);
      }
    }
    const sentencesPerParagraph = 2;
    for (let i = 0; i < sentencesArray.length; i += sentencesPerParagraph) {
      // Check if current sentence is a triple asterisk break
      if (sentencesArray[i] === "***") {
        paragraphsArray.push("***");
        i -= sentencesPerParagraph - 1; // Adjust increment to only move forward by 1
        continue;
      }

      const paragraphSentences = sentencesArray.slice(
        i,
        i + sentencesPerParagraph,
      );

      // Filter out any triple asterisks that might have been included in the slice
      const filteredSentences = paragraphSentences.filter((s) => s !== "***");

      if (filteredSentences.length > 0) {
        paragraphsArray.push(`${filteredSentences.join(" ")}`);
      }

      // If we filtered out a ***, we need to add it separately and adjust index
      if (paragraphSentences.length !== filteredSentences.length) {
        paragraphsArray.push("***");
      }
    }
  }

  return paragraphsArray;
}

function PaginateText(rawText) {
  const paragraphs = formatTextToParagraphs(rawText);
  const itemsPerPage = 40;
  const totalPages = Math.ceil(paragraphs.length / itemsPerPage);

  const pages = [];

  let bumperArray = Array.from({ length: 5 }, () => ". . . . . .");

  for (let i = 0; i < paragraphs.length; i += itemsPerPage) {
    const page = paragraphs.slice(i, i + itemsPerPage);
    const pageParagraphs = [...bumperArray, ...page, ...bumperArray];
    pages.push(pageParagraphs);
  }

  return { totalPages, pages };
}
