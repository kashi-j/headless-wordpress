// const
import PostConst from "../constants/PostConst";
// type
import PostType from "../types/PostType";
import PostOnListType from "../types/PostOnListType";
import OffsetPaginationType from "../types/OffsetPaginationType";
import SeoType from "../types/SeoType";
// repository
import RepositoryFactory from "../repositories/RepositoryFactory";

class PostService {
  static async getSeo({ slug }: { slug: string }) {
    try {
      const res = await RepositoryFactory.post.getSeo({ slug });
      const data = res.data.data.page.seo;
      const seoInfo: SeoType = {
        metaFullHead: this._replaceHostNameForSeo(data.fullHead),
      };
      return seoInfo
    } catch (error) {
      throw new Error("Failed to fetch SEO data");
    }
  }

  static async getSeoByCategorySlug({
    slug,
  }: {
    slug: string;
  }): Promise<SeoType> {
    try {
      const res = await RepositoryFactory.post.getSeoByCategorySlug({
        slug,
      });
      const data = res.data.data.categories.edges[0].node.seo;
      const seoInfo: SeoType = {
        metaFullHead: this._replaceHostNameForSeo(data.fullHead),
      };
      return seoInfo;
    } catch (error) {
      console.error("Error fetching SEO data:", error);
      // エラーが発生した場合は適切なエラーを返す
      throw new Error("Failed to fetch SEO data");
    }
  }
  // デフォルト投稿1件取得
  static async getOne({ id }: { id: string }): Promise<PostType | null> {
    try {
      const res = await RepositoryFactory.post.getOne({ id });
      const data = res.data.data.post;
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
          slug: data.categories.edges[0].node.slug,
          name: data.categories.edges[0].node.name,
        },
        metaFullHead: this._replaceHostNameForSeo(data.seo.fullHead)
      };
      return post;
    } catch {
      return null;
    }
  }

  // ページネーション情報を含んだデフォルトの記事リストを取得
  static async getList({
    page,
    categoryId,
  }: {
    page: number;
    categoryId?: number;
  }): Promise<[PostOnListType[], number]> {
    try {
      const offsetPagination = this._makeOffsetPaginationFromPage(page);
      const res = await RepositoryFactory.post.getList({
        offsetPagination,
        categoryId,
      });
      const postList = res.data.data.posts.edges.map((data: any) => {
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
            slug: data.node.categories.edges[0].node.slug,
            name: data.node.categories.edges[0].node.name,
          },
        };
        return post;
      });
      const total = res.data.data.posts.pageInfo.offsetPagination.total;
      return [postList, total];
    } catch {
      return [[], 0];
    }
  }
  // デフォルト投稿タイプのすべての記事のスラッグリスト取得
  static async getAllSlugList(): Promise<{ params: { slug: string } }[]> {
    try {
      const res = await RepositoryFactory.post.getAllSlugList();
      return res.data.data.posts.edges.map((data: any) => ({
        params: { slug: data.node.slug },
      }));
    } catch {
      return [];
    }
  }

  // デフォルト投稿のページ情報とカテゴリーを取得
  static async getAllPageAndCategoryList() {
    const total = await this.getTotal();
    const pageList = this._makePageList(total);
    // 投稿一覧
    let allPageAndCategoryList = pageList.map((page: number) => {
      return { params: { param: ["page", page.toString()] } };
    });
    // カテゴリ別一覧
    const res = await RepositoryFactory.post.getAllCategorySlugList();
    res.data.data.categories.edges.map((data: any) => {
      const categorySlug = data.node.slug;
      const total = data.node.posts.pageInfo.offsetPagination.total;
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

  // デフォルト投稿の特定のカテゴリスラッグ(引数)からカテゴリIDを取得
  // ここで取得したIDは記事を情報の取得で使用する
  static async getCategoryIdBySlug({
    slug,
  }: {
    slug: string;
  }): Promise<number> {
    const res = await RepositoryFactory.post.getCategoryIdBySlug({ slug });
    return res.data.data.category.categoryId;
  }

  static async getTotal(): Promise<number> {
    const res = await RepositoryFactory.post.getTotal();
    return res.data.data.posts.pageInfo.offsetPagination.total;
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
  // Yoast Seoのfullhead情報からホスト情報を書き換え
  // card情報などはwordpressを参照させるため、書き換えない
  private static _replaceHostNameForSeo(headStrign: string) {
    const wpHost: string =
      process.env.NEXT_PUBLIC_WP_HOSTNAME?.replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&"
      ) || "";
    const nextHost: string =
      process.env.NEXT_PUBLIC_HOSTNAME?.replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&"
      ) || "";
    const changedHead = headStrign
      .replace(new RegExp(wpHost + "/wp-content", "g"), "temp-host")
      .replace(new RegExp(wpHost, "g"), nextHost)
      .replace(new RegExp("temp-host", "g"), wpHost + "/wp-content");
    return changedHead;
  }
}

export default PostService;
