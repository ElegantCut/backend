//Añado la interface para validar usuario y contraseña uwu 
export const USER_LOOKUP_SERVICE = 'USER_LOOKUP_SERVICE';

export interface IUserLookup {
    findOneByUsername(username: string): Promise<any>;
    comparePassword(password: string, hash: string): Promise<boolean>;
    crearUsuario(data: any): Promise<any>;
}