//Añado la interface para validar usuario y contraseña uwu 
export const USER_INTEGRATION_SERVICE = 'USER_INTEGRATION_SERVICE';

export interface IUserIntegration {
    findOneByUsername(username: string): Promise<any>;
    comparePassword(password: string, hash: string): Promise<boolean>;
    crearUsuario(data: any): Promise<any>;
    getUserBasicInfo(id: number): Promise<{ prim_nombre: string, apellido1: string, email?: string }>;
    findByEmail(email: string): Promise<any>;
    findByEmailOrGoogleId(email: string, google_id: string): Promise<any>;
    vincularGoogleId(id_usuario: number, google_id: string): Promise<any>;
    crearUsuarioConGoogle(data: any): Promise<any>;
    updatePasswordByEmail(email: string, hash: string): Promise<any>;
}