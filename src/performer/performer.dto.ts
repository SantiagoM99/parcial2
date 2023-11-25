import { IsString, IsNotEmpty } from 'class-validator';
export class PerformerDto {
    @IsNotEmpty()
    @IsString()
    readonly nombre: string;

    @IsNotEmpty()
    @IsString()
    readonly imagen: string;

    @IsNotEmpty()
    @IsString()
    readonly descripcion: string;
}
