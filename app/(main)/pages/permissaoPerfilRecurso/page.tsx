'use client';

//Uma dica nessa aula é selecionar o que quiser trocar, apertar ctrl+d para selecionar todas a palavras identicas e
//trocar. Depois pesquisa a palavra antiga com ctrl+f para garantir q nao  ficou nenhum lugar com a palavra antiga e boa

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
import { PermissaoPerfilRecursoService } from '@/service/PermissaoPerfilRecursoService';
import { RecursoService } from '@/service/RecursoService';
import { PerfilService } from '@/service/PerfilService';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
const PermissaoPerfilRecurso= () => {
    let permissaoPerfilRecursoVazio: Agenda.PermissaoPerfilRecurso = {
        id: undefined,
        perfil : {descricao :''},
        recurso : {nome:'' , chave:''}
    };

    const [permissaoPerfilRecursos, setPermissaoPerfilRecursos] = useState<Agenda.PermissaoPerfilRecurso[] | null>(null);
    //setPermissaoPerfilRecursos
    const [permissaoPerfilRecursoDialog, setPermissaoPerfilRecursoDialog] = useState(false);
    const [deletePermissaoPerfilRecursoDialog, setDeletePermissaoPerfilRecursoDialog] = useState(false);
    const [deletePermissaoPerfilRecursosDialog, setDeletePermissaoPerfilRecursosDialog] = useState(false);
    const [permissaoPerfilRecurso, setPermissaoPerfilRecurso] = useState<Agenda.PermissaoPerfilRecurso>(permissaoPerfilRecursoVazio);
    const [selectedPermissaoPerfilRecursos, setSelectedPermissaoPerfilRecursos] = useState<Agenda.PermissaoPerfilRecurso[]>([]);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState('');
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<any>>(null);
    const permissaoPerfilRecursoService = useMemo(() => new PermissaoPerfilRecursoService(), []);
    const perfilService = useMemo(() => new PerfilService(), []);
    const recursoService = useMemo(() => new RecursoService(), []);
    const [recursos , setRecursos] = useState<Agenda.Recurso[]>([]);
    const [perfis , setPerfis] = useState<Agenda.Perfil[]>([]);

    const loadPermissaoPerfilRecurso = useCallback(() => {
            permissaoPerfilRecursoService.listarTodos()
            .then(res => setPermissaoPerfilRecursos(res.data))
            .catch(err => console.log(err));
        }, [permissaoPerfilRecursoService]);

    const loadRecursosPerfis = useCallback(() => {
            if(permissaoPerfilRecursoDialog){
            recursoService.listarTodos()
            .then((response) => setRecursos(response.data))
            .catch(error => {
                console.log(error);
                toast.current?.show({
                    severity:'info',
                    summary: 'Erro!',
                    detail:'Erro ao carregar a lista de recurso!'
                })
            })
            perfilService.listarTodos()
            .then((response) => setPerfis(response.data))
            .catch(error => {
                console.log(error);
                toast.current?.show({
                    severity:'info',
                    summary: 'Erro!',
                    detail:'Erro ao carregar a lista de perfil!'
                })
            })
        }
    }, [permissaoPerfilRecursoDialog , recursoService ,perfilService]);



    useEffect(() => {
        loadPermissaoPerfilRecurso();
        loadRecursosPerfis();
    }, [loadPermissaoPerfilRecurso , loadRecursosPerfis]);

    const openNew = () => {
        setPermissaoPerfilRecurso(permissaoPerfilRecursoVazio);
        setSubmitted(false);
        setPermissaoPerfilRecursoDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setPermissaoPerfilRecursoDialog(false);
    };

    const hideDeletePermissaoPerfilRecursoDialog = () => {
        setDeletePermissaoPerfilRecursoDialog(false);
    };

    const hideDeletePermissaoPerfilRecursosDialog = () => {
        setDeletePermissaoPerfilRecursosDialog(false);
    };

    const savePermissaoPerfilRecurso = () => {
        setSubmitted(true);

        if(!permissaoPerfilRecurso.id){
            permissaoPerfilRecursoService.inserir(permissaoPerfilRecurso)
                .then((response)=>{
                    setPermissaoPerfilRecursoDialog(false);
                    setPermissaoPerfilRecurso(permissaoPerfilRecursoVazio);
                    setPermissaoPerfilRecursos([]);
                    loadPermissaoPerfilRecurso();
                    toast.current?.show({
                        severity: 'info',
                        summary: 'Sucesso!',
                        detail:'Permissão cadastrado com sucesso!!'
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
            permissaoPerfilRecursoService.alterar(permissaoPerfilRecurso)
                .then((response)=>{
                    setPermissaoPerfilRecursoDialog(false);
                    setPermissaoPerfilRecurso(permissaoPerfilRecursoVazio);
                    setPermissaoPerfilRecursos([]);
                    loadPermissaoPerfilRecurso();
                    toast.current?.show({
                        severity: 'info',
                        summary: 'Sucesso!',
                        detail:'Permissão alterado com sucesso!!'
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

    const editPermissaoPerfilRecurso = (permissaoPerfilRecurso: Agenda.PermissaoPerfilRecurso) => {
        setPermissaoPerfilRecurso({ ...permissaoPerfilRecurso });
        setPermissaoPerfilRecursoDialog(true);
    };

    const confirmDeletePermissaoPerfilRecurso = (permissaoPerfilRecurso: Agenda.PermissaoPerfilRecurso) => {
        setPermissaoPerfilRecurso(permissaoPerfilRecurso);
        setDeletePermissaoPerfilRecursoDialog(true);
    };

    const deletePermissaoPerfilRecurso = () => {
        if(permissaoPerfilRecurso.id){
            permissaoPerfilRecursoService.excluir(permissaoPerfilRecurso.id)
                .then((response)=>{
                    setDeletePermissaoPerfilRecursoDialog(false);
                    setPermissaoPerfilRecurso(permissaoPerfilRecursoVazio);
                    setPermissaoPerfilRecursos([]);
                    loadPermissaoPerfilRecurso();
                    toast.current?.show({
                        severity: 'success',
                        summary: 'Sucesso!',
                        detail: 'Permissão Deletado com Sucesso!',
                        life: 3000
                    });
                })
                .catch((error)=>{
                    toast.current?.show({
                        severity: 'error',
                        summary: 'Error!',
                        detail: 'Error ao deletar o permissão!',
                        life: 3000
                    });

                })
            }
    };

    const exportCSV = () => {
        dt.current?.exportCSV();
    };

    const confirmDeleteSelected = () => {
        setPermissaoPerfilRecurso(permissaoPerfilRecurso);
        setDeletePermissaoPerfilRecursosDialog(true);
    };

    const deleteSelectedPermissaoPerfilRecursos = () => {

        Promise.all(selectedPermissaoPerfilRecursos.map(async(_permissaoPerfilRecurso) => {
            if(_permissaoPerfilRecurso.id){
                await permissaoPerfilRecursoService.excluir(_permissaoPerfilRecurso.id)
            }
        })).then((response) =>{
            setDeletePermissaoPerfilRecursosDialog(false);
            //setPermissaoPerfilRecurso(permissaoPerfilRecursoVazio);
            setPermissaoPerfilRecursos([]);
            loadPermissaoPerfilRecurso();
            toast.current?.show({
                    severity: 'success',
                    summary: 'Sucesso!',
                    detail: 'Permissões Deletado com Sucesso!',
                    life: 3000
                });
        }).catch((error)=>{
            toast.current?.show({
                    severity: 'error',
                    summary: 'Error!',
                    detail: 'Error ao deletar o permissões!',
                    life: 3000
                });
        })
    };

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, name: string) => {
        const val = (e.target && e.target.value) || '';
        setPermissaoPerfilRecurso(prevPermissaoPerfilRecurso =>({
            ...prevPermissaoPerfilRecurso,
            [name]: val,
        }));
    };

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="Novo" icon="pi pi-plus" severity="success" className=" mr-2" onClick={openNew} />
                    <Button label="Excluir" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedPermissaoPerfilRecursos || !(selectedPermissaoPerfilRecursos as any).length} />
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

    const idBodyTemplate = (rowData: Agenda.PermissaoPerfilRecurso) => {
        return (
            <>
                <span className="p-column-title">Identificador</span>
                {rowData.id}
            </>
        );
    };

    const perfilBodyTemplate = (rowData: Agenda.PermissaoPerfilRecurso) => {
        return (
            <>
                <span className="p-column-title">Perfil</span>
                {rowData.perfil.descricao}
            </>
        );
    };

    const recursoBodyTemplate = (rowData: Agenda.PermissaoPerfilRecurso) => {
        return (
            <>
                <span className="p-column-title">Recurso</span>
                {rowData.recurso.nome}
            </>
        );
    };


    const actionBodyTemplate = (rowData: Agenda.PermissaoPerfilRecurso) => {
        return (
            <>
                <Button icon="pi pi-pencil" rounded severity="success" className="mr-2" onClick={() => editPermissaoPerfilRecurso(rowData)} />
                <Button icon="pi pi-trash" rounded severity="warning" onClick={() => confirmDeletePermissaoPerfilRecurso(rowData)} />
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

    const permissaoPerfilRecursoDialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" text onClick={hideDialog} />
            <Button label="Savar" icon="pi pi-check" text onClick={savePermissaoPerfilRecurso} />
        </>
    );
    const deletePermissaoPerfilRecursoDialogFooter = (
        <>
            <Button label="Não" icon="pi pi-times" text onClick={hideDeletePermissaoPerfilRecursoDialog} />
            <Button label="Sim" icon="pi pi-check" text onClick={deletePermissaoPerfilRecurso} />
        </>
    );
    const deletePermissaoPerfilRecursosDialogFooter = (
        <>
            <Button label="Não" icon="pi pi-times" text onClick={hideDeletePermissaoPerfilRecursosDialog} />
            <Button label="Sim" icon="pi pi-check" text onClick={deleteSelectedPermissaoPerfilRecursos} />
        </>
    );

    const onSelectPerfilChange = (perfil : Agenda.Perfil) =>{
        let _permissaoPerfilRecurso = { ...permissaoPerfilRecurso};
        _permissaoPerfilRecurso.perfil = perfil;
        setPermissaoPerfilRecurso(_permissaoPerfilRecurso);
    }
    const onSelectRecursoChange = (recurso : Agenda.Recurso) =>{
        let _permissaoPerfilRecurso = { ...permissaoPerfilRecurso};
        _permissaoPerfilRecurso.recurso = recurso;
        setPermissaoPerfilRecurso(_permissaoPerfilRecurso);
    }

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                    <DataTable
                        ref={dt}
                        value={permissaoPerfilRecursos}
                        selection={selectedPermissaoPerfilRecursos}
                        onSelectionChange={(e) => setSelectedPermissaoPerfilRecursos(e.value as any)}
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
                        <Column field="perfil" header="Perfil" sortable body={perfilBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="recurso" header="Recurso" sortable body={recursoBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column body={actionBodyTemplate} headerStyle={{minWidth: '10rem'}}></Column>

                    </DataTable>

                    <Dialog visible={permissaoPerfilRecursoDialog} style={{ width: '450px' }} header="Detahles de Permissão Perfil Recurso" modal className="p-fluid" footer={permissaoPerfilRecursoDialogFooter} onHide={hideDialog}>

                        <div className="field">
                            <label htmlFor="perfil">Perfil</label>
                            <Dropdown optionLabel='descricao' value={permissaoPerfilRecurso.perfil} options={perfis ?? []} filter onChange={(e: DropdownChangeEvent) => onSelectPerfilChange(e.value)} placeholder='Selecione um perfil....'/>
                            {submitted && !permissaoPerfilRecurso.perfil && <small className="p-invalid">Perfil é obrigatório.</small>}
                        </div>


                        <div className="field">
                            <label htmlFor="usuario">Usuario</label>
                        <Dropdown optionLabel='nome' value={permissaoPerfilRecurso.recurso} options={recursos ?? []} filter onChange={(e: DropdownChangeEvent) => onSelectRecursoChange(e.value)} placeholder='Selecione um usuario....'/>
                            {submitted && !permissaoPerfilRecurso.recurso && <small className="p-invalid">Recurso é obrigatório.</small>}
                        </div>

                    </Dialog>

                    <Dialog visible={deletePermissaoPerfilRecursoDialog} style={{ width: '450px' }} header="Confirm" modal footer={deletePermissaoPerfilRecursoDialogFooter} onHide={hideDeletePermissaoPerfilRecursoDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {permissaoPerfilRecurso && (
                                <span>
                                    Você realmente deseja excluir permissão. <b>{permissaoPerfilRecurso.id}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deletePermissaoPerfilRecursosDialog} style={{ width: '450px' }} header="Confirm" modal footer={deletePermissaoPerfilRecursosDialogFooter} onHide={hideDeletePermissaoPerfilRecursosDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {permissaoPerfilRecurso && <span>Você realmente deseja excluir os permissões selecionados?</span>}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default PermissaoPerfilRecurso;
