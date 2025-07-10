import { gql } from '@apollo/client';

export const GET_USER_PRODUCTS = gql`
  query GetUserProducts(
    $language: LanguageEnum!
    $currency: String
    $approve: Boolean
    $search: String
    $page: Int
    $limit: Int
    $sort: SortInput
  ) {
    userProducts(
      language: $language
      currency: $currency
      approve: $approve
      search: $search
      page: $page
      limit: $limit
      sort: $sort
    ) {
      total
      data {
        id
        name
        type
        selectedColor
        origin
        qty
        approve
        price
        oldPrice
        size {
          value
          label
        }
        color
        category {
          id
          name
        }
        pictures {
          id
          path
          fileType
        }
        user {
          id
          account {
            mobile
          }
        }
      }
    }
  }
`;
export const GET_PRODUCTS = gql`
  query GetUserProducts(
    $language: LanguageEnum!
    $currency: String
    $search: String
    $page: Int
    $limit: Int
    $sort: SortInput
    $categoryId: String
    $type: String
    $minPrice: Float
    $maxPrice: Float
$userIds: [String]
$categoryIds: [String]
$colors: [String]
  ) {
    products(
      language: $language
      currency: $currency
      search: $search
      page: $page
      limit: $limit
      sort: $sort
      categoryId:$categoryId
type:$type
minPrice: $minPrice
maxPrice: $maxPrice
userIds: $userIds
categoryIds: $categoryIds
colors: $colors
    ) {
      total
      data {
        id
        name
        type
        selectedColor
        origin
        qty
        approve
        price
        oldPrice
        size {
          value
          label
        }
        color
        category {
          id
          name
        }
        pictures {
          id
          path
          fileType
        }
        user {
          id
          account {
            mobile
          }
        }
      }
    }
  }
`;
// export const GET_PRODUCTS = gql`
//   query GetProducts {
//     products {
//       id
//       name
//       price
//       oldPrice
//       type
//       selectedColor
//       origin
//       qty
//       category
//       approve
//       status
//       rentPerHur
//       sell
//       rent
//       color
//       size{
//       label
//       value
//       }
//       country {
//         value
//         label
//       }
//       pictures {
//         id
//         path
//         fileType
//       }
//         vendorShopName
//         user{
//       id
//       account{
//         mobile

//       }
//     }
//     }
//   }
// `;

export const GET_USER_PRODUCT_BY_ID = gql`
  query GetUserProductById($id: ID!, $language: LanguageEnum!, $currency: String!) {
    userProductById(id: $id, language: $language, currency: $currency) {
     id
      name
    description
      price
      oldPrice
      type
      selectedColor
      origin
      qty
    color
      category{
        id
        name
      }
      approve
     
      state
    material
    careInstructions
   
    size{
      label
      value
    }
      
      pictures {
        id
        path
        fileType
      }
    sleeve
    underlay
    selectedColor
    ref
    shoulder
    chest
waist
hip
high
length
    }
  }
`;

export const GET_USER_ORDERS = gql`
  query GetUserOrders(
    $language: LanguageEnum!
    $currency: String
    $search: String
    $page: Int
    $limit: Int
    $sortField: String
    $sortOrder: SortOrder
  ) {
    orders(
      language: $language
      currency: $currency
      search: $search
      page: $page
      limit: $limit
      sortField: $sortField
      sortOrder: $sortOrder
    ) {
      data {
        id
        ref
        total
        status
        notes
        isPaid
        paymentType
        createdAt
        address {
          city
          appartment
          street
        }
        items {
          id
          qty
          total
          size
          color
          product {
            id
            name
            pictures {
              path
            }
          }
        }
        user {
          id
          account {
            firstName
            lastName
            email
            mobile
          }
        }
      }
      total
    }
  }
`;

export const GET_VENDOR_ORDERS = gql`
  query GetVendorOrders(
    $language: LanguageEnum!
    $currency: String
    $search: String
    $page: Int
    $limit: Int
    $sortField: String
    $sortOrder: SortOrder
  ) {
    userOrders(
      language: $language
      currency: $currency
      search: $search
      page: $page
      limit: $limit
      sortField: $sortField
      sortOrder: $sortOrder
    ) {
      data {
        id
        ref
        total
        status
        notes
        isPaid
        paymentType
        createdAt
        address {
          city
          appartment
          street
        }
        items {
          id
          qty
          total
          size
          color
          product {
            id
            name
            pictures {
              path
            }
          }
        }
        user {
          id
          account {
            firstName
            lastName
            email
            mobile
          }
        }
      }
      total
    }
  }
`;



export const GET_CATEGORIES = gql`
    query {
        categories {
            id
            name {
                ar
                en
            }
        }
    }
`;

export const GET_SHOP = gql`
query FindOneShopByUser($language: LanguageEnum!) {
  findOneShopByUser(language: $language) {
    shopName
    description
    shopPhoneNumber
    tags
    coverImage {
      id
      path
    }
    profileImage {
      id
      path
    }
  }
}
`;

export const GET_SHOPS = gql`
  query GetShops($language: LanguageEnum!, $search: String, $page: Int, $limit: Int) {
    shops(language: $language, search: $search, page: $page, limit: $limit) {
      data {
        id
        shopName
        description
        coverImage {
          path
        }
        profileImage {
          path
        }
          user{
          id
          }
          tags
      }
      total
    }
  }
`;
export const GET_SHOP_BY_ID = gql`
  query FindShopById($language: LanguageEnum!, $id: ID!) {
    findShopById(language: $language, id: $id) {
       id
        shopName
        description
        coverImage {
          path
        }
        profileImage {
          path
        }
          tags
          shopPhoneNumber
          user{
          id
          }
    }
  }
`;

export const GET_PRODUCTS_BY_USER_ID = gql`
  query GetProductsByUserId(
    $id: ID
    $language: LanguageEnum!
    $currency: String
    $search: String
    $page: Int
    $limit: Int
    $sort: SortInput
  ) {
    getProductsByUserId(
      id: $id
      language: $language
      currency: $currency
      search: $search
      page: $page
      limit: $limit
      sort: $sort
    ) {
      total
      data {
        id
        name
        type
        selectedColor
        origin
        qty
        approve
        price
        oldPrice
        size {
          value
          label
        }
        color
        category {
          id
          name
        }
        pictures {
          id
          path
          fileType
        }
        user {
          id
          account {
            mobile
          }
        }
      }
    }
  }
`;

export const GET_PRODUCT_BY_ID = gql`
  query GetProductById($id: ID!, $language: LanguageEnum!, $currency: String!) {
    productById(id: $id, language: $language, currency: $currency) {
      id
      name
      description
      price
      oldPrice
      type
      selectedColor
      origin
      qty
      color
      category {
        id
        name
      }
      approve
      state
      material
      careInstructions
      size {
        label
        value
      }
      pictures {
        id
        path
        fileType
      }
      sleeve
      underlay
      selectedColor
      ref
      shoulder
      chest
    length
    hip
    high
    waist
    user {
          id
          account {
            mobile
          }
        }
    }
  }
`;

export const GET_DASHBOARD_DATA = gql`
  query GetUserDashboard{
    userDashboard {
      completed
    pending
    processing
    total
    }
  }
`;
export const GET_USER_PROFILE = gql`
  query GET_USER_PROFILE{
    userProfile {
      productsCount
       subscription{
      id
    userId
    status
    plan
    }
    }
    
  }
`;
