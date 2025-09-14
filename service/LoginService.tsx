import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL_API
})

export class LoginService{

    novoCadastro(usuario: Agenda.Usuario){
        return axiosInstance.post("/auth/cadastro" , usuario);
    }

    login(email : String , senha: String){
        return axiosInstance.post("auth/login",
            {username: email , password:senha})
    }
}
