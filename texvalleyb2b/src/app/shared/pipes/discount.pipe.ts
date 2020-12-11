import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'discount'
})
export class DiscountPipe implements PipeTransform {

  transform(value: any, args?: any): any {
  var userDetails = localStorage.getItem("LoginDetails") 
    const price = userDetails == null?"[For Price: Login]" : (JSON.parse(userDetails).verified == 0 ? "[For Price: verify KYC]" :  (args.price) + (" (Pcs)") ) //args.discount ? args.price - (args.price * args.discount / 100) : args.price;
    return price 
  }

}
