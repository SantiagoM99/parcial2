import { Injectable } from '@nestjs/common';
import { AlbumEntity } from './album.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class AlbumService {
    constructor(
        @InjectRepository(AlbumEntity)
        private readonly albumRepository: Repository<AlbumEntity>
    ){}

    async findAll(): Promise<AlbumEntity[]> {
        return await this.albumRepository.find({ relations: ["tracks","performers"] });
    }

    async findOne(id: string): Promise<AlbumEntity> {
        const album: AlbumEntity = await this.albumRepository.findOne({where: {id}, relations: ["tracks","performers"] } );
        if (!album)
          throw new BusinessLogicException("The album with the given id was not found", BusinessError.NOT_FOUND);
   
        return album;
    }

    async create(album: AlbumEntity): Promise<AlbumEntity> {
        if (album.nombre.length < 1 || album.nombre == "" || album.nombre == null){
            throw new BusinessLogicException("The album's name can't be empty", BusinessError.BAD_REQUEST);
        }
        else if (album.descripcion.length < 1 || album.descripcion == "" || album.descripcion == null){
            throw new BusinessLogicException("The album's description can't be empty", BusinessError.BAD_REQUEST);
        }
        
        return await this.albumRepository.save(album);
    }

    async update(id: string, album: AlbumEntity): Promise<AlbumEntity> {
        const persistedAlbum: AlbumEntity = await this.albumRepository.findOne({where:{id}});
        if (!persistedAlbum)
          throw new BusinessLogicException("The album with the given id was not found", BusinessError.NOT_FOUND);
        
        return await this.albumRepository.save({...persistedAlbum, ...album});
    }

    async delete(id: string) {
        const album: AlbumEntity = await this.albumRepository.findOne({where:{id}});
        if (!album)
          throw new BusinessLogicException("The album with the given id was not found", BusinessError.NOT_FOUND);
     
        await this.albumRepository.remove(album);
    }
}