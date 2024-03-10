export class WpGraphQlPostConst {
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
  `

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
  `

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
  `

  static one = `
    query PostQuery($id: ID!) {
      post(id: $id, idType: SLUG) {
        ${this._itemOnOne}
      }
    }
  `

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
  `

  static categoryIdBySlug = `
    query PostCategoryIdBySlugQuery($id: ID!) {
      category(id: $id, idType: SLUG) {
        categoryId
      }
    }
  `

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
  `

}
