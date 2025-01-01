import {
  Controller,
  Headers,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { createRemoteJWKSet, jwtVerify } from 'jose';
import { IsPublic } from 'src/auth/is-public.decorator';

@Controller('users')
export class UserController {
  private jwks: any;
  constructor(private readonly userService: UserService) {
    // Generate a JWKS using jwks_uri obtained from the Logto server
    this.jwks = createRemoteJWKSet(
      new URL(process.env.LOGTO_ENDPOINT + '/oidc/jwks'),
    );
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }
  
  @IsPublic()
  @Get()
  async findAll(@Req() req: any) {
    console.log('User Payload:', req.user);

    const data = await this.userService.findAll();
    return { data, message: 'success', code: 200 };
  }

  @Get(':userId')
  async findOne(@Param('userId') userId: string) {
    return this.userService.findOne(userId);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
