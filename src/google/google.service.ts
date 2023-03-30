import {HttpStatus, Injectable} from '@nestjs/common';
import {ConfigService} from "@nestjs/config";
import {OAuth2Client} from "google-auth-library";

@Injectable()
export class GoogleService {
    constructor(
        private readonly configService: ConfigService
    ) {
    }

    async retrieveUser(token) {
        try {
            const client = new OAuth2Client(this.configService.get('GOOGLE_CLIENT_ID'))
            const data = await client.verifyIdToken({
                idToken: token,
                audience: this.configService.get('GOOGLE_CLIENT_ID'),
            })
            return {
                status: HttpStatus.OK,
                message: '',
                data: data.getPayload()
            };
        } catch (error) {
            return {
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                data: error,
                message: 'Can not retrieve user'
            }
        }
    }
}
