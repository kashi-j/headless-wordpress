// component
import { ReactNode } from "react";
import Footer from "../organisms/Footer";
import Header from "../organisms/Header";

const Layout: React.FC<{ children: ReactNode, hidePt?: boolean }> = ({ children, hidePt = false }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className={`mb-auto ${hidePt ? "" : "pt-10"}`}>
        {children}
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
