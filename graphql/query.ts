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
  ) {
    products(
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

export const GET_PRODUCT_BY_ID = gql`
  query GetProductById($id: ID!) {
    productById(id: $id) {
    id
      name
    description
    vendorShopName
      price
      oldPrice
      type
      selectedColor
      origin
      qty
    color
      category
      approve
      status
      rentPerHur
      sell
      rent
      state
    material
    careInstructions
    shape{
      label
      value
    }
    size{
      label
      value
    }
      country {
        value
        label
      }
      pictures {
        id
        path
        fileType
      }
    sleeve
    sell
    rent
    underlay
    selectedColor
    ref
    shoulder
    }
  }
`;
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
  query GetUserOrders {
    orders {
      id
      total
      ref
      status
      notes
    isPaid
    paymentType
    createdAt
    address{
      city
      appartment
      street
    }
      items {
        id
        product {
          id
          name
          pictures{
          path
          }
        }
        qty
        total
        size
        color
      }
    user{
          id
          account{
            firstName
            lastName
            email
            mobile
          }
        }
    }
  }
`;

export const GET_VENDOR_ORDERS = gql`
  query GetVendorOrders {
    userOrders {
      id
      total
      ref
      status
      notes
    isPaid
    paymentType
    createdAt
    address{
      city
      appartment
      street
    }
      items {
        id
        product {
          id
          name
          pictures{
          path
          }
        }
        qty
        total
        size
        color
      }
    user{
          id
          account{
            firstName
            lastName
            email
            mobile
          }
        }
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