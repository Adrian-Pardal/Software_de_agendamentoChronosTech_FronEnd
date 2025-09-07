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
import { PerfilUsuarioService } from '@/service/PerfilUsuarioService';
import { UsuarioService } from '@/service/UsuarioService';
import { PerfilService } from '@/service/PerfilService';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
const PerfilUsuario= () => {
    let perfilUsuarioVazio: Agenda.PerfilUsuario = {
        id: undefined,
        perfil : {descricao :''},
        usuario : {nome:'' , email:'' , senha:'' ,cpf : '' , numeroTelefone:''}
    };

    const [perfisUsuario, setPerfisUsuario] = useState<Agenda.PerfilUsuario[] | null>(null);
    const [perfilUsuarioDialog, setPerfilUsuarioDialog] = useState(false);
    const [deletePerfilUsuarioDialog, setDeletePerfilUsuarioDialog] = useState(false);
    const [deletePerfisUsuarioDialog, setDeletePerfisUsuarioDialog] = useState(false);
    const [perfilUsuario, setPerfilUsuario] = useState<Agenda.PerfilUsuario>(perfilUsuarioVazio);
    const [selectedPerfisUsuario, setSelectedPerfisUsuario] = useState<Agenda.PerfilUsuario[]>([]);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState('');
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<any>>(null);
    const perfilUsuarioService = useMemo(() => new PerfilUsuarioService(), []);
    const perfilService = useMemo(() => new PerfilService(), []);
    const usuarioService = useMemo(() => new UsuarioService(), []);
    const [usuarios , setUsuarios] = useState<Agenda.Usuario[]>([]);
    const [perfis , setPerfis] = useState<Agenda.Perfil[]>([]);

    const loadPerfisUsuario = useCallback(() => {
            perfilUsuarioService.listarTodos()
            .then(res => setPerfisUsuario(res.data))
            .catch(err => console.log(err));
        }, [perfilUsuarioService]);

    const loadUsuariosPerfis = useCallback(() => {
            if(perfilUsuarioDialog){
            usuarioService.listarTodos()
            .then((response) => setUsuarios(response.data))
            .catch(error => {
                console.log(error);
                toast.current?.show({
                    severity:'info',
                    summary: 'Erro!',
                    detail:'Erro ao carregar a lista de usuário!'
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
    }, [perfilUsuarioDialog , usuarioService ,perfilService]);



    useEffect(() => {
        loadPerfisUsuario();
        loadUsuariosPerfis();
    }, [loadPerfisUsuario , loadUsuariosPerfis]);

    const openNew = () => {
        setPerfilUsuario(perfilUsuarioVazio);
        setSubmitted(false);
        setPerfilUsuarioDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setPerfilUsuarioDialog(false);
    };

    const hideDeletePerfilUsuarioDialog = () => {
        setDeletePerfilUsuarioDialog(false);
    };

    const hideDeletePerfisUsuarioDialog = () => {
        setDeletePerfisUsuarioDialog(false);
    };

    const savePerfilUsuario = () => {
        setSubmitted(true);

        if(!perfilUsuario.id){
            perfilUsuarioService.inserir(perfilUsuario)
                .then((response)=>{
                    setPerfilUsuarioDialog(false);
                    setPerfilUsuario(perfilUsuarioVazio);
                    setPerfisUsuario([]);
                    loadPerfisUsuario();
                    toast.current?.show({
                        severity: 'info',
                        summary: 'Sucesso!',
                        detail:'Perfil-Usuario cadastrado com sucesso!!'
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
            perfilUsuarioService.alterar(perfilUsuario)
                .then((response)=>{
                    setPerfilUsuarioDialog(false);
                    setPerfilUsuario(perfilUsuarioVazio);
                    setPerfisUsuario([]);
                    loadPerfisUsuario();
                    toast.current?.show({
                        severity: 'info',
                        summary: 'Sucesso!',
                        detail:'Perfil-Usuario alterado com sucesso!!'
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

    const editPerfilUsuario = (perfilUsuario: Agenda.PerfilUsuario) => {
        setPerfilUsuario({ ...perfilUsuario });
        setPerfilUsuarioDialog(true);
    };

    const confirmDeletePerfilUsuario = (perfilUsuario: Agenda.PerfilUsuario) => {
        setPerfilUsuario(perfilUsuario);
        setDeletePerfilUsuarioDialog(true);
    };

    const deletePerfilUsuario = () => {
        if(perfilUsuario.id){
            perfilUsuarioService.excluir(perfilUsuario.id)
                .then((response)=>{
                    setPerfilUsuario(perfilUsuarioVazio);
                    setDeletePerfilUsuarioDialog(false)
                    setPerfisUsuario([]);
                    loadPerfisUsuario();
                    toast.current?.show({
                        severity: 'success',
                        summary: 'Sucesso!',
                        detail: 'Perfil-Usuario Deletado com Sucesso!',
                        life: 3000
                    });
                })
                .catch((error)=>{
                    toast.current?.show({
                        severity: 'error',
                        summary: 'Error!',
                        detail: 'Error ao deletar o perfil-usuario!',
                        life: 3000
                    });

                })
            }
    };

    const exportCSV = () => {
        dt.current?.exportCSV();
    };

    const confirmDeleteSelected = () => {
        setPerfilUsuario(perfilUsuario);
        setDeletePerfisUsuarioDialog(true);
    };

    const deleteSelectedPerfisUsuario = () => {

        Promise.all(selectedPerfisUsuario.map(async(_perfilUsuario) => {
            if(_perfilUsuario.id){
                await perfilUsuarioService.excluir(_perfilUsuario.id)
            }
        })).then((response) =>{
            setPerfisUsuario(null);
            setSelectedPerfisUsuario([]);
            setDeletePerfisUsuarioDialog(false);
            loadPerfisUsuario();
            toast.current?.show({
                    severity: 'success',
                    summary: 'Sucesso!',
                    detail: 'Perfis-Usuario Deletado com Sucesso!',
                    life: 3000
                });
        }).catch((error)=>{
            toast.current?.show({
                    severity: 'error',
                    summary: 'Error!',
                    detail: 'Error ao deletar o perfis-usuario!',
                    life: 3000
                });
        })
    };

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, name: string) => {
        const val = (e.target && e.target.value) || '';
        setPerfilUsuario(prevPerfilUsuario =>({
            ...prevPerfilUsuario,
            [name]: val,
        }));
    };

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="Novo" icon="pi pi-plus" severity="success" className=" mr-2" onClick={openNew} />
                    <Button label="Excluir" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedPerfisUsuario || !(selectedPerfisUsuario as any).length} />
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

    const idBodyTemplate = (rowData: Agenda.PerfilUsuario) => {
        return (
            <>
                <span className="p-column-title">Identificador</span>
                {rowData.id}
            </>
        );
    };

    const perfilBodyTemplate = (rowData: Agenda.PerfilUsuario) => {
        return (
            <>
                <span className="p-column-title">Perfil</span>
                {rowData.perfil.descricao}
            </>
        );
    };

    const usuarioBodyTemplate = (rowData: Agenda.PerfilUsuario) => {
        return (
            <>
                <span className="p-column-title">Usuario</span>
                {rowData.usuario.nome}
            </>
        );
    };


    const actionBodyTemplate = (rowData: Agenda.PerfilUsuario) => {
        return (
            <>
                <Button icon="pi pi-pencil" rounded severity="success" className="mr-2" onClick={() => editPerfilUsuario(rowData)} />
                <Button icon="pi pi-trash" rounded severity="warning" onClick={() => confirmDeletePerfilUsuario(rowData)} />
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

    const perfilUsuarioDialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" text onClick={hideDialog} />
            <Button label="Savar" icon="pi pi-check" text onClick={savePerfilUsuario} />
        </>
    );
    const deletePerfilUsuarioDialogFooter = (
        <>
            <Button label="Não" icon="pi pi-times" text onClick={hideDeletePerfilUsuarioDialog} />
            <Button label="Sim" icon="pi pi-check" text onClick={deletePerfilUsuario} />
        </>
    );
    const deletePerfisUsuarioDialogFooter = (
        <>
            <Button label="Não" icon="pi pi-times" text onClick={hideDeletePerfisUsuarioDialog} />
            <Button label="Sim" icon="pi pi-check" text onClick={deleteSelectedPerfisUsuario} />
        </>
    );

    const onSelectPerfilChange = (perfil : Agenda.Perfil) =>{
        let _perfilUsuario = { ...perfilUsuario};
        _perfilUsuario.perfil = perfil;
        setPerfilUsuario(_perfilUsuario);
    }
    const onSelectUsuarioChange = (usuario : Agenda.Usuario) =>{
        let _perfilUsuario = { ...perfilUsuario};
        _perfilUsuario.usuario = usuario;
        setPerfilUsuario(_perfilUsuario);
    }

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                    <DataTable
                        ref={dt}
                        value={perfisUsuario}
                        selection={selectedPerfisUsuario}
                        onSelectionChange={(e) => setSelectedPerfisUsuario(e.value as any)}
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
                        <Column field="usuario" header="Usuario" sortable body={usuarioBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column body={actionBodyTemplate} headerStyle={{minWidth: '10rem'}}></Column>

                    </DataTable>

                    <Dialog visible={perfilUsuarioDialog} style={{ width: '450px' }} header="Detahles de Perfil-Usuario" modal className="p-fluid" footer={perfilUsuarioDialogFooter} onHide={hideDialog}>

                        <div className="field">
                            <label htmlFor="perfil">Perfil</label>
                            <Dropdown optionLabel='descricao' value={perfilUsuario.perfil} options={perfis ?? []} filter onChange={(e: DropdownChangeEvent) => onSelectPerfilChange(e.value)} placeholder='Selecione um perfil....'/>
                            {submitted && !perfilUsuario.perfil && <small className="p-invalid">Perfil é obrigatório.</small>}
                        </div>


                        <div className="field">
                            <label htmlFor="usuario">Usuario</label>
                        <Dropdown optionLabel='nome' value={perfilUsuario.usuario} options={usuarios ?? []} filter onChange={(e: DropdownChangeEvent) => onSelectUsuarioChange(e.value)} placeholder='Selecione um usuario....'/>
                            {submitted && !perfilUsuario.usuario && <small className="p-invalid">Usuario é obrigatório.</small>}
                        </div>

                    </Dialog>

                    <Dialog visible={deletePerfilUsuarioDialog} style={{ width: '450px' }} header="Confirm" modal footer={deletePerfilUsuarioDialogFooter} onHide={hideDeletePerfilUsuarioDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {perfilUsuario && (
                                <span>
                                    Você realmente deseja excluir recurso. <b>{perfilUsuario.id}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deletePerfisUsuarioDialog} style={{ width: '450px' }} header="Confirm" modal footer={deletePerfisUsuarioDialogFooter} onHide={hideDeletePerfisUsuarioDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {perfilUsuario && <span>Você realmente deseja excluir os perfis-usuario selecionados?</span>}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default PerfilUsuario;
