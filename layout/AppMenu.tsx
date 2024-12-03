/* eslint-disable @next/next/no-img-element */

import React, { useContext } from 'react';
import AppMenuitem from './AppMenuitem';
import { LayoutContext } from './context/layoutcontext';
import { MenuProvider } from './context/menucontext';
import Link from 'next/link';
import { AppMenuItem } from '@/types';
import { InputText } from 'primereact/inputtext';
import { useRouter } from 'next/navigation';


const AppMenu = () => {
    const { layoutConfig } = useContext(LayoutContext);
    const router=useRouter()

    const model: AppMenuItem[] = [
        {
            label: '',
            icon: 'pi pi-fw pi-briefcase', // General category icon
            to: '/pages',
            items: [
                {
                    label: 'Dashboard',
                    icon: 'pi pi-fw pi-home', // Home or main dashboard icon
                    to: '/',
                },
                {
                    label: 'Products',
                    icon: 'pi pi-fw pi-box', // Products or inventory icon
                    items: [
                        {
                            label: 'Dictionary',
                            icon: 'pi pi-fw pi-book', // Dictionary or book icon
                            to: '/pages/dictionary',
                        },
                        {
                            label: 'Product Category',
                            icon: 'pi pi-fw pi-tags', // Categories or tags icon
                            to: '/pages/product-category',
                        },
                        {
                            label: 'Variations',
                            icon: 'pi pi-fw pi-th-large', // Grid or variations icon
                            to: '/pages/variations',
                        },
                        {
                            label: 'Brands',
                            icon: 'pi pi-fw pi-star', // Star for brands or favorites
                            to: '/pages/brands',
                        },
                        {
                            label: 'Units',
                            icon: 'pi pi-fw pi-sliders-h', // Units or measurements icon
                            to: '/pages/units',
                        },
                        {
                            label: 'Base Units',
                            icon: 'pi pi-fw pi-sliders-h', // Layers for base units
                            to: '/pages/base-units',
                        },
                    ],
                },
                {
                    label:'Stocks',
                    icon: 'pi pi-fw pi-shopping-cart', // Cart for purchases
                    to: '/pages/stocks',
                },
                {
                    label: 'Purchases',
                    icon: 'pi pi-fw pi-shopping-cart', // Cart for purchases
                    to: '/pages/purchases',
                },
                {
                    label: 'Sales',
                    icon: 'pi pi-fw pi-chart-line', // Line chart for sales
                    to: '/pages/sales',
                },
                {
                    label: 'Roles/Permissions',
                    icon: 'pi pi-fw pi-lock', // Lock for security or permissions
                    to: '/pages/role-permissions',
                },
                {
                    label: 'Warehouse',
                    icon: 'pi pi-fw pi-map-marker', // Map or location marker for warehouses
                    to: '/pages/warehouse',
                },
            ],
        },
    ];

    const logout=()=>{
        router.push('/auth/login')
    }


    return (
        <MenuProvider>
             <div className='m-1'>
             <span className="p-input-icon-right">
                <InputText type="text" placeholder="Search" />
                <i className="pi pi-search" />
            </span>
             </div>
            <ul className="layout-menu">
                {model.map((item, i) => {
                    return !item?.seperator ? <AppMenuitem item={item} root={true} index={i} key={item.label} /> : <li className="menu-separator"></li>;
                })}
            </ul>
            {/* Logout Button at the Bottom */}
            <div className="menu-bottom">
                <button className="p-link layout-menu-button logout-button" onClick={logout}>
                    <i className="pi pi-sign-out"></i>
                    <span>Logout</span>
                </button>
            </div>
        </MenuProvider>
    );
};

export default AppMenu;
