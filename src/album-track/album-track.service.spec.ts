/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { TrackEntity } from '../track/track.entity';
import { Repository } from 'typeorm';
import { AlbumEntity } from '../album/album.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { AlbumTrackService } from './album-track.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('AlbumTrackService', () => {
  let service: AlbumTrackService;
  let albumRepository: Repository<AlbumEntity>;
  let trackRepository: Repository<TrackEntity>;
  let album: AlbumEntity;
  let tracksList : TrackEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [AlbumTrackService],
    }).compile();

    service = module.get<AlbumTrackService>(AlbumTrackService);
    albumRepository = module.get<Repository<AlbumEntity>>(getRepositoryToken(AlbumEntity));
    trackRepository = module.get<Repository<TrackEntity>>(getRepositoryToken(TrackEntity));

    await seedDatabase();
  });

  const seedDatabase = async () => {
    trackRepository.clear();
    albumRepository.clear();

    tracksList = [];
    for(let i = 0; i < 5; i++){
        const track: TrackEntity = await trackRepository.save({
          nombre: faker.lorem.word(),
          duracion: faker.number.int(),
        })
        tracksList.push(track);
    }

    album = await albumRepository.save({
      nombre: faker.lorem.word(),
      descripcion: faker.lorem.sentence(),
      fechaLanzamiento: faker.date.past(),
      caratula: faker.image.url(),
      tracks: tracksList,
    })
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addTrackAlbum should add an track to a album', async () => {
    const newTrack: TrackEntity = await trackRepository.save({
      nombre: faker.lorem.word(),
      duracion: faker.number.int(),
    });
    

    const newAlbum: AlbumEntity = await albumRepository.save({
      nombre: faker.lorem.word(),
      descripcion: faker.lorem.sentence(),
      fechaLanzamiento: faker.date.past(),
      caratula: faker.image.url(),
    });


    const result: AlbumEntity = await service.addTrackAlbum(newAlbum.id, newTrack.id);
    
    expect(result.tracks.length).toBe(1);
    expect(result.tracks[0].id).toBe(newTrack.id);
    expect(result.tracks[0].nombre).toEqual(newTrack.nombre);
    expect(result.tracks[0].duracion).toEqual(newTrack.duracion);


  });

  it('addTrackAlbum should thrown exception for an invalid track', async () => {
    const newAlbum: AlbumEntity = await albumRepository.save({
      nombre: faker.lorem.word(),
      descripcion: faker.lorem.sentence(),
      fechaLanzamiento: faker.date.past(),
      caratula: faker.image.url(),
    })

    await expect(() => service.addTrackAlbum(newAlbum.id, "0")).rejects.toHaveProperty("message", "The track with the given id was not found");
  });

  it('addTrackAlbum should throw an exception for an invalid album', async () => {
    const newTrack: TrackEntity = await trackRepository.save({
      nombre: faker.lorem.word(),
      duracion: faker.number.int(),
    });

    await expect(() => service.addTrackAlbum("0", newTrack.id)).rejects.toHaveProperty("message", "The album with the given id was not found");
  });

  it('findTrackByAlbumIdTrackId should return track by album', async () => {
    const track: TrackEntity = tracksList[0];
    const storedTrack: TrackEntity = await service.findTrackByAlbumIdTrackId(album.id, track.id, )
    expect(storedTrack).not.toBeNull();
    expect(storedTrack.id).toBe(track.id);
    expect(storedTrack.nombre).toEqual(track.nombre);
    expect(storedTrack.duracion).toEqual(track.duracion);
  });

  it('findTrackByAlbumIdTrackId should throw an exception for an invalid track', async () => {
    await expect(()=> service.findTrackByAlbumIdTrackId(album.id, "0")).rejects.toHaveProperty("message", "The track with the given id was not found"); 
  });

  it('findTrackByAlbumIdTrackId should throw an exception for an invalid album', async () => {
    const track: TrackEntity = tracksList[0]; 
    await expect(()=> service.findTrackByAlbumIdTrackId("0", track.id)).rejects.toHaveProperty("message", "The album with the given id was not found"); 
  });

  it('findTrackByAlbumIdTrackId should throw an exception for an track not associated to the album', async () => {
    const newTrack: TrackEntity = await trackRepository.save({
      nombre: faker.lorem.word(),
      duracion: faker.number.int(),
    });

    await expect(()=> service.findTrackByAlbumIdTrackId(album.id, newTrack.id)).rejects.toHaveProperty("message", "The track with the given id is not associated to the album"); 
  });

  it('findTracksByAlbumId should return tracks by album', async ()=>{

    const tracks: TrackEntity[] = await service.findTracksByAlbumId(album.id);
    expect(tracks.length).toBe(5)
  });

  it('findTracksByAlbumId should throw an exception for an invalid album', async () => {
    await expect(()=> service.findTracksByAlbumId("0")).rejects.toHaveProperty("message", "The album with the given id was not found"); 
  });

  it('associateTracksAlbum should update tracks list for a album', async () => {
    const newTrack: TrackEntity = await trackRepository.save({
      nombre: faker.lorem.word(),
      duracion: faker.number.int(),
    });

    const updatedAlbum: AlbumEntity = await service.associateTracksAlbum(album.id, [newTrack]);
    expect(updatedAlbum.tracks.length).toBe(1);
    expect(updatedAlbum.tracks[0].id).toBe(newTrack.id);
    expect(updatedAlbum.tracks[0].nombre).toEqual(newTrack.nombre);
    expect(updatedAlbum.tracks[0].duracion).toEqual(newTrack.duracion);
    
  });

  it('associateTracksAlbum should throw an exception for an invalid album', async () => {
    const newTrack: TrackEntity = await trackRepository.save({
      nombre: faker.lorem.word(),
      duracion: faker.number.int(),
    });

    await expect(()=> service.associateTracksAlbum("0", [newTrack])).rejects.toHaveProperty("message", "The album with the given id was not found"); 
  });

  it('associateTracksAlbum should throw an exception for an invalid track', async () => {
    const newTrack: TrackEntity = tracksList[0];
    newTrack.id = "0";

    await expect(()=> service.associateTracksAlbum(album.id, [newTrack])).rejects.toHaveProperty("message", "The track with the given id was not found"); 
  });

  it('deleteTrackToAlbum should remove an track from a album', async () => {
    const track: TrackEntity = tracksList[0];
    await service.deleteTrackAlbum(album.id, track.id);

    const storedAlbum: AlbumEntity = await albumRepository.findOne({where: {id: album.id}, relations: ["tracks"]});
    const deletedTrack: TrackEntity = storedAlbum.tracks.find(a => a.id === track.id);

    expect(deletedTrack).toBeUndefined();

  });

  it('deleteTrackToAlbum should thrown an exception for an invalid track', async () => {
    await expect(()=> service.deleteTrackAlbum(album.id, "0")).rejects.toHaveProperty("message", "The track with the given id was not found"); 
  });

  it('deleteTrackToAlbum should thrown an exception for an invalid album', async () => {
    const track: TrackEntity = tracksList[0];
    await expect(()=> service.deleteTrackAlbum("0", track.id)).rejects.toHaveProperty("message", "The album with the given id was not found"); 
  });

  it('deleteTrackToAlbum should thrown an exception for an non asocciated track', async () => {
    const newTrack: TrackEntity = await trackRepository.save({
      nombre: faker.lorem.word(),
      duracion: faker.number.int(),
    });
    await expect(()=> service.deleteTrackAlbum(album.id, newTrack.id)).rejects.toHaveProperty("message", "The track with the given id is not associated to the album"); 
  }); 

});