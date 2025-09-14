/* eslint-disable @next/next/no-img-element */
'use client';
import { useRouter } from 'next/navigation';
import React, { useContext,useRef, useMemo, useState } from 'react';
import { Checkbox } from 'primereact/checkbox';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Password } from 'primereact/password';
import { LayoutContext } from '../../../../layout/context/layoutcontext';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import { LoginService } from '@/service/LoginService';
import { InputMask, InputMaskChangeEvent } from 'primereact/inputmask';
import { error } from 'console';

const NewUserPage = () => {
    let usuarioVazio: Agenda.Usuario = {
            id: undefined,
            nome: '',
            email: '',
            senha: '',
            numeroTelefone: '',
            cpf: '',

        };

    const [usuario, setUsuario] = useState<Agenda.Usuario>(usuarioVazio);
    const { layoutConfig } = useContext(LayoutContext);
    const loginService = useMemo(() => new LoginService(), []);
    const toast = useRef<Toast>(null);

    const router = useRouter();
    const containerClassName = classNames('surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden', { 'p-input-filled': layoutConfig.inputStyle === 'filled' });

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | InputMaskChangeEvent,field: keyof Agenda.Usuario) => {
            let val: string;

            if ('value' in e) {
                // é InputMaskChangeEvent
                val = e.value ?? '';
            } else {
                // é ChangeEvent normal
                val = e.target.value;
            }

            // remover máscara se for CPF ou telefone
            if (field === "cpf" || field === "numeroTelefone") {
                val = val.replace(/\D/g, "");
            }

            setUsuario(prev => ({
                ...prev,
                [field]: val,
            }));
    };

    const novoUsuario = () =>{
        loginService.novoCadastro(usuario)
        .then((response) =>{
            setUsuario(usuarioVazio);
            toast.current?.show({
                severity: 'info',
                summary: 'Sucesso!',
                detail:'Usuário cadastrado com sucesso!!'
            })
        }).catch((error) => {
             console.log(error.response?.data);
                toast.current?.show({
                    severity: 'error',
                    summary: 'Error!',
                    detail:'Error ao salvar!' + (error.response?.data?.message || 'Tente novamente')
                })
        });
    }







    return (
        <div className={containerClassName}>
            <Toast ref={toast}/>
            <div className="flex flex-column align-items-center justify-content-center">
                <img src={`/layout/images/logo-${layoutConfig.colorScheme === 'light' ? 'dark' : 'white'}.svg`} alt="Sakai logo" className="mb-5 w-6rem flex-shrink-0" />
                <div
                    style={{
                        borderRadius: '56px',
                        padding: '0.3rem',
                        background: 'linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)'
                    }}
                >
                    <div className="w-full surface-card py-8 px-5 sm:px-8" style={{ borderRadius: '53px' }}>
                        <div className="text-center mb-5">
                            <div className="text-900 text-3xl font-medium mb-3">Cadastre-se Agora</div>
                            <span className="text-600 font-medium">SEU TEMPO, SUA ESCOLHA .</span>
                        </div>

                        <div>
                            <label htmlFor="nome" className="block text-900 text-xl font-medium mb-2">
                                Nome Completo
                            </label>
                            <InputText
                            id="nome" type="text"
                            placeholder="Digite seu nome"
                            className="w-full md:w-30rem mb-5"
                            style={{ padding: '1rem' }}
                            value={usuario.nome}
                            onChange={(e) => onInputChange(e, 'nome')}
                            />

                            <label htmlFor="email" className="block text-900 text-xl font-medium mb-2">
                                Email
                            </label>
                            <InputText id="email"
                            type="text"
                            placeholder="Digite seu email"
                            className="w-full md:w-30rem mb-5"
                            style={{ padding: '1rem' }}
                            value={usuario.email}
                            onChange={(e) => onInputChange(e, 'email')}
                            />

                            <label htmlFor="cpf" className="block text-900 text-xl font-medium mb-2">
                                CPF
                            </label>
                            <InputMask
                            id="cpf" type="text"
                            mask="999.999.999-99"
                            placeholder="000.000.000-00"
                            className="w-full md:w-30rem mb-5"
                            style={{ padding: '1rem' }}
                            value={usuario.cpf}
                            onChange={(e) => onInputChange(e, 'cpf')}
                            />

                            <label htmlFor="numeroTelefone" className="block text-900 text-xl font-medium mb-2">
                                Numero de Telefone
                            </label>
                            <InputMask
                            id="numeroTelefone"
                            mask="(99) 99999-9999"
                            placeholder="(00) 00000-0000"
                            className="w-full md:w-30rem mb-5"
                            style={{ padding: '1rem' }}
                            value={usuario.numeroTelefone}
                            onChange={(e) => onInputChange(e, 'numeroTelefone')}
                            />

                            <label htmlFor="senha" className="block text-900 font-medium text-xl mb-2">
                                Senha
                            </label>
                            {/* <Password
                            inputId="senha"
                            placeholder="Digite sua senha"
                            toggleMask
                            className="w-full mb-5"
                            inputClassName="w-full p-3 md:w-30rem">
                            value={usuario.senha}
                            onChange={(e) => onInputChange(e, 'senha')}
                            </Password> */}
                            <Password
                            inputId="senha"
                            placeholder="Digite sua senha"
                            toggleMask
                            className="w-full mb-5"
                            inputClassName="w-full p-3 md:w-30rem"
                            value={usuario.senha}
                            onChange={(e) => onInputChange(e, 'senha')}
                            />

                            <div className="flex align-items-center justify-content-between mb-5 gap-5">
                                {/* <div className="flex align-items-center">
                                    <Checkbox inputId="rememberme1" checked={checked} onChange={(e) => setChecked(e.checked ?? false)} className="mr-2"></Checkbox>
                                    <label htmlFor="rememberme1">Remember me</label>
                                </div> */}
                                {/* <a className="font-medium no-underline ml-2 text-right cursor-pointer" style={{ color: 'var(--primary-color)' }} >
                                    Cadastre-se
                                </a> */}
                                <a className="font-medium no-underline ml-2 text-right cursor-pointer" style={{ color: 'var(--primary-color)' }} onClick={() => router.push('/auth/login')}>
                                    Ja tenho cadastro!
                                </a>
                            </div>
                            <Button label="Cadastrar" className="w-full p-3 text-xl" onClick={() => novoUsuario()}></Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NewUserPage;
