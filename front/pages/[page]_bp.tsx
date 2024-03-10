import { Noto_Sans_JP } from "next/font/google";
// const
import PostConst from "../constants/PostConst";
// type
import type { NextPage } from "next";
import { GetStaticProps } from "next";
import PostOnListType from "@/types/PostOnListType";
// service
import PostService from "../services/PostService";
// hook
import usePostListSwr from "../hooks/swr/usePostListSwr";
// component
import Layout from "../components/templates/Layout";
import PostBox from "../components/molecules/PostBox";
import Pagination from "@/components/molecules/Pagination";

const notoSansJP = Noto_Sans_JP({ subsets: ["latin"], weight: ["400"] });

const Home: NextPage<{
  staticPostList: PostOnListType[],
  currentPage: number,
  staticTotal: number
}> = ({ staticPostList, currentPage, staticTotal }) => {
  const [postList, total] = usePostListSwr({currentPage, staticPostList ,staticTotal})
  // const postList = staticPostList;

  return (
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
          path=""
        />
      </main>
    </Layout>
  );
};

export async function getStaticPaths() {
  const paths = await PostService.getAllPageList()
  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }: {
  params: {
    page: string
  }
}) {
  const currentPage = parseInt(params.page);
  const [staticPostList, staticTotal] = await PostService.getList({page: currentPage});
  return {
    props: {
      staticPostList,
      staticTotal,
      currentPage
    },
    revalidate: 10,
  };
};

export default Home;
