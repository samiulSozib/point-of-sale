import React, { useState, useRef } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { FileUpload } from 'primereact/fileupload';
import { classNames } from 'primereact/utils';
import { Toast } from 'primereact/toast';

interface AddBrandDialogProps {
  visible: boolean;
  onHide: () => void;
  //onSave: (brand: { name: string; image: string }) => void;
}

const AddBrandDialog: React.FC<AddBrandDialogProps> = ({ visible, onHide }) => {
  const [brand, setBrand] = useState({ name: '', image: '' });
  const [submitted, setSubmitted] = useState(false);
  const toast = useRef<Toast>(null);

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    setBrand((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const onUpload = (e: any) => {
    const file = e.files[0];
    setBrand((prev) => ({ ...prev, image: file.name }));
    toast.current?.show({
      severity: 'info',
      summary: 'Success',
      detail: 'File Uploaded',
      life: 3000,
    });
  };

//   const saveBrand = () => {
//     setSubmitted(true);
//     if (brand.name.trim()) {
//       onSave(brand);
//       setBrand({ name: '', image: '' });
//       setSubmitted(false);
//       onHide();
//     }
//   };

  const footer = (
    <>
      <Button label="Cancel" icon="pi pi-times" text onClick={onHide} />
      <Button label="Save" icon="pi pi-check" text  />
    </>
  );

  return (
    <>
      <Toast ref={toast} />
      <Dialog
        visible={visible}
        style={{ width: '450px' }}
        header="Add Brand"
        modal
        footer={footer}
        onHide={onHide}
        className="p-fluid"
      >
        {brand.image && (
          <img
            src={`/demo/images/product/${brand.image}`}
            alt={brand.image}
            width="150"
            className="mt-0 mx-auto mb-5 block shadow-2"
          />
        )}
        <div className="field">
          <label htmlFor="name">Name</label>
          <InputText
            id="name"
            value={brand.name}
            onChange={(e) => onInputChange(e, 'name')}
            required
            autoFocus
            className={classNames({ 'p-invalid': submitted && !brand.name })}
          />
          {submitted && !brand.name && <small className="p-invalid">Name is required.</small>}
        </div>
        <FileUpload
          name="demo[]"
          url="/api/upload"
          accept="image/*"
          maxFileSize={1000000}
          onUpload={onUpload}
        />
      </Dialog>
    </>
  );
};

export default AddBrandDialog;
