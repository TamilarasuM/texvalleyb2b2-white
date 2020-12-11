import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ProductService } from 'src/app/shared/services/product.service';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.scss']
})
export class WishlistComponent implements OnInit {

  isWishlist = false;
  orderDetails = [];
  orderCollection = [];
  showPopup = false;
  constructor(private productDetails: ProductService, private tost:ToastrService,private router: Router) { }

  ngOnInit(): void {
    this.productDetails.getOrderDetails().subscribe((res) => {
      this.orderDetails = res
      var walAMt = 0
      res.map(function myFunc(args) {
        walAMt = walAMt + (Number(args.total.replace(/[^0-9.-]+/g, "")));
      })
      // this.yourWallet = walAMt * (10 / 100);
      // this.totalAmt = walAMt;
    }
    )
  }

  public getDetails(orderID) {
    this.showPopup = true;
    this.productDetails.getOrderCollectionDetail(orderID).subscribe((function (res) {
      this.orderCollection = res;
      debugger
    }).bind(this))
  }

  public payDetails(orderID) {
    this.productDetails.initiatePayement(orderID).subscribe((function (res) {
      // this.orderCollection = res;
     if(res.status ==0)
      this.tost.error(res.message)
     else {
       var payemntGateWayUrl =  "https://uat.ostaapp.com/paymentGateway/?ostaTransactionReferenceId="+res.ostaTransactionReferenceId+"&token="+res.token;
      // this.router.navigateByUrl(routeUrl);
      window.location.href = payemntGateWayUrl;
     }
    }).bind(this))

  }

  toggle() {
    this.showPopup = !this.showPopup;
  }

}
