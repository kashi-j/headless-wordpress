import type { NextPage } from "next";
import { Noto_Sans_JP } from "next/font/google";
// type
import { GetStaticProps } from "next";
import PostOnListType from "@/types/PostOnListType";
// service
import PostService from "../services/PostService";
// hook
import usePostListSwr from "../hooks/swr/usePostListSwr";
// component
import PostBox from "@/components/molecules/PostBox";
import Layout from "@/components/templates/Layout";

const notoSansJP = Noto_Sans_JP({ subsets: ["latin"], weight: ["400"] });

const Home: NextPage<{ staticPostList: PostOnListType[], staticTotal: number }> = ({ staticPostList, staticTotal }) => {
  const postList = staticPostList;
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
      </main>
    </Layout>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const [staticPostList, staticTotal] = await PostService.getList({page: 1});
  return {
    props: {
      staticPostList,
      staticTotal
    },
    revalidate: 10,
  };
};

export default Home;
