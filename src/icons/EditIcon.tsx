import * as React from "react";

const EditIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className={className || "w-5 h-5"}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M16.862 4.487a2.1 2.1 0 1 1 2.97 2.97L7.5 19.79l-4 1 1-4 13.362-13.303z"
    />
  </svg>
);

export default EditIcon;
