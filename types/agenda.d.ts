declare namespace Agenda {
    type Usuario = {
        id?: undefined;
        nome: string;
        email: string;
        senha: string;
        numeroTelefone?: undefined;
        cpf?: undefined;
    };

    type Recurso ={
        id?: undefined;
        nome:string ;
        chave:string;
    }
}
