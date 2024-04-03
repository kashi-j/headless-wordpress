import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import SiteInfoConst from "../constants/SiteInfoConst";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
    <Head>
      <title>foo | sitename</title>
    </Head>
    < Component {...pageProps } />;
    </>
  )
}
