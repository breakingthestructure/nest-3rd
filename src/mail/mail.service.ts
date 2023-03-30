import { HttpStatus, Injectable } from '@nestjs/common';
import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  // constructor(@InjectQueue('welcome') private sendMailQueue: Queue) {}
  constructor(
    private mailerService: MailerService,
    private configService: ConfigService,
  ) {}

  isDevEnviroment() {
    return this.configService.get('APP_ENV') == "dev";
  }

  async welcome(data) {
    console.log('coreService welcome', data);
    // await this.sendMailQueue.add(data);
    await this.mailerService.sendMail({
      to: this.isDevEnviroment() ? 'hau.vh@kiotviet.com' : data.email,
      // to: 'hau.vh@citigo.com.vn',
      from: this.configService.get('MAIL_FROM'),
      bcc: [
        'mo.nt@citigo.com.vn',
        'hue.lt@citigo.com.vn',
        'anh.ntt3@citigo.com.vn',
        'hau.vh@citigo.com.vn',
      ],
      subject: '[E-Portal] Thông báo tài khoản truy cập hệ thống E-Portal',
      template: './welcome2',
      context: {
        url: this.configService.get('APP_URL') + '/login',
        url_guide: this.configService.get('APP_URL_GUIDE'),
        email: data.email || '',
        name: data.name || '',
        password: data.password || '',
        department: data.department || '',
      },
    });
    return {
      status: HttpStatus.OK,
      error: [],
    };
  }

  sendForgotPassword(data) {
    console.log('service sendForgotPassword', data);
    // await this.sendMailQueue.add(data);
    this.mailerService.sendMail({
      to: this.isDevEnviroment() ? 'hau.vh@kiotviet.com' : data.email,
      // to: 'hau.vh@citigo.com.vn',
      from: this.configService.get('MAIL_FROM'),
      subject: '[E-Portal] Thiết lập lại mật khẩu tài khoản',
      template: './reset_password',
      context: {
        urlReset:
          this.configService.get('APP_URL') +
            '/reset-password?token=' +
            data.token || '',
        name: data.email || '',
      },
    });
    return {
      status: HttpStatus.OK,
      error: ['Success'],
    };
  }

  sendApproveAndRejectTimeOff(data) {
    let template = '';
    let subject = '';
    if (data.type == 'approve') {
      template = './approve_time_off';
      subject =
        '[E-Portal] Thông báo Đơn xin nghỉ phép đã được Phê duyệt ngày ' +
        data.date;
    } else {
      template = './reject_time_off';
      subject =
        '[E-Portal] Thông báo Đơn xin nghỉ phép đã bị Từ chối ngày ' +
        data.date;
    }

    const mailData: ISendMailOptions = {
      to: data.email,
      from: this.configService.get('MAIL_FROM'),
      subject: subject,
      template: template,
      context: {
        urlReset:
          this.configService.get('APP_URL') + '/time-off/' + data.id || '',
        name: data.name || '',
        description: data.description || '',
        date_time_off: data.date_time_off || '',
        date: data.date || '',
      },
    };
    if (this.isDevEnviroment()) {
      mailData.to = 'hau.vh@kiotviet.com';
      mailData.cc = 'anh.ntt3@kiotviet.com';
    }

    this.mailerService.sendMail(mailData);
    return {
      status: HttpStatus.OK,
      error: ['Success'],
    };
  }

  sendTimeOff(data) {
    console.log('data', data);
    let time = ' từ ngày ' + data.start_date + ' đến ngày ' + data.end_date;
    let subject = ' [E-Portal] Thông báo Phê duyệt đơn nghỉ phép của nhân viên ' + data.name + time;
    if (data.start_date == data.end_date) {
      time = ' ngày ' + data.end_date;
      subject = ' [E-Portal] Thông báo Phê duyệt đơn nghỉ phép của nhân viên ' + data.name + time;
    }

    const mailData: ISendMailOptions = {
      to: data.email,
      from: this.configService.get('MAIL_FROM'),
      subject: subject,
      template: './time_off_noti',
      context: {
        urlReset:
          this.configService.get('APP_URL') + '/time-off/' + data.time_off_id ||
          '',
        urlApi: this.configService.get('API_URL') + '/timesheet/approve-time-off',
        url: this.configService.get('APP_URL') + '/approve-timeoff.html',
        id: data.time_off_id,
        time: time,
        reason: data.reason,
        token: data.token,
      },
    };

    if (this.isDevEnviroment()) {
      mailData.to = 'hau.vh@kiotviet.com';
      mailData.cc = 'anh.ntt3@kiotviet.com';
    }

    this.mailerService.sendMail(mailData);
    return {
      status: HttpStatus.OK,
      error: ['Success'],
    };
  }
}
