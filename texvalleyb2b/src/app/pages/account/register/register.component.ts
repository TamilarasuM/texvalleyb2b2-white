import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductService } from 'src/app/shared/services/product.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  isError: boolean = false;
  isOtp: boolean = false;
  errorMessage: string;
  SignupForm: FormGroup;
  states = [];
  cities = [];
  areas=[];
  stateDetails = [];


  constructor(private httpClient: HttpClient, private router: Router, private product: ProductService) { }

  ngOnInit(): void {
    this.SignupForm = new FormGroup({
      'buyer_name': new FormControl(null, [Validators.required]),
      'company_name': new FormControl(null, [Validators.required]),
      'mobile_no': new FormControl(null, [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]),
      'email_id': new FormControl(null, [Validators.required, Validators.email]),
      'city': new FormControl([], [Validators.required]),
      'state': new FormControl([], [Validators.required]),
      'address': new FormControl(null, [Validators.required]),
      'area': new FormControl(null),
      'pincode': new FormControl(null, [Validators.required]),
    });


    this.product.getState().subscribe((res) => {
      if (res) {
        this.stateDetails = res;
        this.states = res.map((data) => { return data.state_name });
      }
    })
  }


  onSubmit() {
    if (this.SignupForm.valid) {
      return this.httpClient.post<any>(environment.applicationUrl.buyerSignUpUrl, JSON.stringify(this.SignupForm.value)).subscribe(
        res => {
          this.errorMessage = res["status"];
          if (!(res["status"].indexOf("already Registered") > -1)) {
            this.isOtp = true;
          }
        }
      );
    }
  }

  validateOTP(args: number) {
    if (this.SignupForm.valid) {
      var data = { otp: args["value"] }
      return this.httpClient.post<any>( environment.applicationUrl.buyerOtpVerificationUrl, JSON.stringify(data)).subscribe(
        res => {

          if (!(res["message"].indexOf("Incorrect OTP") > -1)) {
            localStorage.setItem("LoginDetails", JSON.stringify(res))
            this.router.navigate(['/home/fashion']);
          } else {
            alert(res["message"])
          }

        }
      );
    }
  }

  changeState(e) {
    console.log(e.value)
    this.stateDetails.filter((args) => {
      if (e.target.value.indexOf(args.state_name) > -1) {
        this.cities = args.cities; //.map( (cities)=>{ return cities.city})
      }
    });
    this.SignupForm.patchValue({ "state": e.target.value })
  }

  changeCity(e) {
    this.SignupForm.patchValue({ "city": e.target.value })
  }

  changeArea(e){
    this.SignupForm.patchValue({ "area": e.target.value })
  }

  checkPinCode(pincodeValue) {
    if(pincodeValue.length==6){
      this.httpClient.post<any>( environment.applicationUrl.pincodeUrl, JSON.stringify({pincode:pincodeValue})).subscribe(
        res => {
        if(res && res.length>0 && res[0].state) {
        this.SignupForm.patchValue({ "state": res[0].state });
        this.SignupForm.patchValue({ "city": res[0].city });
        this.SignupForm.patchValue({ "area": res[0].area[0].area });
        (<HTMLInputElement>document.getElementById("states")).value =res[0].state;
        this.stateDetails.filter((args) => {
          if (res[0].state.indexOf(args.state_name) > -1) {
            this.cities = args.cities; 
            this.areas = res[0].area;
          }
        });
        setTimeout(() => {
          (<HTMLInputElement>document.getElementById("cities")).value = res[0].city;
        }, 1200);

        setTimeout(() => {
          (<HTMLInputElement>document.getElementById("areaList")).value = res[0].area[0].area;
        }, 1200);
       
       
        }}
        )
    }
  }

}
