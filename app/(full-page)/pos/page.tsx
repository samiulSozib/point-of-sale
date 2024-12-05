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
import { ProductService } from '../../../demo/service/ProductService';
import { Demo } from '@/types';
import { useRouter } from 'next/navigation';
import { Menu } from 'primereact/menu';
import { Dropdown } from 'primereact/dropdown';
import { DataView, DataViewLayoutOptions } from 'primereact/dataview';

/* @todo Used 'as any' for types here. Will fix in next version due to onSelectionChange event type issue. */
interface Dictionary{
    id:number,
    name:string,
    category:string,
    brand:string,
    base_unit:string,
    variations:string[],
    image:string
}
interface ColumnMeta {
    field: string;
    header: string;
}
interface SelectedProduct extends Demo.Product {
    quantity: number;
    subtotal: number;
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

    const [dictionary,setDictionary]=useState<Dictionary[]>([])
    const [products, setProducts] = useState(null);
    const [productDialog, setProductDialog] = useState(false);
    const [deleteProductDialog, setDeleteProductDialog] = useState(false);
    const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
    const [product, setProduct] = useState<Demo.Product>(emptyProduct);
    const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>([]);
    const [selectedDictionary,setSelectedDictionary]=useState<Dictionary[]>([])
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState('');
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<any>>(null);
    const router=useRouter()
    const menu = useRef<Menu>(null);
    const [layout, setLayout] = useState<'grid' | 'list' | (string & Record<string, unknown>)>('grid');
    const [filteredValue, setFilteredValue] = useState<Demo.Product[] | null>(null);
    const [dataViewValue, setDataViewValue] = useState<Demo.Product[]>([]);
    const [sortOrder, setSortOrder] = useState<0 | 1 | -1 | null>(null);
    const [sortField, setSortField] = useState('');
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [discount, setDiscount] = useState(0);
    const [shippingCost, setShippingCost] = useState(0); // Shipping cost




    const [selectedOption, setSelectedOption] = React.useState(null);
    const dropdownOptions = [
        { label: 'Option 1', value: 'option1' },
        { label: 'Option 2', value: 'option2' },
        { label: 'Option 3', value: 'option3' },
    ];

    useEffect(() => {
        ProductService.getProducts1().then((data) => setDataViewValue(data));
    }, []);

    useEffect(()=>{
        console.log(selectedProducts)
    },[selectedProducts])

    const formatCurrency = (value: number) => {
        return value.toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD'
        });
    };

    const openNew = () => {
        //router.push(`/pages/dictionary/add`)
        //setProduct(emptyProduct);
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
        // setProduct({ ...product });
        // setProductDialog(true);
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

    // const deleteSelectedProducts = () => {
    //     let _products = (products as any)?.filter((val: any) => !(selectedProducts as any)?.includes(val));
    //     setProducts(_products);
    //     setDeleteProductsDialog(false);
    //     setSelectedProducts(null);
    //     toast.current?.show({
    //         severity: 'success',
    //         summary: 'Successful',
    //         detail: 'Products Deleted',
    //         life: 3000
    //     });
    // };

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

    const onFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setGlobalFilterValue(value);
        if (value.length === 0) {
            setFilteredValue(null);
        } else {
            const filtered = dataViewValue?.filter((product) => {
                const productNameLowercase = product.name.toLowerCase();
                const searchValueLowercase = value.toLowerCase();
                return productNameLowercase.includes(searchValueLowercase);
            });

            setFilteredValue(filtered);
        }
    };

    const firstLeftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-1 p-inputgroup" >
                    <span className="p-inputgroup-addon">
                        <i className="pi pi-search"></i>
                    </span>
                    <InputText placeholder="Search" style={{maxWidth:"150px"}}/>
                    <span className="p-inputgroup-addon" onClick={openNew}><i className='pi pi-user-plus'></i></span>
                </div>
            </React.Fragment>
        );
    };

    const firstRightToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-1">
                    <Dropdown
                        value={selectedOption}
                        options={dropdownOptions}
                        onChange={(e) => setSelectedOption(e.value)}
                        placeholder="Location"
                        className="p-dropdown-sm"
                        style={{ minWidth: '120px' }}
                    />
                </div>
            </React.Fragment>
        );
    };

    const secondLeftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-1 p-inputgroup" >
                    <span className="p-inputgroup-addon">
                        <i className="pi pi-search"></i>
                    </span>
                    <InputText value={globalFilterValue} onChange={onFilter}  placeholder="Search Product" style={{maxWidth:"3000px"}}/>
                </div>
            </React.Fragment>
        );
    };

    const secondRightToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-1 p-inputgroup" >
                <DataViewLayoutOptions layout={layout} onChange={(e) => setLayout(e.value)} />
                </div>
            </React.Fragment>
        );
    };



    const dataviewListItem = (data: Demo.Product) => {
        const handleProductClick = () => {
            // Check if the product is already selected
            const isSelected = selectedProducts.some((item) => item.id === data.id);

            if (!isSelected) {
                const updatedProduct: SelectedProduct = {
                    ...data,
                    quantity: 1,
                    subtotal: data.price?data.price*1:0,
                };

                setSelectedProducts((prevSelected) => [...prevSelected, updatedProduct]);
            }
        };
        return (
            <div className="col-12 product-card" style={{ cursor: "pointer" }} onClick={handleProductClick}>
            <div className="flex flex-column md:flex-row align-items-center p-3 w-full">
                {/* Product Image */}
                <img
                    src={`/demo/images/product/${data.image}`}
                    alt={data.name}
                    className="product-image my-3 md:my-0 shadow-2 mr-3"
                    style={{ maxWidth: '80px' }}
                />

                {/* Product Details */}
                <div className="flex-1 flex flex-column align-items-center text-center md:text-left">
                    <h3 className="product-name font-bold text-lg mb-2" style={{ fontSize: '1rem' }}>
                        {data.name}
                    </h3>
                    <p className="product-description mb-1" style={{ fontSize: '0.85rem' }}>
                        {data.description}
                    </p>
                    <Rating
                        value={data.rating}
                        readOnly
                        cancel={false}
                        className="product-rating mb-1"
                        style={{ fontSize: '0.85rem' }}
                    />
                    <div className="product-category flex align-items-center">
                        <i className="pi pi-tag mr-1" style={{ fontSize: '0.8rem' }}></i>
                        <span className="font-semibold" style={{ fontSize: '0.85rem' }}>
                            {data.category}
                        </span>
                    </div>
                </div>

                {/* Pricing and Actions */}
                <div className="flex flex-row md:flex-column justify-content-between w-full md:w-auto align-items-center md:align-items-end mt-3 md:mt-0">
                    {/* Price */}
                    <span
                        className="product-price text-xl font-semibold mb-1 align-self-center md:align-self-end"
                        style={{ fontSize: '1rem' }}
                    >
                        ${data.price}
                    </span>

                    {/* Add to Cart Button */}
                    <Button
                        icon="pi pi-shopping-cart"
                        label="Add"
                        disabled={data.inventoryStatus === 'OUTOFSTOCK'}
                        size="small"
                        className="add-to-cart-button mb-1 p-button-sm"
                        style={{ fontSize: '0.85rem', padding: '0.25rem 0.5rem' }}
                    />

                    {/* Inventory Status */}
                    <span
                        className={`product-badge status-${data.inventoryStatus?.toLowerCase()}`}
                        style={{ fontSize: '0.75rem', padding: '0.2rem 0.4rem' }}
                    >
                        {data.inventoryStatus}
                    </span>
                </div>
            </div>
        </div>

        );
    };




    const dataviewGridItem = (data: Demo.Product) => {
        const handleProductClick = () => {
            // Check if the product is already selected
            const isSelected = selectedProducts.some((item) => item.id === data.id);

            if (!isSelected) {
                const updatedProduct: SelectedProduct = {
                    ...data,
                    quantity: 1,
                    subtotal: data.price?data.price*1:0,
                };

                setSelectedProducts((prevSelected) => [...prevSelected, updatedProduct]);
            }
        };
        return (
            <div className="col-12 md:col-6 lg:col-3" style={{cursor:"pointer"}} onClick={handleProductClick}>
                <div className="card m-2 border-1 surface-border" style={{ padding: '0.5rem' }}>
                    {/* Header Section */}
                    <div className="flex flex-wrap gap-1 align-items-center justify-content-between mb-2">
                        <div className="flex align-items-center">
                            <i className="pi pi-tag mr-1" style={{ fontSize: '0.85rem' }} />
                            <span className="font-semibold" style={{ fontSize: '0.9rem' }}>
                                {data.category}
                            </span>
                        </div>
                        <span
                            className={`product-badge status-${data.inventoryStatus?.toLowerCase()}`}
                            style={{ fontSize: '0.8rem', padding: '0.25rem 0.5rem' }}
                        >
                            {data.inventoryStatus}
                        </span>
                    </div>
                    {/* Image and Product Details Section */}
                    <div className="flex flex-column align-items-center text-center mb-2">
                        <img
                            src={`/demo/images/product/${data.image}`}
                            alt={data.name}
                            className="w-8 shadow-2 my-2 mx-0"
                            style={{ maxWidth: '100px' }}
                        />
                        <div className="text-xl font-bold" style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>
                            {data.name}
                        </div>
                        <div style={{ fontSize: '0.85rem', marginBottom: '0.5rem' }}>{data.description}</div>
                        <Rating
                            value={data.rating}
                            readOnly
                            cancel={false}
                            style={{ fontSize: '0.85rem' }}
                        />
                    </div>
                    {/* Footer Section */}
                    <div className="flex align-items-center justify-content-between">
                        <span className="text-xl font-semibold" style={{ fontSize: '1rem' }}>
                            ${data.price}
                        </span>
                        <Button
                            icon="pi pi-shopping-cart"
                            disabled={data.inventoryStatus === 'OUTOFSTOCK'}
                            style={{ fontSize: '0.85rem', padding: '0.25rem 0.5rem' }}
                            className="p-button-sm"
                        />
                    </div>
                </div>
            </div>
        );
    };


    const itemTemplate = (data: Demo.Product, layout: 'grid' | 'list' | (string & Record<string, unknown>)) => {
        if (!data) {
            return;
        }

        if (layout === 'list') {
            return dataviewListItem(data);
        } else if (layout === 'grid') {
            return dataviewGridItem(data);
        }
    };




    const productDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" text onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" text onClick={saveProduct} />
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
        </>
    );

    const columns: ColumnMeta[] = [
        {field: 'name', header: 'Name'},
        {field: 'quantity', header: 'Quantity'},
        {field: 'price', header: 'Price'},
        {field:'subtotal',header:'Subtotal'},
        { field: 'delete', header: '' },
    ];

    const handleDeleteProduct = (id: string): void => {
        const updatedProducts = selectedProducts.filter((product) => product.id !== id);
        setSelectedProducts(updatedProducts);
      };

      const totalAmount = selectedProducts.reduce(
        (total, product) => total + (product.price || 0) * (product.quantity || 1),
        0
    );

    const finalAmount = totalAmount - (totalAmount * discount) / 100 + shippingCost;

    const handleIncrement = (id: string) => {
        const updatedProducts = selectedProducts.map((product) =>
            product.id === id
                ? { ...product, quantity: product.quantity + 1 }
                : product
        );
        setSelectedProducts(updatedProducts); // Update state
    };

    const handleDecrement = (id: string) => {
        const updatedProducts = selectedProducts.map((product) =>
            product.id === id && product.quantity > 0 // Prevent negative quantities
                ? { ...product, quantity: product.quantity - 1 }
                : product
        );
        setSelectedProducts(updatedProducts); // Update state
    };



    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card" style={{margin:"-25px"}}>
                    <Toast ref={toast} />
                    <div className='flex'>
                        <div
                            className="card col-4"
                            style={{
                                height: "100vh", // Occupy the full viewport height
                                overflow: "hidden", // Prevent scrolling
                                position: "sticky", // Fix relative to the parent
                                top: 0, // Stick to the top
                                marginRight: "5px",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "space-between", // Push the total amount section to the bottom
                            }}
                        >
                            <div>
                                {/* Toolbar and DataTable */}
                                <Toolbar
                                    className="mb-4"
                                    right={firstRightToolbarTemplate}
                                    left={firstLeftToolbarTemplate}
                                ></Toolbar>
                                <DataTable value={selectedProducts}>
                                    {columns.map((col) =>
                                    col.field === 'quantity' ? (
                                        <Column
                                            key={col.field}
                                            header={col.header}
                                            body={(rowData: SelectedProduct) => (
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>

                                                    <Button size="small" icon="pi pi-minus" rounded severity="danger" onClick={() => {if(rowData.id){handleDecrement(rowData.id)}}}/>
                                                    <span>{rowData.quantity}</span>
                                                    <Button size="small" icon="pi pi-plus" rounded severity="success" onClick={() => {if(rowData.id){handleIncrement(rowData.id)}}}/>
                                                </div>
                                            )}
                                        />
                                    ):
                                        col.field === 'name' ? (
                                            <Column
                                                key={col.field}
                                                field={col.field}
                                                header={col.header}
                                                body={(rowData) => (
                                                    <span style={{ fontWeight: 'bold' }}>{rowData[col.field]}</span>
                                                )}
                                            />
                                        ) : col.field !== 'delete' ? (
                                            <Column key={col.field} field={col.field} header={col.header} />
                                        ) : (
                                            <Column
                                                key={col.field}
                                                header={col.header}
                                                body={(rowData: SelectedProduct) => (
                                                    <Button
                                                        icon="pi pi-trash"
                                                        className="p-button-danger p-button-text"
                                                        onClick={() => {
                                                            if (rowData.id) {
                                                                handleDeleteProduct(rowData.id);
                                                            }
                                                        }}
                                                    />
                                                )}
                                            />
                                        )
                                    )}
                                </DataTable>;
                            </div>

                            {/* Total Amount Section */}
                            <div
                                style={{
                                    display:"flex",
                                    justifyContent:"space-between",
                                    alignItems:"center",
                                    padding: "1rem",
                                    borderTop: "1px solid #ddd", // Optional divider for clarity
                                    backgroundColor: "#f9f9f9", // Light background for distinction
                                }}
                            >
                                <div>
                                    {/* Discount */}
                                    <div className="field">
                                        <label htmlFor="discount">Discount (%):</label>
                                        <InputNumber
                                            id="discount"
                                            value={discount}
                                            onValueChange={(e) => setDiscount(e.value || 0)}
                                            mode="decimal"
                                            min={0}
                                            max={100}
                                            showButtons
                                            suffix="%"
                                            style={{ width: "100%" }}
                                        />
                                    </div>

                                    {/* Shipping Cost */}
                                    <div className="field">
                                        <label htmlFor="shippingCost">Shipping Cost:</label>
                                        <InputNumber
                                            id="shippingCost"
                                            value={shippingCost}
                                            onValueChange={(e) => setShippingCost(e.value || 0)}
                                            mode="currency"
                                            currency="USD"
                                            locale="en-US"
                                            style={{ width: "100%" }}
                                        />
                                    </div>
                                </div>

                                <div>
                                    {/* Total Amount */}
                                    <div className="field">
                                        <label htmlFor="totalAmount">Total Amount:</label>
                                        <div className="flex align-items-center justify-content-between">
                                            <span
                                                style={{
                                                    fontWeight: "bold",
                                                    fontSize: "1.2rem",
                                                    color: "#333",
                                                }}
                                            >
                                                ${totalAmount.toFixed(2)}
                                            </span>
                                        </div>
                                    </div>



                                {/* Final Amount */}
                                <div className="field">
                                    <label htmlFor="finalAmount">Final Amount:</label>
                                    <div className="flex align-items-center justify-content-between">
                                        <span
                                            style={{
                                                fontWeight: "bold",
                                                fontSize: "1.2rem",
                                                color: "#28a745",
                                            }}
                                        >
                                            ${finalAmount.toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                                </div>


                            </div>
                        </div>




                        <div className=' card col-8' style={{
                            overflowY: "auto", // Enable vertical scrolling
                            maxHeight: "100vh", // Limit height to viewport
                        }}>
                        <div
                            style={{
                            position: "sticky", // Stick the toolbar
                            top: 0, // Stick to the top of this section
                            zIndex: 10, // Ensure it appears above content
                            backgroundColor: "white", // Add background to prevent overlap with content
                            }}
                        >
                            <Toolbar className="mb-4" left={secondLeftToolbarTemplate} right={secondRightToolbarTemplate}/>
                        </div>
                            <DataView value={filteredValue || dataViewValue} layout={layout} paginator rows={20} sortOrder={sortOrder} sortField={sortField} itemTemplate={itemTemplate} ></DataView>

                        </div>
                    </div>


                    <Dialog visible={productDialog} style={{ width: '450px' }} header="Add Customer" modal className="p-fluid" footer={productDialogFooter} onHide={hideDialog}>

                        <div className="formgrid grid">
                            <div className="field col-6">
                                <label htmlFor="name">Name</label>
                                <InputText
                                    id="name"
                                    required
                                />
                            </div>
                            <div className="field col-6">
                                <label htmlFor="email">Email</label>
                                <InputText
                                    id="email"
                                    required
                                />
                            </div>
                            <div className="field col-6">
                                <label htmlFor="phone">Phone</label>
                                <InputText
                                    id="phone"
                                    required
                                />
                            </div>
                            <div className="field col-6">
                                <label htmlFor="country">Country</label>
                                <InputText
                                    id="country"
                                    required
                                />
                            </div>
                            <div className="field col-6">
                                <label htmlFor="city">City</label>
                                <InputText
                                    id="city"
                                    required
                                />
                            </div>
                            <div className="field col-6">
                                <label htmlFor="address">Address</label>
                                <InputText
                                    id="address"
                                    required
                                />
                            </div>
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
