import { gql } from '@apollo/client'

export const CREATE_USER_MUTATION = gql`
  mutation CreateUser($user: UserInput!) {
  createUser(user: $user) {
    access_token
    user{
    id
      account{
        firstName
        lastName
        country
        email
        mobile
        token
        lang
        currency{
          value
          label
        }
      }
    }
        subscription{
      id
    userId
    status
    plan
    }
  }
}

`;

export const LOGIN_USER_MUTATION = gql`
  mutation LoginUser($username: String!, $password: String!) {
    loginUser(username: $username, password: $password) {
      access_token
        user{
            id
            account{
            firstName
            lastName
            country
            password
            email
            currency{
              value
              label
            }
            lang
            mobile
      }
    }
       subscription{
      id
    userId
    status
    plan
    stripePriceId
      currentPeriodStart
      currentPeriodEnd
    }
    }
  }
`;
export const FORGET_PASSWORD_MUTATION = gql`
  mutation ForgetPassword($email: String!) {
    forgetPassword(email: $email) 
  }
`;
export const CONFIRM_TOKEN_MUTATION = gql`
  mutation ConfirmToken($token: String!, $newPassword: String!) {
    confirmToken(token: $token, newPassword: $newPassword){
    id
    }
  }
`;

export const UPDATE_USER_MUTATION = gql`
  mutation UpdateUser($user: UpdateUserInput!) {
  updateUser(user: $user) {
    id
      account{
        firstName
        lastName
        country
        email
        mobile
        token
        lang
        currency{
          value
          label
        }
    }
  }
}

`;

// 🔁 GraphQL Mutation
export const CREATE_SUBSCRIPTION_MUTATION = gql`
  mutation CreateSubscription($input: CreateSubscriptionInput!) {
    createSubscription(input: $input) {
     success
    message
    subscription{
      userId
      stripeCustomerId
      stripePriceId
      stripeProductId
      status
      currentPeriodStart
      currentPeriodEnd
      cancelAtPeriodEnd
      plan
      canceledAt
    }
    clientSecret
    }
  }
`;

export const CREATE_PRODUCT = gql`
  mutation CreateProduct($product: ProductInput!, $pictures: [Upload!]!) {
    createProduct(product: $product, pictures: $pictures)
  }
`;
export const CREATE_SHOP = gql`
  mutation CreateShop($shop: ShopInput!, $coverPicture: Upload!, $profilePicture: Upload!) {
    createShop(shop: $shop, coverPicture: $coverPicture, profilePicture: $profilePicture)
  }
`;
export const CREATE_OR_UPDATE_SHOP = gql`
  mutation UpdateShop($shop: ShopInput!, $coverPicture: Upload, $profilePicture: Upload) {
    updateShop(shop: $shop, coverPicture: $coverPicture, profilePicture: $profilePicture)
  }
`;

export const UPDATE_PRODUCT = gql`
  mutation UpdateProduct($product: ProductInput!, $picturesToAdd: [Upload!]!, $productId:String!, $picturesToRemove:[String]) {
    updateProduct(product: $product, picturesToAdd: $picturesToAdd, productId:$productId, picturesToRemove:$picturesToRemove)
  }
`;
export const IMPORT_PRODUCT = gql`
  mutation UploadCSV($file: Upload!) {
    uploadCSV(file: $file)
  }
`;

export const DELETE_PRODUCT = gql`
  mutation DeleteProduct($id: ID!) {
    deleteProduct(id: $id)
  }
`;

export const CREATE_ORDER_MUTATION = gql`
  mutation CreateOrder($order: OrderInput!) {
    createOrder(order: $order)
  }
`;
export const CHANGE_ORDER_STATUS = gql`
  mutation ChangeStatus($id: String, $status:String) {
    changeStatus(id: $id, status:$status)
  }
`;

// export const CREATE_PRODUCT = gql`
//   mutation CreateProduct($name: String!, $user: String!, $pictures: [Upload!]!) {
//     createProduct(name: $name, user: $user, pictures: $pictures)
//   }
// `;