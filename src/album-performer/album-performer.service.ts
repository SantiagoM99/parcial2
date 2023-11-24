import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PerformerEntity } from '../performer/performer.entity';
import { AlbumEntity } from '../album/album.entity';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class AlbumPerformerService {
   constructor(
       @InjectRepository(AlbumEntity)
       private readonly albumRepository: Repository<AlbumEntity>,
   
       @InjectRepository(PerformerEntity)
       private readonly performerRepository: Repository<PerformerEntity>
   ) {}

   async addPerformerAlbum(albumId: string, performerId: string): Promise<AlbumEntity> {
    // Verifica si el intérprete existe
    const performer: PerformerEntity = await this.performerRepository.findOne({ where: { id: performerId } });
    if (!performer) {
        throw new BusinessLogicException('The performer with the given id was not found', BusinessError.NOT_FOUND);
    }

    // Verifica si el álbum existe
    const album: AlbumEntity = await this.albumRepository.findOne({ where: { id: albumId }, relations: ['performers'] });
    if (!album) {
        throw new BusinessLogicException('The album with the given id was not found', BusinessError.NOT_FOUND);
    }

    // Verificar si el álbum ya tiene tres intérpretes asociados
    if (album.performers.length > 3) {
        throw new BusinessLogicException('The album has already three performers', BusinessError.PRECONDITION_FAILED);
    }

    // Verificar si el intérprete ya está asociado al álbum
    const isPerformerAssociated = album.performers.some((p) => p.id === performer.id);
    if (isPerformerAssociated) {
        throw new BusinessLogicException('The performer is already associated with the album', BusinessError.PRECONDITION_FAILED);
    }

    // Asociar el intérprete al álbum
    album.performers.push(performer);
    await this.albumRepository.save(album);  // Guardar los cambios en la base de datos
    return album;
}


   
   async findPerformerByAlbumIdPerformerId(albumId: string, performerId: string): Promise<PerformerEntity> {
       const performer: PerformerEntity = await this.performerRepository.findOne({where: {id: performerId}});
       if (!performer)
         throw new BusinessLogicException("The performer with the given id was not found", BusinessError.NOT_FOUND)
       const album: AlbumEntity = await this.albumRepository.findOne({where: {id: albumId}, relations: ["performers"]});
       if (!album)
         throw new BusinessLogicException("The album with the given id was not found", BusinessError.NOT_FOUND)
       const albumPerformer: PerformerEntity = album.performers.find(e => e.id === performer.id);
       if (!albumPerformer)
         throw new BusinessLogicException("The performer with the given id is not associated to the album", BusinessError.PRECONDITION_FAILED)
  
       return albumPerformer;
   }
   
   async findPerformersByAlbumId(albumId: string): Promise<PerformerEntity[]> {
       const album: AlbumEntity = await this.albumRepository.findOne({where: {id: albumId}, relations: ["performers"]});
       if (!album)
         throw new BusinessLogicException("The album with the given id was not found", BusinessError.NOT_FOUND)
      
       return album.performers;
   }
   
   async associatePerformersAlbum(albumId: string, performers: PerformerEntity[]): Promise<AlbumEntity> {
       const album: AlbumEntity = await this.albumRepository.findOne({where: {id: albumId}, relations: ["performers"]});
   
       if (!album)
         throw new BusinessLogicException("The album with the given id was not found", BusinessError.NOT_FOUND)
   
       for (let i = 0; i < performers.length; i++) {
         const performer: PerformerEntity = await this.performerRepository.findOne({where: {id: performers[i].id}});
         if (!performer)
           throw new BusinessLogicException("The performer with the given id was not found", BusinessError.NOT_FOUND)
       }
   
       album.performers = performers;
       return await this.albumRepository.save(album);
     }
   
   async deletePerformerAlbum(albumId: string, performerId: string){
       const performer: PerformerEntity = await this.performerRepository.findOne({where: {id: performerId}});
       if (!performer)
         throw new BusinessLogicException("The performer with the given id was not found", BusinessError.NOT_FOUND)
   
       const album: AlbumEntity = await this.albumRepository.findOne({where: {id: albumId}, relations: ["performers"]});
       if (!album)
         throw new BusinessLogicException("The album with the given id was not found", BusinessError.NOT_FOUND)
   
       const albumPerformer: PerformerEntity = album.performers.find(e => e.id === performer.id);
   
       if (!albumPerformer)
           throw new BusinessLogicException("The performer with the given id is not associated to the album", BusinessError.PRECONDITION_FAILED)

       album.performers = album.performers.filter(e => e.id !== performerId);
       await this.albumRepository.save(album);
   }  
}