import FeaturedImageType from "./FeaturedImage"
import CategoryType from "./CategoryType"
import SeoType from "./SeoType"

interface PostOnListType {
  id: string;
  title: string;
  slug: string;
  date: string;
  excerpt: string;
  featuredImage: FeaturedImageType;
  category: CategoryType;
  seo?: SeoType;
}

export default PostOnListType;