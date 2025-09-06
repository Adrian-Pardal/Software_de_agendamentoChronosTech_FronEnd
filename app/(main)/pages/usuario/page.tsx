
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
import { UsuarioService } from '@/service/UsuarioService';
import { error } from 'console';
import { InputMask } from 'primereact/inputmask';
import { InputMaskChangeEvent } from 'primereact/inputmask';


const Usuario= () => {
    let usuarioVazio: Agenda.Usuario = {
        id: undefined,
        nome: '',
        email: '',
        senha: '',
        numeroTelefone: '',
        cpf: '',

    };

    const [usuarios, setUsuarios] = useState<Agenda.Usuario[] | null>(null);
    const [usuarioDialog, setUsuarioDialog] = useState(false);
    const [deleteUsuarioDialog, setDeleteUsuarioDialog] = useState(false);
    const [deleteUsuariosDialog, setDeleteUsuariosDialog] = useState(false);
    const [usuario, setUsuario] = useState<Agenda.Usuario>(usuarioVazio);
    const [selectedUsuarios, setSelectedUsuarios] = useState<Agenda.Usuario[]>([]);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState('');
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<any>>(null);
    const usuarioService = useMemo(() => new UsuarioService(), []);
    //conexao com back end fazer mais pra frente


    const loadUsuarios = useCallback(() => {
        usuarioService.listarTodos()
            .then(res => setUsuarios(res.data))
            .catch(err => console.log(err));
    }, [usuarioService]);

    useEffect(() => {
        loadUsuarios();
    }, [loadUsuarios]);

    const openNew = () => {
        setUsuario(usuarioVazio);
        setSubmitted(false);
        setUsuarioDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setUsuarioDialog(false);
    };

    const hideDeleteUsuarioDialog = () => {
        setDeleteUsuarioDialog(false);
    };

    const hideDeleteUsuariosDialog = () => {
        setDeleteUsuariosDialog(false);
    };


    // VALIDANDO O CPF E NUMERO ANTES DE MANDAR PARA O BACK END
    const [errors, setErrors] = useState<{ cpf?: string; telefone?: string }>({});

    const somenteNumeros = (str: string) => str.replace(/\D/g, '');

    // Para validar CPF
    const cpfValido = (cpf: string) => {
        const numeros = somenteNumeros(cpf); // "19006695793"
        return numeros.length === 11;
    };

    // Para validar telefone
    const telefoneValido = (telefone: string) => {
        const numeros = somenteNumeros(telefone); // "24992272126"
        return numeros.length === 11;
    };


    const saveUsuario = () => {
        setSubmitted(true);
        let newErrors: { cpf?: string; telefone?: string } = {};

        const cpfLimpo = (usuario.cpf ?? '').replace(/\D/g, '');
        const telefoneLimpo = (usuario.numeroTelefone ?? '').replace(/\D/g, '');

        if (!usuario.cpf || !cpfValido(usuario.cpf)) {
            newErrors.cpf = "CPF inválido. Digite 11 números.";
        }

        if (!usuario.numeroTelefone || !telefoneValido(usuario.numeroTelefone)) {
            newErrors.telefone = "Número de telefone inválido.";
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            return; // não envia para o backend se tiver erros
        }
        const usuarioEnviar = {
            ...usuario,
            cpf: cpfLimpo,
            numeroTelefone: telefoneLimpo,
        };

        if(!usuario.id){
            usuarioService.inserir(usuarioEnviar)
                .then((response)=>{
                    setUsuarioDialog(false);
                    setUsuario(usuarioVazio);
                    setUsuarios([]);
                    loadUsuarios();
                    toast.current?.show({
                        severity: 'info',
                        summary: 'Sucesso!',
                        detail:'Usuário cadastrado com sucesso!!'
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
            usuarioService.alterar(usuario)
                .then((response)=>{
                    setUsuarioDialog(false);
                    setUsuario(usuarioVazio);
                    setUsuarios([]);
                    loadUsuarios();
                    toast.current?.show({
                        severity: 'info',
                        summary: 'Sucesso!',
                        detail:'Usuário alterado com sucesso!!'
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

    const editUsuario = (usuario: Agenda.Usuario) => {
        setUsuario({ ...usuario });
        setUsuarioDialog(true);
    };

    const confirmDeleteUsuario = (usuario: Agenda.Usuario) => {
        setUsuario(usuario);
        setDeleteUsuarioDialog(true);
    };

    const deleteUsuario = () => {
        if(usuario.id){
            usuarioService.excluir(usuario.id)
                .then((response)=>{
                    setUsuario(usuarioVazio);
                    setDeleteUsuarioDialog(false)
                    setUsuarios([]);
                    loadUsuarios();
                    toast.current?.show({
                        severity: 'success',
                        summary: 'Sucesso!',
                        detail: 'Usuario Deletado com Sucesso!',
                        life: 3000
                    });
                })
                .catch((error)=>{
                    toast.current?.show({
                        severity: 'error',
                        summary: 'Error!',
                        detail: 'Error ao deletar o usuário!',
                        life: 3000
                    });

                })
            }
    };

    const exportCSV = () => {
        dt.current?.exportCSV();
    };

    const confirmDeleteSelected = () => {
        setUsuario(usuario);
        setDeleteUsuariosDialog(true);
    };

    const deleteSelectedUsuarios = () => {

        Promise.all(selectedUsuarios.map(async(_usuario) => {
            if(_usuario.id){
                await usuarioService.excluir(_usuario.id)
            }
        })).then((response) =>{
            setUsuarios(null);
            setSelectedUsuarios([]);
            setDeleteUsuariosDialog(false);
            loadUsuarios();
            toast.current?.show({
                    severity: 'success',
                    summary: 'Sucesso!',
                    detail: 'Usuários Deletado com Sucesso!',
                    life: 3000
                });
        }).catch((error)=>{
            toast.current?.show({
                    severity: 'error',
                    summary: 'Error!',
                    detail: 'Error ao deletar o usuários!',
                    life: 3000
                });
        })
    };
    const formatCPF = (value: string) => {
        return value
            .replace(/\D/g, "")               // só números
            .replace(/(\d{3})(\d)/, "$1.$2")  // 123.456...
            .replace(/(\d{3})(\d)/, "$1.$2")  // 123.456.789
            .replace(/(\d{3})(\d{1,2})$/, "$1-$2"); // 123.456.789-00
    };

    const formatTelefone = (value: string) => {
        return value
            .replace(/\D/g, "")
            .replace(/(\d{2})(\d)/, "($1) $2")
            .replace(/(\d{5})(\d)/, "$1-$2")
            .replace(/(-\d{4})\d+?$/, "$1"); // limita tamanho
    };

    // const onInputChange = (e: React.ChangeEvent<HTMLInputElement | InputMaskChangeEvent>, name: string) => {
    //     //const val = (e.target && e.target.value) || '';
    //     // let _usuario = { ...usuario };
    //     // _usuario[`${name}`] = val;
    //      let val: string;

    //     if ('value' in e) {
    //     // é InputMaskChangeEvent
    //         val = e.value ?? '';
    //     } else {
    //     // é React.ChangeEvent<HTMLInputElement>
    //         val = e.target.value;
    //     }

    //     if (name === "cpf") {
    //         val = formatCPF(val);
    //     }

    //     if (name === "numeroTelefone") {
    //         val = formatTelefone(val);
    //     }
    //     setUsuario(prevUsuario =>({
    //         ...prevUsuario,
    //         [name]: val,
    //     }));
    // };
    const onInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | InputMaskChangeEvent,field: keyof Agenda.Usuario) => {
        let val: string;

        if ('value' in e) {
            // é InputMaskChangeEvent
            val = e.value ?? '';
        } else {
            // é ChangeEvent normal
            val = e.target.value;
        }

        setUsuario(prev => ({
            ...prev,
            [field]: val,
        }));
    };

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="Novo" icon="pi pi-plus" severity="success" className=" mr-2" onClick={openNew} />
                    <Button label="Excluir" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedUsuarios || !(selectedUsuarios as any).length} />
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

    const idBodyTemplate = (rowData: Agenda.Usuario) => {
        return (
            <>
                <span className="p-column-title">Identificador</span>
                {rowData.id}
            </>
        );
    };

    const nomeBodyTemplate = (rowData: Agenda.Usuario) => {
        return (
            <>
                <span className="p-column-title">Nome Completo</span>
                {rowData.nome}
            </>
        );
    };

    const emailBodyTemplate = (rowData: Agenda.Usuario) => {
        return (
            <>
                <span className="p-column-title">Email</span>
                {rowData.email}
            </>
        );
    };

    const cpfBodyTemplate = (rowData: Agenda.Usuario) => {
        return (
            <>
                <span className="p-column-title">CPF</span>
                {rowData.cpf}
            </>
        );
    };

    const numeroTelefoneBodyTemplate = (rowData: Agenda.Usuario) => {
        return (
            <>
                <span className="p-column-title">Numero Telefone</span>
                {rowData.numeroTelefone}
            </>
        );
    };

    //Deixei pois pode ser que vamos usar mais para frente

    // const imageBodyTemplate = (rowData: Demo.Product) => {
    //     return (
    //         <>
    //             <span className="p-column-title">Image</span>
    //             <img src={`/demo/images/product/${rowData.image}`} alt={rowData.image} className="shadow-2" width="100" />
    //         </>
    //     );
    // };

    const actionBodyTemplate = (rowData: Agenda.Usuario) => {
        return (
            <>
                <Button icon="pi pi-pencil" rounded severity="success" className="mr-2" onClick={() => editUsuario(rowData)} />
                <Button icon="pi pi-trash" rounded severity="warning" onClick={() => confirmDeleteUsuario(rowData)} />
            </>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Gerenciamento de Usuarios</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.currentTarget.value)} placeholder="Search..." />
            </span>
        </div>
    );

    const usuarioDialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" text onClick={hideDialog} />
            <Button label="Savar" icon="pi pi-check" text onClick={saveUsuario} />
        </>
    );
    const deleteUsuarioDialogFooter = (
        <>
            <Button label="Não" icon="pi pi-times" text onClick={hideDeleteUsuarioDialog} />
            <Button label="Sim" icon="pi pi-check" text onClick={deleteUsuario} />
        </>
    );
    const deleteUsuariosDialogFooter = (
        <>
            <Button label="Não" icon="pi pi-times" text onClick={hideDeleteUsuariosDialog} />
            <Button label="Sim" icon="pi pi-check" text onClick={deleteSelectedUsuarios} />
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
                        value={usuarios}
                        selection={selectedUsuarios}
                        onSelectionChange={(e) => setSelectedUsuarios(e.value as any)}
                        dataKey="id"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Mostrando {first} até {last} de {totalRecords} usuários"
                        globalFilter={globalFilter}
                        emptyMessage="Nenhum usuário encontrado."
                        header={header}
                        responsiveLayout="scroll"
                    >
                        <Column selectionMode="multiple" headerStyle={{ width: '4rem' }}></Column>
                        <Column field="id" header="Identificador" sortable body={idBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="nome" header="Nome Completo" sortable body={nomeBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="email" header="Email" sortable body={emailBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="cpf" header="CPF" sortable body={cpfBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="numeroTelefone" header="Número Telefone" sortable body={numeroTelefoneBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column body={actionBodyTemplate} headerStyle={{minWidth: '10rem'}}></Column>
                        {/* deixei aqui caso adicionacimos imagem : <Column header="Image" body={imageBodyTemplate}></Column>*/}

                    </DataTable>

                    <Dialog visible={usuarioDialog} style={{ width: '450px' }} header="Detahles de Usuário" modal className="p-fluid" footer={usuarioDialogFooter} onHide={hideDialog}>

                        {/* deixei aqui caso adicionacimos imagem : {product.image && <img src={`/demo/images/product/${product.image}`} alt={product.image} width="150" className="mt-0 mx-auto mb-5 block shadow-2" />}*/}
                        <div className="field">
                            <label htmlFor="nome">Nome Completo</label>
                            <InputText
                                id="nome"
                                value={usuario.nome}
                                onChange={(e) => onInputChange(e, 'nome')}
                                required
                                autoFocus
                                className={classNames({
                                    'p-invalid': submitted && !usuario.nome
                                })}
                            />
                            {submitted && !usuario.nome && <small className="p-invalid">Nome é obrigatório.</small>}
                        </div>

                        <div className="field">
                            <label htmlFor="email">Email</label>
                            <InputText
                                id="email"
                                value={usuario.email}
                                onChange={(e) => onInputChange(e, 'email')}
                                required
                                autoFocus
                                className={classNames({
                                    'p-invalid': submitted && !usuario.email
                                })}
                            />
                            {submitted && !usuario.email && <small className="p-invalid">Email é obrigatório.</small>}
                        </div>

                        <div className="field">
                            <label htmlFor="senha">Senha</label>
                            <InputText
                                id="senha"
                                value={usuario.senha}
                                onChange={(e) => onInputChange(e, 'senha')}
                                required
                                autoFocus
                                className={classNames({
                                    'p-invalid': submitted && !usuario.senha
                                })}
                            />
                            {submitted && !usuario.senha && <small className="p-invalid">Senha é obrigatório.</small>}
                        </div>


                        {/*<div className="field">
                            <label htmlFor="cpf">CPF</label>
                            <InputText
                                id="cpf"
                                value={usuario.cpf}
                                onChange={(e) => onInputChange(e, 'cpf')}
                                required
                                autoFocus
                                className={classNames({
                                    'p-invalid': submitted && !usuario.cpf
                                })}
                            />
                            {submitted && !usuario.cpf && <small className="p-invalid">CPF é obrigatório.</small>}
                        </div>*/}
                        <div className="field">
                            <label htmlFor="cpf">CPF</label>
                           <InputMask
                                id="cpf"
                                mask="999.999.999-99"
                                value={usuario.cpf}
                                onChange={(e) => onInputChange(e, 'cpf')}
                                placeholder="000.000.000-00"
                                className={classNames({ 'p-invalid': submitted && !!errors.cpf })}
                            />
                            {submitted && errors.cpf && <small className="p-invalid">{errors.cpf}</small>}
                        </div>

                        {/*<div className="field">
                            <label htmlFor="numeroTelefone">Número de Telefone</label>
                            <InputText
                                id="numeroTelefone"
                                value={usuario.numeroTelefone}
                                onChange={(e) => onInputChange(e, 'numeroTelefone')}
                                required
                                autoFocus
                                className={classNames({
                                    'p-invalid': submitted && !usuario.numeroTelefone
                                })}
                            />
                            {submitted && !usuario.numeroTelefone && <small className="p-invalid">Número de Telefone é obrigatório.</small>}
                        </div>*/}

                        <div className="field">
                            <label htmlFor="numeroTelefone">Número de Telefone</label>
                            <InputMask
                                id="numeroTelefone"
                                mask="(99) 99999-9999"
                                value={usuario.numeroTelefone}
                                onChange={(e) => onInputChange(e, 'numeroTelefone')}
                                placeholder="(00) 00000-0000"
                                className={classNames({ 'p-invalid': submitted && !!errors.telefone })}
                            />
                            {submitted && errors.telefone && <small className="p-invalid">{errors.telefone}</small>}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteUsuarioDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteUsuarioDialogFooter} onHide={hideDeleteUsuarioDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {usuario && (
                                <span>
                                    Você realmente deseja excluir usuário. <b>{usuario.nome}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteUsuariosDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteUsuariosDialogFooter} onHide={hideDeleteUsuariosDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {usuario && <span>Você realmente deseja excluir os usuários selecionados?</span>}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default Usuario;
