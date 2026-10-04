import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';

import { diskStorage, memoryStorage } from 'multer';

import { extname } from 'path';

import {
  ApiBearerAuth,
  ApiTags,
} from '@nestjs/swagger';

import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../auth/decorators/current-user.decorator';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

import { CreateKycDto } from './dto/create-kyc.dto';
import { UpdateKycDto } from './dto/update-kyc.dto';

import { KycService } from './kyc.service';

@ApiTags('kyc')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('kyc')
export class KycController {
  constructor(
    private readonly kycService: KycService,
  ) {}

  // --------------------------------------------------
  // Create KYC
  // POST /kyc
  // --------------------------------------------------
  @Post()
  create(
    @Body()
    dto: CreateKycDto,

    @CurrentUser()
    currentUser: AuthenticatedUser,
  ) {
    return this.kycService.create(
      dto,
      currentUser.username,
    );
  }

  // --------------------------------------------------
  // Import KYC records from CSV
  // POST /kyc/import
  // --------------------------------------------------
  @Post('import')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),

      // Maximum 10 MB
      limits: {
        fileSize: 10 * 1024 * 1024,
      },

      fileFilter: (
        req,
        file,
        callback,
      ) => {
        if (!file.originalname.toLowerCase().endsWith('.csv')) {
          return callback(
            new BadRequestException(
              'Only CSV files are allowed',
            ),
            false,
          );
        }

        callback(
          null,
          true,
        );
      },
    }),
  )
  importCsv(
    @UploadedFile()
    file: Express.Multer.File,

    @CurrentUser()
    currentUser: AuthenticatedUser,
  ) {
    if (!file) {
      throw new BadRequestException(
        'CSV file is required',
      );
    }

    return this.kycService.importFromCsv(
      file.buffer,
      currentUser.username,
    );
  }

  // --------------------------------------------------
  // Get all KYC
  // GET /kyc
  // --------------------------------------------------
  @Get()
  findAll() {
    return this.kycService.findAll();
  }

  // --------------------------------------------------
  // Get one KYC
  // GET /kyc/:id
  // --------------------------------------------------
  @Get(':id')
  findOne(
    @Param(
      'id',
      ParseUUIDPipe,
    )
    id: string,
  ) {
    return this.kycService.findOne(id);
  }

  // --------------------------------------------------
  // Update KYC
  // PATCH /kyc/:id
  // --------------------------------------------------
  @Patch(':id')
  update(
    @Param(
      'id',
      ParseUUIDPipe,
    )
    id: string,

    @Body()
    dto: UpdateKycDto,

    @CurrentUser()
    currentUser: AuthenticatedUser,
  ) {
    return this.kycService.update(
      id,
      dto,
      currentUser.username,
    );
  }

  // --------------------------------------------------
  // Upload KYC image
  // POST /kyc/:id/image
  // --------------------------------------------------
  @Post(':id/image')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/kyc',

        filename: (
          req,
          file,
          callback,
        ) => {
          const uniqueName =
            `${Date.now()}-${Math.round(
              Math.random() * 1e9,
            )}${extname(
              file.originalname,
            )}`;

          callback(
            null,
            uniqueName,
          );
        },
      }),

      // Maximum 5 MB
      limits: {
        fileSize:
          5 * 1024 * 1024,
      },

      // Allowed image types
      fileFilter: (
        req,
        file,
        callback,
      ) => {
        const allowedTypes = [
          'image/jpeg',
          'image/png',
          'image/webp',
        ];

        if (
          !allowedTypes.includes(
            file.mimetype,
          )
        ) {
          return callback(
            new BadRequestException(
              'Only JPG, PNG and WEBP images are allowed',
            ),
            false,
          );
        }

        callback(
          null,
          true,
        );
      },
    }),
  )
  uploadImage(
    @Param(
      'id',
      ParseUUIDPipe,
    )
    id: string,

    @UploadedFile()
    file: Express.Multer.File,

    @CurrentUser()
    currentUser: AuthenticatedUser,
  ) {
    return this.kycService.uploadImage(
      id,
      file,
      currentUser.username,
    );
  }

  // --------------------------------------------------
  // Delete KYC
  // DELETE /kyc/:id
  // --------------------------------------------------
  @HttpCode(
    HttpStatus.NO_CONTENT,
  )
  @Delete(':id')
  remove(
    @Param(
      'id',
      ParseUUIDPipe,
    )
    id: string,
  ) {
    return this.kycService.remove(id);
  }
}