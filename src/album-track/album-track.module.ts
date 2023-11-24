import { Module } from '@nestjs/common';
import { AlbumTrackService } from './album-track.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlbumEntity } from 'src/album/album.entity';
import { TrackEntity } from 'src/track/track.entity';

@Module({
  providers: [AlbumTrackService],
  imports: [TypeOrmModule.forFeature([AlbumEntity, TrackEntity])],
})
export class AlbumTrackModule {}
