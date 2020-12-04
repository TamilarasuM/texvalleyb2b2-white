import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ProductService } from 'src/app/shared/services/product.service';
@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.scss']
})
export class ForgetPasswordComponent implements OnInit {
  // test:string = JSON.stringify({"c_id":"689","token":"d41d8cd98f00b204e9800998ecf8427e","login_id":"983","login_name":"Tamilarasu","verified":"1"})
  constructor(private tst: ToastrService, private prdSRC: ProductService, private router: Router) {
    // localStorage.setItem("LoginDetails", this.test);
  }
  submitted = false;
  panImage: string;
  aadharImage: string;
  shopImage: string;
  shopImage2: string;
  shopImage3: string;
  gstImage: string;
  userDetails: object;
  KYCStatus: string;
  isKYCVerified: boolean;

  details = ['GSTIN', 'Business PAN Card', 'Aadhar Card'];
  getDetailsForm: FormGroup = new FormGroup(
    {
      gstno: new FormControl('', Validators.required),
      gstCompanyName: new FormControl('', Validators.required),
      gstCompanyAddress: new FormControl('', Validators.required),
      gstImg: new FormControl('', Validators.required)
    })
  panDetailsForm = new FormGroup({
    panNo: new FormControl('', Validators.required),
    panCompanyName: new FormControl('', Validators.required),
    panCompanyAddress: new FormControl('', Validators.required),
    panImg: new FormControl('', Validators.required)
  })
  aadharDetailsForm = new FormGroup({
    aadharNo: new FormControl('', Validators.required),
    aadharCompanyName: new FormControl('', Validators.required),
    aadharCompanyAddress: new FormControl('', Validators.required),
    aadharImg: new FormControl('', Validators.required)
  })
  shopDetailsForm = new FormGroup({
    shopCompanyName: new FormControl('', Validators.required),
    shopCompanyAddress: new FormControl('', Validators.required),
    shopImg: new FormControl('', Validators.required),
    shopImg1: new FormControl('', Validators.required)
  })
  kycForm: FormGroup = new FormGroup({
    verificationType: new FormControl('', Validators.required),
  });

  ngOnInit(): void {
    this.userDetails = JSON.parse(localStorage.getItem("LoginDetails"));
    this.KYCStatus = this.userDetails["verified"] == 0 ? "Not Verified" : "Verified";
    this.isKYCVerified = this.userDetails["verified"] == 0 ? false : true;
    this.handleEmploymentStatus();
  }
  get verificationDetails() {
    return this.kycForm.get('verificationType') as FormControl;
  }
  handleEmploymentStatus() {
    this.verificationDetails.valueChanges.subscribe(val => {
      this.kycForm.removeControl('gstDetails');
      this.kycForm.removeControl('panDetails');
      this.kycForm.removeControl('aadharDetails');
      this.kycForm.removeControl('shopDetails');
      if (val == "GSTIN")
        this.kycForm.addControl('gstDetails', this.getDetailsForm);
      if (val == "businessPan")
        this.kycForm.addControl('panDetails', this.panDetailsForm);
      if (val == "Aadhar")
        this.kycForm.addControl('aadharDetails', this.aadharDetailsForm);
      if (val == "shopPic")
        this.kycForm.addControl('shopDetails', this.shopDetailsForm);
    })
  }
  setGstImg($event): void {
    var file: File = $event.target.files[0];
    var myReader: FileReader = new FileReader();
    myReader.onloadend = (e) => {
      this.gstImage = myReader.result.toString();//.replace("data:image/jpeg;base64,", "").replace("data:image/png;base64,", ""); //.replace("data:image/png;base64,", "");
      //this.getDetailsForm.patchValue({gstImg: myReader.result})
    }
    myReader.readAsDataURL(file);
  }
  panImg($event): void {
    var file: File = $event.target.files[0];
    var myReader: FileReader = new FileReader();
    myReader.onloadend = (e) => {
      this.panImage = myReader.result.toString();//.replace("data:image/png;base64,", "");
      this.kycForm.patchValue({ "panImg": this.panImage })
    }
    myReader.readAsDataURL(file);
  }
  cImg($event, key): void {
    var file: File = $event.target.files[0];
    var myReader: FileReader = new FileReader();
    myReader.onloadend = (e) => {
      if (key == "aadharImage") {
        this.aadharImage = myReader.result.toString(); //.replace("data:image/jpeg;base64,", "");//.replace("data:image/png;base64,", "");
      }
      else if (key == "shopImage1" || key == "shopImage2" || key == "shopImage3") {
        if (key == "shopImage1") {
          this.shopImage = myReader.result.toString(); //.replace("data:image/jpeg;base64,", "");//.replace("data:image/png;base64,", "");
          this.kycForm.controls.shopDetails.patchValue({ shopImg: "shopImage" })
        }
        else if (key == "shopImage2") {
          this.shopImage2 = myReader.result.toString();
          this.kycForm.controls.shopDetails.patchValue({ shopImg1: "shopImage2" })
        }
        else if (key == "shopImage3") {
          this.shopImage3 = myReader.result.toString();
          this.kycForm.controls.shopDetails.patchValue({ shopImg1: "shopImage3" })
        }
      }
    }
    myReader.readAsDataURL(file);
  }

  updateKYC() {
    //this.submitted = true;
    if (this.kycForm.valid) {
      var userDetails = JSON.parse(localStorage.getItem("LoginDetails"))
      var val = this.kycForm.controls.verificationType.value;
      var params = {};
      if (val == "GSTIN") {
        params = {
          verification_type: 1,
          login_id: userDetails.login_id,
          c_id: userDetails.c_id,
          gstin: this.getDetailsForm.value.gstno,
          company_name: this.getDetailsForm.value.gstCompanyName,
          address: this.getDetailsForm.value.gstCompanyAddress,
          gstin_picture: this.gstImage
        }
      } else if (val == "businessPan") {
        params = {
          verification_type: 2,
          login_id: userDetails.login_id,
          c_id: userDetails.c_id,
          pan_no: this.panDetailsForm.value.panNo,
          company_name: this.panDetailsForm.value.panCompanyName,
          address: this.panDetailsForm.value.panCompanyAddress,
          pan_picture: this.panImage
        }
      }
      else if (val == "Aadhar") {
        params = {
          verification_type: 3,
          login_id: userDetails.login_id,
          c_id: userDetails.c_id,
          udyog_no: this.aadharDetailsForm.value.aadharNo,
          company_name: this.aadharDetailsForm.value.aadharCompanyName,
          address: this.aadharDetailsForm.value.aadharCompanyAddress,
          udyog_picture: this.aadharImage
        }
      }
      else if (val == "shopPic") {
        params = {
          verification_type: 2,
          login_id: userDetails.login_id,
          c_id: userDetails.c_id,
          company_name: this.shopDetailsForm.value.shopCompanyName,
          address: this.shopDetailsForm.value.shopCompanyAddress,
          shop_picture1: this.shopImage,
          shop_picture2: this.shopImage2,
          shop_picture3: this.shopImage3
        }
      }
      this.prdSRC.updateKYC(params).subscribe(res => {
        
        if(res !=null && res[0] !=null ) {
          this.tst.success(res[0].status)
          setTimeout((function (args) {
          this.router.navigate(['/home/fashion']);
          }).bind(this), 2500)
        }
      },
        err => {
          this.tst.error("Error occured " + err)
          // this.router.navigate(['/home/fashion']);
          // this.router
        }
      )
    }
  }
}
