/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { TrackEntity } from './track.entity';
import { TrackService } from './track.service';

import { faker } from '@faker-js/faker';

describe('TrackService', () => {
  let service: TrackService;
  let repository: Repository<TrackEntity>;
  let tracksList: TrackEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [TrackService],
    }).compile();

    service = module.get<TrackService>(TrackService);
    repository = module.get<Repository<TrackEntity>>(getRepositoryToken(TrackEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    tracksList = [];
    for(let i = 0; i < 5; i++){
        const track: TrackEntity = await repository.save({
        nombre: faker.lorem.word(),
        duracion: faker.number.int(),
    });
    tracksList.push(track);
    }
  }

    
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all tracks', async () => {
    const tracks: TrackEntity[] = await service.findAll();
    expect(tracks).not.toBeNull();
    expect(tracks).toHaveLength(tracksList.length);
  });

  it('findOne should return a track by id', async () => {
    const storedTrack: TrackEntity = tracksList[0];
    const track: TrackEntity = await service.findOne(storedTrack.id);
    expect(track).not.toBeNull();
    expect(track.nombre).toEqual(storedTrack.nombre)
    expect(track.duracion).toEqual(storedTrack.duracion)
  });

  it('findOne should throw an exception for an invalid track', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "The track with the given id was not found")
  });

  it('create should return a new track', async () => {
    const track: TrackEntity = {
      id: "",
      nombre: faker.lorem.word(),
      duracion: faker.number.int(),
      album: null
    }

    const newTrack: TrackEntity = await service.create(track);
    expect(newTrack).not.toBeNull();

    const storedTrack: TrackEntity = await repository.findOne({where: {id: newTrack.id}})
    expect(track).not.toBeNull();
    expect(track.nombre).toEqual(storedTrack.nombre)
    expect(track.duracion).toEqual(storedTrack.duracion)
  });

  it('update should modify a track', async () => {
    const track: TrackEntity = tracksList[0];
    track.nombre = "New name";
    track.duracion = 3;
  
    const updatedTrack: TrackEntity = await service.update(track.id, track);
    expect(updatedTrack).not.toBeNull();
  
    const storedTrack: TrackEntity = await repository.findOne({ where: { id: track.id } })
    expect(storedTrack).not.toBeNull();
    expect(storedTrack.nombre).toEqual(track.nombre)
    expect(storedTrack.duracion).toEqual(track.duracion)
  });
 
  it('update should throw an exception for an invalid track', async () => {
    let track: TrackEntity = tracksList[0];
    track = {
      ...track, nombre: "New name", duracion: 3
    }
    await expect(() => service.update("0", track)).rejects.toHaveProperty("message", "The track with the given id was not found")
  });

  it('delete should remove a track', async () => {
    const track: TrackEntity = tracksList[0];
    await service.delete(track.id);
  
    const deletedTrack: TrackEntity = await repository.findOne({ where: { id: track.id } })
    expect(deletedTrack).toBeNull();
  });

  it('delete should throw an exception for an invalid track', async () => {
    const track: TrackEntity = tracksList[0];
    await service.delete(track.id);
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "The track with the given id was not found")
  });
 
});