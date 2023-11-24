import { AlbumEntity } from "../album/album.entity";
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class PerformerEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    nombre: string;

    @Column()
    descripcion: string;

    @Column()
    imagen: string;

    @ManyToMany(() => AlbumEntity, album => album.performers)
    albums: AlbumEntity[];
}