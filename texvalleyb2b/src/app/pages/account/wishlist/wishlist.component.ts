import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/shared/services/product.service';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.scss']
})
export class WishlistComponent implements OnInit {

  isWishlist =false;
  orderDetails =[];
  constructor(private productDetails:ProductService) { }

  ngOnInit(): void {
      this.productDetails.getOrderDetails().subscribe((res) => {
        this.orderDetails = res
        var walAMt = 0
        res.map(function myFunc(args) {
          walAMt = walAMt+ (Number(args.total.replace(/[^0-9.-]+/g, "")));
        })
        // this.yourWallet = walAMt * (10 / 100);
        // this.totalAmt = walAMt;
      }
)
  }

}
