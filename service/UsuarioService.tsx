import axios from "axios";
import { ModeloService } from "./ModeloService";


export class UsuarioService extends ModeloService{
    constructor(){
        super("/usuario")
    }
}
