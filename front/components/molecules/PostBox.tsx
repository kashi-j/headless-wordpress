// type
import PostOnListType from "../../types/PostOnListType";
// component
import CommonImage from "../atoms/image/CommonImage";
import CategoryLabel from "../atoms/label/CategoryLabel";
import ArticleOnListHeading from "../atoms/text/ArticleOnListHeading";
import DateText from "../atoms/text/DateText";
import Link from "next/link";

const PostBox: React.FC<{ post: PostOnListType }> = ({ post }) => {
  return (
    <article className="shadow-sm shadow-gray-200">
      <Link href={`/post/${post.slug}`}>
        <CommonImage
          src={post.featuredImage.url}
          className="w-full h-48"
          alt=""
        />
      </Link>
      <div className="py-4 px-5">
        <div className="flex mb-2">
          <div className="mr-2">
            <Link href={`/category/${post.category.slug}`}>
              <CategoryLabel>{post.category.name}</CategoryLabel>
            </Link>
          </div>
          <DateText>{post.date}</DateText>
        </div>
        <div className="mb-2">
          <Link href={`/post/${post.slug}`}>
            <ArticleOnListHeading>{post.title}</ArticleOnListHeading>
          </Link>
        </div>
        <div dangerouslySetInnerHTML={{ __html: post.excerpt }}></div>
      </div>
    </article>
  );
};

export default PostBox;
