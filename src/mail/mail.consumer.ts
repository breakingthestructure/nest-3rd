import { MailerService } from '@nestjs-modules/mailer';
import { Processor, Process, OnQueueActive } from '@nestjs/bull';
import { Job } from 'bull';

@Processor('welcome')
export class MailConsumer {
  constructor(private mailerService: MailerService) {}

  @Process()
  async transcode(job: Job<unknown>) {
    let progress = 0;
    for (let i = 0; i < 100; i++) {
      await this.doSomething(job);
      progress += 1;
      await job.progress(progress);
    }
    return {};
  }

  async doSomething(job) {
    console.log('doSomething', job);
    await this.mailerService.sendMail({
      to: 'ducnv157@gmail.com',
      from: '"Internal Team" <support@example.com>',
      subject: 'Chào mừng đến với Citigo! E-Portal Account',
      template: './welcome',
      context: {
        name: job.data.name,
        department: job.data.department,
      },
    });
  }

  @OnQueueActive()
  onActive(job: Job) {
    console.log(
      `Processing job ${job.id} of type ${job.name} with data ${job.data}...`,
    );
  }
}
