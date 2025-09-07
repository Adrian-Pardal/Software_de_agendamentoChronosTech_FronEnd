
'use client';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { FileUpload } from 'primereact/fileupload';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { classNames } from 'primereact/utils';
import React, { useEffect, useMemo, useRef, useState , useCallback } from 'react';
import { Agenda } from '@/types';
import { PerfilService } from '@/service/PerfilService';

const Perfil= () => {
    let perfilVazio: Agenda.Perfil = {
        id: undefined,
        descricao: '',
    };

    const [perfis, setPerfis] = useState<Agenda.Perfil[] | null>(null);
    const [perfilDialog, setPerfilDialog] = useState(false);
    const [deletePerfilDialog, setDeletePerfilDialog] = useState(false);
    const [deletePerfisDialog, setDeletePerfisDialog] = useState(false);
    const [perfil, setPerfil] = useState<Agenda.Perfil>(perfilVazio);
    const [selectedPerfis, setSelectedPerfis] = useState<Agenda.Perfil[]>([]);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState('');
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<any>>(null);
    const perfilService = useMemo(() => new PerfilService(), []);

    const loadPerfis = useCallback(() => {
            perfilService.listarTodos()
                .then(res => setPerfis(res.data))
                .catch(err => console.log(err));
        }, [perfilService]);

        useEffect(() => {
            loadPerfis();
        }, [loadPerfis]);
    // useEffect(() => {

    //     if(!perfis){
    //     perfilService.listarTodos()
    //         .then((response) =>{
    //             console.log(response.data);
    //             setPerfis(response.data);
    //         }).catch((error) =>{
    //             console.log(error);
    //         });
    //     }
    // }, [perfilService , perfis]);

    const openNew = () => {
        setPerfil(perfilVazio);
        setSubmitted(false);
        setPerfilDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setPerfilDialog(false);
    };

    const hideDeletePerfilDialog = () => {
        setDeletePerfilDialog(false);
    };

    const hideDeletePerfisDialog = () => {
        setDeletePerfisDialog(false);
    };

    const savePerfil = () => {
        setSubmitted(true);

        if(!perfil.id){
            perfilService.inserir(perfil)
                .then((response)=>{
                    setPerfilDialog(false);
                    setPerfil(perfilVazio);
                    setPerfis([]);
                    loadPerfis();
                    toast.current?.show({
                        severity: 'info',
                        summary: 'Sucesso!',
                        detail:'Perfil cadastrado com sucesso!!'
                    })

                })
                .catch((error)=>{
                    console.log(error.response?.data);
                    toast.current?.show({
                        severity: 'error',
                        summary: 'Error!',
                        detail:'Error ao salvar!' + (error.response?.data?.message || 'Tente novamente')
                    })
                })
        }else{
            perfilService.alterar(perfil)
                .then((response)=>{
                    setPerfilDialog(false);
                    setPerfil(perfilVazio);
                    setPerfis([]);
                    loadPerfis();
                    toast.current?.show({
                        severity: 'info',
                        summary: 'Sucesso!',
                        detail:'Perfil alterado com sucesso!!'
                    })
                })
                .catch((error)=>{
                    console.log(error.response?.data);
                    toast.current?.show({
                        severity: 'error',
                        summary: 'Error!',
                        detail:'Error ao alterar!' + (error.response?.data?.message || 'Tente novamente')
                    })
                })
        }
    };

    const editPerfil = (perfil: Agenda.Perfil) => {
        setPerfil({ ...perfil });
        setPerfilDialog(true);
    };

    const confirmDeletePerfil = (perfil: Agenda.Perfil) => {
        setPerfil(perfil);
        setDeletePerfilDialog(true);
    };

    const deletePerfil = () => {
        if(perfil.id){
            perfilService.excluir(perfil.id)
                .then((response)=>{
                    setPerfil(perfilVazio);
                    setDeletePerfilDialog(false)
                    setPerfis([]);
                    loadPerfis();
                    toast.current?.show({
                        severity: 'success',
                        summary: 'Sucesso!',
                        detail: 'Perfil Deletado com Sucesso!',
                        life: 3000
                    });
                })
                .catch((error)=>{
                    toast.current?.show({
                        severity: 'error',
                        summary: 'Error!',
                        detail: 'Error ao deletar o perfil!',
                        life: 3000
                    });

                })
            }
    };

    const exportCSV = () => {
        dt.current?.exportCSV();
    };

    const confirmDeleteSelected = () => {
        setPerfil(perfil);
        setDeletePerfisDialog(true);
    };

    const deleteSelectedPerfis = () => {

        Promise.all(selectedPerfis.map(async(_perfil) => {
            if(_perfil.id){
                await perfilService.excluir(_perfil.id)
            }
        })).then((response) =>{
            setPerfis(null);
            setSelectedPerfis([]);
            setDeletePerfisDialog(false);
            loadPerfis();
            toast.current?.show({
                    severity: 'success',
                    summary: 'Sucesso!',
                    detail: 'Perfis Deletado com Sucesso!',
                    life: 3000
                });
        }).catch((error)=>{
            toast.current?.show({
                    severity: 'error',
                    summary: 'Error!',
                    detail: 'Error ao deletar o perfis!',
                    life: 3000
                });
        })
    };

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, name: string) => {
        const val = (e.target && e.target.value) || '';
        setPerfil(prevPerfil =>({
            ...prevPerfil,
            [name]: val,
        }));
    };

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="Novo" icon="pi pi-plus" severity="success" className=" mr-2" onClick={openNew} />
                    <Button label="Excluir" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedPerfis || !(selectedPerfis as any).length} />
                </div>
            </React.Fragment>
        );
    };

    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                <FileUpload mode="basic" accept="image/*" maxFileSize={1000000} chooseLabel="Import" className="mr-2 inline-block" />
                <Button label="Export" icon="pi pi-upload" severity="help" onClick={exportCSV} />
            </React.Fragment>
        );
    };

    const idBodyTemplate = (rowData: Agenda.Perfil) => {
        return (
            <>
                <span className="p-column-title">Identificador</span>
                {rowData.id}
            </>
        );
    };

    const descricaoBodyTemplate = (rowData: Agenda.Perfil) => {
        return (
            <>
                <span className="p-column-title">Descrição</span>
                {rowData.descricao}
            </>
        );
    };


    const actionBodyTemplate = (rowData: Agenda.Perfil) => {
        return (
            <>
                <Button icon="pi pi-pencil" rounded severity="success" className="mr-2" onClick={() => editPerfil(rowData)} />
                <Button icon="pi pi-trash" rounded severity="warning" onClick={() => confirmDeletePerfil(rowData)} />
            </>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Gerenciamento de Recursos</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.currentTarget.value)} placeholder="Search..." />
            </span>
        </div>
    );

    const perfilDialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" text onClick={hideDialog} />
            <Button label="Savar" icon="pi pi-check" text onClick={savePerfil} />
        </>
    );
    const deletePerfilDialogFooter = (
        <>
            <Button label="Não" icon="pi pi-times" text onClick={hideDeletePerfilDialog} />
            <Button label="Sim" icon="pi pi-check" text onClick={deletePerfil} />
        </>
    );
    const deletePerfisDialogFooter = (
        <>
            <Button label="Não" icon="pi pi-times" text onClick={hideDeletePerfisDialog} />
            <Button label="Sim" icon="pi pi-check" text onClick={deleteSelectedPerfis} />
        </>
    );

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                    <DataTable
                        ref={dt}
                        value={perfis}
                        selection={selectedPerfis}
                        onSelectionChange={(e) => setSelectedPerfis(e.value as any)}
                        dataKey="id"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Mostrando {first} até {last} de {totalRecords} recursos"
                        globalFilter={globalFilter}
                        emptyMessage="Nenhum recurso encontrado."
                        header={header}
                        responsiveLayout="scroll"
                    >
                        <Column selectionMode="multiple" headerStyle={{ width: '4rem' }}></Column>
                        <Column field="id" header="Identificador" sortable body={idBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="descricao" header="Descrição" sortable body={descricaoBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column body={actionBodyTemplate} headerStyle={{minWidth: '10rem'}}></Column>

                    </DataTable>

                    <Dialog visible={perfilDialog} style={{ width: '450px' }} header="Detahles de Perfil" modal className="p-fluid" footer={perfilDialogFooter} onHide={hideDialog}>

                        <div className="field">
                            <label htmlFor="descricao">Deescrição</label>
                            <InputText
                                id="descricao"
                                value={perfil.descricao}
                                onChange={(e) => onInputChange(e, 'descricao')}
                                required
                                autoFocus
                                className={classNames({
                                    'p-invalid': submitted && !perfil.descricao
                                })}
                            />
                            {submitted && !perfil.descricao && <small className="p-invalid">Descricao é obrigatório.</small>}
                        </div>

                        {/* <div className="field">
                            <label htmlFor="chave">Chave</label>
                            <InputText
                                id="chave"
                                value={recurso.chave}
                                onChange={(e) => onInputChange(e, 'chave')}
                                required
                                autoFocus
                                className={classNames({
                                    'p-invalid': submitted && !recurso.chave
                                })}
                            />
                            {submitted && !recurso.chave && <small className="p-invalid">Chave é obrigatório.</small>}
                        </div> */}


                    </Dialog>

                    <Dialog visible={deletePerfilDialog} style={{ width: '450px' }} header="Confirm" modal footer={deletePerfilDialogFooter} onHide={hideDeletePerfilDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {perfil && (
                                <span>
                                    Você realmente deseja excluir recurso. <b>{perfil.descricao}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deletePerfisDialog} style={{ width: '450px' }} header="Confirm" modal footer={deletePerfisDialogFooter} onHide={hideDeletePerfisDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {perfil && <span>Você realmente deseja excluir os perfis selecionados?</span>}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default Perfil;
