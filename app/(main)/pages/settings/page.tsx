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
import BaseUnitDialog from '@/demo/components/BaseUnitDialog';
import AddBrandDialog from '@/demo/components/AddBrandDialog';
import AddVariationDialog from '@/demo/components/AddVariationDialog';

/* @todo Used 'as any' for types here. Will fix in next version due to onSelectionChange event type issue. */
interface DropdownItem {
    name: string;
    code: string;
}
interface Category{
    name:string
}
interface Brand{
    name:string
}
interface Base_Unit{
    name:string
}
interface Variation{
    name:string
}
interface FormField {
    id: number;
    name: string;
    category: string | null;
    brand: string | null;
    baseUnit: string | null;
    variations: string[];
    description: string;
  }
  interface Currency{
    id:number,
    name:string,
    symbol:string
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

    const [forms, setForms] = useState<FormField[]>([
        {
          id: 1,
          name: "",
          category: null,
          brand: null,
          baseUnit: null,
          variations: [],
          description: "",
        },
      ]);



    const [products, setProducts] = useState(null);
    const [productDialog, setProductDialog] = useState(false);
    const [brandDialog,setBrandDialog]=useState(false)
    const [variationDialog,setVariationDialog]=useState(false)
    const [deleteProductDialog, setDeleteProductDialog] = useState(false);
    const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
    const [product, setProduct] = useState<Demo.Product>(emptyProduct);
    const [selectedProducts, setSelectedProducts] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState('');
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<any>>(null);
    const router=useRouter()

    const [categories,setCategories]=useState<Category |null>(null)
    const categoryItems: Category[]= useMemo(
        ()=>[
            {name:"Category1"},
            {name:"Category2"}
        ],[]
    )

    const [brands,setBrands]=useState<Brand |null>(null)
    const brandItems: Brand[]= useMemo(
        ()=>[
            {name:"Brand1"},
            {name:"Brand2"}
        ],[]
    )

    const [baseUnits,setBaseUnits]=useState<Base_Unit |null>(null)
    const baseUnitItems: Base_Unit[]= useMemo(
        ()=>[
            {name:"Kilogram"},
            {name:"Meter"}
        ],[]
    )

    const [variations,setVariations]=useState<Variation[] |null>(null)
    const variationItems: Variation[]= useMemo(
        ()=>[
            {name:"Storage"},
            {name:"Ram"},
            {name:"Color"}
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
                    <h4>System Settings</h4>
                </div>
            </React.Fragment>
        );
    };

const addForm = () => {
    const newForm: FormField = {
      id: forms.length + 1,
      name: "",
      category: null,
      brand: null,
      baseUnit: null,
      variations: [],
      description: "",
    };
    setForms([...forms, newForm]);

  };

  const removeForm = (id: number) => {
    setForms(forms.filter((form) => form.id !== id));

  };

  const handleInputChange = (id: number, field: keyof FormField, value: any) => {
    setForms(
      forms.map((form) =>
        form.id === id ? { ...form, [field]: value } : form
      )
    );
  };

  const handleAddBaseUnit=()=>{
    setProductDialog(true);
  }

  const handleBrandDialog=()=>{
    setBrandDialog(true)
  }

  const handleVariationDialog=()=>{
    setVariationDialog(true)
  }
  const hideVariationDialog=()=>{
    setVariationDialog(false)
  }

  const hideBaseUnitDialog = () => {
    setSubmitted(false);
    setProductDialog(false);
};

const hideBrandDialog=()=>{
    setBrandDialog(false)
}

 const [currencies,setCurrenceis]=useState<Currency |null>(null)
    const currencyItems: Currency[]= useMemo(
        ()=>[
            {id:1,name:"Dollar",symbol:"$"},
            {id:2,name:"Taka",symbol:"ট"},
        ],[]
    )


    return (
        <div className="grid crud-demo">
      <div className="col-12">
        <div className="card">
          <Toast ref={toast} />
          <Toolbar className="mb-4" right={rightToolbarTemplate} left={leftToolbarTemplate}></Toolbar>

            <div className="col-12" >
              <div className="card">
                <div className="p-fluid formgrid grid">
                <div className="field col-12 md:col-6">
                    <label htmlFor={`name}`}>Currency</label>
                    <Dropdown
                        options={currencyItems}
                        optionLabel="name"
                        placeholder="Select One"
                        className="flex-grow-1"
                    />
                  </div>

                  {/* Default email */}
                  <div className="field col-12 md:col-6">
                    <label htmlFor={`email`}>Email</label>
                    <InputText

                    />
                  </div>


                <div className="field col-12 md:col-6">
                    <label htmlFor={`email`}>Company Name</label>
                    <InputText

                    />
                </div>

                <div className="field col-12 md:col-6">
                    <label htmlFor={`email`}>Company Phone</label>
                    <InputText

                    />
                </div>

                <div className="field col-12 md:col-6">
                    <label htmlFor={`email`}>Developed By</label>
                    <InputText

                    />
                </div>

                <div className="field col-12 md:col-6">
                    <label htmlFor={`email`}>Footer</label>
                    <InputText

                    />
                </div>

                <div className="field col-12 md:col-6">
                    <label htmlFor={`email`}>Default Customer</label>
                    <InputText

                    />
                </div>

                <div className="field col-12 md:col-6">
                    <label htmlFor={`email`}>Default Location</label>
                    <InputText

                    />
                </div>

                <div className="field col-12 md:col-6">
                    <label htmlFor={`email`}>Country</label>
                    <Dropdown

                    />
                </div>

                <div className="field col-12 md:col-6">
                    <label htmlFor={`email`}>State</label>
                    <Dropdown

                    />
                </div>

                <div className="field col-12 md:col-6">
                    <label htmlFor={`email`}>City</label>
                    <Dropdown

                    />
                </div>

                <div className="field col-12 md:col-6">
                    <label htmlFor={`email`}>Postal Code</label>
                    <InputText

                    />
                </div>

                <div className="field col-12 md:col-6">
                    <label htmlFor={`email`}>Date Formate</label>
                    <Dropdown

                    />
                </div>

                <div className="field col-12 md:col-12">
                    <label htmlFor={`email`}>Address</label>
                    <InputTextarea autoResize   rows={5} cols={30} />

                </div>




                </div>
                <Button label="Submit" icon="pi pi-check" iconPos="right" />


              </div>
            </div>


        </div>
      </div>
    </div>
    );
};

export default Crud;
