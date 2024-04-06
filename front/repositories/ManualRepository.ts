import { WpGraphQlPostConst } from "@/constants/WpGraphQlConst";
import Repository from "./Repository";
import OffsetPaginationType from "../types/OffsetPaginationType";

class ManualRepository {
  // ページネーション情報を含んだデフォルトの記事リストを取得
  static getList({
    offsetPagination,
    categorySlug,
  }: {
    offsetPagination: OffsetPaginationType;
    categorySlug?: string;
    }) {
    if (categorySlug) {
      let terms = categorySlug;
      return Repository(WpGraphQlPostConst.manualListBycategory, {
        variables: {
          offsetPagination,
          terms,
        },
      }).getWp();
    }
    return Repository(WpGraphQlPostConst.manualList, {
      variables: { offsetPagination },
    }).getWp();
  }
  // デフォルト投稿1件取得
  static getOne({ id }: { id: string }) {
    return Repository(WpGraphQlPostConst.oneManual, { variables: { id } }).getWp();
  }
  // デフォルト投稿の特定カテゴリに該当する記事スラッグリスト取得
  static getAllSlugList() {
    return Repository(WpGraphQlPostConst.allManualSlugList).getWp();
  }
  // デフォルト投稿のカテゴリのスラッグリスト取得
  static getAllCategorySlugList() {
    return Repository(WpGraphQlPostConst.allManualCategorySlugList).getWp();
  }
  // デフォルト投稿の特定のカテゴリスラッグ(引数)からカテゴリIDを取得
  // ここで取得したIDは記事を情報の取得で使用する
  static getCategoryIdBySlug({ slug }: { slug: string }) {
    return Repository(WpGraphQlPostConst.manualCategoryIdBySlug, {
      variables: { id: slug },
    }).getWp();
  }
  // デフォルト投稿の記事総数を取得
  static getTotal() {
    return Repository(WpGraphQlPostConst.manualTotal).getWp();
  }
}

export default ManualRepository;
