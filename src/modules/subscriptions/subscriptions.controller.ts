import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { RoleGuard } from 'src/common/guards/role.guard';
import { CreateSubscriptionPlansDto } from './dto/create-subscription-plan.dto';
import { CreateSubPurchaseDTO } from './dto/create-subscription.-purchase.dto';
import { Request } from 'express';

@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Get('plans')
  @SetMetadata('isFreeAuth', true)
  async SubPlans() {
    return await this.subscriptionsService.subPlans();
  }

  @Post('add/plan')
  @UseGuards(RoleGuard)
  @SetMetadata('roles', ['admin', 'superadmin'])
  async creaSubPlans(@Body() body: CreateSubscriptionPlansDto) {
    return await this.subscriptionsService.createSubPlans(body);
  }

  @Post('purchase')
  async subPurchase(
    @Body() body: CreateSubPurchaseDTO,
    @Req() request: Request,
  ) {
    const userId = request['userId'];
    return await this.subscriptionsService.SubscriptionPurchase(body, userId);
  }
}
