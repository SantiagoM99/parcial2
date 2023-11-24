/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { AlbumEntity } from './album.entity';
import { AlbumService } from './album.service';

import { faker } from '@faker-js/faker';

describe('AlbumService', () => {
  let service: AlbumService;
  let repository: Repository<AlbumEntity>;
  let albumsList: AlbumEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [AlbumService],
    }).compile();

    service = module.get<AlbumService>(AlbumService);
    repository = module.get<Repository<AlbumEntity>>(getRepositoryToken(AlbumEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    albumsList = [];
    for(let i = 0; i < 5; i++){
        const album: AlbumEntity = await repository.save({
        nombre: faker.lorem.word(),
        descripcion: faker.lorem.sentence(),
        fechaLanzamiento: faker.date.past(),
        caratula: faker.image.url(),
    });
    albumsList.push(album);
    }
  }

    
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all albums', async () => {
    const albums: AlbumEntity[] = await service.findAll();
    expect(albums).not.toBeNull();
    expect(albums).toHaveLength(albumsList.length);
  });

  it('findOne should return a album by id', async () => {
    const storedAlbum: AlbumEntity = albumsList[0];
    const album: AlbumEntity = await service.findOne(storedAlbum.id);
    expect(album).not.toBeNull();
    expect(album.nombre).toEqual(storedAlbum.nombre)
    expect(album.descripcion).toEqual(storedAlbum.descripcion)
    expect(album.fechaLanzamiento).toEqual(storedAlbum.fechaLanzamiento)
    expect(album.caratula).toEqual(storedAlbum.caratula)
  });

  it('findOne should throw an exception for an invalid album', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "The album with the given id was not found")
  });

  it('create should return a new album', async () => {
    const album: AlbumEntity = {
      id: "",
      nombre: faker.lorem.word(),
      descripcion: faker.lorem.sentence(),
      fechaLanzamiento: faker.date.past(),
      caratula: faker.image.url(),
      tracks: [],
      performers: []
    }

    const newAlbum: AlbumEntity = await service.create(album);
    expect(newAlbum).not.toBeNull();

    const storedAlbum: AlbumEntity = await repository.findOne({where: {id: newAlbum.id}})
    expect(album).not.toBeNull();
    expect(album.nombre).toEqual(storedAlbum.nombre)
    expect(album.descripcion).toEqual(storedAlbum.descripcion)
    expect(album.fechaLanzamiento).toEqual(storedAlbum.fechaLanzamiento)
    expect(album.caratula).toEqual(storedAlbum.caratula)
  });

  it('create should not create a album with an empty name', async () => {
    const album: AlbumEntity = {
      id: "",
      nombre: "",
      descripcion: faker.lorem.sentence(),
      fechaLanzamiento: faker.date.past(),
      caratula: faker.image.url(),
      tracks: [],
      performers: []
    }

    await expect(() => service.create(album)).rejects.toHaveProperty("message", "The album's name can't be empty")
  });

  it('create should not create a album with an empty description', async () => {
    const album: AlbumEntity = {
      id: "",
      nombre: faker.lorem.word(),
      descripcion: "",
      fechaLanzamiento: faker.date.past(),
      caratula: faker.image.url(),
      tracks: [],
      performers: []
    }

    await expect(() => service.create(album)).rejects.toHaveProperty("message", "The album's description can't be empty")
  });

  it('update should modify a album', async () => {
    const album: AlbumEntity = albumsList[0];
    album.nombre = "New name";
    album.descripcion = "New description";
  
    const updatedAlbum: AlbumEntity = await service.update(album.id, album);
    expect(updatedAlbum).not.toBeNull();
  
    const storedAlbum: AlbumEntity = await repository.findOne({ where: { id: album.id } })
    expect(storedAlbum).not.toBeNull();
    expect(storedAlbum.nombre).toEqual(album.nombre)
    expect(storedAlbum.descripcion).toEqual(album.descripcion)
  });
 
  it('update should throw an exception for an invalid album', async () => {
    let album: AlbumEntity = albumsList[0];
    album = {
      ...album, nombre: "New name", descripcion: "New description"
    }
    await expect(() => service.update("0", album)).rejects.toHaveProperty("message", "The album with the given id was not found")
  });

  it('delete should remove a album', async () => {
    const album: AlbumEntity = albumsList[0];
    await service.delete(album.id);
  
    const deletedAlbum: AlbumEntity = await repository.findOne({ where: { id: album.id } })
    expect(deletedAlbum).toBeNull();
  });

  it('delete should throw an exception for an invalid album', async () => {
    const album: AlbumEntity = albumsList[0];
    await service.delete(album.id);
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "The album with the given id was not found")
  });
 
});