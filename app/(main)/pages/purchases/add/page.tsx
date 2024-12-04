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
import { Calendar } from 'primereact/calendar';

/* @todo Used 'as any' for types here. Will fix in next version due to onSelectionChange event type issue. */
interface DropdownItem {
    name: string;
    code: string;
}
interface Supplier{
    id:number
    name:string
}
interface Dictionary{
    id:number
    name:string
}
interface Variation{
    id:number
    name:string[]
}

interface LocationType{
    id:number,
    name:string
}

interface LocationName{
    id:number
    name:string
}

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
    const [date, setDate] = useState(null);

    const [suppliers,setSuppliers]=useState<Supplier |null>(null)
    const supplierItems: Supplier[]= useMemo(
        ()=>[
            {id:1,name:"Supplier1"},
            {id:2,name:"Supplier2"},
        ],[]
    )

    const [dictionaries,setDictionaries]=useState<Dictionary |null>(null)
    const dictionaryItems: Dictionary[]= useMemo(
        ()=>[
            {id:1,name:"Dell latitude 8490"},
            {id:2,name:"Dell latitude 8490"}
        ],[]
    )

    const [variations,setVariations]=useState<Variation |null>(null)
    const variationItems: Variation[]= useMemo(
        ()=>[
            {id:1,name:["Red","16GB"]},
            {id:2,name:["Green","16GB"]},
        ],[]
    )

    const [locationTypes,setLocationTypes]=useState<LocationType | null>(null)
    const locationTypesItems: LocationType[]= useMemo(
        ()=>[
            {id:1,name:"Type1"},
            {id:2,name:"Type2"},
        ],[]
    )

    const [locationNames,setLocationNames]=useState<LocationName[]>([])
    const locationNamesItems: LocationName[]= useMemo(
        ()=>[
            {id:1,name:"Name1"},
            {id:2,name:"Name2"},
        ],[]
    )



    useEffect(() => {

    }, []);

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

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="Back" icon="pi pi-arrow-left" severity="success" className=" mr-2" onClick={goBack} />
                </div>
            </React.Fragment>
        );
    };



    return (
        <div className="grid crud-demo">
      <div className="col-12">
        <div className="card">
          <Toast ref={toast} />
          <Toolbar className="mb-4" right={leftToolbarTemplate}></Toolbar>

            <div className="col-12" >
              <div className="card">
                <div className="p-fluid formgrid grid">
                  {/* Date */}
                  <div className="field col-12 md:col-3">
                    <label htmlFor={`name`}>Date</label>
                    <Calendar value={date}  dateFormat="dd/mm/yy" />
                  </div>
                  {/* supplier */}
                  <div className="field col-12 md:col-3">
                    <label htmlFor={`supplier`}>Supplier</label>
                    <Dropdown
                      id={`supplier`}
                      options={supplierItems}
                      optionLabel="name"
                      placeholder="Select One"
                    />
                  </div>

                  {/* dictionary */}
                  <div className="field col-12 md:col-3">
                    <label htmlFor={`dictionary`}>Dictionary</label>
                    <Dropdown
                      id={`dictionary`}


                      options={dictionaryItems}
                      optionLabel="name"
                      placeholder="Select One"
                    />
                  </div>

                  {/* variation */}
                  <div className="field col-12 md:col-3">
                    <label htmlFor={`variation`}>Variations</label>
                    <Dropdown
                      id={`variation`}
                      options={variationItems}
                      optionLabel="name"
                      placeholder="Select One"
                    />
                  </div>




                </div>

                {/* stock lists */}
                <div style={{textAlign:'center',margin:"10px"}}>
                    <p>List of stocks</p>
                </div>
                {/* stock lists */}

                <div className='p-fluid formgrid grid'>
                    {/* expire Date */}
                    <div className="field col-12 md:col-4">
                    <label htmlFor={`name`}>Expire Date</label>
                    <Calendar value={date}  dateFormat="dd/mm/yy" />
                    </div>
                    {/* Location Type */}
                    <div className="field col-12 md:col-4">
                    <label htmlFor={`supplier`}>Location Type</label>
                    <Dropdown
                      id={`location_type`}
                      options={locationTypesItems}
                      optionLabel="name"
                      placeholder="Select One"
                    />
                    </div>
                    {/* Location name */}
                    <div className="field col-12 md:col-4">
                    <label htmlFor={`location_name`}>Location Name</label>
                    <Dropdown
                      id={`location_name`}
                      options={locationNamesItems}
                      optionLabel="name"
                      placeholder="Select One"
                    />
                    </div>
                </div>


                   {/* others */}
                <div className="field col-12 md:col-12" style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <div style={{ width: '100%', maxWidth: '400px',border:'1px solid' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <tbody>
                                    <tr>
                                        <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>Order Tax</td>
                                        <td style={{ padding: '8px', borderBottom: '1px solid #ddd', textAlign: 'right' }}>12.0%</td>
                                    </tr>
                                    <tr>
                                        <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>Discount</td>
                                        <td style={{ padding: '8px', borderBottom: '1px solid #ddd', textAlign: 'right' }}>0.00 ৳</td>
                                    </tr>
                                    <tr>
                                        <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>Shipping</td>
                                        <td style={{ padding: '8px', borderBottom: '1px solid #ddd', textAlign: 'right' }}>0.00 ৳</td>
                                    </tr>
                                    <tr>
                                        <td style={{ padding: '8px', fontWeight: 'bold', color: 'blue' }}>Grand Total</td>
                                        <td style={{ padding: '8px', textAlign: 'right', fontWeight: 'bold', color: 'blue' }}>0.00 ৳</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                </div>

                <div className='p-fluid formgrid grid'>
                    {/* Order tax */}
                    <div className="field col-12 md:col-3">
                    <label htmlFor={`order_tax`}>Order Tax</label>
                        <div className="p-inputgroup">
                            <InputText placeholder="Tax" type='number'/>
                            <span className="p-inputgroup-addon">%</span>
                        </div>
                    </div>

                    {/* Order tax */}
                    <div className="field col-12 md:col-3">
                    <label htmlFor={`discount`}>Discount</label>
                        <div className="p-inputgroup">
                            <InputText placeholder="Discount" type='number'/>
                            <span className="p-inputgroup-addon">$</span>
                        </div>
                    </div>

                    {/* Shipping */}
                    <div className="field col-12 md:col-3">
                    <label htmlFor={`shipping`}>Shipping</label>
                        <div className="p-inputgroup">
                            <InputText placeholder="Shipping" type='number'/>
                            <span className="p-inputgroup-addon">$</span>
                        </div>
                    </div>

                    {/* Note */}
                    <div className="field col-12 md:col-3">
                    <label htmlFor={`note`}>Note</label>
                        <InputTextarea
                            placeholder="Your Message"
                            rows={1}
                            cols={30}
                        />
                    </div>

                </div>

                <div className='p-fluid formgrid grid'>




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
