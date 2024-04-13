import FeaturedImageType from "./FeaturedImage"
import CategoryType from "./CategoryType"

interface PostType {
  id: string;
  title: string;
  slug: string;
  date: string;
  content: string;
  featuredImage: FeaturedImageType;
  category: CategoryType;
  metaFullHead?: string;
}

export default PostType;