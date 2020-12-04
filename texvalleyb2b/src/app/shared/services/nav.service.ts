import { HttpClient } from '@angular/common/http';
import { HostListener, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

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

	// Windows width
	@HostListener('window:resize', ['$event'])
	onResize(event?) {
		this.screenWidth = window.innerWidth;
	}

	MENUITEMS: Menu[] = [

	];

	LEFTMENUITEMS: Menu[] = [
		{
			title: 'clothing', type: 'sub', megaMenu: true, active: false, children: [
				{
					title: 'mens fashion', type: 'link', active: false, children: [
						{ path: '/home/fashion', title: 'sports wear', type: 'link' },
						{ path: '/home/fashion', title: 'top', type: 'link' },
						{ path: '/home/fashion', title: 'bottom', type: 'link' },
						{ path: '/home/fashion', title: 'ethic wear', type: 'link' },
						{ path: '/home/fashion', title: 'sports wear', type: 'link' },
						{ path: '/home/fashion', title: 'shirts', type: 'link' },
						{ path: '/home/fashion', title: 'bottom', type: 'link' },
						{ path: '/home/fashion', title: 'ethic wear', type: 'link' },
						{ path: '/home/fashion', title: 'sports wear', type: 'link' }
					]
				},
				{
					title: 'women fashion', type: 'link', active: false, children: [
						{ path: '/home/fashion', title: 'dresses', type: 'link' },
						{ path: '/home/fashion', title: 'skirts', type: 'link' },
						{ path: '/home/fashion', title: 'westarn wear', type: 'link' },
						{ path: '/home/fashion', title: 'ethic wear', type: 'link' },
						{ path: '/home/fashion', title: 'bottom', type: 'link' },
						{ path: '/home/fashion', title: 'ethic wear', type: 'link' },
						{ path: '/home/fashion', title: 'sports wear', type: 'link' },
						{ path: '/home/fashion', title: 'sports wear', type: 'link' },
						{ path: '/home/fashion', title: 'bottom wear', type: 'link' }
					]
				},
			]
		},
		{
			title: 'bags', type: 'sub', active: false, children: [
				{ path: '/home/fashion', title: 'shopper bags', type: 'link' },
				{ path: '/home/fashion', title: 'laptop bags', type: 'link' },
				{ path: '/home/fashion', title: 'clutches', type: 'link' },
				{
					path: '/home/fashion', title: 'purses', type: 'link', active: false, children: [
						{ path: '/home/fashion', title: 'purses', type: 'link' },
						{ path: '/home/fashion', title: 'wallets', type: 'link' },
						{ path: '/home/fashion', title: 'leathers', type: 'link' },
						{ path: '/home/fashion', title: 'satchels', type: 'link' }
					]
				},
			]
		},
		{
			title: 'footwear', type: 'sub', active: false, children: [
				{ path: '/home/fashion', title: 'sport shoes', type: 'link' },
				{ path: '/home/fashion', title: 'formal shoes', type: 'link' },
				{ path: '/home/fashion', title: 'casual shoes', type: 'link' }
			]
		},
		{
			path: '/home/fashion', title: 'watches', type: 'link'
		},
		{
			title: 'Accessories', type: 'sub', active: false, children: [
				{ path: '/home/fashion', title: 'fashion jewellery', type: 'link' },
				{ path: '/home/fashion', title: 'caps and hats', type: 'link' },
				{ path: '/home/fashion', title: 'precious jewellery', type: 'link' },
				{
					path: '/home/fashion', title: 'more..', type: 'link', active: false, children: [
						{ path: '/home/fashion', title: 'necklaces', type: 'link' },
						{ path: '/home/fashion', title: 'earrings', type: 'link' },
						{ path: '/home/fashion', title: 'rings & wrist wear', type: 'link' },
						{
							path: '/home/fashion', title: 'more...', type: 'link', active: false, children: [
								{ path: '/home/fashion', title: 'ties', type: 'link' },
								{ path: '/home/fashion', title: 'cufflinks', type: 'link' },
								{ path: '/home/fashion', title: 'pockets squares', type: 'link' },
								{ path: '/home/fashion', title: 'helmets', type: 'link' },
								{ path: '/home/fashion', title: 'scarves', type: 'link' },
								{
									path: '/home/fashion', title: 'more...', type: 'link', active: false, children: [
										{ path: '/home/fashion', title: 'accessory gift sets', type: 'link' },
										{ path: '/home/fashion', title: 'travel accessories', type: 'link' },
										{ path: '/home/fashion', title: 'phone cases', type: 'link' }
									]
								},
							]
						}
					]
				},
			]
		},
		{
			path: '/home/fashion', title: 'house of design', type: 'link'
		},
		{
			title: 'beauty & personal care', type: 'sub', active: false, children: [
				{ path: '/home/fashion', title: 'makeup', type: 'link' },
				{ path: '/home/fashion', title: 'skincare', type: 'link' },
				{ path: '/home/fashion', title: 'premium beaty', type: 'link' },
				{
					path: '/home/fashion', title: 'more..', type: 'link', active: false, children: [
						{ path: '/home/fashion', title: 'fragrances', type: 'link' },
						{ path: '/home/fashion', title: 'luxury beauty', type: 'link' },
						{ path: '/home/fashion', title: 'hair care', type: 'link' },
						{ path: '/home/fashion', title: 'tools & brushes', type: 'link' }
					]
				},
			]
		},
		{
			path: '/home/fashion', title: 'home & decor', type: 'link'
		},
		{
			path: '/home/fashion', title: 'kitchen', type: 'link'
		}
	];

	// Array
	items = new BehaviorSubject<Menu[]>([]);
	leftMenuItems = new BehaviorSubject<Menu[]>(this.LEFTMENUITEMS);
	public isLogin = false;

	getSegments() {
		
		return this.httpClient.get<any>("https://stage.texvalleyb2b.in/api_web/get_segment.php").toPromise().then((res) => {
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
			{ megaMenu: false, title: "MY Orders", path: '/order-details', segment_ID: 2, product_name: null, type: 'extLink', sort_order: 1 },
			{ megaMenu: false, title: "MY KYC", path: '/kyc', segment_ID: 2, product_name: null, type: 'extLink', sort_order: 1 },
			{ megaMenu: false, title: "Logout", path: '/login', segment_ID: 2, product_name: null, type: 'logout', sort_order: 1 },
		] :
			[{ megaMenu: false, title: "Login", path: '/login', segment_ID: 2, product_name: null, type: 'extLink', sort_order: 1 },
			{ megaMenu: false, title: "Register", path: '/register', segment_ID: 2, product_name: null, type: 'extLink', sort_order: 1 },
			]

			menuItems.push({ megaMenu: false, removePadding:true, title: "Buyer Benifits", path: '/buyer', segment_ID: 2, product_name: null, type: 'extLink', sort_order: 1 })
			menuItems.push({ megaMenu: false, removePadding:true, title: "Why Texvalley B2B?", path: '/whyb2b', segment_ID: 2, product_name: null, type: 'extLink', sort_order: 1 })
		
			menuItems.push({ title: this.isLogin ? "My Account" : "Login/Register", megaMenu: false, segment_ID: 1, type: 'sub', active: false, children: myccMenu })			
		return menuItems;
	}

}
