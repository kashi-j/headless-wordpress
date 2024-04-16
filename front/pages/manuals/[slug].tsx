import parser from "html-react-parser";
// type
import { NextPage } from "next";
import PostType from "../../types/PostType";
// service
import ManualService from "../../services/ManualService";
// hook
import useManualSwr from "../../hooks/swr/useManualSwr";
// component
import Layout from "../../components/templates/Layout";
import CommonImage from "../../components/atoms/image/CommonImage";
import CategoryLabel from "../../components/atoms/label/CategoryLabel";
import DateText from "../../components/atoms/text/DateText";
import PostHeading from "../../components/atoms/text/PostHeading";
import Link from "next/link";
import { useRouter } from "next/router";
import Loading from "../../components/molecules/Loading";
import Head from "next/head";


const Post: NextPage<{ slug: string; staticPost: PostType }> = ({
  slug,
  staticPost,
}) => {
  const router = useRouter();
  const fullHead =
    typeof staticPost?.metaFullHead == "string" &&
    parser(staticPost.metaFullHead);
  if (router.isFallback) {
    return (
      <>
        <Head>{fullHead && fullHead}</Head>
        <Layout>
          <div className="w-main mx-auto">
            <Loading></Loading>
          </div>
        </Layout>
      </>
    );
  }
  const post = useManualSwr({ id: slug, staticPost });
  return (
    <>
      <Head>{fullHead && fullHead}</Head>
      <Layout>
        <div className="w-main mx-auto">
          <article>
            <div>
              <CommonImage
                src={post!.featuredImage.url}
                alt=""
                className="w-full aspect-[4/3] md:aspect-video"
                priority
              />
            </div>
            <div className="flex mb-4">
              <div className="mr-3">
                <Link href={`/manuals/category/${post!.category.slug}`}>
                  <CategoryLabel>{post!.category.name}</CategoryLabel>
                </Link>
              </div>
              <DateText>{post!.date}</DateText>
            </div>
            <div className="mb-10">
              <PostHeading>{post!.title}</PostHeading>
            </div>
            <div dangerouslySetInnerHTML={{ __html: post!.content }}></div>
          </article>
        </div>
      </Layout>
    </>
  );
};

export async function getStaticPaths() {
  const paths = await ManualService.getAllSlugList();
  return {
    paths,
    fallback: true,
  };
}

export async function getStaticProps({
  params,
}: {
  params: {
    slug: string;
  };
}) {
  const slug = params.slug;
  const staticPost = await ManualService.getOne({ id: slug });
  if (!staticPost) {
    return { notFound: true };
  }
  return {
    props: {
      slug,
      staticPost,
    },
    revalidate: 10,
  };
}

export default Post;
