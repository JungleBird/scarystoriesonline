import { motion, useScroll, useTransform } from "framer-motion";

export function ProgressBarScrollComponent(props) {
  const { progress } = props;
  const width = useTransform(progress, [0, 1], ["0%", "100%"]);

  return (
    <div
      style={{
        position: "sticky",
        bottom: 0,
        width: "100%",
        height: "5px",
        backgroundColor: "rgba(44, 44, 44)",
      }}
    >
      <motion.div
        style={{
          width,
          height: "100%",
          backgroundColor: "orange",
          originX: 0,
          borderRadius: "10px",
          boxShadow: "0 0 40px 10px rgba(180, 108, 0, 0.4)",
        }}
      />
    </div>
  );
}

export function ProgressBarStepsComponent(props) {
  const { progress, total } = props;
  const width = "5px";
  const height = "30px"
  const fullSteps = Array.from({ length: total }, (_, i) => (i < progress+1 ? true : false ));
  
    return (
      <div style={{display: "flex", flexDirection: "row", columnGap: "8px", justifyContent: "center", alignItems: "center"}}>
        {fullSteps.map((bool, index) => (
          <div
            key={`candle${index}`}
            style={{
              width: width,
              height: height,
              backgroundColor: bool ? "orange" : "rgba(44, 44, 44)",
              borderRadius: "10px",
              boxShadow: bool ? "0 0 40px 10px rgba(180, 108, 0, 0.4)" : "none",
            }}
          />
        ))}
      </div>
   
  );
}