import React, { useState } from "react";
import { Button } from "@chakra-ui/react";

function CollapseBtn({ text }) {
  // its for comments show less/show more
  const [show, setShow] = useState(false);

  const handleToggle = () => setShow(!show);

  // If text length is less than 45 words, show the full text.
  if (text.split(" ").length <= 45) {
    return <p>{text}</p>;
  }

  // If it's longer, show the first 45 words with the "Show More" button.
  return (
    <>
      <p>
        {show ? text : text.split(" ").slice(0, 45).join(" ")}
        {show ? "" : "..."}{" "}
        <Button variant="link" onClick={handleToggle}>
          {show ? "Show Less" : "Show More"}
        </Button>
      </p>
    </>
  );
}

export default CollapseBtn;
