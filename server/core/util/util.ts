import { hashSync, compareSync, genSaltSync } from 'bcrypt-nodejs';
import { randomBytes, createHash } from 'crypto';
import * as moment from 'moment';
import { tz } from 'moment-timezone';

import { ValidationError } from './../error/user-friendly';
import { MissingArgumentsError } from './../error/server';
import { IPasswordRequirements } from './../models/constants';

export class Util {
  static convertHoursToMilliseconds(hours: number) {
    return hours * 60 * 60 * 1000;
  }

  static generateHash(text = ''): string {
    let salt = genSaltSync(8);
    return hashSync(text, salt);
  }

  static compareHash(text: string, hashedText: string): boolean {
    return compareSync(text, hashedText);
  }

  static generateToken(length = 32): string {
    return randomBytes(length).toString('hex');
  }

  static hashToken(token: string): string {
    return createHash('sha1').update(token).digest('hex');
  }

  static validatePassword(password: string, passwordRequirements: IPasswordRequirements) {
    if (!password || typeof (password) !== 'string') {
      throw new ValidationError('Password provided not valid');
    }

    if (password.length < passwordRequirements.minLength) {
    throw new ValidationError(`Password must be at least '${passwordRequirements.minLength} characters long`);
    }

    if (passwordRequirements.numberRequired && !password.match(/\d/)) {
      throw new ValidationError('Password must include at least one number character to be valid');
    }

    if (passwordRequirements.mixedCaseRequired && !(password.match(/[A-Z]/) && password.match(/[a-z]/))) {
      throw new ValidationError('Password must include at least one upper and lower case character to be valid');
    }
  }

  static toDictionary(array: any, key: string): any {
    if(!Array.isArray(array) || !key) {
      throw new MissingArgumentsError('First argument must be an array');
    }
    
    let dict: any = {};
    array.forEach(item => {
      if(!dict[item[key]]) {
        dict[item[key]] = Object.assign({}, item);
      }
    });

    return dict;
  }

  static primitiveToComplexArray(array: any, key: string) {
    if(!Array.isArray(array) || !key) {
      throw new MissingArgumentsError('Argument must be an array');
    }

    let complexArray: any[] = [];
    array.forEach((item, index) => {
      let complex: any = {};
      complex['_id']= index;
      complex[key]= item;
      complexArray.push(complex);
    });

    return complexArray;
  }

  static humanizeFileName(fileName: string): string {
    let parts = fileName.split('.');
    let name = (parts[0].replace(' ', '_') || '').toLowerCase();
    let extension = (parts[1] || '').toLowerCase();
    let timeStamp = moment(new Date()).format('YYYY-MM-DD-HH-mm-ss');

    return `${name}-${timeStamp}.${extension}`;
  }

  static humanizeDate(date?: Date): string {
    if(!date) {
      return '';
    }

    return moment(date).format('YYYY/MM/DD HH:mm:ss');
  }

  static formatTimezone(timezoneId: string): string {
    let userFriendlyName = timezoneId.replace(/_/gi, ' ');
    return `${userFriendlyName} ${tz(timezoneId).format('Z')}`
  }
}