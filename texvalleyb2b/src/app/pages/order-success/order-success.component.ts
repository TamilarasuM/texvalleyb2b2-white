import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-order-success',
  templateUrl: './order-success.component.html',
  styleUrls: ['./order-success.component.scss']
})
export class OrderSuccessComponent implements OnInit {

  public orderID:number;
  constructor(private router:ActivatedRoute,private route:Router) { 
    this.orderID= this.router.snapshot.params["id"];
  }
  ngOnInit(): void {


    setTimeout((function(){
      this.route.navigate(['/pages/order-details']);  
   }).bind(this), 3000);
  }
  

}
