import { Controller, Get, Header } from "@nestjs/common";
import { AppService } from "./app.service.js";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get('/')
  @Header('Content-Type', 'text/html')
  getRoot() {
    return this.appService.getTemplate();
  }

  @Get('/health')
  getHealth(): string {
    return 'OK';
  }
}