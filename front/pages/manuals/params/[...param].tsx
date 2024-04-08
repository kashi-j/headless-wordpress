import { Noto_Sans_JP } from "next/font/google";
// const
import PostConst from "../../../constants/PostConst";
// type
import type { NextPage } from "next";
import PostOnListType from "@/types/PostOnListType";
// service
import ManualService from "../../../services/ManualService";
// hook
import useManualListSwr from "../../../hooks/swr/useManualListSwr";
// component
import Layout from "../../../components/templates/Layout";
import PostBox from "../../../components/molecules/PostBox";
import Pagination from "../../../components/molecules/Pagination";
import Head from "next/head";  // 追記
import SiteInfoConst from "../../../constants/SiteInfoConst";

const notoSansJP = Noto_Sans_JP({ subsets: ["latin"], weight: ["400"] });

const Home: NextPage<{
  staticPostList: PostOnListType[];
  currentPage: number;
  staticTotal: number;
  // staticCategoryId: number | null;
  staticCategorySlug: string | null;
}> = ({
  staticPostList,
  currentPage,
  staticTotal,
  staticCategorySlug,
}) => {
  const categorySlug = staticCategorySlug ?? undefined;

  const [postList, total] = useManualListSwr({
    currentPage,
    staticPostList,
    staticTotal,
    categorySlug,
  });

  const siteTitle = `記事一覧 ${staticCategorySlug ? ":" + staticCategorySlug : ""}`;
  return (
    <>
      <Head>
        <title>{`${siteTitle} | ${SiteInfoConst.siteName}`}</title>
      </Head>
      <Layout>
        <main className={`${notoSansJP.className}`}>
          <div className="flex flex-wrap w-main mx-auto">
            {postList!.map((post) => (
              <div
                key={post.id}
                className="w-1/3 pr-4 pb-4 [&:nth-of-type(3n)]:pr-0"
              >
                <PostBox post={post} postType="manuals" />
              </div>
            ))}
          </div>
          <Pagination
            total={total}
            sizePerPage={PostConst.sizePerPage}
            currentPage={currentPage}
            path={categorySlug ? `/manuals/category/${categorySlug}/page` : "/manuals/page"}
          />
        </main>
      </Layout>
    </>
  );
};

export async function getStaticPaths() {
  const paths = await ManualService.getAllPageAndCategoryList();
  return {
    paths,
    // fallback: true,
    fallback: false,
  };
}

export async function getStaticProps({
  params,
}: {
  params: {
    param: [string, string] | [string, string, string, string];
  };
}) {
  const param = params.param;
  let currentPage = 1;
  let categoryId: number | undefined;
  let categorySlug: string | undefined;
  // 「page/ページ番号」の場合
  if (param.length === 2 && param[0] === "page") {
    currentPage = parseInt(param[1]);
  } else if (
    // 「catagory/カテゴリー名/page/ページ番号」の場合
    param.length === 4 &&
    param[0] === "category" &&
    param[2] === "page"
  ) {
    categorySlug = param[1];
    currentPage = parseInt(param[3]);
  }
  const [staticPostList, staticTotal] = await ManualService.getList({
    page: currentPage,
  });
  return {
    props: {
      staticPostList,
      staticTotal,
      currentPage,
      staticCategorySlug: categorySlug ?? null,
    },
    revalidate: 10,
  };
}

export default Home;
