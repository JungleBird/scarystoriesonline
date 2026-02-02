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

      // If sentence contains *** (e.g., "*** text" or "text ***" or "*** text ***"), split it
      if (sentence.includes("***")) {
        const parts = sentence.split("***");
        for (let i = 0; i < parts.length; i++) {
          const part = parts[i].trim();
          if (i < parts.length - 1) {
            // Not the last part - push part (if not empty) then push ***
            if (part) {
              sentencesArray.push(part);
            }
            sentencesArray.push("***");
          } else {
            // Last part - only push if not empty
            if (part) {
              sentencesArray.push(part);
            }
          }
        }
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
    let buffer = [];
    for (let i = 0; i < sentencesArray.length; i++) {
      const sentence = sentencesArray[i];
      if (sentence === "***") {
        // If there is a pending sentence in buffer, push it as a paragraph
        if (buffer.length > 0) {
          paragraphsArray.push(buffer.join(" "));
          buffer = [];
        }
        paragraphsArray.push("***");
        continue;
      }
      buffer.push(sentence);
      if (buffer.length === sentencesPerParagraph) {
        paragraphsArray.push(buffer.join(" "));
        buffer = [];
      }
    }
    // Push any remaining sentence(s) in buffer as a paragraph
    if (buffer.length > 0) {
      paragraphsArray.push(buffer.join(" "));
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
