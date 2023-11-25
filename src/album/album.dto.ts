import {IsDate, IsNotEmpty, IsString} from 'class-validator';

export class AlbumDto {

    @IsNotEmpty()
    @IsString()
    readonly nombre: string;

    @IsNotEmpty()
    @IsString()
    readonly caratula: string;

    @IsNotEmpty()
    @IsDate()
    readonly fechaLanzamiento: string;

    @IsNotEmpty()
    @IsString()
    readonly descripcion: string;

}
