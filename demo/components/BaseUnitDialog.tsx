import React from 'react';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { classNames } from 'primereact/utils';

interface BaseUnitDialogProps {
    visible: boolean;
    onHide: () => void;
    //onSave: (data: { name: string }) => void;
}

const BaseUnitDialog: React.FC<BaseUnitDialogProps> = ({ visible, onHide }) => {
    const [name, setName] = React.useState('');
    const [submitted, setSubmitted] = React.useState(false);

    // const saveHandler = () => {
    //     setSubmitted(true);
    //     if (name.trim()) {
    //         onSave({ name });
    //         onHide();
    //         setName('');
    //         setSubmitted(false);
    //     }
    // };

    return (
        <Dialog
            visible={visible}
            style={{ width: '450px' }}
            header="Add Base Units"
            modal
            className="p-fluid"
            onHide={onHide}
            footer={
                <>
                    <Button label="Cancel" icon="pi pi-times" text onClick={onHide} />
                    <Button label="Save" icon="pi pi-check" text  />
                </>
            }
        >
            <div className="field">
                <label htmlFor="name">Name</label>
                <InputText
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    autoFocus
                    className={classNames({ 'p-invalid': submitted && !name })}
                />
                {submitted && !name && <small className="p-invalid">Name is required.</small>}
            </div>
        </Dialog>
    );
};

export default BaseUnitDialog;
