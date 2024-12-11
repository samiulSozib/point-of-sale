import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';

interface AddVariationDialogProps {
    visible: boolean;
    onHide: () => void;
    //onSave: (name: string, variationTypes: string[]) => void;
}

const AddVariationDialog: React.FC<AddVariationDialogProps> = ({ visible, onHide }) => {
    const [brandName, setBrandName] = useState('');
    const [fields, setFields] = useState([{ id: Date.now(), value: '' }]);

    const addField = () => {
        setFields([...fields, { id: Date.now(), value: '' }]);
    };

    const removeField = (id: number) => {
        setFields(fields.filter((field) => field.id !== id));
    };

    const handleInputChange = (id: number, value: string) => {
        setFields(fields.map((field) => (field.id === id ? { ...field, value } : field)));
    };

    const saveHandler = () => {
        const variationTypes = fields.map((field) => field.value.trim()).filter((val) => val);
        if (brandName.trim() && variationTypes.length > 0) {
            //onSave(brandName, variationTypes);
            setBrandName('');
            setFields([{ id: Date.now(), value: '' }]);
        }
    };

    const dialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" text onClick={onHide} />
            <Button label="Save" icon="pi pi-check" text onClick={saveHandler} />
        </>
    );

    return (
        <Dialog visible={visible} style={{ width: '450px' }} header="Add Variation" modal footer={dialogFooter} onHide={onHide}>
            <div className="field">
                <label htmlFor="brandName">Variation Name: </label>
                <InputText
                    id="brandName"
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                    required
                    autoFocus
                    style={{marginLeft:"5px"}}
                />
            </div>
            <div>
                <label htmlFor="variationTypes">Variation Types</label>
                {fields.map((field, index) => (
                    <div
                        key={field.id}
                        style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem', marginTop: '1rem' }}
                    >
                        <InputText
                            value={field.value}
                            onChange={(e) => handleInputChange(field.id, e.target.value)}
                            style={{ flex: 1, marginRight: '1rem' }}
                        />
                        {index === 0 ? (
                            <Button icon="pi pi-plus" className="p-button-rounded p-button-icon-only" onClick={addField} />
                        ) : (
                            <Button
                                icon="pi pi-trash"
                                className="p-button-danger p-button-rounded p-button-icon-only"
                                onClick={() => removeField(field.id)}
                            />
                        )}
                    </div>
                ))}
            </div>
        </Dialog>
    );
};

export default AddVariationDialog;
