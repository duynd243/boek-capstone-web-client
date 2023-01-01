import React from "react";
import Link from "next/link";
import { IoAdd } from "react-icons/io5";

type Props = {
  href?: string;
  onClick?: () => void;
  label: string;
  // align: "left" | "right";
};

const CreateButton: React.FC<Props> = ({ label, onClick, href }) => {
  return (
    <Link
      href={href || ""}
      onClick={onClick}
      className="m-btn gap-1 bg-indigo-500 text-white hover:bg-indigo-600"
    >
      <IoAdd size={16} />
      <span className="hidden sm:block">{label}</span>
    </Link>
  );
};

export default CreateButton;
