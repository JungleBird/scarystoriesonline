export default function FormattedTextComponent(props) {

  const { scrollProgress, paragraphs } = props;

  let paragraphsArray = [...paragraphs];
  return (
    <div
      className="paragraph-container"
      id="paragraph-container-id"
      >
      {paragraphsArray.map((paragraph, i) => {
        const start = i / paragraphsArray.length;
        const end = start + 1 / paragraphsArray.length;
        return (
          <MotionParagraph
            key={i}
            index={i}
            start={start}
            end={end}
            progress={scrollProgress}
          >
            {paragraph}
          </MotionParagraph>
        );
      })}
    </div>
  );
}

const MotionParagraph = (props) => {
  const { children, start, end, progress, index } = props;
  //const opacity = useTransform(scrollProgress, [start-0.015, end-0.015], [0.15, 1]);
  const wordsArray = children.split(" ");

  return (
    <p className="text-paragraph" id={"text-paragraph" + index} index={index} style={{padding: "15px"}}>
      {wordsArray.map((word, i) => (
        <span key={i} className="text-word">
          {word + " "}
        </span>
      ))}
    </p>
  );
};
//return <motion.p className="text-paragraph" id={id} style={{opacity: opacity }}>{children}</motion.p>;