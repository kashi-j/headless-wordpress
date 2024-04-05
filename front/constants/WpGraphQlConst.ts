export class WpGraphQlPostConst {
  // デフォルト投稿タイプ共通部分
  private static _itemOnList = `
    categories {
      edges {
        node {
          name
          slug
        }
      }
    }
    date
    excerpt
    featuredImage {
      node {
        sourceUrl
      }
    }
    id
    slug
    title
  `;
  // code投稿タイプ共通部分
  private static _codeItemOnList = `
    codeCategories {
      edges {
        node {
          name
          slug
        }
      }
    }
    date
    content
    featuredImage {
      node {
        sourceUrl
      }
    }
    id
    slug
    title
  `;

  // デフォルト投稿タイプ共通部分
  private static _itemOnOne = `
    categories {
      edges {
        node {
          name
          slug
        }
      }
    }
    date
    content
    featuredImage {
      node {
        sourceUrl
      }
    }
    id
    slug
    title
  `;

  // code投稿タイプ共通部分
  private static _codeItemOnOne = `
    codeCategories {
      edges {
        node {
          name
          slug
        }
      }
    }
    date
    content
    featuredImage {
      node {
        sourceUrl
      }
    }
    id
    slug
    title
  `;

  static list = `
    query PostListQuery($offsetPagination: OffsetPagination!) {
      posts(where: {offsetPagination: $offsetPagination}) {
        edges {
          node {
            ${this._itemOnList}
          }
        }
        pageInfo {
          offsetPagination {
            total
          }
        }
      }
    }
  `;

  static codeList = `
    query PostListQuery($offsetPagination: OffsetPagination!) {
      codes(where: {offsetPagination: $offsetPagination}) {
        edges {
          node {
            ${this._codeItemOnList}
          }
        }
        pageInfo {
          offsetPagination {
            total
          }
        }
      }
    }
  `;

  // デフォルト投稿タイプ用
  static listBycategory = `
    query PostListByCategoryQuery($offsetPagination: OffsetPagination!, $categoryId: Int!) {
      posts(where: {offsetPagination: $offsetPagination, categoryId: $categoryId}) {
        edges {
          node {
            ${this._itemOnList}
          }
        }
        pageInfo {
          offsetPagination {
            total
          }
        }
      }
    }
  `;

  // code投稿タイプ用
  // WPGraphQLで任意のカテゴリ、オフセット設定を設定する場合は下記の通り。
  // query PostListByCategoryQuery {
  // posts(where: {categoryId: 2, offsetPagination: {offset: 0, size:9}}) {
  static codeListBycategory = `
    query CodeListByCategoryQuery($offsetPagination: OffsetPagination!, $terms: [String]) {
      codes(
        where: {offsetPagination: $offsetPagination, taxQuery: {taxArray: {taxonomy: CODECATEGORY, terms: $terms, operator: IN, field: SLUG}}}
      ) {
        edges {
          node {
            codeCategories {
              edges {
                node {
                  name
                  slug
                }
              }
            }
            date
            content
            featuredImage {
              node {
                sourceUrl
              }
            }
            id
            slug
            title
          }
        }
        pageInfo {
          offsetPagination {
            total
          }
        }
      }
    }
  `;

  // WPGraphQLでは下記のように記載することで初期値を設定して試せる
  // query PostQuery($id: ID! = "スラッグ名") {… }
  // デフォルト投稿タイプ用
  static one = `
    query PostQuery($id: ID!) {
      post(id: $id, idType: SLUG) {
        ${this._itemOnOne}
      }
    }
  `;

  // code投稿タイプ用
  static oneCode = `
    query PostQuery($id: ID!) {
      code(id: $id, idType: SLUG) {
        ${this._codeItemOnOne}
      }
    }
  `;

  // デフォルト投稿タイプ用
  static allSlugList = `
    query PostAllSlugListQuery {
      posts(first: 10000) {
        edges {
          node {
            slug
          }
        }
      }
    }
  `;

  // code投稿タイプ用
  static allCodeSlugList = `
    query PostAllSlugListQuery {
      codes(first: 10000) {
        edges {
          node {
            slug
          }
        }
      }
    }
  `;

  // デフォルト投稿タイプ用
  static allCategorySlugList = `
    query PostAllCategorySlugListQuery {
      categories {
        edges {
          node {
            slug
            posts {
              pageInfo {
                offsetPagination {
                  total
                }
              }
            }
          }
        }
      }
    }
  `;

  // code投稿タイプ用
  static allCodeCategorySlugList = `
    query PostAllCategorySlugListQuery {
      codeCategories {
        edges {
          node {
            slug
            codes {
              pageInfo {
                offsetPagination {
                  total
                }
              }
            }
          }
        }
      }
    }
  `;

  // デフォルト投稿タイプ用
  static categoryIdBySlug = `
    query PostCategoryIdBySlugQuery($id: ID!) {
      category(id: $id, idType: SLUG) {
        categoryId
      }
    }
  `;
  // code投稿タイプ用
  static codeCategoryIdBySlug = `
    query PostCategoryIdBySlugQuery($id: ID!) {
      codeCategory(id: $id, idType: SLUG) {
        codeCategoryId
      }
    }
  `;

  // デフォルト投稿タイプ用
  static total = `
    query PostTotalQuery {
      posts {
        pageInfo {
          offsetPagination {
            total
          }
        }
      }
    }
  `;
  // code投稿タイプ用
  static codeTotal = `
    query PostTotalQuery {
      codes {
        pageInfo {
          offsetPagination {
            total
          }
        }
      }
    }
  `;
}
