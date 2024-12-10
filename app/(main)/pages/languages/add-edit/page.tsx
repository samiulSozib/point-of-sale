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
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ProductService } from '../../../../../demo/service/ProductService';
import { Demo } from '@/types';
import { useRouter } from 'next/navigation';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { MultiSelect } from 'primereact/multiselect';

/* @todo Used 'as any' for types here. Will fix in next version due to onSelectionChange event type issue. */

const Crud = () => {
    let emptyProduct: Demo.Product = {
        id: '',
        name: '',
        image: '',
        description: '',
        category: '',
        price: 0,
        quantity: 0,
        rating: 0,
        inventoryStatus: 'INSTOCK'
    };




    const [products, setProducts] = useState(null);
    const [productDialog, setProductDialog] = useState(false);
    const [deleteProductDialog, setDeleteProductDialog] = useState(false);
    const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
    const [product, setProduct] = useState<Demo.Product>(emptyProduct);
    const [selectedProducts, setSelectedProducts] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState('');
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<any>>(null);
    const router=useRouter()






    const formatCurrency = (value: number) => {
        return value.toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD'
        });
    };

    const goBack = () => {
       router.back()
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

    const saveProduct = () => {
        setSubmitted(true);

        if (product.name.trim()) {
            let _products = [...(products as any)];
            let _product = { ...product };
            if (product.id) {
                const index = findIndexById(product.id);

                _products[index] = _product;
                toast.current?.show({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Product Updated',
                    life: 3000
                });
            } else {
                _product.id = createId();
                _product.image = 'product-placeholder.svg';
                _products.push(_product);
                toast.current?.show({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Product Created',
                    life: 3000
                });
            }

            setProducts(_products as any);
            setProductDialog(false);
            setProduct(emptyProduct);
        }
    };

    const editProduct = (product: Demo.Product) => {
        setProduct({ ...product });
        setProductDialog(true);
    };

    const confirmDeleteProduct = (product: Demo.Product) => {
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

    const onCategoryChange = (e: RadioButtonChangeEvent) => {
        let _product = { ...product };
        _product['category'] = e.value;
        setProduct(_product);
    };

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, name: string) => {
        const val = (e.target && e.target.value) || '';
        let _product = { ...product };
        _product[`${name}`] = val;

        setProduct(_product);
    };

    const onInputNumberChange = (e: InputNumberValueChangeEvent, name: string) => {
        const val = e.value || 0;
        let _product = { ...product };
        _product[`${name}`] = val;

        setProduct(_product);
    };

    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="Back" icon="pi pi-arrow-left" severity="success" className=" mr-2" onClick={goBack} />
                </div>
            </React.Fragment>
        );
    };

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <h4>Translation Manager</h4>
                </div>
            </React.Fragment>
        );
    };







    return (
        <div className="grid crud-demo">
      <div className="col-12">
        <div className="card">
          <Toast ref={toast} />
          <Toolbar className="mb-4" right={rightToolbarTemplate}  left={leftToolbarTemplate}></Toolbar>
            <div className="col-12" >
              <div className="card">
                <div className="p-fluid formgrid grid">

                  <div className="field col-12 md:col-4">
                    <label htmlFor={`dashboard_title`}><strong>Dashboard Title:</strong></label>
                    <InputText
                      id={`dashboard_title`}
                    />
                  </div>
                  <div className="field col-12 md:col-4">
                    <label htmlFor={`dashboard_title`}><strong>Header POS Title:</strong></label>
                    <InputText
                      id={`dashboard_title`}
                    />
                  </div>
                  <div className="field col-12 md:col-4">
                    <label htmlFor={`dashboard_title`}><strong>Header profile menu profile label :</strong></label>
                    <InputText
                      id={`dashboard_title`}
                    />
                  </div>
                  <div className="field col-12 md:col-4">
                    <label htmlFor={`dashboard_title`}><strong>Header profile menu change password label :</strong></label>
                    <InputText
                      id={`dashboard_title`}
                    />
                  </div>
                  <div className="field col-12 md:col-4">
                    <label htmlFor={`dashboard_title`}><strong>Header profile menu logout label :</strong></label>
                    <InputText
                      id={`dashboard_title`}
                    />
                  </div>
                  <div className="field col-12 md:col-4">
                    <label htmlFor={`dashboard_title`}><strong>Product categories title </strong></label>
                    <InputText
                      id={`dashboard_title`}
                    />
                  </div>
                  <div className="field col-12 md:col-4">
                    <label htmlFor={`dashboard_title`}><strong>Expense categories title :</strong></label>
                    <InputText
                      id={`dashboard_title`}
                    />
                  </div>
                  <div className="field col-12 md:col-4">
                    <label htmlFor={`dashboard_title`}><strong>Dashboard salesReturn title :</strong></label>
                    <InputText
                      id={`dashboard_title`}
                    />
                  </div>
                  <div className="field col-12 md:col-4">
                    <label htmlFor={`dashboard_title`}><strong>Dashboard salesReturn title :</strong></label>
                    <InputText
                      id={`dashboard_title`}
                    />
                  </div>



                </div>


              </div>
            </div>

          {/* Add Form Button */}
          <div style={{ textAlign: "right", marginTop: "10px" }}>
            <Button label="Submit" icon="pi pi-check" className="ml-2" />
          </div>
        </div>
      </div>
    </div>
    );
};

export default Crud;
