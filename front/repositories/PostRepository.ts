import { WpGraphQlPostConst } from "@/constants/WpGraphQlConst";
import Repository from "./Repository";
import OffsetPaginationType from "../types/OffsetPaginationType";

class PostRepository {
  static getList({ offsetPagination, categoryId }: {
    offsetPagination: OffsetPaginationType, categoryId?: number }) {
    if (categoryId) {
      return Repository(WpGraphQlPostConst.listBycategory, {
        variables: { offsetPagination, categoryId },
      }).getWp();
    }
    return Repository(WpGraphQlPostConst.list, {
      variables: {offsetPagination}
    }).getWp();
  }
  static getOne({ id }: { id: string }) {
    return Repository(WpGraphQlPostConst.one, { variables: { id } }).getWp();
  }
  static getAllSlugList() {
    return Repository(WpGraphQlPostConst.allSlugList).getWp();
  }
  static getAllCategorySlugList() {
    return Repository(WpGraphQlPostConst.allCategorySlugList).getWp();
  }
  static getCategoryIdBySlug({ slug }: {
    slug: string
  } ) {
    return Repository(WpGraphQlPostConst.categoryIdBySlug, {
      variables: { id: slug }
    }).getWp();
  }
  static getTotal() {
    return Repository(WpGraphQlPostConst.total).getWp();
  }
}

export default PostRepository;
