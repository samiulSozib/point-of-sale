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
    memory: string;
    ram: string;
    color: string;
    supplier: number;
    currency: string;
    cost: number;
    stock:number,
    stock_alert:number,
    quantity:number,
    order_tax:number,
    tax_type:string,
    expire_date:string,
    location:number,
    location2:number,
    partition:number
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
            memory: "",
            ram: "",
            color: "",
            supplier: 1,
            currency: "BDT",
            cost: 45.01,
            stock:1000,
            stock_alert:100,
            quantity:1000,
            order_tax:10.2,
            tax_type:"type",
            expire_date:"20-12-2024",
            location:4,
            location2:2,
            partition:1
        },
      ]);



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

    const [selectedVariations, setSelectedVariations] = useState([
        { name: "Storage"},
        { name: "Color" }
    ]);

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

const addForm = () => {
    const newForm: FormField = {
        id: forms.length + 1,
        memory: "",
        ram: "",
        color: "",
        supplier: 2,
        currency: "BDT",
        cost: 45.01,
        stock:1000,
        stock_alert:100,
        quantity:1000,
        order_tax:10.2,
        tax_type:"type",
        expire_date:"20-12-2024",
        location:4,
        location2:2,
        partition:1

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


    return (
        <div className="grid crud-demo">
      <div className="col-12">
        <div className="card">
          <Toast ref={toast} />
          <Toolbar className="mb-4" right={leftToolbarTemplate}></Toolbar>
          <div className="col-12">
              <div className="card">
                <div className="p-fluid formgrid grid">
                  {/* Name */}
                  <div className="field col-12 md:col-3">
                    <label htmlFor={`name`}>Name</label>
                    <InputText
                      id={`name`}
                        value='Dell latitude 8490'
                        disabled

                    />
                  </div>
                  {/* Category */}
                  <div className="field col-12 md:col-3">
                    <label htmlFor={`category`}>Category</label>
                    <Dropdown
                      id={`category`}
                      options={categoryItems}
                      optionLabel="name"
                      placeholder="Category"
                      disabled
                    />
                  </div>
                  {/* Brand */}
                  <div className="field col-12 md:col-3">
                    <label htmlFor={`brand`}>Brand</label>
                    <Dropdown
                      id={`brand`}

                      options={brandItems}
                      optionLabel="name"
                      placeholder="Dell"
                      disabled
                    />
                  </div>
                  {/* Base Unit */}
                  <div className="field col-12 md:col-3">
                    <label htmlFor={`base_unit`}>Base Unit</label>
                    <Dropdown
                      id={`base_unit`}

                      options={baseUnitItems}
                      optionLabel="name"
                      placeholder="Piece"
                      disabled
                    />
                  </div>
                  {/* Variation */}
                  <div className="field col-12 md:col-3">
                    <label htmlFor={`variation`}>Variation</label>
                    <MultiSelect
                      id={`variation`}
                    value={selectedVariations}
                      options={variationItems}
                      optionLabel="name"
                      display="chip"
                      placeholder="Select Variation"
                      maxSelectedLabels={3}
                      disabled
                    />
                  </div>

                  <div className="field col-12 md:col-3">
                    <label htmlFor={`description`}>Description</label>
                    <InputTextarea
                      id={`description`}
                      rows={2}
                      value="this is description"
                      disabled
                    />
                  </div>



                </div>

              </div>
            </div>
          {forms.map((form,index) => (
            <div className="col-12" key={form.id}>
              <div className="card">
                <div className="p-fluid formgrid grid">
                  {/* Memory */}
                  <div className="field col-12 md:col-3">
                    <label htmlFor={`memory-${form.id}`}>Memory</label>
                    <InputText
                      id={`memory-${form.id}`}
                      value={form.memory}
                      onChange={(e) =>
                        handleInputChange(form.id, "memory", e.target.value)
                      }
                    />
                  </div>
                  {/* Ram */}
                  <div className="field col-12 md:col-3">
                    <label htmlFor={`ram-${form.id}`}>Ram</label>
                    <InputText
                      id={`ram-${form.id}`}
                      value={form.ram}
                      onChange={(e) =>
                        handleInputChange(form.id, "ram", e.target.value)
                      }
                    />
                  </div>
                  {/* Supplier */}
                  <div className="field col-12 md:col-3">
                    <label htmlFor={`supplier-${form.id}`}>Supplier</label>
                    <div className="flex align-items-center">
                        <Dropdown
                        id={`supplier-${form.id}`}
                        value={form.supplier}
                        onChange={(e: DropdownChangeEvent) =>
                            handleInputChange(form.id, "supplier", e.value)
                        }
                        options={categoryItems}
                        optionLabel="name"
                        placeholder="Select One"
                        className="flex-grow-1"
                        />
                        <Button style={{ width: '3rem', height: '3rem', marginLeft:"5px" }} icon="pi pi-plus" severity="success" aria-label="Search" />

                    </div>
                  </div>
                  {/* Currency */}
                  <div className="field col-12 md:col-3">
                    <label htmlFor={`currency-${form.id}`}>Currency</label>
                    <div className="flex align-items-center">
                    <Dropdown
                      id={`currency-${form.id}`}
                      value={form.currency}
                      onChange={(e: DropdownChangeEvent) =>
                        handleInputChange(form.id, "currency", e.value)
                      }
                      options={categoryItems}
                      optionLabel="name"
                      placeholder="Select One"
                      className="flex-grow-1"
                      />
                      <Button style={{ width: '3rem', height: '3rem', marginLeft:"5px" }} icon="pi pi-plus" severity="success" aria-label="Search" />

                  </div>
                  </div>
                  {/* Cost */}
                  <div className="field col-12 md:col-3">
                    <label htmlFor={`cost-${form.id}`}>Cost</label>
                    <InputText
                      id={`cost-${form.id}`}
                      type='number'
                      value={form.cost.toString()}
                      onChange={(e) =>
                        handleInputChange(form.id, "cost", e.target.value)
                      }
                    />
                  </div>

                  {/* Stock */}
                  <div className="field col-12 md:col-3">
                    <label htmlFor={`stock-${form.id}`}>Stock</label>
                    <InputText
                      id={`stock-${form.id}`}
                      type='number'
                      value={form.stock.toString()}
                      onChange={(e) =>
                        handleInputChange(form.id, "stock", e.target.value)
                      }
                    />
                  </div>

                  {/* Stock alert */}
                  <div className="field col-12 md:col-3">
                    <label htmlFor={`stock_alert-${form.id}`}>Stock Alert</label>
                    <InputText
                      id={`stock_alert-${form.id}`}
                      type='number'
                      value={form.stock_alert.toString()}
                      onChange={(e) =>
                        handleInputChange(form.id, "stock_alert", e.target.value)
                      }
                    />
                  </div>

                  {/* Quantity */}
                  <div className="field col-12 md:col-3">
                    <label htmlFor={`quantity-${form.id}`}>Quantity</label>
                    <InputText
                      id={`quantity-${form.id}`}
                      type='number'
                      value={form.quantity.toString()}
                      onChange={(e) =>
                        handleInputChange(form.id, "quantity", e.target.value)
                      }
                    />
                  </div>

                  {/* Order tax */}
                  <div className="field col-12 md:col-3">
                    <label htmlFor={`order_tax-${form.id}`}>Order Tax</label>
                    <InputText
                      id={`order_tax-${form.id}`}
                      type='number'
                      value={form.order_tax.toString()}
                      onChange={(e) =>
                        handleInputChange(form.id, "order_tax", e.target.value)
                      }
                    />
                  </div>

                  {/* Tax type */}
                  <div className="field col-12 md:col-3">
                    <label htmlFor={`tax_type-${form.id}`}>Tax Type</label>
                    <div className="flex align-items-center">
                    <Dropdown
                      id={`tax_type-${form.id}`}
                      value={form.tax_type}
                      onChange={(e: DropdownChangeEvent) =>
                        handleInputChange(form.id, "tax_type", e.value)
                      }
                      options={categoryItems}
                      optionLabel="name"
                      placeholder="Select One"
                      className="flex-grow-1"
                      />
                      <Button style={{ width: '3rem', height: '3rem', marginLeft:"5px" }} icon="pi pi-plus" severity="success" aria-label="Search" />

                  </div>
                  </div>
                    {/* Location */}
                    <div className="field col-12 md:col-3">
                        <label htmlFor={`location-${form.id}`}>Location</label>
                        <div className="flex align-items-center">
                        <Dropdown
                        id={`location-${form.id}`}
                        value={form.location}
                        onChange={(e: DropdownChangeEvent) =>
                            handleInputChange(form.id, "location", e.value)
                        }
                        options={categoryItems}
                        optionLabel="name"
                        placeholder="Select One"
                        className="flex-grow-1"
                        />
                        <Button style={{ width: '3rem', height: '3rem', marginLeft:"5px" }} icon="pi pi-plus" severity="success" aria-label="Search" />

                    </div>
                  </div>

                  {/* Location1 */}
                  <div className="field col-12 md:col-3">
                    <label htmlFor={`location2-${form.id}`}>Location 2</label>
                    <div className="flex align-items-center">
                    <Dropdown
                    id={`location2-${form.id}`}
                    value={form.location2}
                    onChange={(e: DropdownChangeEvent) =>
                        handleInputChange(form.id, "location2", e.value)
                    }
                    options={categoryItems}
                    optionLabel="name"
                    placeholder="Select One"
                    className="flex-grow-1"
                    />
                    <Button style={{ width: '3rem', height: '3rem', marginLeft:"5px" }} icon="pi pi-plus" severity="success" aria-label="Search" />

                </div>
                  </div>

                  {/* Partition */}
                  <div className="field col-12 md:col-3">
                    <label htmlFor={`partition-${form.id}`}>Partition</label>
                    <div className="flex align-items-center">
                    <Dropdown
                    id={`Partition-${form.id}`}
                    value={form.partition}
                    onChange={(e: DropdownChangeEvent) =>
                        handleInputChange(form.id, "partition", e.value)
                    }
                    options={categoryItems}
                    optionLabel="name"
                    placeholder="Select One"
                    className="flex-grow-1"
                        />
                        <Button style={{ width: '3rem', height: '3rem', marginLeft:"5px" }} icon="pi pi-plus" severity="success" aria-label="Search" />

                    </div>
                  </div>

                  {/* Partition */}
                  <div className="field col-12 md:col-3">
                    <label htmlFor={`date-${form.id}`}>Date</label>
                    <Calendar value={date}  dateFormat="dd/mm/yy" />

                  </div>

                  </div>
                {/* Remove Form Button */}
                {index===0?(
                    <div></div>
                ):(
                    <div className="col-auto" style={{ textAlign: "right" }}>
                    <Button
                        icon="pi pi-trash"
                        className="p-button-rounded p-button-danger p-button-sm"
                        onClick={() => removeForm(form.id)}
                        style={{
                            top: "10px",
                            right: "10px",
                        }}
                    />
                </div>
                )}


            </div>
            </div>
          ))}
          {/* Add Form Button */}
          <div style={{ textAlign: "right", marginTop: "10px" }}>
            <Button label="Add Form" icon="pi pi-plus" onClick={addForm} />
            <Button label="Submit" icon="pi pi-check" className="ml-2" />
          </div>
        </div>
      </div>
    </div>
    );
};

export default Crud;
