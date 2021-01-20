import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ProductService } from '../../../shared/services/product.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {

  constructor(private route: ActivatedRoute,private router: Router, private prodSVC:ProductService, private toast:ToastrService) { 
    this.route.queryParams.subscribe(params => {
      this.prodSVC.updatedTranStatus(params).subscribe( (res)=>{
        if(res.status == 0)
            this.toast.error(res.message)
        else
          this.toast.success(res.message);

          this.router.navigate(['/myorders']);
      } )
    });
  }

  ngOnInit(): void {
  }

}
