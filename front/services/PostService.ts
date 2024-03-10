// const
import PostConst from "../constants/PostConst";
// type
import PostType from "../types/PostType";
import PostOnListType from "@/types/PostOnListType";
import OffsetPaginationType from "../types/OffsetPaginationType";
// repository
import RepositoryFactory from "../repositories/RepositoryFactory";

class PostService {
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
      };
      return post;
    } catch {
      return null;
    }
  }

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
            param: ['category',categorySlug, 'page', page.toString()]
          }
        })
      })
    });
    return allPageAndCategoryList;
  }

  // static async getAllCategorySlugList(): Promise<
  //   { params: { slug: string } }[]
  // > {
  //   try {
  //     const res = await RepositoryFactory.post.getAllCategorySlugList();
  //     return res.data.data.categories.edges.map((data: any) => ({
  //       params: { slug: data.node.slug },
  //     }));
  //   } catch {
  //     return [];
  //   }
  // }

  // static async getAllPageList(): Promise<
  //   {
  //     params: {
  //       page: string;
  //     };
  //   }[]
  // > {
  //   const total = await this.getTotal();
  //   const pageTotal = Math.ceil(total / PostConst.sizePerPage);
  //   const pageList = [...Array(pageTotal)].map((_, i) => i + 1); // [1,2,3,...]
  //   const paths = pageList.map((page: number) => {
  //     return { params: { page: page.toString() } };
  //   });
  //   return paths;
  // }

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
  
  private static _makePageList(total : number) {
    const pageTotal = Math.ceil(total / PostConst.sizePerPage);
    return [...Array(pageTotal)].map((_, i) => i + 1); // [1,2,3,...]
  }
}

export default PostService;
