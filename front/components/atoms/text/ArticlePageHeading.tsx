import { ReactNode } from "react";

const ArticlePageHeading = ({children} : {children:ReactNode}) => {
  return (
    <h1 className="pt-4 pb-8 text-xl font-bold">
      {children}
    </h1>
  );
}

export default ArticlePageHeading;