import { Test, TestingModule } from '@nestjs/testing';
import { AlbumTrackService } from './album-track.service';

describe('AlbumTrackService', () => {
  let service: AlbumTrackService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AlbumTrackService],
    }).compile();

    service = module.get<AlbumTrackService>(AlbumTrackService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
