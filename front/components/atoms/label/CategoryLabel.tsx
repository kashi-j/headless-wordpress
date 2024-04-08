import { ReactNode } from "react";

const CategoryLabel: React.FC<{ children: ReactNode }> = ({ children }) => {
  return <span className="inline-block text-white bg-gray-800 px-2 py-[2px] text-sm">{children}</span>;
};

export default CategoryLabel;
