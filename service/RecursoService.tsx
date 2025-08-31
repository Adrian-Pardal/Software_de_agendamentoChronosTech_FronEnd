import { ModeloService } from "./ModeloService";

export class RecursoService extends ModeloService{
    constructor(){
        super("/recurso")
    }
}
