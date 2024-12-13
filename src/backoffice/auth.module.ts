import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
// import { UserService } from '../user/user.service';
import { JwtStrategy } from './jwt.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Respondent } from '../respondent/respondent.entity';
import { Career } from '../respondent/career.entity';
import { User } from './user.entity';
import { SurveyController } from '../survey/survey.controller';
import { AuthController } from './auth.controller';
// import { UserModule } from '../user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule,
    JwtModule.register({
      secret: 'SECRET_KEY', // Cambiar por una clave segura
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
  controllers: [AuthController],

})
export class AuthModule {}
