// type
import PostOnListType from "../../types/PostOnListType";
// component
import CommonImage from "../atoms/image/CommonImage";
import CategoryLabel from "../atoms/label/CategoryLabel";
import ArticleOnListHeading from "../atoms/text/ArticleOnListHeading";
import DateText from "../atoms/text/DateText";
import Link from "next/link";

const PostBox: React.FC<{ post: PostOnListType, postType: string, postIndex?: number }> = ({ post, postType, postIndex }) => {
  return (
    <article className="shadow-lg shadow-gray-200 overflow-hidden rounded-md ring-1 ring-slate-900/5 relative transition-all duration-500 hover:scale-105">
      <Link
        href={`/${postType}/${post.slug}`}
        className="block absolute inset-0 z-10"
      />
      <CommonImage
        src={post.featuredImage.url}
        className="w-full aspect-[4/3]"
        alt={post.featuredImage.alt ?? ""}
        priority={postIndex !== undefined && postIndex < 6}
      />
      <div className="py-4 px-5 bg-white">
        <div className="flex mb-2">
          <div className="mr-2">
            <Link
              href={`/${postType}/category/${post.category.slug}`}
              className="relative z-20"
            >
              <CategoryLabel>{post.category.name}</CategoryLabel>
            </Link>
          </div>
          <DateText>{post.date}</DateText>
        </div>
        <div className="mb-2">
          <ArticleOnListHeading>{post.title}</ArticleOnListHeading>
        </div>
        <div dangerouslySetInnerHTML={{ __html: post.excerpt }}></div>
      </div>
    </article>
  );
};

export default PostBox;
