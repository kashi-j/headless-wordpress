import { ReactNode } from "react";

const DateText: React.FC<{ children: ReactNode }> = ({ children }) => {
  return <span className="text-gray-500 font-light inline-block">{children}</span>;
};

export default DateText;
