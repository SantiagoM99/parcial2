import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TrackEntity } from '../track/track.entity';
import { AlbumEntity } from '../album/album.entity';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class AlbumTrackService {
   constructor(
       @InjectRepository(AlbumEntity)
       private readonly albumRepository: Repository<AlbumEntity>,
   
       @InjectRepository(TrackEntity)
       private readonly trackRepository: Repository<TrackEntity>
   ) {}

   async addTrackAlbum(albumId: string, trackId: string): Promise<AlbumEntity> {
       const track: TrackEntity = await this.trackRepository.findOne({where: {id: trackId}});
       if (!track)
         throw new BusinessLogicException("The track with the given id was not found", BusinessError.NOT_FOUND);
     
       const album: AlbumEntity = await this.albumRepository.findOne({where: {id: albumId}, relations: ["tracks"]});
       if (!album)
         throw new BusinessLogicException("The album with the given id was not found", BusinessError.NOT_FOUND);
   
       album.tracks = [...album.tracks, track];
       return await this.albumRepository.save(album);
     }
   
   async findTrackByAlbumIdTrackId(albumId: string, trackId: string): Promise<TrackEntity> {
       const track: TrackEntity = await this.trackRepository.findOne({where: {id: trackId}});
       if (!track)
         throw new BusinessLogicException("The track with the given id was not found", BusinessError.NOT_FOUND)
       const album: AlbumEntity = await this.albumRepository.findOne({where: {id: albumId}, relations: ["tracks"]});
       if (!album)
         throw new BusinessLogicException("The album with the given id was not found", BusinessError.NOT_FOUND)
       const albumTrack: TrackEntity = album.tracks.find(e => e.id === track.id);
       if (!albumTrack)
         throw new BusinessLogicException("The track with the given id is not associated to the album", BusinessError.PRECONDITION_FAILED)
  
       return albumTrack;
   }
   
   async findTracksByAlbumId(albumId: string): Promise<TrackEntity[]> {
       const album: AlbumEntity = await this.albumRepository.findOne({where: {id: albumId}, relations: ["tracks"]});
       if (!album)
         throw new BusinessLogicException("The album with the given id was not found", BusinessError.NOT_FOUND)
      
       return album.tracks;
   }
   
   async associateTracksAlbum(albumId: string, tracks: TrackEntity[]): Promise<AlbumEntity> {
       const album: AlbumEntity = await this.albumRepository.findOne({where: {id: albumId}, relations: ["tracks"]});
   
       if (!album)
         throw new BusinessLogicException("The album with the given id was not found", BusinessError.NOT_FOUND)
   
       for (let i = 0; i < tracks.length; i++) {
         const track: TrackEntity = await this.trackRepository.findOne({where: {id: tracks[i].id}});
         if (!track)
           throw new BusinessLogicException("The track with the given id was not found", BusinessError.NOT_FOUND)
       }
   
       album.tracks = tracks;
       return await this.albumRepository.save(album);
     }
   
   async deleteTrackAlbum(albumId: string, trackId: string){
       const track: TrackEntity = await this.trackRepository.findOne({where: {id: trackId}});
       if (!track)
         throw new BusinessLogicException("The track with the given id was not found", BusinessError.NOT_FOUND)
   
       const album: AlbumEntity = await this.albumRepository.findOne({where: {id: albumId}, relations: ["tracks"]});
       if (!album)
         throw new BusinessLogicException("The album with the given id was not found", BusinessError.NOT_FOUND)
   
       const albumTrack: TrackEntity = album.tracks.find(e => e.id === track.id);
   
       if (!albumTrack)
           throw new BusinessLogicException("The track with the given id is not associated to the album", BusinessError.PRECONDITION_FAILED)

       album.tracks = album.tracks.filter(e => e.id !== trackId);
       await this.albumRepository.save(album);
   }  
}