import { useEffect, useState } from "react";
import parser from "html-react-parser";
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
import { SkeletonCard } from "@/components/molecules/SkeletonCard";
import ArticlePageHeading from "@/components/atoms/text/ArticlePageHeading";

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
  const [isLoading, setLoading] = useState(true);
  const categoryId = staticCategoryId ?? undefined;
  const categorySlug = staticCategorySlug ?? undefined;
  const [postList, total] = usePostListSwr({
    currentPage,
    staticPostList,
    staticTotal,
    categoryId,
  });
  const fullHead =
    typeof seoInfo?.metaFullHead == "string" && parser(seoInfo.metaFullHead);
  useEffect(() => {
    if (!postList) return;
    setLoading(false);
  }, [postList]);

  return (
    <>
      <Head>{fullHead && fullHead}</Head>
      <Layout currentPostType="posts">
        <div className="w-main mx-auto">
          {staticCategorySlug && <ArticlePageHeading>カテゴリー：{staticCategorySlug}</ArticlePageHeading>}
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-6">
            {isLoading
              ? staticPostList!.map((post) => (
                  <li key={post.id}>
                    <SkeletonCard></SkeletonCard>
                  </li>
                ))
              : postList!.map((post, index) => (
                  <li key={post.id}>
                    <PostBox
                      post={post}
                      postType="posts"
                      postIndex={index}
                      key={post.id}
                    />
                  </li>
              ))
            }
          </ul>
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
        </div>
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
