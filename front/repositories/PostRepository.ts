import { WpGraphQlPostConst } from "../constants/WpGraphQlConst";
import Repository from "./Repository";
import OffsetPaginationType from "../types/OffsetPaginationType";

class PostRepository {
  // ページネーション情報を含んだデフォルトの記事リストを取得
  static getList({
    offsetPagination,
    categoryId,
  }: {
    offsetPagination: OffsetPaginationType;
    categoryId?: number;
  }) {
    if (categoryId) {
      return Repository(WpGraphQlPostConst.listBycategory, {
        variables: { offsetPagination, categoryId },
      }).getWp();
    }
    return Repository(WpGraphQlPostConst.list, {
      variables: { offsetPagination },
    }).getWp();
  }
  // デフォルト投稿1件取得
  static getOne({ id }: { id: string }) {
    return Repository(WpGraphQlPostConst.one, { variables: { id } }).getWp();
  }
  // デフォルト投稿の特定カテゴリに該当する記事スラッグリスト取得
  static getAllSlugList() {
    return Repository(WpGraphQlPostConst.allSlugList).getWp();
  }
  // デフォルト投稿のカテゴリのスラッグリスト取得
  static getAllCategorySlugList() {
    return Repository(WpGraphQlPostConst.allCategorySlugList).getWp();
  }
  // デフォルト投稿の特定のカテゴリスラッグ(引数)からカテゴリIDを取得
  // ここで取得したIDは記事を情報の取得で使用する
  static getCategoryIdBySlug({ slug }: { slug: string }) {
    return Repository(WpGraphQlPostConst.categoryIdBySlug, {
      variables: { id: slug },
    }).getWp();
  }
  // デフォルト投稿の記事総数を取得
  static getTotal() {
    return Repository(WpGraphQlPostConst.total).getWp();
  }
  // メタ情報を取得
  static getSeo({ slug }: { slug: string }) {
    return Repository(WpGraphQlPostConst.seoForPage, {
      variables: { id: slug },
    }).getWp();
  }
  // メタ情報を取得
  static getSeoByCategorySlug({ slug }: { slug: string }) {
    return Repository(WpGraphQlPostConst.seoForCategory, {
      variables: { slug },
    }).getWp();
  }
}

export default PostRepository;
