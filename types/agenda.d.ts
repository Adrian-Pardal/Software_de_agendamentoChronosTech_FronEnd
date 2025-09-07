declare namespace Agenda {
    type Usuario = {
        id?: undefined;
        nome: string;
        email: string;
        senha: string;
        numeroTelefone?: string;
        cpf?: string;
    };

    type Recurso ={
        id?: undefined;
        nome:string ;
        chave:string;
    };

    type Perfil = {
        id?: undefined;
        descricao: string;
    };

    type PerfilUsuario = {
        id?: undefined;
        perfil : Perfil;
        usuario : Usuario;
    };
    type PermissaoPerfilRecurso = {
        id?: undefined;
        perfil : Perfil;
        recurso: Recurso;
    }
}
