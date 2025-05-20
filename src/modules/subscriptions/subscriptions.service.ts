import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';
import { CreateSubscriptionPlansDto } from './dto/create-subscription-plan.dto';
import { CreateSubPurchaseDTO } from './dto/create-subscription.-purchase.dto';
import { Payment_method, SubStatus } from '@prisma/client';

@Injectable()
export class SubscriptionsService {
  constructor(private readonly prisma: PrismaService) {}

  async subPlans() {
    return await this.prisma.subscription_plan.findMany();
  }

  async createSubPlans(planData: CreateSubscriptionPlansDto) {
    return await this.prisma.subscription_plan.create({
      data: planData,
    });
  }

  async SubscriptionPurchase(subData: CreateSubPurchaseDTO, userId: string) {
    const plan = await this.prisma.subscription_plan.findFirst({
      where: { id: subData.plan_id },
    });
    if (!plan) throw new NotFoundException('Subscription plans not found');

    let end_date: Date | null = null;

    if (plan.duration_days) {
      const now = new Date();
      now.setDate(now.getDate() + plan.duration_days);
      end_date = now;
    }

    const userSubs = await this.prisma.user_subscription.create({
      data: {
        user_id: userId,
        plan_id: subData.plan_id,
        end_date: end_date || null,
      },
    });

    const payment = await this.prisma.payment.create({
      data: {
        user_subcription_id: userSubs.id,
        amount: plan.price,
        payment_method: subData.payment_method,
        payment_details: subData.payment_details,
        external_transaction_id: 'random_transaction_id',
      },
    });

    let status: SubStatus;

    if (payment) {
      status = 'active';
    } else {
      status = 'canceled';
      return { message: "To'lovda xatolik bor, qaytadan urinib ko'ring" };
    }

    let updatedUserSubs = await this.prisma.user_subscription.update({
      where: { id: userSubs.id },
      data: { status },
    });

    let subscription = await this.prisma.user_subscription.findFirst({
      where: { id: updatedUserSubs.id },
      select: {
        id: true,
        plan: { select: { id: true, name: true } },
        start_date: true,
        end_date: true,
        status: true,
        auto_renew: true,
        payment: {
          select: {
            id: true,
            amount: true,
            status: true,
            external_transaction_id: true,
            payment_method: true,
          },
        },
      },
    });

    return { message: 'Obuna muvaffaqiyatli sotib olindi', data: subscription };
  }
}
