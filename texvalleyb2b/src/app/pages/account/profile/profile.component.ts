import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ProductService } from 'src/app/shared/services/product.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  SignupForm: FormGroup;
  constructor(private productService:ProductService,private tost:ToastrService) { }

  ngOnInit(): void {

    this.SignupForm = new FormGroup({
      'buyer_name': new FormControl(null, [Validators.required]),
      'company_name': new FormControl(null, [Validators.required]),
      'mobile_number': new FormControl(null, [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]),
      'email_id': new FormControl(null, [Validators.required, Validators.email]),
      'address': new FormControl(null, [Validators.required]),
      'shipping_address': new FormControl(null, [Validators.required]),
      // 'gst_no': new FormControl(null, [Validators.required]),
      'city': new FormControl([], [Validators.required]),
      'state': new FormControl([], [Validators.required]),
      'pincode': new FormControl(null, [Validators.required]),
      'area': new FormControl(null, [Validators.required]),
    });
    this.productService.getProfile().subscribe((res) => {
      if (res.length > 0) {
        // this.image = "//stage.texvalleyb2b.in/" + res[0].photo;
          this.SignupForm.patchValue(
          {
            address: res[0].address,
            shipping_address: res[0].shipping_address,
            buyer_name: res[0].contact_name,
            company_name: res[0].company_name,
            email_id: res[0].email_id,
            mobile_number: res[0].mobile_no,
            pincode: res[0].pin_code,
            city: res[0].city,
            state: res[0].state,
            area: res[0].area,
          }
        )
      }
    })
  }

  onSubmit() {
    if (this.SignupForm.valid) {
      var userDetails = JSON.parse(localStorage.getItem("LoginDetails"));
         var profileData =   Object.assign(userDetails,this.SignupForm.value) ;
         debugger
      this.productService.updateProfile( JSON.stringify(profileData)).subscribe(
          res => {
            // if (!(res["status"].indexOf("already Registered") > -1)) {
            // }
            if(res.length>0 && res[0].message.indexOf("Success")>-1)
              this.tost.success(res[0].message)
            else
            this.tost.error("error")

            // alert(res["status"])
          }
        );
    }
  }

  
  // this.SignupForm.patchValue( //res[0]
  //   {
  //     address: res[0].address,
  //     buyer_name: res[0].contact_name,
  //     city: res[0].city,
  //     company_name: res[0].company_name,
  //     email_id: res[0].email_id,
  //     mobile_no: res[0].mobile_no,
  //     pincode: res[0].pin_code,
  //     state: res[0].state
  //   }
  // )

}
