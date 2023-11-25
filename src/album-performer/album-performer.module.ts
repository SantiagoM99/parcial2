import { Module } from '@nestjs/common';
import { AlbumPerformerService } from './album-performer.service';
import { AlbumEntity } from '../album/album.entity';
import { PerformerEntity } from '../performer/performer.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlbumPerformerController } from './album-performer.controller';

@Module({
  providers: [AlbumPerformerService],
  imports: [TypeOrmModule.forFeature([AlbumEntity, PerformerEntity])],
  controllers: [AlbumPerformerController],
})
export class AlbumPerformerModule {}
