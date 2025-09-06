import { ModeloService } from "./ModeloService";

export class PerfilService extends ModeloService{
    constructor(){
        super("/perfil")
    }
}
