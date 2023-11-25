import { IsString, IsNumber,IsNotEmpty } from 'class-validator';
import { AlbumDto } from 'src/album/album.dto';
export class TrackDto {

    @IsNotEmpty()
    @IsString()
    readonly nombre: string;

    @IsNotEmpty()
    @IsNumber()
    readonly duracion: number;

    @IsNotEmpty()
    readonly album: AlbumDto;
}
