/* eslint-disable @next/next/no-img-element */
'use client';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { FileUpload } from 'primereact/fileupload';
import { InputNumber, InputNumberValueChangeEvent } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { RadioButton, RadioButtonChangeEvent } from 'primereact/radiobutton';
import { Rating } from 'primereact/rating';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { classNames } from 'primereact/utils';
import React, { useEffect, useRef, useState } from 'react';
import { ProductService } from '../../../../demo/service/ProductService';
import { Demo } from '@/types';
import BaseUnitDialog from '@/demo/components/BaseUnitDialog';

/* @todo Used 'as any' for types here. Will fix in next version due to onSelectionChange event type issue. */
interface Product {
    id:String,
    name:string,
    phone_number:string,
    email:string,
    country:string,
    address:string,
}

const Crud = () => {
    let emptyProduct: Product = {
        id: '',
        name: '',
        phone_number: '',
        email: '',
        country: '',
        address: "",

    };


    const [products, setProducts] = useState<Product[]>([]);
    const [productDialog, setProductDialog] = useState(false);
    const [deleteProductDialog, setDeleteProductDialog] = useState(false);
    const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
    const [product, setProduct] = useState<Product>(emptyProduct);
    const [selectedProducts, setSelectedProducts] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState('');
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<any>>(null);

    useEffect(() => {
        //ProductService.getProducts().then((data) => setProducts(data as any));
        setProducts([
            { id:"1",name: 'User1', phone_number:"01798779878", email:"samiulcse2018@gmail.com",country:"Bangladesh",address:"Mirpur, Dhaka"  },
            { id:"2",name: 'User2', phone_number:"01798779878", email:"samiulcse2018@gmail.com",country:"Bangladesh",address:"Mirpur, Dhaka"  },
            { id:"3",name: 'User3', phone_number:"01798779878", email:"samiulcse2018@gmail.com",country:"Bangladesh",address:"Mirpur, Dhaka"  },

        ]);
    }, []);

    const formatCurrency = (value: number) => {
        return value.toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD'
        });
    };

    const openNew = () => {
        setProduct(emptyProduct);
        setSubmitted(false);
        setProductDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setProductDialog(false);
    };

    const hideDeleteProductDialog = () => {
        setDeleteProductDialog(false);
    };

    const hideDeleteProductsDialog = () => {
        setDeleteProductsDialog(false);
    };

    // const saveProduct = () => {
    //     setSubmitted(true);

    //     if (product.name.trim()) {
    //         let _products = [...(products as any)];
    //         let _product = { ...product };
    //         if (product.id) {
    //             const index = findIndexById(product.id);

    //             _products[index] = _product;
    //             toast.current?.show({
    //                 severity: 'success',
    //                 summary: 'Successful',
    //                 detail: 'Product Updated',
    //                 life: 3000
    //             });
    //         } else {
    //             _product.id = createId();
    //             _product.image = 'product-placeholder.svg';
    //             _products.push(_product);
    //             toast.current?.show({
    //                 severity: 'success',
    //                 summary: 'Successful',
    //                 detail: 'Product Created',
    //                 life: 3000
    //             });
    //         }

    //         setProducts(_products as any);
    //         setProductDialog(false);
    //         setProduct(emptyProduct);
    //     }
    // };

    const editProduct = (product: Product) => {
        setProduct({ ...product });
        setProductDialog(true);
    };

    const confirmDeleteProduct = (product: Product) => {
        setProduct(product);
        setDeleteProductDialog(true);
    };

    const deleteProduct = () => {
        let _products = (products as any)?.filter((val: any) => val.id !== product.id);
        setProducts(_products);
        setDeleteProductDialog(false);
        setProduct(emptyProduct);
        toast.current?.show({
            severity: 'success',
            summary: 'Successful',
            detail: 'Product Deleted',
            life: 3000
        });
    };

    const findIndexById = (id: string) => {
        let index = -1;
        for (let i = 0; i < (products as any)?.length; i++) {
            if ((products as any)[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    };

    const createId = () => {
        let id = '';
        let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < 5; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return id;
    };

    const exportCSV = () => {
        dt.current?.exportCSV();
    };

    const confirmDeleteSelected = () => {
        setDeleteProductsDialog(true);
    };

    const deleteSelectedProducts = () => {
        let _products = (products as any)?.filter((val: any) => !(selectedProducts as any)?.includes(val));
        setProducts(_products);
        setDeleteProductsDialog(false);
        setSelectedProducts(null);
        toast.current?.show({
            severity: 'success',
            summary: 'Successful',
            detail: 'Products Deleted',
            life: 3000
        });
    };

    // const onCategoryChange = (e: RadioButtonChangeEvent) => {
    //     let _product = { ...product };
    //     _product['category'] = e.value;
    //     setProduct(_product);
    // };

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, name: string) => {
        const val = (e.target && e.target.value) || '';
        let _product = { ...product };
        //_product[`${name}`] = val;


        setProduct(_product);
    };

    const onInputNumberChange = (e: InputNumberValueChangeEvent, name: string) => {
        const val = e.value || 0;
        let _product = { ...product };
        //_product[`${name}`] = val;

        setProduct(_product);
    };

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="New" icon="pi pi-plus" severity="success" className=" mr-2" onClick={openNew} />
                    <Button label="Delete" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedProducts || !(selectedProducts as any).length} />
                </div>
            </React.Fragment>
        );
    };


    const nameBodyTemplate = (rowData: Product) => {
        return (
            <>
                <span className="p-column-title">Name</span>
                {rowData.name}
            </>
        );
    };
    const phoneBodyTemplate = (rowData: Product) => {
        return (
            <>
                <span className="p-column-title">Code</span>
                {rowData.phone_number}
            </>
        );
    };

    const emailBodyTemplate = (rowData: Product) => {
        return (
            <>
                <span className="p-column-title">Symbol</span>
                {rowData.email}
            </>
        );
    };
    const countryBodyTemplate = (rowData: Product) => {
        return (
            <>
                <span className="p-column-title">Country</span>
                {rowData.country}
            </>
        );
    };

    const addressBodyTemplate = (rowData: Product) => {
        return (
            <>
                <span className="p-column-title">Address</span>
                {rowData.address}
            </>
        );
    };




    const actionBodyTemplate = (rowData: Product) => {
        return (
            <>
                <Button title="Edit User" icon="pi pi-pencil" rounded severity="success" className="mr-5" onClick={() => editProduct(rowData)} />
                <Button title="Delete User" icon="pi pi-trash" rounded severity="warning" onClick={() => confirmDeleteProduct(rowData)} />
            </>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Mange Users</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.currentTarget.value)} placeholder="Search..." />
            </span>
        </div>
    );

    const productDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" text onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" text />
        </>
    );
    const deleteProductDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={hideDeleteProductDialog} />
            <Button label="Yes" icon="pi pi-check" text onClick={deleteProduct} />
        </>
    );
    const deleteProductsDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={hideDeleteProductsDialog} />
            <Button label="Yes" icon="pi pi-check" text onClick={deleteSelectedProducts} />
        </>
    );




    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" right={leftToolbarTemplate}></Toolbar>

                    <DataTable
                        ref={dt}
                        value={products}
                        selection={selectedProducts}
                        onSelectionChange={(e) => setSelectedProducts(e.value as any)}
                        dataKey="id"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
                        globalFilter={globalFilter}
                        emptyMessage="No products found."
                        header={header}
                        responsiveLayout="scroll"
                    >
                        <Column selectionMode="multiple" headerStyle={{ width: '4rem' }}></Column>
                        {/* <Column field="code" header="Code" sortable body={codeBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column> */}
                        {/* <Column header="Image" body={imageBodyTemplate}></Column> */}
                        <Column field="name" header="Name" sortable body={nameBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="code" header="Code" sortable body={phoneBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="symbol" header="Symbol" sortable body={emailBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="symbol" header="Symbol" sortable body={countryBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="symbol" header="Symbol" sortable body={addressBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>

                        {/* <Column field="price" header="Price" body={priceBodyTemplate} sortable></Column> */}
                        {/* <Column field="category" header="Category" sortable body={categoryBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column> */}
                        {/* <Column field="rating" header="Reviews" body={ratingBodyTemplate} sortable></Column> */}
                        {/* <Column field="inventoryStatus" header="Status" body={statusBodyTemplate} sortable headerStyle={{ minWidth: '10rem' }}></Column> */}
                        <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                    </DataTable>

                    {/* <BaseUnitDialog visible={productDialog} onHide={hideDialog} /> */}

                    <Dialog visible={productDialog} style={{ width: '450px' }} header="User Details" modal className="p-fluid" footer={productDialogFooter} onHide={hideDialog}>
                        <div className="field">
                            <label htmlFor="name">Name</label>
                            <InputText
                                id="name"
                                value={product.name}
                                onChange={(e) => onInputChange(e, 'name')}
                                required
                                autoFocus
                                className={classNames({
                                    'p-invalid': submitted && !product.name
                                })}
                            />
                            {submitted && !product.name && <small className="p-invalid">Name is required.</small>}
                        </div>


                        <div className="field">
                            <label htmlFor="phone">Phone</label>
                            <InputText
                                id="phone"
                                value={product.phone_number}
                                onChange={(e) => onInputChange(e, 'symbol')}
                                required
                                autoFocus
                                className={classNames({
                                    'p-invalid': submitted && !product.phone_number
                                })}
                            />
                            {submitted && !product.phone_number && <small className="p-invalid">Symbol is required.</small>}
                        </div>

                        <div className="field">
                            <label htmlFor="email">Email</label>
                            <InputText
                                id="email"
                                value={product.email}
                                onChange={(e) => onInputChange(e, 'email')}
                                required
                                autoFocus
                                className={classNames({
                                    'p-invalid': submitted && !product.email
                                })}
                            />
                            {submitted && !product.email && <small className="p-invalid">Email is required.</small>}
                        </div>

                        <div className="field">
                            <label htmlFor="country">Country</label>
                            <InputText
                                id="country"
                                value={product.country}
                                onChange={(e) => onInputChange(e, 'country')}
                                required
                                autoFocus
                                className={classNames({
                                    'p-invalid': submitted && !product.country
                                })}
                            />
                            {submitted && !product.country && <small className="p-invalid">Country is required.</small>}
                        </div>

                        <div className="field">
                            <label htmlFor="address">Address</label>
                            <InputText
                                id="address"
                                value={product.address}
                                onChange={(e) => onInputChange(e, 'address')}
                                required
                                autoFocus
                                className={classNames({
                                    'p-invalid': submitted && !product.address
                                })}
                            />
                            {submitted && !product.address && <small className="p-invalid">Address is required.</small>}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteProductDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteProductDialogFooter} onHide={hideDeleteProductDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {product && (
                                <span>
                                    Are you sure you want to delete <b>{product.name}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteProductsDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteProductsDialogFooter} onHide={hideDeleteProductsDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {product && <span>Are you sure you want to delete the selected products?</span>}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default Crud;
