import { Noto_Sans_JP } from "next/font/google";
// component
import { ReactNode } from "react";
import Footer from "../organisms/Footer";
import Header from "../organisms/Header";

const notoSansJP = Noto_Sans_JP({ subsets: ["latin"], weight: ["400"] });

const Layout: React.FC<{
  children: ReactNode;
  hidePt?: boolean;
  currentPostType?: string;
}> = ({ children, hidePt = false, currentPostType = "" }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header currentPostType={currentPostType} />
      <main
        className={`${notoSansJP.className} mb-auto pb-10 ${
          hidePt ? "" : "pt-10"
        }  bg-grid-slate`}
      >
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
