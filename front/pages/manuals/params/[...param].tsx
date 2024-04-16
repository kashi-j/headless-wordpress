import parser from "html-react-parser";
import { Noto_Sans_JP } from "next/font/google";
// const
import PostConst from "../../../constants/PostConst";
// type
import type { NextPage } from "next";
import PostOnListType from "../../../types/PostOnListType";
import SeoType from "../../../types/SeoType";
// service
import ManualService from "../../../services/ManualService";
// hook
import useManualListSwr from "../../../hooks/swr/useManualListSwr";
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
  staticCategorySlug: string | null;
  seoInfo: SeoType;
}> = ({
  staticPostList,
  currentPage,
  staticTotal,
  staticCategorySlug,
  seoInfo,
}) => {
  const categorySlug = staticCategorySlug ?? undefined;

  const [postList, total] = useManualListSwr({
    currentPage,
    staticPostList,
    staticTotal,
    categorySlug,
  });
  const fullHead =
    typeof seoInfo?.metaFullHead == "string" && parser(seoInfo.metaFullHead);
  // const siteTitle = `記事一覧 ${
  //   staticCategorySlug ? ":" + staticCategorySlug : ""
  // }`;
  return (
    <>
      <Head>{fullHead && fullHead}</Head>
      <Layout>
        <main className={`${notoSansJP.className}`}>
          <div className="w-main mx-auto">
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-4">
              {postList!.map((post) => (
                <li
                  key={post.id}
                  className=""
                >
                  <PostBox post={post} postType="manuals" />
                </li>
              ))}
            </ul>
          </div>
          <Pagination
            total={total}
            sizePerPage={PostConst.sizePerPage}
            currentPage={currentPage}
            path={
              categorySlug
                ? `/manuals/category/${categorySlug}/page`
                : "/manuals/page"
            }
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
    seoInfo = await ManualService.getSeo({ slug: "manuals" });
  } else if (
    // 「catagory/カテゴリー名/page/ページ番号」の場合
    param.length === 4 &&
    param[0] === "category" &&
    param[2] === "page"
  ) {
    categorySlug = param[1];
    currentPage = parseInt(param[3]);
    seoInfo = await ManualService.getSeoByCategorySlug({
      slug: categorySlug,
    });
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
      seoInfo: seoInfo ?? null,
    },
    revalidate: 10,
  };
}

export default Home;
