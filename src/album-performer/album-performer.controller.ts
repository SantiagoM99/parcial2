import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { PerformerDto } from 'src/performer/performer.dto';
import { PerformerEntity } from 'src/performer/performer.entity';
import { AlbumPerformerService } from './album-performer.service';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors/business-errors.interceptor';

@Controller('albums')
@UseInterceptors(BusinessErrorsInterceptor)
export class AlbumPerformerController {
    constructor(private readonly albumPerformerService: AlbumPerformerService) { }
 
    @Post(':albumId/performers/:performerId')
    async addPerformerAlbum(@Param('albumId') albumId: string, @Param('performerId') performerId: string){
        return await this.albumPerformerService.addPerformerAlbum(albumId, performerId);
    }
 
    @Get(':albumId/performers/:performerId')
     async findPerformerByAlbumIdPerformerId(@Param('albumId') albumId: string, @Param('performerId') performerId: string){
          return await this.albumPerformerService.findPerformerByAlbumIdPerformerId(albumId, performerId);
     }
 
     @Get(':albumId/performers')
     async findPerformersByAlbumId(@Param('albumId') albumId: string){
          return await this.albumPerformerService.findPerformersByAlbumId(albumId);
     }
 
     @Put(':albumId/performers')
     async associatePerformersAlbum(@Body() performersDto: PerformerDto[] , @Param('albumId') albumId: string){
         const performers = plainToInstance(PerformerEntity, performersDto)
         return await this.albumPerformerService.associatePerformersAlbum(albumId, performers);
     }
 
     @Delete(':albumId/performers/:performerId')
     @HttpCode(204)
     async deletePerformerAlbum(@Param('albumId') albumId: string, @Param('performerId') performerId: string){
         return await this.albumPerformerService.deletePerformerAlbum(albumId, performerId);
     }
 }