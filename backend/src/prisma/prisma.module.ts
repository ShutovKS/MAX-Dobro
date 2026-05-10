import {Global, Module} from '@nestjs/common';
import {PrismaService} from './prisma.service';

@Global()
@Module({
  /** <context:backend_prisma_module> Global Prisma provider for backend data access paths. </context:backend_prisma_module> */
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {
}
