"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const auth_module_1 = require("./auth/auth.module");
const disrtricts_module_1 = require("./district/disrtricts.module");
const users_module_1 = require("./users/users.module");
const provinces_module_1 = require("./province/provinces.module");
const municipalities_module_1 = require("./municipality/municipalities.module");
const kyc_module_1 = require("./kyc/kyc.module");
const DEFAULT_PORTS = {
    postgres: 5432,
    mysql: 3306,
};
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (config) => {
                    const type = config.get('DB_TYPE', 'postgres');
                    return {
                        type,
                        host: config.get('DB_HOST', 'localhost'),
                        port: config.get('DB_PORT', DEFAULT_PORTS[type]),
                        username: config.get('DB_USERNAME', 'postgres'),
                        password: config.get('DB_PASSWORD', 'postgres'),
                        database: config.get('DB_NAME', 'kyc'),
                        autoLoadEntities: true,
                        synchronize: config.get('NODE_ENV', 'development') !== 'production',
                    };
                },
            }),
            users_module_1.UsersModule,
            auth_module_1.AuthModule,
            disrtricts_module_1.DistrictsModule,
            provinces_module_1.ProvincesModule,
            municipalities_module_1.MunicipalitiesModule,
            kyc_module_1.KycModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map