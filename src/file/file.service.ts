import { HttpStatus, Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { ConfigService } from '@nestjs/config';
import { v4 as uuid } from 'uuid';
import * as XLSX from 'sheetjs-style';
import * as moment from 'moment-timezone';

@Injectable()
export class FileService {
  constructor(private readonly configService: ConfigService) {}

  async upload(dataBuffer: Buffer, filename: string) {
    try {
      const s3 = new S3();
      const cloudFrontUrl = this.configService.get('AWS_CLOUDFRONT_URL');
      const uploadResult = await s3
        .upload({
          Bucket: this.configService.get('AWS_PUBLIC_BUCKET_NAME'),
          Body: dataBuffer,
          Key: `${uuid()}-${filename}`,
          // ACL: 'public-read',
          ContentType: 'image/jpeg',
          ContentLength: dataBuffer.length,
        })
        .promise();
      return {
        status: HttpStatus.OK,
        message: 'Tải lên thành công',
        data: cloudFrontUrl + uploadResult.Key,
      };
    } catch (error) {
      console.log('error', error);
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Có lỗi xảy ra',
        data: error,
      };
    }
  }

  async export(payload) {
    const workSheetColumns = [
      { wch: 30 },
      { wch: 15 },
      { wch: 20 },
      { wch: 20 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 20 },
      { wch: 40 },
      { wch: 15 },
      { wch: 15 },
    ];
    const columns = {
      A: 'A',
      B: 'B',
      C: 'C',
      D: 'D',
      E: 'E',
      F: 'F',
      G: 'G',
      H: 'H',
      I: 'I',
      J: 'J',
      K: 'K',
      L: 'L',
    };
    const configMergeCells = [
      {
        s: {
          r: 0,
          c: 0,
        },
        e: {
          r: 0,
          c: 10,
        },
      },
    ];
    try {
      const workSheetColumnName = [];
      for (const key of Object.keys(payload.columns)) {
        workSheetColumnName.push(payload.columns[key]);
      }
      const addRows = [];
      let justFinished = 0;
      const arrMerge = [];
      let row = {};
      let counting = 1;
      payload.data.map((item, key, array) => {
        //proceed cell
        if (item.number_of_day > 0) {
          const startDate = moment(payload.start_date, 'YYYY-MM-DD')
            .tz('Asia/Ho_Chi_Minh')
            .subtract(1, 'days')
            .format('YYYY-MM-DD');
          const endDate = moment(payload.end_date, 'YYYY-MM-DD')
            .tz('Asia/Ho_Chi_Minh')
            .add(1, 'days')
            .format('YYYY-MM-DD');
          let numberOfDay = 0;
          for (let i = 0; i <= item.number_of_day; i++) {
            const date2Check = moment(item.start_date, 'DD/MM/YYYY')
              .tz('Asia/Ho_Chi_Minh')
              .add(i, 'days')
              .format('YYYY-MM-DD');
            const isBetween = moment(date2Check).isBetween(startDate, endDate);
            if (!isBetween) {
              continue;
            }
            addRows.push([
              item.name_request,
              item.code_request,
              item.division_name,
              item.department_name,
              item.position_name,
              moment(item.start_date, 'DD/MM/YYYY')
                .tz('Asia/Ho_Chi_Minh')
                .add(i, 'days')
                .format('MM/DD/YYYY'),
              item.hours + 'h',
              item.type_name,
              item.reason,
              item.no_money,
              item.has_money,
            ]);
            numberOfDay++;
          }
          item.row_to_show = numberOfDay - 1;
        }
        if (item.number_of_day == 0) {
          addRows.push([
            item.name_request,
            item.code_request,
            item.division_name,
            item.department_name,
            item.position_name,
            moment(item.start_date, 'DD/MM/YYYY')
              .tz('Asia/Ho_Chi_Minh')
              .format('MM/DD/YYYY'),
            item.hours + 'h',
            item.type_name,
            item.reason,
            item.no_money,
            item.has_money,
          ]);
        }
        //end to process data

        //processing cell
        //the first of user
        const nextItem = array[key + 1];
        if (justFinished != item.user_id) {
          if (typeof row['s'] != 'undefined') {
            if (typeof nextItem != 'undefined') {
              row['e'] = { r: counting, c: 0 };
              arrMerge.push(row);
              // finish set end of one row
              row = {};
              // create new row
              counting = counting + 1;
              row['s'] = { r: counting, c: 0 };
              arrMerge.push(row);
              let bonus = 0;
              if (item.number_of_day > 0) {
                bonus = item.row_to_show + bonus;
              }
              counting = counting + bonus;
            }
            if (typeof nextItem == 'undefined') {
              row['e'] = { r: counting, c: 0 };
              arrMerge.push(row);
              // create new row

              row = {};
              counting = counting + 1;
              row['s'] = { r: counting, c: 0 };
              let bonus = 0;
              if (item.number_of_day > 0) {
                bonus = item.row_to_show + bonus;
              }
              counting = counting + bonus;
            }
          }
          if (typeof row['s'] == 'undefined') {
            //create new first row
            row = {};
            row['s'] = { r: 2, c: 0 };
            let bonus = 1;
            if (item.number_of_day > 1) {
              bonus = item.row_to_show + bonus;
            }
            counting = counting + bonus;
          }
        }
        if (justFinished == item.user_id) {
          let bonus = 1;
          if (item.number_of_day > 0) {
            bonus = item.row_to_show + 1;
          }
          counting = counting + bonus;
        }
        //the last
        if (payload.data.length - key == 1) {
          row['e'] = { r: counting, c: 0 };
          arrMerge.push(row);
        }
        //end to process merge cell
        justFinished = item.user_id;
      });
      const workBook = XLSX.utils.book_new();
      const workSheetData = [
        [
          'Danh sách nghỉ phép từ ngày ' +
            payload.start_date +
            ' đến ngày ' +
            payload.end_date,
        ],
        workSheetColumnName,
        ...addRows,
      ];
      const workSheet = XLSX.utils.aoa_to_sheet(workSheetData);
      workSheet['!cols'] = workSheetColumns;
      workSheet['A1']['s'] = {
        font: {
          bold: true,
        },
        alignment: {
          vertical: 'center',
          horizontal: 'center',
        },
        fill: { fgColor: { rgb: 'FFFFAA00' } },
      };
      for (const column in columns) {
        const columnName = column + '2';
        if (typeof workSheet[columnName] != 'undefined') {
          workSheet[columnName]['s'] = {
            font: {
              bold: true,
            },
            alignment: {
              vertical: 'center',
              horizontal: 'center',
            },
            fill: { fgColor: { rgb: 'FFFFAA00' } },
          };
        }
      }
      // configMergeCells.push();
      arrMerge.forEach(function (arrayItem, idx, array) {
        const isMerged = configMergeCells.find((item) => {
          return (
            item.s.r == arrayItem['s']['r'] && item.e.r == arrayItem['e']['r']
          );
        });
        if (typeof isMerged == 'undefined') {
          configMergeCells.push(arrayItem);
        }
        const rowNumber = arrayItem['s']['r'] + 1;
        if (typeof workSheet['A' + rowNumber] != 'undefined') {
          workSheet['A' + rowNumber]['s'] = {
            font: {
              name: 'arial',
              bold: true,
            },
            alignment: {
              vertical: 'center',
              horizontal: 'center',
            },
          };
        }
        if (idx === array.length - 1) {
          const lastRow = arrayItem.e.r + 2;
          if (typeof workSheet['A' + lastRow] != 'undefined') {
            workSheet['A' + lastRow]['s'] = {
              font: {
                name: 'arial',
                bold: true,
              },
              alignment: {
                vertical: 'center',
                horizontal: 'center',
              },
            };
          }
        }
      });
      workSheet['!merges'] = configMergeCells;
      XLSX.utils.book_append_sheet(workBook, workSheet, 'Danh sách nghỉ phép');
      const content = XLSX.write(workBook, { type: 'base64' });
      return {
        status: HttpStatus.OK,
        message: 'Export thành công',
        data: content,
      };
    } catch (error) {
      console.log('error', error);
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        data: error,
        message: 'Có lỗi xảy ra',
      };
    }
  }

  // convertStringToDate(str) {
  //   const date = new Date(str),
  //     mnth = ('0' + (date.getMonth() + 1)).slice(-2),
  //     day = ('0' + date.getDate()).slice(-2);
  //   return [date.getFullYear(), mnth, day].join('-');
  // }
}
