import { Noto_Sans_JP } from "next/font/google";
// const
import PostConst from "../../../constants/PostConst";
// type
import type { NextPage } from "next";
import PostOnListType from "@/types/PostOnListType";
// service
import PostService from "../../../services/PostService";
// hook
import usePostListSwr from "../../../hooks/swr/usePostListSwr";
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
  staticCategoryId: number | null;
  staticCategorySlug: string | null;
}> = ({
  staticPostList,
  currentPage,
  staticTotal,
  staticCategoryId,
  staticCategorySlug,
}) => {
  const categoryId = staticCategoryId ?? undefined;
  const categorySlug = staticCategorySlug ?? undefined;
  const [postList, total] = usePostListSwr({
    currentPage,
    staticPostList,
    staticTotal,
    categoryId,
  });
  const siteTitle = `記事一覧 ${staticCategorySlug ? ":" + staticCategorySlug : ""}`;
  return (
    <>
      <Head>
        <title>{`${siteTitle} | ${SiteInfoConst.siteName}`}</title>
      </Head>
      <Layout hidePt>
        <main className={`${notoSansJP.className}`}>
          <div className="flex flex-wrap w-main mx-auto">
            {postList!.map((post) => (
              <div
                key={post.id}
                className="w-1/3 pr-4 pb-4 [&:nth-of-type(3n)]:pr-0"
              >
                <PostBox post={post} />
              </div>
            ))}
          </div>
          <Pagination
            total={total}
            sizePerPage={PostConst.sizePerPage}
            currentPage={currentPage}
            path={categorySlug ? `/category/${categorySlug}/page` : "/page"}
          />
        </main>
      </Layout>
    </>
  );
};

export async function getStaticPaths() {
  const paths = await PostService.getAllPageAndCategoryList();
  return {
    paths,
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
  if (param.length === 2 && param[0] === "page") {
    currentPage = parseInt(param[1]);
  } else if (
    param.length === 4 &&
    param[0] === "category" &&
    param[2] === "page"
  ) {
    categorySlug = param[1];
    categoryId = await PostService.getCategoryIdBySlug({ slug: categorySlug });
    currentPage = parseInt(param[3]);
  }
  const [staticPostList, staticTotal] = await PostService.getList({
    page: currentPage,
  });
  return {
    props: {
      staticPostList,
      staticTotal,
      currentPage,
      staticCategoryId: categoryId ?? null,
      staticCategorySlug: categorySlug ?? null,
    },
    revalidate: 10,
  };
}

export default Home;
