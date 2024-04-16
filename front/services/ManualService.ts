// const
import PostConst from "../constants/PostConst";
// type
import PostType from "../types/PostType";
import PostOnListType from "../types/PostOnListType";
import OffsetPaginationType from "../types/OffsetPaginationType";
import SeoType from "../types/SeoType";
// repository
import RepositoryFactory from "../repositories/RepositoryFactory";

class ManualService {
  static async getSeo({ slug }: { slug: string }) {
    try {
      const res = await RepositoryFactory.manual.getSeo({ slug });
      const data = res.data.data.page.seo;
      const seoInfo: SeoType = {
        metaFullHead: this._replaceHostNameForSeo(data.fullHead),
      };
      return seoInfo;
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
      const res = await RepositoryFactory.manual.getSeoByCategorySlug({
        slug,
      });
      const data = res.data.data.manualCategories.edges[0].node.seo;
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
  // manual投稿1件取得
  static async getOne({ id }: { id: string }): Promise<PostType | null> {
    try {
      const res = await RepositoryFactory.manual.getOne({ id });
      const data = res.data.data.manual;
      const post: PostType = {
        id: data.id,
        title: data.title,
        slug: data.slug,
        date: this._formatDate(data.date),
        content: data.content,
        featuredImage: {
          url: data.featuredImage.node.sourceUrl,
          alt: data.featuredImage.node.altText,
        },
        category: {
          slug: data.manualCategories.edges[0].node.slug,
          name: data.manualCategories.edges[0].node.name,
        },
        metaFullHead: this._replaceHostNameForSeo(data.seo.fullHead),
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
          date: this._formatDate(data.node.date),
          excerpt: data.node.excerpt,
          featuredImage: {
            url: data.node.featuredImage.node.sourceUrl,
            alt: data.node.featuredImage.node.altText,
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
  // Yoast Seoのfullhead情報からホスト情報を書き換え
  // card情報などはwordpressを参照させるため、書き換えない
  private static _replaceHostNameForSeo(headStrign: string) {
    const wpUrl: string = process.env.NEXT_PUBLIC_WP_URL || "";
    const wpHost: string = process.env.NEXT_PUBLIC_WP_HOSTNAME || "";
    const nextHost: string = process.env.NEXT_PUBLIC_HOSTNAME || "";
    const changedHead = headStrign
      .replace(new RegExp(wpUrl + "/wp-content", "g"), "temp-host")
      .replace(new RegExp(wpHost, "g"), nextHost)
      .replace(new RegExp("temp-host", "g"), wpUrl + "/wp-content");
    return changedHead;
  }
  private static _formatDate(originDate: string) {
    // Date オブジェクトに変換
    const date = new Date(originDate);
    // 年、月、日を取得し、希望の形式で文字列を作成
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}.${month}.${day}`;
  }
}

export default ManualService;
