import { HttpClient } from '@angular/common/http';
import { HostListener, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from "../../../environments/environment";
// Menu
export interface Menu {
	path?: string;
	title?: string;
	type?: string;
	megaMenu?: boolean;
	image?: string;
	active?: boolean;
	badge?: boolean;
	badgeText?: string;
	children?: Menu[];
}

@Injectable({
	providedIn: 'root'
})

export class NavService {

	constructor(private httpClient: HttpClient) { }
	public screenWidth: any;
	public leftMenuToggle: boolean = false;
	public mainMenuToggle: boolean = false;
	private menus = this.getSegments();
	private menuCollections = [];
	public menuCollection = new BehaviorSubject([]);
	MENUITEMS: Menu[] = [];
	LEFTMENUITEMS: Menu[] = [];
	items = new BehaviorSubject<Menu[]>([]);
	leftMenuItems = new BehaviorSubject<Menu[]>(this.LEFTMENUITEMS);
	public isLogin = false;

	// Windows width
	@HostListener('window:resize', ['$event']) onResize(event?) {
		this.screenWidth = window.innerWidth;
	}
	getSegments() {
		return this.httpClient.get<any>(environment.applicationUrl.getSegmentsUrl).toPromise().then((res) => {
			var menuItems = [];
			this.menuCollection.next(res);
			res.map((function myFunc(args) {
				var segmentID = args["segment_id"];
				var subMenus = args["product_name"].map(function myFunc(args) {
					return { megaMenu: false, path: '/shop/collection/left/sidebar', segment_ID: segmentID, product_name: args["products"], title: args["products"], image_url: args['image'], type: 'link', sort_order: args["sort_order"] }
				});
				var isAddMore = false;
				subMenus = subMenus.filter(function (args) {
					if (args.sort_order == 0)
						isAddMore = true;
					return (args.sort_order != 0);
				});
				if (subMenus.length > 0)
					menuItems.push({ title: args["segment"], megaMenu: false, path: '/shop/segments', segment_ID: args["segment_id"], product_name: args["products"], type: 'sub', active: false, children: subMenus })
				if (isAddMore)
					subMenus.push({ megaMenu: false, path: '/shop/segments', segment_ID: segmentID, product_name: args["products"], title: "More..", type: 'elink', sort_order: args["sort_order"] })
			}).bind(this))
			this.items.next(menuItems)
		})
	}

	updateMenus(menuItems) {
		this.isLogin = localStorage.getItem("LoginDetails") == null ? false : true;
		var myccMenu = this.isLogin ? [
			{ megaMenu: false, title: "MY Profile", path: '/profile', segment_ID: 2, product_name: null, type: 'extLink', sort_order: 1 },
			{ megaMenu: false, title: "MY cart", path: '/shop/cart', segment_ID: 2, product_name: null, type: 'extLink', sort_order: 1 },
			{ megaMenu: false, title: "MY Orders", path: '/myorders', segment_ID: 2, product_name: null, type: 'extLink', sort_order: 1 },
			{ megaMenu: false, title: "MY KYC", path: '/kyc', segment_ID: 2, product_name: null, type: 'extLink', sort_order: 1 },
			{ megaMenu: false, title: "Logout", path: '/login', segment_ID: 2, product_name: null, type: 'logout', sort_order: 1 },
		] :
			[{ megaMenu: false, title: "Login", path: '/login', segment_ID: 2, product_name: null, type: 'extLink', sort_order: 1 },
			{ megaMenu: false, title: "Register", path: '/register', segment_ID: 2, product_name: null, type: 'extLink', sort_order: 1 },
			]
		menuItems.push({ megaMenu: false, removePadding: true, title: "Buyer Benefits", path: '/buyer', segment_ID: 2, product_name: null, type: 'extLink', sort_order: 1 })
		menuItems.push({ megaMenu: false, removePadding: true, title: "Why Texvalley B2B?", path: '/whyb2b', segment_ID: 2, product_name: null, type: 'extLink', sort_order: 1 })
		menuItems.push({ title: this.isLogin ? "My Account" : "Login/Register", megaMenu: false, segment_ID: 1, type: 'sub', active: false, children: myccMenu })			
		return menuItems;
	}

}
