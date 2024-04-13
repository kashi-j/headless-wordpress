import parser from "html-react-parser";
import { Noto_Sans_JP } from "next/font/google";
// const
import PostConst from "../../../constants/PostConst";
// type
import type { NextPage } from "next";
import PostOnListType from "../../../types/PostOnListType";
import SeoType from "../../../types/SeoType";
// service
import PostService from "../../../services/PostService";
// hook
import usePostListSwr from "../../../hooks/swr/usePostListSwr";
// component
import Layout from "../../../components/templates/Layout";
import PostBox from "../../../components/molecules/PostBox";
import Pagination from "../../../components/molecules/Pagination";
import Head from "next/head"; // 追記
import SiteInfoConst from "../../../constants/SiteInfoConst";

const notoSansJP = Noto_Sans_JP({ subsets: ["latin"], weight: ["400"] });

const Home: NextPage<{
  staticPostList: PostOnListType[];
  currentPage: number;
  staticTotal: number;
  staticCategoryId: number | null;
  staticCategorySlug: string | null;
  seoInfo: SeoType;
}> = ({
  staticPostList,
  currentPage,
  staticTotal,
  staticCategoryId,
  staticCategorySlug,
  seoInfo,
}) => {
  const categoryId = staticCategoryId ?? undefined;
  const categorySlug = staticCategorySlug ?? undefined;
  const [postList, total] = usePostListSwr({
    currentPage,
    staticPostList,
    staticTotal,
    categoryId,
  });
  const fullHead = typeof seoInfo?.metaFullHead == "string" && parser(seoInfo.metaFullHead);
  return (
    <>
      <Head>
        {fullHead && fullHead}
      </Head>
      <Layout>
        <main className={`${notoSansJP.className}`}>
          <div className="flex flex-wrap w-main mx-auto">
            {postList!.map((post) => (
              <div
                key={post.id}
                className="w-1/3 pr-4 pb-4 [&:nth-of-type(3n)]:pr-0"
              >
                <PostBox post={post} postType="posts" />
              </div>
            ))}
          </div>
          <Pagination
            total={total}
            sizePerPage={PostConst.sizePerPage}
            currentPage={currentPage}
            path={
              categorySlug
                ? `/posts/category/${categorySlug}/page`
                : "/posts/page"
            }
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
  let seoInfo: SeoType | undefined;

  // 「page/ページ番号」の場合
  if (param.length === 2 && param[0] === "page") {
    currentPage = parseInt(param[1]);
    seoInfo = await PostService.getSeo({ slug: "posts" });
  } else if (
    // 「catagory/カテゴリー名/page/ページ番号」の場合
    param.length === 4 &&
    param[0] === "category" &&
    param[2] === "page"
  ) {
    categorySlug = param[1];
    categoryId = await PostService.getCategoryIdBySlug({ slug: categorySlug });
    currentPage = parseInt(param[3]);
    seoInfo = await PostService.getSeoByCategorySlug({ slug: categorySlug });
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
      seoInfo: seoInfo ?? null,
    },
    revalidate: 10,
  };
}

export default Home;
