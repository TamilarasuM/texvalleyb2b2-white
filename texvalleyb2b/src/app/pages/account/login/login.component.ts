import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NavService } from 'src/app/shared/services/nav.service';
import { ProductService } from 'src/app/shared/services/product.service';
import { environment } from '../../../../environments/environment';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public urlCollection = environment.applicationUrl;
  loginForm: FormGroup;
  otpForm: FormGroup;
  isOTP = false;
  otpReqValue: string;

  constructor(private httpClient: HttpClient, private router: Router, private tost: ToastrService, private productService: ProductService, private navSRC: NavService) { }

  ngOnInit(): void {

    this.loginForm = new FormGroup({
      username: new FormControl(null, [Validators.required]),
      password: new FormControl(null, [Validators.required]),
    });
    this.otpForm = new FormGroup({
      username: new FormControl(null, [Validators.required]),
      password: new FormControl(null, [Validators.required]),
    });
  }


  login() {
    if (this.loginForm.valid) {
      localStorage.removeItem("LoginDetails");
      if (localStorage.getItem("LoginDetails") == null) {
        // var url = "https://stage.texvalleyb2b.in/api_web/login.php";
        var loginUrl = environment.applicationUrl.loginUrl;
        return this.httpClient.post<any>(loginUrl, JSON.stringify(this.loginForm.value)).subscribe((res) => {
          if (res.message.indexOf("Welcome") > -1) {
              var loginData = { "c_id": res["c_id"], token: res["token"], login_id: res["login_id"], login_name: res["login_name"] , verified: res["verified"]}
              localStorage.setItem("LoginDetails", JSON.stringify(loginData));
              this.productService.getCartDetails().subscribe((response) => {
              var products = this.productService.convertToProduct(response);
              this.productService.cartDetails.next(products);
            })
            this.router.navigate(['/home/fashion']);
          }
          else {
            this.tost.error(res.message)
          }
        })
      }
    }
  }

  toggleView() {
    this.isOTP = !this.isOTP;
  }

  changeOTP() {
    this.isOTP = true;
  }

  otpRequest() {
    this.otpReqValue = this.otpForm.get("username").value;
    // var url = "https://stage.texvalleyb2b.in/api_web/login_otp.php";
    var loginOtpUrl = environment.applicationUrl.loginOtpUrl;
    this.httpClient.post<any>(loginOtpUrl, JSON.stringify({ "mobile_no": this.otpReqValue })).subscribe((res) => {
    if (res.message.indexOf("registered")>-1)
    this.tost.error(res.message)
    else 
    {
      this.tost.success(res.message)
    }
    })
  }

  verifyOTP(OTP) {
    // this.isOTP = true;
    var optVerificationURL =  environment.applicationUrl.optVerificationUrl;//"https://stage.texvalleyb2b.in/api_web/login_otp_verification.php";
    this.httpClient.post<any>(optVerificationURL, JSON.stringify({ "otp": OTP })).subscribe((res) => {
      if (res.message.indexOf("Incorrect") > -1)
        this.tost.error(res.message)
      else {
        this.tost.success("Successfully logged in")
        var loginData = { "c_id": res["c_id"], token: res["token"], login_id: res["login_id"], login_name: res["login_name"] ,verified: res["verified"]}
        localStorage.setItem("LoginDetails", JSON.stringify(loginData));
          this.navSRC.items.subscribe( res => {
            this.navSRC.updateMenus(res);
          })
            this.productService.getCartDetails().subscribe((response) => {
              var products = this.productService.convertToProduct(response);
              this.productService.cartDetails.next(products);
            })
        this.router.navigate(['/home/fashion']);
      }
    })
  }

  forgetPWD() {
    this.otpReqValue = this.loginForm.get("username").value;
    var forgetPwdUrl = environment.applicationUrl.forgetPwdUrl//"https://stage.texvalleyb2b.in/api_web/forget_password.php";
    this.httpClient.post<any>(forgetPwdUrl, JSON.stringify({ "email_id": this.loginForm.get("username").value })).subscribe((res) => {
      if (res[0].message.indexOf("Incorrect") > -1 || res[0].message.indexOf("Valid") > -1)
        this.tost.error(res[0].message)
      else if (res.length > 0) {
        this.tost.success("Successfully logged in")
        var loginData = { "c_id": res["c_id"], token: res["token"], login_id: res["login_id"], login_name: res["login_name"], verified: res["verified"] }
        localStorage.setItem("LoginDetails", JSON.stringify(loginData));
        this.router.navigate(['/home/fashion']);
      }
    })
  }
}
