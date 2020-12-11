// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  instagram_token: 'INSTAGRAM_TOKEN',
  stripe_token: 'STRIPE_PUBLISHABLE_KEY',
  paypal_token: 'PAYPAL_CLIENT_ID',
  applicationUrl : {
        searchUrl: "https://stage.texvalleyb2b.in/api_web/get_search_products.php",
        getProductListUrl: "https://stage.texvalleyb2b.in/api_web/get_product.php",
        getNewArivalsUrl: "https://stage.texvalleyb2b.in/api_web/get_new_arrival.php",
        getStateUrl : "https://stage.texvalleyb2b.in/api_web/get_state.php",
        addCartDetailsUrl : "https://stage.texvalleyb2b.in/api_web/add_cart.php",
        productDetailsUrl: "https://stage.texvalleyb2b.in/api_web/get_product_details.php",
        getOrderDetailsUrl : "https://stage.texvalleyb2b.in/api_web/get_order.php",
        getOrderCollectionDetailUrl : "https://stage.texvalleyb2b.in/api_web/get_order_items.php",
        paymentInitateUrl: "https://stage.texvalleyb2b.in/api_web/initiate_payment.php",
        deleteCartUrl : "https://stage.texvalleyb2b.in/api_web/delete_cart.php",
        confirmOrderUrl: "https://stage.texvalleyb2b.in/api_web/confirm_order.php",
        couponUrl : "https://stage.texvalleyb2b.in/api_web/update_coupon.php",
        updateProfileUrl : "https://stage.texvalleyb2b.in/api_web/send_update_profile.php",
        kycURL : "https://stage.texvalleyb2b.in/api_web/send_kyc_update.php",
        getProfileUrl : " https://stage.texvalleyb2b.in/api_web/get_profile.php",
  }

};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
