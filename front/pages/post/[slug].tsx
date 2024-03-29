// type
import { NextPage } from "next";
import PostType from "../../types/PostType";
// service
import PostService from "../../services/PostService";
// hook
import UsePostSwr from "../../hooks/swr/UsePostSwr";
// component
import Layout from "../../components/templates/Layout";
import CommonImage from "../../components/atoms/image/CommonImage";
import CategoryLabel from "../../components/atoms/label/CategoryLabel";
import DateText from "../../components/atoms/text/DateText";
import PostHeading from "../../components/atoms/text/PostHeading";
import Link from "next/link";

const Post: NextPage<{ slug: string; staticPost: PostType }> = ({
  slug,
  staticPost,
}) => {
  const post = UsePostSwr({ id: slug, staticPost });
  return (
    <Layout>
      <div className="w-main mx-auto">
        <article>
          <div>
            <CommonImage
              src={post!.featuredImage.url}
              alt=""
              className="w-full h-96"
            />
          </div>
          <div className="flex mb-4">
            <div className="mr-3">
              <Link href={`/category/${post!.category.slug}`}>
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
  );
};

export async function getStaticPaths() {
  const paths = await PostService.getAllSlugList();
  return {
    paths,
    fallback: false,
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
  const staticPost = await PostService.getOne({ id: slug });
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
