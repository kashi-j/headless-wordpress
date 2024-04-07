// const
import PostConst from "../constants/PostConst";
// type
import PostType from "../types/PostType";
import PostOnListType from "@/types/PostOnListType";
import OffsetPaginationType from "../types/OffsetPaginationType";
// repository
import RepositoryFactory from "../repositories/RepositoryFactory";

class ManualService {
  // manual投稿1件取得
  static async getOne({ id }: { id: string }): Promise<PostType | null> {
    try {
      const res = await RepositoryFactory.manual.getOne({ id });
      const data = res.data.data.manual;
      const post: PostType = {
        id: data.id,
        title: data.title,
        slug: data.slug,
        date: data.date,
        content: data.content,
        featuredImage: {
          url: data.featuredImage.node.sourceUrl,
        },
        category: {
          slug: data.manualCategories.edges[0].node.slug,
          name: data.manualCategories.edges[0].node.name,
        },
      };
      return post;
    } catch {
      return null;
    }
  }

  // ページネーション情報を含んだmanualの記事リストを取得
  static async getList({
    page,
    // categoryId,
    categorySlug,
  }: {
    page: number;
    // categoryId?: number;
    categorySlug?: string;
  }): Promise<[PostOnListType[], number]> {
    try {
      const offsetPagination = this._makeOffsetPaginationFromPage(page);
      const res = await RepositoryFactory.manual.getList({
        offsetPagination,
        categorySlug,
      });
      const postList = res.data.data.manuals.edges.map((data: any) => {
        const post: PostOnListType = {
          id: data.node.id,
          title: data.node.title,
          slug: data.node.slug,
          date: data.node.date,
          excerpt: data.node.excerpt,
          featuredImage: {
            url: data.node.featuredImage.node.sourceUrl,
          },
          category: {
            slug: data.node.manualCategories.edges[0].node.slug,
            name: data.node.manualCategories.edges[0].node.name,
          },
        };
        return post;
      });
      const total = res.data.data.manuals.pageInfo.offsetPagination.total;
      return [postList, total];
    } catch {
      return [[], 0];
    }
  }
  // manual投稿タイプのすべての記事のスラッグリスト取得
  static async getAllSlugList(): Promise<{ params: { slug: string } }[]> {
    try {
      const res = await RepositoryFactory.manual.getAllSlugList();
      return res.data.data.manuals.edges.map((data: any) => ({
        params: { slug: data.node.slug },
      }));
    } catch {
      return [];
    }
  }

  // manual投稿のページ情報とカテゴリーを取得
  static async getAllPageAndCategoryList() {
    const total = await this.getTotal();
    const pageList = this._makePageList(total);
    // 投稿一覧
    let allPageAndCategoryList = pageList.map((page: number) => {
      return { params: { param: ["page", page.toString()] } };
    });
    // カテゴリ別一覧
    const res = await RepositoryFactory.manual.getAllCategorySlugList();
    res.data.data.manualCategories.edges.map((data: any) => {
      const categorySlug = data.node.slug;
      const total = data.node.manuals.pageInfo.offsetPagination.total;
      const pageList = this._makePageList(total);
      pageList.forEach((page: number) => {
        allPageAndCategoryList.push({
          params: {
            param: ["category", categorySlug, "page", page.toString()],
          },
        });
      });
    });
    return allPageAndCategoryList;
  }

  // manual投稿の特定のカテゴリスラッグ(引数)からカテゴリIDを取得
  // ここで取得したIDは記事を情報の取得で使用する
  static async getCategoryIdBySlug({
    slug,
  }: {
    slug: string;
  }): Promise<number> {
    const res = await RepositoryFactory.manual.getCategoryIdBySlug({ slug });
    return res.data.data.manualCategory.manualCategoryId;
  }

  static async getTotal(): Promise<number> {
    const res = await RepositoryFactory.manual.getTotal();
    return res.data.data.manuals.pageInfo.offsetPagination.total;
  }

  private static _makeOffsetPaginationFromPage(
    page: number
  ): OffsetPaginationType {
    return {
      offset: (page - 1) * PostConst.sizePerPage,
      size: PostConst.sizePerPage,
    };
  }

  private static _makePageList(total: number) {
    const pageTotal = Math.ceil(total / PostConst.sizePerPage);
    return [...Array(pageTotal)].map((_, i) => i + 1); // [1,2,3,...]
  }
}

export default ManualService;
