"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export const FancySelect = ({
  options,
  placeholder,
  onItemSelected,
}: {
  options: string[];
  onItemSelected?: (item: string) => void;
  placeholder?: string;
}) => {
  const [selectedOption, setSelectedOption] = useState(
    placeholder ?? "Select audio"
  );
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    setIsExpanded(false);
    onItemSelected && onItemSelected(selectedOption);
  }, [selectedOption, onItemSelected]);

  return (
    <motion.div
      className="input_sizing relative"
      animate={isExpanded ? "open" : "closed"}
    >
      <motion.div
        className="w-full bg-black absolute bottom-12"
        variants={{
          open: {
            clipPath: "inset(0% 0% 0% 0%)",
            transition: {
              type: "spring",
              bounce: 0,
              duration: 0.3,
              // delayChildren: 0.3,
              staggerChildren: 0.05,
              staggerDirection: -1,
            },
          },
          closed: {
            clipPath: "inset(10% 50% 90% 50%)",
            transition: {
              type: "spring",
              bounce: 0,
              duration: 0.3,
            },
          },
        }}
      >
        {options.map((option) => (
          <p
            onClick={() => {
              setSelectedOption(option);
            }}
            key={option}
            className="m-2 text-center h-10 hover:bg-gray-600 border-b-2 border-gray-600 cursor-pointer text-white font-bold"
          >
            {option}
          </p>
        ))}
      </motion.div>
      <motion.button
        onClick={() => setIsExpanded((isExpanded) => !isExpanded)}
        className="grid place-content-center  w-full h-full"
      >
        <p className="mx-auto">{selectedOption}</p>
      </motion.button>
    </motion.div>
    // </GlowingDiv>
  );
};
