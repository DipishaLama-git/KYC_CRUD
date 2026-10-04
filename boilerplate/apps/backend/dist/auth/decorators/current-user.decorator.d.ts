export interface AuthenticatedUser {
    id: string;
    username: string;
}
export declare const CurrentUser: (...dataOrPipes: unknown[]) => ParameterDecorator;
