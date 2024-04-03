import { Noto_Sans_JP } from "next/font/google";
import Head from "next/head";
import Layout from "../components/templates/Layout";
import SiteInfoConst from "@/constants/SiteInfoConst";
const notoSansJP = Noto_Sans_JP({ subsets: ["latin"], weight: ["400"] });

const Custom404: React.FC = () => {
  return (
    <>
      <Head>
        <title>Not Found | ${SiteInfoConst.siteName}`</title>
      </Head>
      <Layout hidePt>
        <main className={`${notoSansJP.className}`}>
          <h1 className="text-center">404error | ページが見つかりません。</h1>
        </main>
      </Layout>
    </>
  );
};

export default Custom404;
