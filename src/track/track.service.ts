import { Injectable } from '@nestjs/common';
import { TrackEntity } from './track.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { StringColorFormat } from '@faker-js/faker';
import { AlbumEntity } from '../album/album.entity';

@Injectable()
export class TrackService {
    
    constructor(
        @InjectRepository(TrackEntity)
        private readonly trackRepository: Repository<TrackEntity>,
        @InjectRepository(AlbumEntity)
        private readonly albumRepository: Repository<AlbumEntity>,
    ){}

    async findAll(): Promise<TrackEntity[]> {
        return await this.trackRepository.find({ relations: ["album"] });
    }

    async findOne(id: string): Promise<TrackEntity> {
        const track: TrackEntity = await this.trackRepository.findOne({where: {id}, relations: ["album"] } );
        if (!track)
          throw new BusinessLogicException("The track with the given id was not found", BusinessError.NOT_FOUND);
   
        return track;
    }

    async create(albumId: string,track: TrackEntity): Promise<TrackEntity> {
        
        const album: AlbumEntity = await this.albumRepository.findOne({where: {id: albumId}, relations: ["tracks","performers"] } );
        
        if (!album)
          throw new BusinessLogicException("The album with the given id was not found", BusinessError.NOT_FOUND);
        if (track.duracion < 0){
            throw new BusinessLogicException("The track's duration must be a positive number", BusinessError.BAD_REQUEST);
        }
        return await this.trackRepository.save(track);
    }

    async update(id: string, track: TrackEntity): Promise<TrackEntity> {
        const persistedTrack: TrackEntity = await this.trackRepository.findOne({where:{id}});
        if (!persistedTrack)
          throw new BusinessLogicException("The track with the given id was not found", BusinessError.NOT_FOUND);
        
        return await this.trackRepository.save({...persistedTrack, ...track});
    }

    async delete(id: string) {
        const track: TrackEntity = await this.trackRepository.findOne({where:{id}});
        if (!track)
          throw new BusinessLogicException("The track with the given id was not found", BusinessError.NOT_FOUND);
     
        await this.trackRepository.remove(track);
    }
}